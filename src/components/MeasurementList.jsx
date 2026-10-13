import { useState } from "react";
import { MEASUREMENT_TYPES, getReference } from "../constants/measurements";
import { getTip } from "../constants/tips";

function formatValues(m) {
  if (m.type === "pressao") return `${m.values.systolic}/${m.values.diastolic}`;
  return m.values.value;
}

function getStatus(m, config, profile) {
  const reference = getReference(m.type, profile);
  if (!reference) return "";
  const outOfRange = config.fields.some((f) => {
    const { min, max } = reference[f];
    return m.values[f] < min || m.values[f] > max;
  });
  return outOfRange ? "out-of-range" : "in-range";
}

export default function MeasurementList({ measurements, onDelete, profile }) {
  const [toDelete, setToDelete] = useState(null);

  if (measurements.length === 0) return <p className="muted">Nenhuma medição ainda.</p>;

  const confirmDelete = async () => {
    await onDelete(toDelete.id);
    setToDelete(null);
  };

  return (
    <>
    <ul className="history">
      {measurements.map((m) => {
        const config = MEASUREMENT_TYPES[m.type];
        const status = getStatus(m, config, profile);
        const tip = getTip(m);
        return (
          <li key={m.id} className="history-item">
            <div className="history-main">
              <span className="history-label">{config.label}</span>
              <span className={`history-value ${status}`}>
                {formatValues(m)} <small>{config.unit}</small>
              </span>
              <span className="muted">
                {m.date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
              </span>
              {m.note && <p className="history-note">{m.note}</p>}
              {tip && <p className={`tip tip-${tip.level}`}>{tip.text}</p>}
            </div>
            <button className="btn-ghost" onClick={() => setToDelete(m)} aria-label="Apagar">
              🗑️
            </button>
          </li>
        );
      })}
    </ul>

    {toDelete && (
      <div className="modal-backdrop" onClick={() => setToDelete(null)}>
        <div className="modal card" onClick={(e) => e.stopPropagation()}>
          <h2 className="section-title">Apagar medição?</h2>
          <p className="muted">
            {MEASUREMENT_TYPES[toDelete.type].label}:{" "}
            <strong>
              {formatValues(toDelete)} {MEASUREMENT_TYPES[toDelete.type].unit}
            </strong>
            <br />
            {toDelete.date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
          </p>
          <p className="muted">Essa ação não pode ser desfeita.</p>
          <button className="btn-danger" onClick={confirmDelete}>Apagar</button>
          <button className="btn-ghost" onClick={() => setToDelete(null)}>Cancelar</button>
        </div>
      </div>
    )}
    </>
  );
}
import { useState } from "react";
import {
  MEASUREMENT_TYPES,
  GLUCOSE_CONTEXTS,
  getReference,
  calcBMI,
  classifyBMI,
  getStatus,
} from "../constants/measurements";
import { getTip } from "../constants/tips";
import MeasurementForm from "./MeasurementForm";

function formatValues(m) {
  if (m.type === "pressao") return `${m.values.systolic}/${m.values.diastolic}`;
  return m.values.value;
}


export default function MeasurementList({ measurements, onDelete, onUpdate, profile }) {
  const [toDelete, setToDelete] = useState(null);
  const [toEdit, setToEdit] = useState(null);

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
        const tip = status === "in-range" ? null : getTip(m);
        const bmi = m.type === "peso" ? calcBMI(m.values.value, profile?.height) : null;
        return (
          <li key={m.id} className="history-item">
            <div className="history-main">
              <span className="history-label">
                {config.label}
                {m.context && ` · ${GLUCOSE_CONTEXTS[m.context].label}`}
              </span>
              <span className={`history-value ${status}`}>
                {formatValues(m)} <small>{config.unit}</small>
              </span>
              {bmi && (
                <span className="muted">
                  IMC {bmi.toFixed(1).replace(".", ",")} · {classifyBMI(bmi).label}
                </span>
              )}
              <span className="muted">
                {m.date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                {m.pending && " · ⏳ aguardando sincronizar"}
              </span>
              {m.note && <p className="history-note">{m.note}</p>}
              {tip && <p className={`tip tip-${tip.level}`}>{tip.text}</p>}
            </div>
            <div className="history-actions">
              <button className="btn-ghost" onClick={() => setToEdit(m)} aria-label="Editar">
                ✏️
              </button>
              <button className="btn-ghost" onClick={() => setToDelete(m)} aria-label="Apagar">
                🗑️
              </button>
            </div>
          </li>
        );
      })}
    </ul>

    {toEdit && (
      <div className="modal-backdrop" onClick={() => setToEdit(null)}>
        <div className="modal card edit-modal" onClick={(e) => e.stopPropagation()}>
          <h2 className="section-title">Editar medição</h2>
          <MeasurementForm
            initial={toEdit}
            onSave={async (data) => {
              await onUpdate(toEdit.id, data);
              setToEdit(null);
            }}
            onCancel={() => setToEdit(null)}
          />
        </div>
      </div>
    )}

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
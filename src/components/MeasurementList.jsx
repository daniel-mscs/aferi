import { MEASUREMENT_TYPES } from "../constants/measurements";

function formatValues(m) {
  if (m.type === "pressao") return `${m.values.systolic}/${m.values.diastolic}`;
  return m.values.value;
}

function getStatus(m, config) {
  if (!config.reference) return "";
  const outOfRange = config.fields.some((f) => {
    const { min, max } = config.reference[f];
    return m.values[f] < min || m.values[f] > max;
  });
  return outOfRange ? "out-of-range" : "in-range";
}

export default function MeasurementList({ measurements, onDelete }) {
  if (measurements.length === 0) return <p className="muted">Nenhuma medição ainda.</p>;

  const handleDelete = (id) => {
    if (confirm("Apagar esta medição?")) onDelete(id);
  };

  return (
    <ul className="history">
      {measurements.map((m) => {
        const config = MEASUREMENT_TYPES[m.type];
        const status = getStatus(m, config);
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
            </div>
            <button className="btn-ghost" onClick={() => handleDelete(m.id)} aria-label="Apagar">
              🗑️
            </button>
          </li>
        );
      })}
    </ul>
  );
}
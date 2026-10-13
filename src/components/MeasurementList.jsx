import { MEASUREMENT_TYPES } from "../constants/measurements";

function formatValues(m) {
  if (m.type === "pressao") return `${m.values.systolic}/${m.values.diastolic}`;
  return m.values.value;
}

export default function MeasurementList({ measurements, onDelete }) {
  if (measurements.length === 0) return <p>Nenhuma medição ainda.</p>;

  const handleDelete = (id) => {
    if (confirm("Apagar esta medição?")) onDelete(id);
  };

  return (
    <ul>
      {measurements.map((m) => {
        const config = MEASUREMENT_TYPES[m.type];
        return (
          <li key={m.id}>
            <strong>{config.label}:</strong> {formatValues(m)} {config.unit}
            <br />
            <small>{m.date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</small>
            {m.note && <p>{m.note}</p>}
            <button onClick={() => handleDelete(m.id)}>Apagar</button>
          </li>
        );
      })}
    </ul>
  );
}
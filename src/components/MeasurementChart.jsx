import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts";
import { MEASUREMENT_TYPES } from "../constants/measurements";

const COLORS = {
  value: "#4ade80",
  systolic: "#f87171",
  diastolic: "#60a5fa",
};

const FIELD_LABELS = {
  value: "Valor",
  systolic: "Sistólica",
  diastolic: "Diastólica",
};

export default function MeasurementChart({ measurements, type }) {
  const config = MEASUREMENT_TYPES[type];

  const data = measurements
    .filter((m) => m.type === type)
    .sort((a, b) => a.date - b.date)
    .map((m) => ({
      date: m.date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      ...m.values,
    }));

  if (data.length === 0) return <p>Sem dados de {config.label.toLowerCase()} ainda.</p>;

  const allValues = data.flatMap((d) => config.fields.map((f) => d[f]));
  const refMins = config.reference ? config.fields.map((f) => config.reference[f].min) : [];
  const refMaxs = config.reference ? config.fields.map((f) => config.reference[f].max) : [];
  const yMin = Math.floor(Math.min(...allValues, ...refMins) * 0.9);
  const yMax = Math.ceil(Math.max(...allValues, ...refMaxs) * 1.1);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="date" stroke="#888" />
        <YAxis stroke="#888" domain={[yMin, yMax]} />
        <Tooltip />

        {config.reference &&
          config.fields.map((field) => (
            <ReferenceArea
              key={`ref-${field}`}
              y1={config.reference[field].min}
              y2={config.reference[field].max}
              fill={COLORS[field]}
              fillOpacity={0.1}
            />
          ))}

        {config.fields.map((field) => (
          <Line
            key={field}
            type="monotone"
            dataKey={field}
            name={FIELD_LABELS[field]}
            stroke={COLORS[field]}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
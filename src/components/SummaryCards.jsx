import { MEASUREMENT_TYPES, getStatus } from "../constants/measurements";

const WEEK = 7 * 86400000;

function format(type, v) {
  if (type === "pressao") return `${Math.round(v.systolic)}/${Math.round(v.diastolic)}`;
  return String(Math.round(v.value * 10) / 10).replace(".", ",");
}

export default function SummaryCards({ measurements, profile }) {
  const weekAgo = new Date(Date.now() - WEEK);

  return (
    <div className="summary-grid">
      {Object.entries(MEASUREMENT_TYPES).map(([type, config]) => {
        const list = measurements.filter((m) => m.type === type);
        const last = list[0];
        const week = list.filter((m) => m.date >= weekAgo);
        const avg = week.length
          ? Object.fromEntries(
              config.fields.map((f) => [f, week.reduce((sum, m) => sum + m.values[f], 0) / week.length])
            )
          : null;

        return (
          <div key={type} className="summary-card">
            <span className="history-label">{config.label}</span>
            {last ? (
              <>
                <span className={`summary-value ${getStatus(last, config, profile)}`}>
                  {format(type, last.values)} <small>{config.unit}</small>
                </span>
                <span className="muted summary-avg">
                  {avg ? `Média 7 dias: ${format(type, avg)}` : "Sem dados na semana"}
                </span>
              </>
            ) : (
              <span className="muted">Sem registros</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { MEASUREMENT_TYPES, GLUCOSE_CONTEXTS } from "../constants/measurements";
import MeasurementChart from "../components/MeasurementChart";
import BuyMeCoffee from "../components/BuyMeCoffee";
import BMICard from "../components/BMICard";
import InstallPrompt from "../components/InstallPrompt";
import RangesSettings from "../components/RangesSettings";
import ExportReport from "../components/ExportReport";
import DeleteAccount from "../components/DeleteAccount";
import { useProfile } from "../hooks/useProfile";
import { useMeasurements } from "../hooks/useMeasurements";
import MeasurementForm from "../components/MeasurementForm";
import MeasurementList from "../components/MeasurementList";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { measurements, addMeasurement, deleteMeasurement } = useMeasurements();
  const [chartType, setChartType] = useState("glicemia");
  const [chartContext, setChartContext] = useState("jejum");
  const { profile, updateProfile } = useProfile();
  const [historyFilter, setHistoryFilter] = useState("todos");

  const filteredMeasurements =
    historyFilter === "todos"
      ? measurements
      : measurements.filter((m) => m.type === historyFilter);

  const filterOptions = [
    ["todos", "Todos"],
    ...Object.entries(MEASUREMENT_TYPES).map(([key, t]) => [key, t.label]),
  ];

  return (
    <div className="container">
      <header className="app-header">
        <div>
          <h1 className="logo">Aferi</h1>
          <span className="muted">Olá, {user.displayName?.split(" ")[0]} 👋</span>
        </div>
        <button className="btn-ghost" onClick={logout}>Sair</button>
      </header>

      <section className="card">
        <h2 className="section-title">Nova medição</h2>
        <MeasurementForm onSave={addMeasurement} />
      </section>

      <section className="card">
        <h2 className="section-title">IMC</h2>
        <BMICard
          measurements={measurements}
          profile={profile}
          onSaveHeight={(height) => updateProfile({ height })}
        />
      </section>

      <section className="card">
      <h2 className="section-title">Evolução</h2>
      <select className="chart-select" value={chartType} onChange={(e) => setChartType(e.target.value)}>
        {Object.entries(MEASUREMENT_TYPES).map(([key, t]) => (
          <option key={key} value={key}>{t.label}</option>
        ))}
      </select>

      {chartType === "glicemia" && (
        <div className="chips">
          {Object.entries(GLUCOSE_CONTEXTS).map(([key, c]) => (
            <button
              key={key}
              className={`chip ${chartContext === key ? "active" : ""}`}
              onClick={() => setChartContext(key)}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}
      <MeasurementChart
        measurements={measurements}
        type={chartType}
        profile={profile}
        context={chartContext}
      />
      <RangesSettings profile={profile} onSave={(ranges) => updateProfile({ ranges })} />
      </section>

      <section className="card">
        <h2 className="section-title">Histórico</h2>
        <ExportReport
          measurements={measurements}
          profile={profile}
          userName={user.displayName}
        />
        <section className="card">
        <h2 className="section-title">Histórico</h2>
        <div className="chips">
          {filterOptions.map(([key, label]) => (
            <button
              key={key}
              className={`chip ${historyFilter === key ? "active" : ""}`}
              onClick={() => setHistoryFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <MeasurementList measurements={filteredMeasurements} onDelete={deleteMeasurement} profile={profile} />
        <p className="muted disclaimer">
          Uso destinado a adultos. As dicas são orientações gerais e não substituem avaliação médica. Em emergência, ligue 192 (SAMU).
        </p>
      </section>

      <section className="card">
        <h2 className="section-title">Privacidade</h2>
        <a className="btn-ghost link-ghost" href="/privacidade.html" target="_blank" rel="noopener noreferrer">
          📜 Política de Privacidade
        </a>
        <DeleteAccount />
      </section>

      <BuyMeCoffee />
      <InstallPrompt />
      </section>
    </div>
  );
}
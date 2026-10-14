import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { MEASUREMENT_TYPES, GLUCOSE_CONTEXTS } from "../constants/measurements";
import { useProfile } from "../hooks/useProfile";
import { useMeasurements } from "../hooks/useMeasurements";
import MeasurementForm from "../components/MeasurementForm";
import MeasurementList from "../components/MeasurementList";
import MeasurementChart from "../components/MeasurementChart";
import BuyMeCoffee from "../components/BuyMeCoffee";
import BMICard from "../components/BMICard";
import InstallPrompt from "../components/InstallPrompt";
import RangesSettings from "../components/RangesSettings";
import ExportReport from "../components/ExportReport";
import DeleteAccount from "../components/DeleteAccount";
import SummaryCards from "../components/SummaryCards";
import NameEditor from "../components/NameEditor";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { measurements, addMeasurement, deleteMeasurement, updateMeasurement } = useMeasurements();
  const { profile, updateProfile } = useProfile();

  const [chartType, setChartType] = useState("glicemia");
  const [chartContext, setChartContext] = useState("jejum");
  const [chartPeriod, setChartPeriod] = useState(30);
  const [historyFilter, setHistoryFilter] = useState("todos");

  const fullName = profile?.name || user.displayName || user.email?.split("@")[0] || "";
  const firstName = fullName.split(" ")[0];

  const filteredMeasurements =
    historyFilter === "todos"
      ? measurements
      : measurements.filter((m) => m.type === historyFilter);

  const filterOptions = [
    ["todos", "Todos"],
    ...Object.entries(MEASUREMENT_TYPES).map(([key, t]) => [key, t.short ?? t.label]),
  ];

  return (
    <div className="container">
      <header className="app-header">
        <div>
          <h1 className="logo">Aferi</h1>
          <NameEditor
            currentName={firstName}
            onSave={(name) => updateProfile({ name })}
            askIfEmpty={!!profile && !profile.name && !user.displayName}
          />
        </div>
        <button className="btn-ghost" onClick={logout}>Sair</button>
      </header>

      <SummaryCards measurements={measurements} profile={profile} />

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

        <div className="chips">
          {Object.entries(MEASUREMENT_TYPES).map(([key, t]) => (
            <button
              key={key}
              className={`chip ${chartType === key ? "active" : ""}`}
              onClick={() => setChartType(key)}
            >
              {t.short ?? t.label}
            </button>
          ))}
        </div>

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

        <div className="chips">
          {[[7, "7 dias"], [30, "30 dias"], [90, "90 dias"], [null, "Tudo"]].map(([value, label]) => (
            <button
              key={label}
              className={`chip ${chartPeriod === value ? "active" : ""}`}
              onClick={() => setChartPeriod(value)}
            >
              {label}
            </button>
          ))}
        </div>

        <MeasurementChart
          measurements={measurements}
          type={chartType}
          profile={profile}
          context={chartContext}
          days={chartPeriod}
        />
        <RangesSettings profile={profile} onSave={(ranges) => updateProfile({ ranges })} />
      </section>

      <section className="card">
        <h2 className="section-title">Histórico</h2>
        <ExportReport measurements={measurements} profile={profile} userName={fullName} />

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

        <MeasurementList
          measurements={filteredMeasurements}
          onDelete={deleteMeasurement}
          onUpdate={updateMeasurement}
          profile={profile}
        />
        <p className="muted disclaimer">
          Uso destinado a adultos. As dicas são orientações gerais e não substituem avaliação médica. Em
          emergência, ligue 192 (SAMU).
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
    </div>
  );
}
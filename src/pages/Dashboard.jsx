import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { MEASUREMENT_TYPES } from "../constants/measurements";
import MeasurementChart from "../components/MeasurementChart";
import BuyMeCoffee from "../components/BuyMeCoffee";
import BMICard from "../components/BMICard";
import { useProfile } from "../hooks/useProfile";
import { useMeasurements } from "../hooks/useMeasurements";
import MeasurementForm from "../components/MeasurementForm";
import MeasurementList from "../components/MeasurementList";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { measurements, addMeasurement, deleteMeasurement } = useMeasurements();
  const [chartType, setChartType] = useState("glicemia");
  const { profile, updateProfile } = useProfile();

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

      <MeasurementChart measurements={measurements} type={chartType} />
      </section>

      <section className="card">
        <h2 className="section-title">Histórico</h2>
        <section className="card">
        <h2 className="section-title">Histórico</h2>
        <MeasurementList measurements={measurements} onDelete={deleteMeasurement} />
      </section>

      <BuyMeCoffee />
      </section>
    </div>
  );
}
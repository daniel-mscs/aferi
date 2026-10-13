import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { MEASUREMENT_TYPES } from "../constants/measurements";
import MeasurementChart from "../components/MeasurementChart";
import { useMeasurements } from "../hooks/useMeasurements";
import MeasurementForm from "../components/MeasurementForm";
import MeasurementList from "../components/MeasurementList";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { measurements, addMeasurement, deleteMeasurement } = useMeasurements();
  const [chartType, setChartType] = useState("glicemia");

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 16 }}>
      <header>
        <span>Olá, {user.displayName}</span>
        <button onClick={logout}>Sair</button>
      </header>

      <MeasurementForm onSave={addMeasurement} />

      <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
        {Object.entries(MEASUREMENT_TYPES).map(([key, t]) => (
          <option key={key} value={key}>{t.label}</option>
        ))}
      </select>

      <MeasurementChart measurements={measurements} type={chartType} />

      <MeasurementList measurements={measurements} onDelete={deleteMeasurement} />
    </div>
  );
}
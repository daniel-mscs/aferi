import { useAuth } from "../contexts/AuthContext";
import { useMeasurements } from "../hooks/useMeasurements";
import MeasurementForm from "../components/MeasurementForm";
import MeasurementList from "../components/MeasurementList";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { measurements, addMeasurement, deleteMeasurement } = useMeasurements();

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 16 }}>
      <header>
        <span>Olá, {user.displayName}</span>
        <button onClick={logout}>Sair</button>
      </header>

      <MeasurementForm onSave={addMeasurement} />

      <MeasurementList measurements={measurements} onDelete={deleteMeasurement} />
    </div>
  );
}
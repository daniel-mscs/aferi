import { useAuth } from "../contexts/AuthContext";
import { useMeasurements } from "../hooks/useMeasurements";
import MeasurementForm from "../components/MeasurementForm";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { measurements, addMeasurement } = useMeasurements();

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 16 }}>
      <header>
        <span>Olá, {user.displayName}</span>
        <button onClick={logout}>Sair</button>
      </header>

      <MeasurementForm onSave={addMeasurement} />

      <p>{measurements.length} medições registradas</p>
    </div>
  );
}
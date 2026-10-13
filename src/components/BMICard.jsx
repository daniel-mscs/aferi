import { useState } from "react";
import { calcBMI, classifyBMI } from "../constants/measurements";

export default function BMICard({ measurements, profile, onSaveHeight }) {
  const [editing, setEditing] = useState(false);
  const [height, setHeight] = useState("");

  if (!profile) return null;

  const latestWeight = measurements.find((m) => m.type === "peso")?.values.value;
  const bmi = calcBMI(latestWeight, profile.height);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSaveHeight(Number(height));
    setEditing(false);
  };

  if (!profile.height || editing) {
    return (
      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          Sua altura (cm)
          <input
            type="number"
            inputMode="numeric"
            min="50"
            max="250"
            required
            placeholder="Ex: 175"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </label>
        <button type="submit" className="btn-primary">Salvar altura</button>
      </form>
    );
  }

  if (!bmi) return <p className="muted">Registre seu peso pra calcular o IMC.</p>;

  const { label, status } = classifyBMI(bmi);

  return (
    <div className="bmi">
      <span className={`history-value ${status}`}>{bmi.toFixed(1).replace(".", ",")}</span>
      <span className={`bmi-label ${status}`}>{label}</span>
      <span className="muted">
        Peso: {latestWeight} kg · Altura: {profile.height} cm
      </span>
      <button
        className="btn-ghost"
        onClick={() => {
          setHeight(profile.height);
          setEditing(true);
        }}
      >
        Editar altura
      </button>
    </div>
  );
}
import { useState } from "react";
import { MEASUREMENT_TYPES } from "../constants/measurements";

const FIELD_LABELS = {
  value: "Valor",
  systolic: "Sistólica",
  diastolic: "Diastólica",
};

function nowLocal() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export default function MeasurementForm({ onSave }) {
  const [type, setType] = useState("glicemia");
  const [values, setValues] = useState({});
  const [date, setDate] = useState(nowLocal());
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const config = MEASUREMENT_TYPES[type];

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setValues({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(date) > new Date()) {
      alert("A data não pode ser no futuro.");
      return;
    }
    setSaving(true);
    const numericValues = Object.fromEntries(
      Object.entries(values).map(([k, v]) => {
        let n = Number(v);
        if (type === "pressao" && n < 30) n = Math.round(n * 10);
        return [k, n];
      })
    );
    await onSave({ type, values: numericValues, date: new Date(date), note });
    setValues({});
    setNote("");
    setDate(nowLocal());
    setSaving(false);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <select value={type} onChange={handleTypeChange}>
        {Object.entries(MEASUREMENT_TYPES).map(([key, t]) => (
          <option key={key} value={key}>{t.label}</option>
        ))}
      </select>

      {config.fields.map((field) => (
        <label key={field} className="field">
          {FIELD_LABELS[field]} ({config.unit})
          <input
            type="number"
            inputMode="decimal"
            step="any"
            required
            value={values[field] ?? ""}
            onChange={(e) => setValues({ ...values, [field]: e.target.value })}
          />
        </label>
      ))}

      {type === "pressao" && (
        <p className="muted">
          Pode digitar do jeito que se fala (ex: 12 por 8) que o app converte pra 120/80.
        </p>
      )}

      <input
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        max={nowLocal()}
        required
      />

      <textarea
        placeholder="Observação (opcional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button type="submit" className="btn-primary" disabled={saving}>
        {saving ? "Salvando..." : "Registrar"}
      </button>
    </form>
  );
}
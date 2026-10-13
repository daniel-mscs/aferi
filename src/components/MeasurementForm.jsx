import { useState } from "react";
import { MEASUREMENT_TYPES, GLUCOSE_CONTEXTS } from "../constants/measurements";

const FIELD_LABELS = {
  value: "Valor",
  systolic: "Sistólica (a maior)",
  diastolic: "Diastólica (a menor)",
};

function toLocalInput(date = new Date()) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

const nowLocal = () => toLocalInput();

export default function MeasurementForm({ onSave, initial, onCancel }) {
  const [type, setType] = useState(initial?.type ?? "glicemia");
  const [values, setValues] = useState(initial?.values ?? {});
  const [date, setDate] = useState(initial ? toLocalInput(initial.date) : nowLocal());
  const [note, setNote] = useState(initial?.note ?? "");
  const [context, setContext] = useState(initial?.context ?? "jejum");
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
    if (Object.values(values).some((v) => Number(v) <= 0)) {
      alert("Os valores precisam ser maiores que zero.");
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
    if (type === "pressao" && numericValues.systolic <= numericValues.diastolic) {
      alert("A sistólica (a maior) precisa ser maior que a diastólica (a menor).");
      setSaving(false);
      return;
    }
    await onSave({
      type,
      values: numericValues,
      date: new Date(date),
      note,
      context: type === "glicemia" ? context : null,
    });
    if (!initial) {
      setValues({});
      setNote("");
      setDate(nowLocal());
    }
    setSaving(false);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <select value={type} onChange={handleTypeChange}>
        {Object.entries(MEASUREMENT_TYPES).map(([key, t]) => (
          <option key={key} value={key}>{t.label}</option>
        ))}
      </select>

      {type === "glicemia" && (
        <div className="chips">
          {Object.entries(GLUCOSE_CONTEXTS).map(([key, c]) => (
            <button
              key={key}
              type="button"
              className={`chip ${context === key ? "active" : ""}`}
              onClick={() => setContext(key)}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      {config.fields.map((field) => (
        <label key={field} className="field">
          {FIELD_LABELS[field]} ({config.unit})
          <input
            type="number"
            inputMode="decimal"
            step="any"
            min="1"
            required
            onKeyDown={(e) => ["-", "+", "e", "E"].includes(e.key) && e.preventDefault()}
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
        {saving ? "Salvando..." : initial ? "Salvar alterações" : "Registrar"}
      </button>
      {onCancel && (
        <button type="button" className="btn-ghost" onClick={onCancel}>
          Cancelar
        </button>
      )}
    </form>
  );
}
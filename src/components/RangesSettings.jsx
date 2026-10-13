import { useState } from "react";
import { MEASUREMENT_TYPES, getReference } from "../constants/measurements";

const FIELD_LABELS = { value: "", systolic: "Sistólica", diastolic: "Diastólica" };

const PRESETS = {
  glicemia: [
    { label: "Padrão", ranges: null },
    { label: "Sou diabético", ranges: { value: { min: 80, max: 130 } } },
  ],
};

export default function RangesSettings({ profile, onSave }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({});
  const [saving, setSaving] = useState(false);

  const types = Object.entries(MEASUREMENT_TYPES).filter(([, t]) => t.reference);

  const openEditor = () => {
    const initial = {};
    types.forEach(([key]) => {
      initial[key] = getReference(key, profile);
    });
    setDraft(initial);
    setOpen(true);
  };

  const setValue = (type, field, bound, value) => {
    setDraft({
      ...draft,
      [type]: { ...draft[type], [field]: { ...draft[type][field], [bound]: Number(value) } },
    });
  };

  const applyPreset = (type, ranges) => {
    setDraft({ ...draft, [type]: ranges ?? MEASUREMENT_TYPES[type].reference });
  };

  const handleSave = async () => {
    const invalid = types.some(([key, t]) =>
      t.fields.some((f) => draft[key][f].min >= draft[key][f].max)
    );
    if (invalid) {
      alert("O valor mínimo precisa ser menor que o máximo.");
      return;
    }
    setSaving(true);
    await onSave(draft);
    setSaving(false);
    setOpen(false);
  };

  if (!open) {
    return (
      <button className="btn-ghost" onClick={openEditor}>
        ⚙️ Personalizar minhas metas
      </button>
    );
  }

  return (
    <div className="modal-backdrop" onClick={() => setOpen(false)}>
      <div className="modal card ranges-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="section-title">Minhas metas</h2>
        <p className="muted">
          Use as metas que seu médico passou. Elas mudam as faixas do gráfico e as cores do histórico.
        </p>

        {types.map(([key, t]) => (
          <div key={key} className="range-group">
            <strong>{t.label} ({t.unit})</strong>

            {PRESETS[key] && (
              <div className="chips">
                {PRESETS[key].map((p) => (
                  <button key={p.label} type="button" className="chip" onClick={() => applyPreset(key, p.ranges)}>
                    {p.label}
                  </button>
                ))}
              </div>
            )}

            {t.fields.map((field) => (
              <div key={field} className="range-row">
                {FIELD_LABELS[field] && <span className="muted range-label">{FIELD_LABELS[field]}</span>}
                <input
                  type="number"
                  inputMode="numeric"
                  min="1"
                  value={draft[key][field].min}
                  onChange={(e) => setValue(key, field, "min", e.target.value)}
                />
                <span className="muted">a</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min="1"
                  value={draft[key][field].max}
                  onChange={(e) => setValue(key, field, "max", e.target.value)}
                />
              </div>
            ))}
          </div>
        ))}

        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Salvando..." : "Salvar metas"}
        </button>
        <button className="btn-ghost" onClick={() => setOpen(false)}>Cancelar</button>
      </div>
    </div>
  );
}
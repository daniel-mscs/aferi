import { useState } from "react";
import { MEASUREMENT_TYPES, GLUCOSE_CONTEXTS, getReference } from "../constants/measurements";
import { toast } from "sonner";

const FIELD_LABELS = { value: "", systolic: "Sistólica", diastolic: "Diastólica" };

const ITEMS = [
  { key: "glicemia", type: "glicemia", context: "jejum", label: "Glicemia em jejum" },
  { key: "glicemia_pos", type: "glicemia", context: "pos", label: "Glicemia pós-refeição" },
  { key: "pressao", type: "pressao", label: "Pressão arterial" },
  { key: "frequencia", type: "frequencia", label: "Frequência cardíaca" },
];

const GLUCOSE_PRESETS = [
  {
    label: "Padrão",
    ranges: {
      glicemia: GLUCOSE_CONTEXTS.jejum.reference,
      glicemia_pos: GLUCOSE_CONTEXTS.pos.reference,
    },
  },
  {
    label: "Sou diabético",
    ranges: {
      glicemia: { value: { min: 80, max: 130 } },
      glicemia_pos: { value: { min: 80, max: 179 } },
    },
  },
];

export default function RangesSettings({ profile, onSave }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({});
  const [saving, setSaving] = useState(false);

  const openEditor = () => {
    const initial = {};
    ITEMS.forEach((item) => {
      initial[item.key] = getReference(item.type, profile, item.context);
    });
    setDraft(initial);
    setOpen(true);
  };

  const setValue = (key, field, bound, value) => {
    setDraft({
      ...draft,
      [key]: { ...draft[key], [field]: { ...draft[key][field], [bound]: Number(value) } },
    });
  };

  const applyPreset = (ranges) => setDraft({ ...draft, ...ranges });

  const handleSave = async () => {
    const invalid = ITEMS.some((item) =>
      MEASUREMENT_TYPES[item.type].fields.some((f) => draft[item.key][f].min >= draft[item.key][f].max)
    );
    if (invalid) {
      toast.error("O valor mínimo precisa ser menor que o máximo.");
      return;
    }
    setSaving(true);
    await onSave(draft);
    toast.success("Metas salvas!");
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

        {ITEMS.map((item) => {
          const config = MEASUREMENT_TYPES[item.type];
          return (
            <div key={item.key} className="range-group">
              <strong>{item.label} ({config.unit})</strong>

              {item.key === "glicemia" && (
                <div className="chips">
                  {GLUCOSE_PRESETS.map((p) => (
                    <button key={p.label} type="button" className="chip" onClick={() => applyPreset(p.ranges)}>
                      {p.label}
                    </button>
                  ))}
                </div>
              )}

              {config.fields.map((field) => (
                <div key={field} className="range-row">
                  {FIELD_LABELS[field] && <span className="muted range-label">{FIELD_LABELS[field]}</span>}
                  <input
                    type="number"
                    inputMode="numeric"
                    min="1"
                    value={draft[item.key][field].min}
                    onChange={(e) => setValue(item.key, field, "min", e.target.value)}
                  />
                  <span className="muted">a</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="1"
                    value={draft[item.key][field].max}
                    onChange={(e) => setValue(item.key, field, "max", e.target.value)}
                  />
                </div>
              ))}
            </div>
          );
        })}

        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Salvando..." : "Salvar metas"}
        </button>
        <button className="btn-ghost" onClick={() => setOpen(false)}>Cancelar</button>
      </div>
    </div>
  );
}
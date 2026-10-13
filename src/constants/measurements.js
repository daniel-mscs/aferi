export const MEASUREMENT_TYPES = {
  glicemia: {
    label: "Glicemia",
    unit: "mg/dL",
    fields: ["value"],
    reference: { value: { min: 70, max: 99 } },
  },
  pressao: {
    label: "Pressão arterial",
    unit: "mmHg",
    fields: ["systolic", "diastolic"],
    reference: {
      systolic: { min: 90, max: 120 },
      diastolic: { min: 60, max: 80 },
    },
  },
  peso: {
    label: "Peso",
    unit: "kg",
    fields: ["value"],
    reference: null,
  },
  frequencia: {
    label: "Frequência cardíaca",
    unit: "bpm",
    fields: ["value"],
    reference: { value: { min: 60, max: 100 } },
  },
};
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
export function calcBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm) return null;
  const h = heightCm / 100;
  return weightKg / (h * h);
}

export function classifyBMI(bmi) {
  if (bmi < 18.5) return { label: "Abaixo do peso", status: "out-of-range" };
  if (bmi < 25) return { label: "Peso normal", status: "in-range" };
  if (bmi < 30) return { label: "Sobrepeso", status: "out-of-range" };
  return { label: "Obesidade", status: "out-of-range" };
}
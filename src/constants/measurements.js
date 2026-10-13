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

export function getReference(type, profile, context) {
  const base = MEASUREMENT_TYPES[type].reference;
  if (!base) return null;
  if (type === "glicemia" && context && context !== "jejum") {
    return profile?.ranges?.[`glicemia_${context}`] ?? GLUCOSE_CONTEXTS[context].reference;
  }
  const custom = profile?.ranges?.[type];
  return custom ? { ...base, ...custom } : base;
}

export const GLUCOSE_CONTEXTS = {
  jejum: { label: "Jejum", reference: { value: { min: 70, max: 99 } } },
  pos: { label: "Pós-refeição", reference: { value: { min: 70, max: 139 } } },
  aleatoria: { label: "Aleatória", reference: { value: { min: 70, max: 139 } } },
};

export function getStatus(m, config, profile) {
  if (m.type === "peso") {
    const bmi = calcBMI(m.values.value, profile?.height);
    return bmi ? classifyBMI(bmi).status : "";
  }
  const reference = getReference(m.type, profile, m.context);
  if (!reference) return "";
  const outOfRange = config.fields.some((f) => {
    const { min, max } = reference[f];
    return m.values[f] < min || m.values[f] > max;
  });
  return outOfRange ? "out-of-range" : "in-range";
}
export function getTip(m) {
  const v = m.values;

  if (m.type === "glicemia") {
    const g = v.value;
    if (g < 54)
      return { level: "danger", text: "Glicemia muito baixa. Consuma açúcar imediatamente (meio copo de suco ou 1 colher de sopa de açúcar). Se houver confusão ou desmaio, ligue 192 (SAMU)." };
    if (g < 70)
      return { level: "warning", text: "Glicemia baixa. Consuma 15 g de açúcar rápido (meio copo de suco comum) e meça de novo em 15 minutos." };
    if (g >= 250)
      return { level: "danger", text: "Glicemia muito alta. Procure atendimento médico, principalmente se tiver sede intensa, náusea, vômito ou mal-estar." };
    const fasting = !m.context || m.context === "jejum";
    if (fasting) {
      if (g >= 126)
        return { level: "warning", text: "Glicemia alta em jejum. Beba água, evite doces e carboidratos simples. Se repetir, procure acompanhamento médico." };
      if (g >= 100)
        return { level: "info", text: "Um pouco acima do ideal em jejum. Se repetir, converse com seu médico." };
    } else {
      if (g >= 200)
        return { level: "warning", text: "Glicemia alta após refeição. Beba água e evite doces. Se repetir com frequência, procure acompanhamento médico." };
      if (g >= 140)
        return { level: "info", text: "Um pouco acima do esperado após refeição. Vale observar o que comeu e continuar acompanhando." };
    }
  }

  if (m.type === "pressao") {
    const { systolic: s, diastolic: d } = v;
    if (s >= 180 || d >= 110)
      return { level: "danger", text: "Pressão muito alta. Repouse 5 minutos e meça de novo. Se continuar alta ou tiver dor de cabeça forte, dor no peito, falta de ar ou alteração na visão, procure atendimento imediatamente (SAMU 192)." };
    if (s >= 140 || d >= 90)
      return { level: "warning", text: "Pressão alta. Descanse, evite sal e cafeína e meça de novo mais tarde. Se repetir, procure um médico." };
    if (s < 90 || d < 60)
      return { level: "warning", text: "Pressão baixa. Deite-se com as pernas elevadas e beba água. Se tiver desmaio, tontura forte ou confusão, procure atendimento." };
    if (s > 120 || d > 80)
      return { level: "info", text: "Pressão um pouco acima do ideal. Reduzir o sal e praticar atividade física ajudam. Continue acompanhando." };
  }

  if (m.type === "frequencia") {
    const f = v.value;
    if (f > 120)
      return { level: "danger", text: "Frequência muito alta em repouso. Se vier com dor no peito, falta de ar, tontura ou palpitação, procure atendimento imediatamente." };
    if (f > 100)
      return { level: "warning", text: "Frequência acima do normal. Descanse alguns minutos e meça de novo. Café, ansiedade e exercício recente aumentam a frequência." };
    if (f < 60)
      return { level: "info", text: "Frequência baixa. Em quem treina pode ser normal. Se tiver tontura, cansaço excessivo ou desmaio, procure atendimento." };
  }

  return null;
}
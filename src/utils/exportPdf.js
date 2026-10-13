import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MEASUREMENT_TYPES, GLUCOSE_CONTEXTS, getReference } from "../constants/measurements";

const fmtDate = (d) => d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

const FIELD_NAMES = { value: "", systolic: "Sistólica ", diastolic: "Diastólica " };

function formatValue(m) {
  if (m.type === "pressao") return `${m.values.systolic}/${m.values.diastolic}`;
  return String(m.values.value).replace(".", ",");
}

function isOutOfRange(m, profile) {
  const ref = getReference(m.type, profile, m.context);
  if (!ref) return false;
  return MEASUREMENT_TYPES[m.type].fields.some(
    (f) => m.values[f] < ref[f].min || m.values[f] > ref[f].max
  );
}

function summarize(list, field) {
  const vals = list.map((m) => m.values[field]);
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  return { min: Math.min(...vals), max: Math.max(...vals), avg: Math.round(avg) };
}

export function exportPdf(measurements, { userName, days, profile }) {
  const since = days ? new Date(Date.now() - days * 86400000) : null;
  const list = measurements.filter((m) => !since || m.date >= since);
  if (list.length === 0) return false;

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Aferi - Relatório de sinais vitais", 14, 20);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Paciente: ${userName}`, 14, 28);
  doc.text(`Período: ${days ? `últimos ${days} dias` : "todo o histórico"}`, 14, 33);
  doc.text(`Gerado em: ${fmtDate(new Date())}`, 14, 38);

  let y = 48;

  Object.entries(MEASUREMENT_TYPES).forEach(([type, config]) => {
    const items = list.filter((m) => m.type === type);
    if (items.length === 0) return;

    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    const summary = config.fields
      .map((f) => {
        const s = summarize(items, f);
        return `${FIELD_NAMES[f]}média ${s.avg} (mín ${s.min} / máx ${s.max})`;
      })
      .join("  |  ");

    doc.setFontSize(13);
    doc.setTextColor(0);
    doc.text(`${config.label} (${config.unit})`, 14, y);
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(summary, 14, y + 5);

    autoTable(doc, {
      startY: y + 8,
      head: [["Data", "Valor", "Contexto", "Observação"]],
      body: items.map((m) => [
        fmtDate(m.date),
        formatValue(m),
        m.context ? GLUCOSE_CONTEXTS[m.context].label : "-",
        m.note || "-",
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [15, 17, 21] },
      didParseCell: (data) => {
        if (
          data.section === "body" &&
          data.column.index === 1 &&
          isOutOfRange(items[data.row.index], profile)
        ) {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fontStyle = "bold";
        }
      },
    });

    y = doc.lastAutoTable.finalY + 14;
  });

  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text("Valores em vermelho estão fora da faixa de referência do paciente.", 14, 290);

  doc.save(`aferi-relatorio-${new Date().toISOString().slice(0, 10)}.pdf`);
  return true;
}
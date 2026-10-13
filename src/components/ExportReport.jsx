import { useState } from "react";

const PERIODS = [
  [30, "30 dias"],
  [90, "90 dias"],
  [null, "Tudo"],
];

export default function ExportReport({ measurements, profile, userName }) {
  const [open, setOpen] = useState(false);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    const { exportPdf } = await import("../utils/exportPdf");
    const ok = exportPdf(measurements, { userName, days, profile });
    setLoading(false);
    if (!ok) {
      alert("Nenhuma medição nesse período.");
      return;
    }
    setOpen(false);
  };

  if (!open) {
    return (
      <button className="btn-ghost" onClick={() => setOpen(true)}>
        📄 Exportar para o médico
      </button>
    );
  }

  return (
    <div className="modal-backdrop" onClick={() => setOpen(false)}>
      <div className="modal card" onClick={(e) => e.stopPropagation()}>
        <h2 className="section-title">Relatório em PDF</h2>
        <p className="muted">Escolha o período pra levar na consulta:</p>

        <div className="chips">
          {PERIODS.map(([value, label]) => (
            <button
              key={label}
              className={`chip ${days === value ? "active" : ""}`}
              onClick={() => setDays(value)}
            >
              {label}
            </button>
          ))}
        </div>

        <button className="btn-primary" onClick={handleExport} disabled={loading}>
          {loading ? "Gerando..." : "Gerar PDF"}
        </button>
        <button className="btn-ghost" onClick={() => setOpen(false)}>Cancelar</button>
      </div>
    </div>
  );
}
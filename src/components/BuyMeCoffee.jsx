import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

const PIX_CODE =
  "00020126460014BR.GOV.BCB.PIX0124daniel.mth1996@gmail.com5204000053039865802BR5920Daniel Cardoso Alves6009SAO PAULO62140510OliUY6dwjx63046F26";

export default function BuyMeCoffee() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(PIX_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button className="coffee-btn" onClick={() => setOpen(true)}>
        ☕ Me paga um café
      </button>

      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="modal card" onClick={(e) => e.stopPropagation()}>
            <h2 className="section-title">☕ Me paga um café?</h2>
            <p className="muted">
              O Aferi é e sempre será <strong>gratuito</strong>. 💚
            </p>
            <p className="muted">
              Se ele te ajuda de alguma forma, considere contribuir com qualquer valor via Pix.
              Isso ajuda a manter o projeto vivo!
            </p>

            <div className="qr-wrapper">
              <QRCodeSVG value={PIX_CODE} size={180} />
            </div>

            <button className="btn-primary" onClick={handleCopy}>
              {copied ? "Copiado! ✅" : "Copiar código Pix"}
            </button>
            <button className="btn-ghost" onClick={() => setOpen(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
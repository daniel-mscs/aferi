import { useState } from "react";
import { deleteAccount } from "../utils/deleteAccount";
import { toast } from "sonner";

export default function DeleteAccount() {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  const close = () => {
    setOpen(false);
    setConfirmText("");
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteAccount();
    } catch (err) {
      toast.error(
        err.code === "auth/requires-recent-login"
          ? "Por segurança, saia e entre de novo antes de apagar a conta."
          : "Não foi possível apagar a conta. Tente novamente."
      );
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button className="btn-ghost btn-danger-ghost" onClick={() => setOpen(true)}>
        🗑️ Apagar minha conta e meus dados
      </button>
    );
  }

  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="modal card" onClick={(e) => e.stopPropagation()}>
        <h2 className="section-title">Apagar conta?</h2>
        <p className="muted">
          Todas as suas medições, metas e dados de perfil serão apagados <strong>permanentemente</strong>.
          Essa ação não pode ser desfeita.
        </p>
        <p className="muted">Dica: exporte o PDF antes, se quiser guardar seu histórico.</p>
        <label className="field">
          Pra confirmar, digite APAGAR:
          <input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
        </label>
        <button
          className="btn-danger"
          onClick={handleDelete}
          disabled={confirmText !== "APAGAR" || loading}
        >
          {loading ? "Apagando..." : "Apagar tudo"}
        </button>
        <button className="btn-ghost" onClick={close}>Cancelar</button>
      </div>
    </div>
  );
}
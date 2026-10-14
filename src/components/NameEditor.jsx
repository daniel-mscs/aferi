import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function NameEditor({ currentName, onSave, askIfEmpty }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (askIfEmpty) {
      setName("");
      setOpen(true);
    }
  }, [askIfEmpty]);

  const openEditor = () => {
    setName(currentName);
    setOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave(trimmed);
    toast.success("Nome atualizado!");
    setOpen(false);
  };

  return (
    <>
      <button className="greeting" onClick={openEditor}>
        Olá, {currentName} 👋 <span className="greeting-edit">✏️</span>
      </button>

      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <form className="modal card" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
            <h2 className="section-title">Como podemos te chamar?</h2>
            <input
              autoFocus
              required
              maxLength={40}
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button type="submit" className="btn-primary">Salvar</button>
            <button type="button" className="btn-ghost" onClick={() => setOpen(false)}>
              Cancelar
            </button>
          </form>
        </div>
      )}
    </>
  );
}
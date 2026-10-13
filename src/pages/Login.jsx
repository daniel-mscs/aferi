import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import AnimatedLogo from "../components/AnimatedLogo";

export default function Login() {
  const { login, sendLoginLink } = useAuth();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState(null);

  const handleGoogle = () =>
    login().catch((err) => {
      if (err.code !== "auth/popup-closed-by-user") {
        console.error(err);
        toast.error("Não foi possível entrar. Tente novamente.");
      }
    });

  const handleEmail = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await sendLoginLink(email);
      setSentTo(email);
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível enviar o link. Confira o e-mail.");
    }
    setSending(false);
  };

  return (
    <div className="login">
      <AnimatedLogo className="login-logo" />
      <h1 className="logo login-title">Aferi</h1>
      <p className="muted">Seu diário de sinais vitais</p>

      <div className="login-box">
        <button className="btn-primary" onClick={handleGoogle}>
          Entrar com Google
        </button>

        <div className="divider">ou</div>

        {sentTo ? (
          <div className="login-sent">
            <p>
              📩 Enviamos um link para <strong>{sentTo}</strong>.
            </p>
            <p className="muted">Abra seu e-mail e toque no link pra entrar. Confira também o spam.</p>
            <button className="btn-ghost" onClick={() => setSentTo(null)}>
              Usar outro e-mail
            </button>
          </div>
        ) : (
          <form className="form" onSubmit={handleEmail}>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="login-email-btn" disabled={sending}>
              {sending ? "Enviando..." : "Receber link de acesso"}
            </button>
          </form>
        )}
      </div>

      <p className="muted consent">
        Ao entrar, você concorda com a{" "}
        <a href="/privacidade.html" target="_blank" rel="noopener noreferrer">
          Política de Privacidade
        </a>{" "}
        e com o armazenamento dos seus dados de saúde.
      </p>
    </div>
  );
}
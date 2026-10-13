import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();

  return (
    <div className="login">
      <img src="/logo.svg" alt="" className="login-logo" />
      <h1 className="logo login-title">Aferi</h1>
      <p className="muted">Seu diário de sinais vitais</p>
      <button className="btn-primary login-btn" onClick={() => login().catch(() => {})}>
        Entrar com Google
      </button>
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
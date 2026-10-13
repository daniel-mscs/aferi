import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();

  return (
    <div style={{ textAlign: "center", marginTop: "30vh" }}>
      <h1>Aferi</h1>
      <p>Seu diário de sinais vitais</p>
      <button onClick={login}>Entrar com Google</button>
    </div>
  );
}
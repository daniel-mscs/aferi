import { useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";

export default function App() {
  const { user, loading, logout } = useAuth();

  if (loading) return <p>Carregando...</p>;
  if (!user) return <Login />;

  return (
    <div style={{ textAlign: "center", marginTop: "30vh" }}>
      <h2>Olá, {user.displayName} 👋</h2>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
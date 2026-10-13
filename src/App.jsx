import { useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Splash from "./components/Splash";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <Splash />;
  if (!user) return <Login />;

  return <Dashboard />;
}
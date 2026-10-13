import AnimatedLogo from "./AnimatedLogo";

export default function Splash() {
  return (
    <div className="splash">
      <AnimatedLogo className="splash-logo" />
      <span className="logo">Aferi</span>
      <span className="muted">Carregando seus sinais vitais...</span>
    </div>
  );
}
import { useEffect, useState } from "react";

const DISMISS_KEY = "aferi-install-dismissed";

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function wasDismissed() {
  try {
    return localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    if (isStandalone() || wasDismissed()) return;

    if (isIOS()) {
      setIos(true);
      const timer = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(timer);
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {}
    setShow(false);
  };

  const install = async () => {
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="modal-backdrop" onClick={dismiss}>
      <div className="modal card" onClick={(e) => e.stopPropagation()}>
        <img src="/logo.svg" alt="" className="install-logo" />
        <h2 className="section-title">Instale o Aferi 📲</h2>
        <p className="muted">
          Acesse direto da tela inicial, em tela cheia, como um app de verdade.
        </p>

        {ios ? (
          <>
            <p className="muted">
              Toque em <strong>Compartilhar</strong> (o quadrado com a seta pra cima) e depois em{" "}
              <strong>Adicionar à Tela de Início</strong>.
            </p>
            <button className="btn-primary" onClick={dismiss}>Entendi</button>
          </>
        ) : (
          <>
            <button className="btn-primary" onClick={install}>Instalar</button>
            <button className="btn-ghost" onClick={dismiss}>Agora não</button>
          </>
        )}
      </div>
    </div>
  );
}
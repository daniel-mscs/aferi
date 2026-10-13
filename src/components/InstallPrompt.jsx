import { useEffect, useState } from "react";

const DISMISS_KEY = "aferi-install-dismissed";
const BTN_KEY = "aferi-install-btn-hidden";

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
  const [deferredPrompt, setDeferredPrompt] = useState(() => window.__installPrompt ?? null);
  const [show, setShow] = useState(false);
  const [installed, setInstalled] = useState(isStandalone());
  const ios = isIOS();
  const [btnHidden, setBtnHidden] = useState(() => {
    try {
      return localStorage.getItem(BTN_KEY) === "1";
    } catch {
      return false;
    }
  });

  const hideButton = () => {
    try {
      localStorage.setItem(BTN_KEY, "1");
    } catch {}
    setBtnHidden(true);
  };

  useEffect(() => {
    if (installed) return;

    const onReady = () => setDeferredPrompt(window.__installPrompt);
    const onInstalled = () => {
      setInstalled(true);
      setShow(false);
    };

    window.addEventListener("installprompt-ready", onReady);
    window.addEventListener("appinstalled", onInstalled);

    const timer = wasDismissed() ? null : setTimeout(() => setShow(true), 2000);

    return () => {
      window.removeEventListener("installprompt-ready", onReady);
      window.removeEventListener("appinstalled", onInstalled);
      clearTimeout(timer);
    };
  }, [installed]);

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {}
    setShow(false);
  };

  const install = async () => {
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    window.__installPrompt = null;
    setDeferredPrompt(null);
    setShow(false);
  };

  if (installed) return null;

  return (
    <>
      {!btnHidden && (
        <div className="install-btn">
          <button onClick={() => setShow(true)}>📲 Instalar app</button>
          <button className="install-close" onClick={hideButton} aria-label="Fechar">
            ✕
          </button>
        </div>
      )}

      {show && (
        <div className="modal-backdrop" onClick={dismiss}>
          <div className="modal card" onClick={(e) => e.stopPropagation()}>
            <img src="/logo.svg" alt="" className="install-logo" />
            <h2 className="section-title">Instale o Aferi 📲</h2>
            <p className="muted">
              Acesse direto da tela inicial, em tela cheia, como um app de verdade.
            </p>

            {deferredPrompt ? (
              <>
                <button className="btn-primary" onClick={install}>Instalar</button>
                <button className="btn-ghost" onClick={dismiss}>Agora não</button>
              </>
            ) : ios ? (
              <>
                <p className="muted">
                  Toque em <strong>Compartilhar</strong> (o quadrado com a seta pra cima) e depois em{" "}
                  <strong>Adicionar à Tela de Início</strong>.
                </p>
                <button className="btn-primary" onClick={dismiss}>Entendi</button>
              </>
            ) : (
              <>
                <p className="muted">
                  Toque no menu <strong>⋮</strong> do navegador e depois em{" "}
                  <strong>Instalar app</strong> ou <strong>Adicionar à tela inicial</strong>.
                </p>
                <button className="btn-primary" onClick={dismiss}>Entendi</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
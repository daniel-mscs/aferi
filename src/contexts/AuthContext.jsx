import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";

const EMAIL_KEY = "aferi-email-for-signin";
import { auth, googleProvider } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    getRedirectResult(auth).catch(() => {});

    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = null;
      try {
        email = localStorage.getItem(EMAIL_KEY);
      } catch {}
      if (!email) email = window.prompt("Confirme seu e-mail para entrar:");
      if (email) {
        signInWithEmailLink(auth, email, window.location.href)
          .then(() => {
            try {
              localStorage.removeItem(EMAIL_KEY);
            } catch {}
            window.history.replaceState(null, "", "/");
          })
          .catch(() => {});
      }
    }
    return unsubscribe;
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const fallbackErrors = [
        "auth/popup-blocked",
        "auth/operation-not-supported-in-this-environment",
        "auth/cancelled-popup-request",
      ];
      if (fallbackErrors.includes(err.code)) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        throw err;
      }
    }
  };
  const logout = () => signOut(auth);

  const sendLoginLink = async (email) => {
    await sendSignInLinkToEmail(auth, email, {
      url: window.location.origin,
      handleCodeInApp: true,
    });
    try {
      localStorage.setItem(EMAIL_KEY, email);
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, sendLoginLink }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
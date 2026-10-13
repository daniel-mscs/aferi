import { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    return onSnapshot(ref, (snap) => setProfile(snap.exists() ? snap.data() : {}));
  }, [user]);

  const updateProfile = (data) =>
    setDoc(doc(db, "users", user.uid), data, { merge: true });

  return { profile, updateProfile };
}
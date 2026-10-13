import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

export function useMeasurements() {
  const { user } = useAuth();
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const ref = collection(db, "users", user.uid, "measurements");
    const q = query(ref, orderBy("date", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => {
        const data = d.data();
        return { id: d.id, ...data, date: data.date.toDate() };
      });
      setMeasurements(list);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const addMeasurement = ({ type, values, date, note, context }) =>
    addDoc(collection(db, "users", user.uid, "measurements"), {
      type,
      values,
      context: context || null,
      date: Timestamp.fromDate(date),
      note: note || "",
      createdAt: serverTimestamp(),
    });

  const deleteMeasurement = (id) =>
    deleteDoc(doc(db, "users", user.uid, "measurements", id));

  const updateMeasurement = (id, { type, values, date, note, context }) =>
    updateDoc(doc(db, "users", user.uid, "measurements", id), {
      type,
      values,
      date: Timestamp.fromDate(date),
      note: note || "",
      context: context || null,
    });

  return { measurements, loading, addMeasurement, deleteMeasurement, updateMeasurement };
}
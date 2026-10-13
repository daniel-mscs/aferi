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

const logError = (err) => console.error("Erro ao sincronizar:", err);

export function useMeasurements() {
  const { user } = useAuth();
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const ref = collection(db, "users", user.uid, "measurements");
    const q = query(ref, orderBy("date", "desc"));

    const unsubscribe = onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
      const list = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          date: data.date.toDate(),
          pending: d.metadata.hasPendingWrites,
        };
      });
      setMeasurements(list);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const measurementsRef = () => collection(db, "users", user.uid, "measurements");

  const addMeasurement = ({ type, values, date, note, context }) => {
    addDoc(measurementsRef(), {
      type,
      values,
      context: context || null,
      date: Timestamp.fromDate(date),
      note: note || "",
      createdAt: serverTimestamp(),
    }).catch(logError);
  };

  const updateMeasurement = (id, { type, values, date, note, context }) => {
    updateDoc(doc(measurementsRef(), id), {
      type,
      values,
      context: context || null,
      date: Timestamp.fromDate(date),
      note: note || "",
    }).catch(logError);
  };

  const deleteMeasurement = (id) => {
    deleteDoc(doc(measurementsRef(), id)).catch(logError);
  };

  return { measurements, loading, addMeasurement, deleteMeasurement, updateMeasurement };
}
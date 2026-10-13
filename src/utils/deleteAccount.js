import { collection, doc, getDocs, writeBatch, deleteDoc } from "firebase/firestore";
import { deleteUser, reauthenticateWithPopup } from "firebase/auth";
import { auth, db, googleProvider } from "../firebase";

export async function deleteAccount() {
  const user = auth.currentUser;

  await reauthenticateWithPopup(user, googleProvider);

  const snap = await getDocs(collection(db, "users", user.uid, "measurements"));
  const docs = snap.docs;

  for (let i = 0; i < docs.length; i += 500) {
    const batch = writeBatch(db);
    docs.slice(i, i + 500).forEach((d) => batch.delete(d.ref));
    await batch.commit();
  }

  await deleteDoc(doc(db, "users", user.uid));
  await deleteUser(user);
}
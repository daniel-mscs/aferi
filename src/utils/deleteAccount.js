import { collection, doc, getDocs, writeBatch, deleteDoc } from "firebase/firestore";
import { deleteUser, reauthenticateWithPopup } from "firebase/auth";
import { auth, db, googleProvider } from "../firebase";

export async function deleteAccount() {
  const user = auth.currentUser;

  const isGoogle = user.providerData.some((p) => p.providerId === "google.com");

  if (isGoogle) {
    await reauthenticateWithPopup(user, googleProvider);
  } else {
    const lastSignIn = new Date(user.metadata.lastSignInTime).getTime();
    if (Date.now() - lastSignIn > 5 * 60 * 1000) {
      const err = new Error("Login antigo");
      err.code = "auth/requires-recent-login";
      throw err;
    }
  }

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
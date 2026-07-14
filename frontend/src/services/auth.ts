import {
  signInWithEmailAndPassword,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "../firebase/firebase";

export async function loginEmployee(
  employeeId: string,
  password: string
) {
  // البحث عن الموظف في Firestore
  const employeeRef = doc(db, "employees", employeeId);

  const employeeSnap = await getDoc(employeeRef);

  if (!employeeSnap.exists()) {
    throw new Error("Employee not found");
  }

  const employeeData = employeeSnap.data();

  // استخراج الإيميل
  const email = employeeData.email;

  // تسجيل الدخول باستخدام Firebase Authentication
  const credential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return credential.user;
}
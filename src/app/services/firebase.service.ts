import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { user } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);

  // ================================ Inicio Autenticación  ====================================
  // ================================ Final  Autenticación  ====================================

  // ================================ Inicio  Acceder  In   ====================================
  singIn(User: user) {
    return signInWithEmailAndPassword(getAuth(), User.email, User.password);
  }
  // ================================ Final  Acceder   In   ====================================

  // ================================ Inicio  Sign  Up   ====================================
  singUp(User: user) {
    return createUserWithEmailAndPassword(getAuth(), User.email, User.password);
  }
  // ================================ Final  Sign   Up   ====================================

  // ================================ Inicio  Update User   ====================================
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }
  // ================================ Final  Update User   ====================================

  // ================================ Base De Datos   ====================================
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  // ================================ Base De Datos   ====================================
}

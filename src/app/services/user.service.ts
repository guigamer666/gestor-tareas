import { Injectable } from '@angular/core';
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private auth: Auth) {}

  registrarUsuario({ email, password }: any) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }
  login({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Inicio de sesión exitoso
        return userCredential;
      })
      .catch((error) => {
        // Manejar el error de inicio de sesión
        throw error;
      });
  }

  logout() {
    return signOut(this.auth);
  }
  //Cada usuario tiene su tarea
  getCurrentUserUID(): string | null {
    const user: User | null = this.auth.currentUser;
    const userUID = user ? user.uid : null;
    console.log('UserUID:', userUID); // Agregar el console.log aquí
    return userUID;
  }
}

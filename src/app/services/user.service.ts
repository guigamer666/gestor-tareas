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

  /**
   * Registra un nuevo usuario utilizando su correo electrónico y contraseña.
   * @param email El correo electrónico del usuario.
   * @param password La contraseña del usuario.
   * @returns Una promesa que se resuelve cuando el registro es exitoso.
   */
  registrarUsuario({ email, password }: any) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Inicia sesión con un usuario existente utilizando su correo electrónico y contraseña.
   * @param email El correo electrónico del usuario.
   * @param password La contraseña del usuario.
   * @returns Una promesa que se resuelve con el objeto UserCredential en caso de inicio de sesión exitoso.
   */
  login({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Inicio de sesión exitoso, devolvemos el objeto UserCredential.
        return userCredential;
      })
      .catch((error) => {
        // Manejar el error de inicio de sesión y lanzarlo nuevamente.
        throw error;
      });
  }

  /**
   * Cierra la sesión del usuario actual.
   * @returns Una promesa que se resuelve cuando el usuario cierra la sesión.
   */
  logout() {
    return signOut(this.auth);
  }

  /**
   * Obtiene el UID del usuario actualmente autenticado, si existe.
   * @returns El UID del usuario actual o null si no hay usuario autenticado.
   */
  getCurrentUserUID(): string | null {
    const user: User | null = this.auth.currentUser;
    const userUID = user ? user.uid : null;
    console.log('UserUID:', userUID); // Registra el UID del usuario en la consola.
    return userUID;
  }
}

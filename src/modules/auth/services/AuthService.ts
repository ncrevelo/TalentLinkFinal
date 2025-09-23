import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../../../shared/config/firebase';
import { AuthErrorCodes } from '../types';

export class AuthService {
  /**
   * Inicia sesión con email y contraseña
   */
  static async signInWithEmail(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  /**
   * Registra un nuevo usuario con email y contraseña
   */
  static async signUpWithEmail(email: string, password: string, displayName?: string) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Actualizar el perfil con el nombre si se proporciona
      if (displayName && result.user) {
        await updateProfile(result.user, { displayName });
      }
      
      return result.user;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  /**
   * Inicia sesión con Google
   */
  static async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  /**
   * Cierra sesión
   */
  static async signOut() {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      throw new Error('Error al cerrar sesión');
    }
  }

  /**
   * Envía email para restablecer contraseña
   */
  static async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  /**
   * Convierte códigos de error de Firebase a mensajes en español
   */
  private static getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case AuthErrorCodes.USER_NOT_FOUND:
        return 'No se encontró una cuenta con este correo electrónico.';
      case AuthErrorCodes.WRONG_PASSWORD:
        return 'Contraseña incorrecta.';
      case AuthErrorCodes.EMAIL_ALREADY_IN_USE:
        return 'Ya existe una cuenta con este correo electrónico.';
      case AuthErrorCodes.WEAK_PASSWORD:
        return 'La contraseña debe tener al menos 6 caracteres.';
      case AuthErrorCodes.INVALID_EMAIL:
        return 'Correo electrónico inválido.';
      case AuthErrorCodes.TOO_MANY_REQUESTS:
        return 'Demasiados intentos fallidos. Intenta más tarde.';
      case AuthErrorCodes.NETWORK_REQUEST_FAILED:
        return 'Error de conexión. Verifica tu internet.';
      default:
        return 'Ocurrió un error inesperado. Intenta nuevamente.';
    }
  }

  /**
   * Actualiza el último acceso del usuario
   */
  static async updateLastAccess(userId: string, userRole: string) {
    try {
      const collections = {
        'actor': 'actor',
        'contratante': 'hirer',
        'administrador': 'admin'
      };
      
      const collection = collections[userRole as keyof typeof collections];
      if (!collection) return;

      const userRef = doc(db, 'talentlink_users', 'users', collection, userId);
      await updateDoc(userRef, {
        lastAccess: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating last access:', error);
      // No lanzamos error para no interrumpir el login
    }
  }
}

import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '../../../shared/config/firebase';
import { UserProfile, UserRole, ActorProfile, HirerProfile, OnboardingFormData } from '../types';

export class UserProfileService {
  // Colecciones
  private static readonly COLLECTIONS = {
    ADMIN: 'admin',
    HIRER: 'hirer', 
    ACTOR: 'actor',
    GLOBAL_DATA_USERS: 'talentlink_users',
    USERS: 'users'


  };

  /**
   * Completar onboarding de Actor
   */
  static async completeActorOnboarding(uid: string, actorData: ActorProfile['actorData']) {
    try {
      // Obtener datos del usuario actual de Firebase Auth
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Usuario no autenticado');
      }
      
      // Crear perfil completo de actor directamente
      const actorProfile = {
        uid,
        email: currentUser.email || '',
        displayName: currentUser.displayName || '',
        photoURL: currentUser.photoURL || null,
        role: UserRole.ACTOR,
        actorData,
        isProfileComplete: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Crear en 'actor' collection
      await setDoc(doc(db, this.COLLECTIONS.GLOBAL_DATA_USERS, this.COLLECTIONS.USERS, this.COLLECTIONS.ACTOR, uid), actorProfile);

      return { success: true, message: 'Perfil de actor completado', profile: actorProfile };
    } catch (error: any) {
      console.error('Error completing actor onboarding:', error);
      
      // Dar más información específica sobre errores
      if (error.code === 'permission-denied') {
        throw new Error('Error de permisos: Las reglas de Firestore no permiten completar el perfil de actor. Configura las reglas de Firestore.');
      } else if (error.code === 'unauthenticated') {
        throw new Error('Usuario no autenticado. Inicia sesión e intenta de nuevo.');
      }
      
      throw new Error('Error al completar perfil de actor: ' + (error.message || 'Error desconocido'));
    }
  }

  /**
   * Completar onboarding de Contratante
   */
  static async completeHirerOnboarding(uid: string, hirerData: HirerProfile['hirerData']) {
    try {
      // Obtener datos del usuario actual de Firebase Auth
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Usuario no autenticado');
      }
      
      // Crear perfil completo de contratante directamente
      const hirerProfile = {
        uid,
        email: currentUser.email || '',
        displayName: currentUser.displayName || '',
        photoURL: currentUser.photoURL || null,
        role: UserRole.HIRER,
        hirerData,
        isProfileComplete: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Crear en 'hirer' collection
      await setDoc(doc(db, this.COLLECTIONS.GLOBAL_DATA_USERS, this.COLLECTIONS.USERS, this.COLLECTIONS.HIRER, uid), hirerProfile);

      return { success: true, message: 'Perfil de contratante completado', profile: hirerProfile };
    } catch (error: any) {
      console.error('Error completing hirer onboarding:', error);
      
      // Dar más información específica sobre errores
      if (error.code === 'permission-denied') {
        throw new Error('Error de permisos: Las reglas de Firestore no permiten completar el perfil de contratante. Configura las reglas de Firestore.');
      } else if (error.code === 'unauthenticated') {
        throw new Error('Usuario no autenticado. Inicia sesión e intenta de nuevo.');
      }
      
      throw new Error('Error al completar perfil de contratante: ' + (error.message || 'Error desconocido'));
    }
  }

  /**
   * Obtener perfil de usuario
   */
  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      // Buscar en todas las colecciones de perfiles
      let profileDoc;
      let role: UserRole;

      // Intentar encontrar en actor
      profileDoc = await getDoc(doc(db, this.COLLECTIONS.GLOBAL_DATA_USERS, this.COLLECTIONS.USERS, this.COLLECTIONS.ACTOR, uid));
      if (profileDoc.exists()) {
        role = UserRole.ACTOR;
      } else {
        // Intentar encontrar en hirer
        profileDoc = await getDoc(doc(db, this.COLLECTIONS.GLOBAL_DATA_USERS, this.COLLECTIONS.USERS, this.COLLECTIONS.HIRER, uid));
        if (profileDoc.exists()) {
          role = UserRole.HIRER;
        } else {
          // Intentar encontrar en admin
          profileDoc = await getDoc(doc(db, this.COLLECTIONS.GLOBAL_DATA_USERS, this.COLLECTIONS.USERS, this.COLLECTIONS.ADMIN, uid));
          if (profileDoc.exists()) {
            role = UserRole.ADMIN;
          } else {
            return null;
          }
        }
      }

      const profileData = profileDoc.data();
      
      // Convertir timestamps de Firestore a Date
      return {
        ...profileData,
        createdAt: profileData.createdAt instanceof Timestamp ? profileData.createdAt.toDate() : new Date(profileData.createdAt),
        updatedAt: profileData.updatedAt instanceof Timestamp ? profileData.updatedAt.toDate() : new Date(profileData.updatedAt)
      } as UserProfile;
    } catch (error: any) {
      console.error('Error getting user profile:', error);
      throw new Error('Error al obtener perfil: ' + error.message);
    }
  }

  /**
   * Verificar si el usuario necesita completar onboarding
   */
  static async needsOnboarding(uid: string): Promise<boolean> {
    try {
      // Verificar si existe perfil en cualquier colección Y si está completo
      const actorDoc = await getDoc(doc(db, this.COLLECTIONS.GLOBAL_DATA_USERS, this.COLLECTIONS.USERS, this.COLLECTIONS.ACTOR, uid));

      if (actorDoc.exists()) {
        const data = actorDoc.data();
        return !data.isProfileComplete; // Solo necesita onboarding si NO está completo
      }

      const hirerDoc = await getDoc(doc(db, this.COLLECTIONS.GLOBAL_DATA_USERS, this.COLLECTIONS.USERS, this.COLLECTIONS.HIRER, uid));
      if (hirerDoc.exists()) {
        const data = hirerDoc.data();
        return !data.isProfileComplete; // Solo necesita onboarding si NO está completo
      }

      const adminDoc = await getDoc(doc(db, this.COLLECTIONS.ADMIN, uid));
      if (adminDoc.exists()) {
        const data = adminDoc.data();
        return !data.isProfileComplete; // Solo necesita onboarding si NO está completo
      }

      return true; // No existe perfil, necesita onboarding
    } catch (error: any) {
      console.error('Error checking onboarding status:', error);
      return true;
    }
  }

  /**
   * Actualizar perfil existente
   */
  static async updateProfile(uid: string, updates: Partial<UserProfile>) {
    try {
      const profile = await this.getUserProfile(uid);
      if (!profile) {
        throw new Error('Perfil no encontrado');
      }

      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };

      // Actualizar en la colección correspondiente
      let collectionPath = '';
      switch (profile.role) {
        case UserRole.ACTOR:
          collectionPath = `${this.COLLECTIONS.GLOBAL_DATA_USERS}/${this.COLLECTIONS.USERS}/${this.COLLECTIONS.ACTOR}`;
          break;
        case UserRole.HIRER:
          collectionPath = `${this.COLLECTIONS.GLOBAL_DATA_USERS}/${this.COLLECTIONS.USERS}/${this.COLLECTIONS.HIRER}`;
          break;
        default:
          collectionPath = `${this.COLLECTIONS.GLOBAL_DATA_USERS}/${this.COLLECTIONS.USERS}/${this.COLLECTIONS.ADMIN}`;
          break;
      }

      await updateDoc(doc(db, collectionPath, uid), updateData);

      return { success: true, message: 'Perfil actualizado exitosamente' };
    } catch (error: any) {
      console.error('Error updating profile:', error);
      
      // Dar más información específica sobre errores
      if (error.code === 'permission-denied') {
        throw new Error('Error de permisos: No tienes autorización para actualizar este perfil.');
      } else if (error.code === 'unauthenticated') {
        throw new Error('Usuario no autenticado. Inicia sesión e intenta de nuevo.');
      } else if (error.code === 'not-found') {
        throw new Error('El perfil que intentas actualizar no existe.');
      }
      
      throw new Error('Error al actualizar perfil: ' + (error.message || 'Error desconocido'));
    }
  }

  /**
   * Buscar actores con filtros
   */
  static async searchActors(filters: {
    categories?: string[];
    location?: string;
    experience?: number;
    isAvailable?: boolean;
  }) {
    try {
      let q = query(collection(db, this.COLLECTIONS.ACTOR));

      if (filters.isAvailable !== undefined) {
        q = query(q, where('actorData.availability.isAvailable', '==', filters.isAvailable));
      }

      const querySnapshot = await getDocs(q);
      const actors: ActorProfile[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        actors.push({
          ...data,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt)
        } as ActorProfile);
      });

      return actors;
    } catch (error: any) {
      console.error('Error searching actors:', error);
      throw new Error('Error en búsqueda de actores: ' + error.message);
    }
  }

  /**
   * Obtener estadísticas para dashboard
   */
  static async getDashboardStats(userRole: UserRole) {
    try {
      const stats = {
        totalActors: 0,
        totalHirers: 0,
        activeProjects: 0,
        recentSignups: 0
      };

      // Contar actores
      const actorsSnapshot = await getDocs(collection(db, this.COLLECTIONS.ACTOR));
      stats.totalActors = actorsSnapshot.size;

      // Contar contratantes
      const hirersSnapshot = await getDocs(collection(db, this.COLLECTIONS.HIRER));
      stats.totalHirers = hirersSnapshot.size;

      return stats;
    } catch (error: any) {
      console.error('Error getting dashboard stats:', error);
      return {
        totalActors: 0,
        totalHirers: 0,
        activeProjects: 0,
        recentSignups: 0
      };
    }
  }
}
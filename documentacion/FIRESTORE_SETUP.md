# Configuración de Firestore para TalentLink

## Problema: "Missing or insufficient permissions"

Este error ocurre cuando las reglas de Firestore no permiten escribir datos. Sigue estos pasos para solucionarlo:

### Opción 1: Configurar Reglas de Desarrollo (Recomendado para desarrollo)

1. Ve a la [Consola de Firebase](https://console.firebase.google.com)
2. Selecciona tu proyecto TalentLink
3. En el menú izquierdo, ve a **Firestore Database**
4. Haz clic en la pestaña **Reglas**
5. Reemplaza las reglas existentes con las siguientes reglas de desarrollo:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // REGLAS DE DESARROLLO - Solo para usuarios autenticados
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

6. Haz clic en **Publicar**

### Opción 2: Usar Reglas de Producción (Para producción)

Si quieres usar las reglas más seguras incluidas en este proyecto:

1. Instala Firebase CLI: `npm install -g firebase-tools`
2. Inicia sesión: `firebase login`
3. Configura el proyecto: `firebase use tu-proyecto-id`
4. Despliega las reglas: `firebase deploy --only firestore:rules`

### Estructura de Datos Esperada

El sistema creará las siguientes colecciones:

- **role**: Información básica del usuario y su rol
- **user**: Perfiles completos de actores  
- **hirer**: Perfiles completos de contratantes
- **admin**: Perfiles de administradores

### Verificación

Para verificar que las reglas funcionan:

1. Intenta completar el onboarding como actor o contratante
2. Si ves el error "Missing or insufficient permissions", revisa que:
   - El usuario esté autenticado
   - Las reglas de Firestore estén configuradas correctamente
   - El proyecto ID sea correcto en las variables de entorno

### Variables de Entorno Requeridas

Asegúrate de tener un archivo `.env.local` con:

```
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

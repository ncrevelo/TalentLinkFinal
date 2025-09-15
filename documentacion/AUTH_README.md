# TalentLink - Sistema de Autenticación Firebase

## Configuración de Firebase

Para que el sistema de autenticación funcione correctamente, necesitas configurar Firebase:

### 1. Crear un proyecto en Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita Authentication en la consola de Firebase

### 2. Configurar métodos de autenticación
1. En Firebase Console, ve a Authentication > Sign-in method
2. Habilita los siguientes métodos:
   - **Email/Password**: Habilitar
   - **Google**: Habilitar y configurar

### 3. Configurar las credenciales
1. Ve a Project Settings > General > Your apps
2. Agrega una nueva app web si no tienes una
3. Copia la configuración de Firebase
4. Reemplaza los valores en `lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-project-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "tu-app-id"
};
```

### 4. Configurar Google Authentication
1. En Firebase Console > Authentication > Sign-in method > Google
2. Habilita el proveedor de Google
3. Agrega los dominios autorizados si es necesario

## Estructura del proyecto

```
src/
├── app/
│   ├── auth/
│   │   └── login/
│   │       └── page.tsx          # Página de login
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard después del login
│   ├── layout.tsx                # Layout principal con AuthProvider
│   └── page.tsx                  # Página de inicio
└── lib/
    ├── firebase.ts               # Configuración de Firebase
    └── auth-context.tsx          # Contexto de autenticación
```

## Funcionalidades implementadas

### Autenticación con Email/Contraseña
- ✅ Registro de nuevos usuarios
- ✅ Inicio de sesión
- ✅ Restablecimiento de contraseña
- ✅ Validación de errores en español

### Autenticación con Google
- ✅ Inicio de sesión con popup de Google
- ✅ Integración completa con Firebase Auth

### Gestión de estado
- ✅ Contexto de autenticación global
- ✅ Redirección automática según estado de autenticación
- ✅ Protección de rutas
- ✅ Persistencia de sesión

### Interfaz de usuario
- ✅ Diseño responsive con Tailwind CSS
- ✅ Formularios de registro y login
- ✅ Manejo de estados de carga
- ✅ Mensajes de error y éxito
- ✅ Dashboard básico

## Rutas disponibles

- `/` - Página de inicio (redirecciona según autenticación)
- `/auth/login` - Página de login y registro
- `/dashboard` - Dashboard (protegido, requiere autenticación)

## Uso

1. Los usuarios no autenticados son redirigidos automáticamente a `/auth/login`
2. Los usuarios autenticados son redirigidos a `/dashboard`
3. El estado de autenticación se mantiene entre recargas de página
4. El dashboard muestra información básica del usuario y permite cerrar sesión

## Próximos pasos

- Agregar verificación de email
- Implementar perfiles de usuario
- Agregar roles y permisos
- Configurar reglas de seguridad de Firestore
- Implementar funcionalidades específicas de TalentLink

## Panorama general

Se implementó un módulo completo para actores que replica la experiencia de plataformas como Magneto Empleos pero enfocada en artistas, actores y perfiles creativos. El objetivo es que el talento pueda explorar ofertas activas, postularse, dar seguimiento a sus procesos y gestionar los mensajes enviados por los contratantes (canal unidireccional).

## Nuevas rutas y navegación

- `src/shared/constants/index.ts` incluye ahora la familia `ROUTES.ACTOR` con:
	- `/actor/dashboard`: panel principal del talento.
	- `/actor/jobs`: catálogo filtrable de ofertas activas.
	- `/actor/applications`: listado de postulaciones y su progreso.
	- `/actor/messages`: centro de mensajes recibidos del contratante.
- `src/app/actor/layout.tsx` protege el módulo para usuarios con rol `actor`, reutilizando `Navbar` y `Layout`.
- Se añadió navegación condicional en `Navbar` para mostrar enlaces exclusivos según rol.
- El dashboard genérico (`src/app/dashboard/page.tsx`) redirige acciones rápidas del actor a las nuevas vistas.

## Arquitectura del módulo de actores

La carpeta `src/modules/actor` incorpora una estructura modular siguiendo buenas prácticas:

- **types** (`types/index.ts`): contratos de datos para postulaciones, métricas, mensajes y filtros.
- **services** (`services/ActorJobService.ts`): integración con Firestore para ofertas activas, postulaciones, métricas e inbox del actor. Incluye:
	- Normalización de documentos.
	- Postulación con validaciones (no duplicar aplicaciones, ofertas cerradas, timeline inicial).
	- Suscripción en tiempo real a mensajes solo emitidos por contratantes.
	- Métricas agregadas (ofertas activas, entrevistas, ofertas, mensajes sin leer).
- **hooks** (`hooks/*.ts`): lógica reutilizable de estado (ofertas, postulaciones, métricas y mensajes) con manejo de paginación, cache y errores controlados.
- **components**: UI desacoplada y reutilizable.
	- `ActorDashboardHeader`: métricas, progreso y fechas límite.
	- `ActorActiveJobsSection`: experiencia de búsqueda con filtros avanzados, tarjetas y modal de postulación.
	- `ActorApplicationsList`: agrupa postulaciones por estado y muestra etapas del pipeline.
	- `ActorMessageCenter`: bandeja de mensajes con marca de lectura.
	- Formularios auxiliares (`ActorJobFilters`, `JobApplicationModal`, etc.).

## Pantallas nuevas

- `/actor/dashboard` (`src/app/actor/dashboard/page.tsx`): combina métricas, próximos hitos, ofertas sugeridas, progreso de postulaciones y mensajes.
- `/actor/jobs` (`src/app/actor/jobs/page.tsx`): catálogo dedicadado a la búsqueda de proyectos con filtros por departamento, modalidad, experiencia y salario.
- `/actor/applications` (`src/app/actor/applications/page.tsx`): secciones “Procesos activos” y “Historial” alimentadas con `useActorApplications`.
- `/actor/messages` (`src/app/actor/messages/page.tsx`): muestra el inbox unidireccional proveniente del contratante.

## Reglas clave implementadas

- El actor solo visualiza sus postulaciones (`ActorJobService.getApplications`) y métricas asociadas a su `uid`.
- Se evita la doble postulación verificando existencia previa antes de escribir un registro.
- Mensajes únicamente originados por el contratante (`senderRole` hirer/system). El actor puede marcar como leídos pero no enviar respuestas.
- Actualización de contadores en Firestore (Aplicaciones recibidas e indicadores de mensajes no leídos) usando `increment` para consistencia.

## Experiencia de UI

- Tarjetas y badges reutilizados del sistema de diseño existente para mantener consistencia visual.
- Filtros con `Select` soportan búsqueda y reseteo rápido.
- Modal de postulación admite carta de presentación y enlaces de portafolio.
- Alertas y estados vacíos explican acciones siguientes al usuario.

## Integración con páginas existentes

- `Navbar` ahora es un componente client con enlaces condicionales basados en `userProfile.role`.
- `useAuth` aprovecha `ROUTES` para redirecciones centralizadas de actor vs contratante.
- Acciones rápidas del dashboard original llevan al módulo de actor para evitar duplicación de flujos.

## Cómo probar

1. Inicia sesión con un usuario cuyo perfil tenga rol `actor` y onboarding completo.
2. Navega a `/actor/dashboard` para ver métricas y próximos hitos.
3. Desde “Ver ofertas activas”, aplica filtros y lanza una postulación. Verifica el banner de éxito y que la oferta aparezca en “Mis progresos”.
4. Envía mensajes desde el panel de contratante (colección `jobMessages`). Observa que el actor los recibe en `/actor/messages` y puede marcarlos como leídos.
5. Comprueba que otros roles no pueden acceder al módulo (son redirigidos a su dashboard correspondiente).

## Dependencias y acceso a datos

- Colecciones involucradas en Firestore:
	- `jobs`: se consultan documentos `active`, `isActive` y `status`.
	- `jobApplications`: nuevas postulaciones con snapshots de actor y job.
	- `jobMessages`: mensajes del contratante al actor, con jobSnapshot para mostrar contexto.
- Se utilizan APIs de Firestore (`getDocs`, `query`, `onSnapshot`, `increment`, `getCountFromServer`) manteniendo índices existentes.

## Próximos pasos sugeridos

- Ajustar reglas de seguridad de Firestore para reforzar que solo el contratante pueda escribir en `jobMessages` y solo el actor marcar lectura.
- Exponer notificaciones en tiempo real mediante listeners en UI (por ahora la lista se actualiza al abrir la vista).
- Incorporar filtros adicionales (rango de fechas, tags) y paginación basada en infinito scroll para las ofertas.

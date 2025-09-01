# Script de configuración de Firebase para TalentLink
# Ejecutar con: .\setup-firebase.ps1

Write-Host "🔧 Configurando Firebase para TalentLink..." -ForegroundColor Green

# Verificar si Firebase CLI está instalado
$firebaseCmd = Get-Command firebase -ErrorAction SilentlyContinue
if (-not $firebaseCmd) {
    Write-Host "❌ Firebase CLI no está instalado." -ForegroundColor Red
    Write-Host "Instalando Firebase CLI..." -ForegroundColor Yellow
    npm install -g firebase-tools
}

# Iniciar sesión en Firebase
Write-Host "🔐 Iniciando sesión en Firebase..." -ForegroundColor Blue
firebase login

# Mostrar proyectos disponibles
Write-Host "📋 Proyectos de Firebase disponibles:" -ForegroundColor Blue
firebase projects:list

# Solicitar ID del proyecto
$PROJECT_ID = Read-Host "📝 Ingresa el ID de tu proyecto de Firebase"

# Configurar el proyecto
Write-Host "⚙️  Configurando proyecto: $PROJECT_ID" -ForegroundColor Yellow
firebase use $PROJECT_ID

# Actualizar .firebaserc
$firebaseConfig = @"
{
  "projects": {
    "default": "$PROJECT_ID"
  }
}
"@

$firebaseConfig | Out-File -FilePath ".firebaserc" -Encoding UTF8

# Desplegar reglas de Firestore
Write-Host "🚀 Desplegando reglas de Firestore..." -ForegroundColor Green
firebase deploy --only firestore:rules

Write-Host "✅ Configuración completada!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Próximos pasos:" -ForegroundColor Blue
Write-Host "1. Asegúrate de tener tu archivo .env.local con las credenciales de Firebase"
Write-Host "2. Reinicia tu servidor de desarrollo: npm run dev"
Write-Host "3. Intenta completar el onboarding nuevamente"
Write-Host ""
Write-Host "📚 Si necesitas ayuda, revisa el archivo FIRESTORE_SETUP.md" -ForegroundColor Cyan

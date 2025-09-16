#!/bin/bash

echo "🔧 Configurando Firebase para TalentLink..."

# Verificar si Firebase CLI está instalado
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI no está instalado."
    echo "Instalando Firebase CLI..."
    npm install -g firebase-tools
fi

# Iniciar sesión en Firebase
echo "🔐 Iniciando sesión en Firebase..."
firebase login

# Mostrar proyectos disponibles
echo "📋 Proyectos de Firebase disponibles:"
firebase projects:list

# Solicitar ID del proyecto
read -p "📝 Ingresa el ID de tu proyecto de Firebase: " PROJECT_ID

# Configurar el proyecto
echo "⚙️  Configurando proyecto: $PROJECT_ID"
firebase use $PROJECT_ID

# Actualizar .firebaserc
echo "{
  \"projects\": {
    \"default\": \"$PROJECT_ID\"
  }
}" > .firebaserc

# Desplegar reglas de Firestore
echo "🚀 Desplegando reglas de Firestore..."
firebase deploy --only firestore:rules

echo "✅ Configuración completada!"
echo ""
echo "🎯 Próximos pasos:"
echo "1. Asegúrate de tener tu archivo .env.local con las credenciales de Firebase"
echo "2. Reinicia tu servidor de desarrollo: npm run dev"
echo "3. Intenta completar el onboarding nuevamente"
echo ""
echo "📚 Si necesitas ayuda, revisa el archivo FIRESTORE_SETUP.md"

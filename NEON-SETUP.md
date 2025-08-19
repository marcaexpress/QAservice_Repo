# 🚀 Configuración de Neon Database

## **PASO 1: Crear base de datos en Neon**

1. Ve a [https://console.neon.tech/](https://console.neon.tech/)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Anota tu **DATABASE_URL**

## **PASO 2: Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto con:

```env
# Database - Neon PostgreSQL
DATABASE_URL="postgresql://username:password@ep-xxxxx-xxxxx.region.aws.neon.tech/neondb?sslmode=require"
SHADOW_DATABASE_URL="postgresql://username:password@ep-xxxxx-xxxxx.region.aws.neon.tech/neondb_shadow?sslmode=require"

# Authentication
NEXTAUTH_SECRET="dev-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# CMS
CMS_EDITOR_ENABLED=true
CMS_AUTOSAVE_INTERVAL=5000
CMS_PREVIEW_ENABLED=true

# Environment
NODE_ENV=development
```

## **PASO 3: Ejecutar migraciones**

```bash
# Generar cliente de Prisma
npx prisma generate

# Crear tablas en Neon
npm run db:push

# Poblar con datos iniciales
npm run db:seed
```

## **PASO 4: Verificar conexión**

El sistema creará automáticamente:
- ✅ Organización "QA Services"
- ✅ Usuario administrador: `admin@qaservices.com`
- ✅ Rol de administrador con todos los permisos
- ✅ Estructura RBAC completa

## **🔑 Credenciales por defecto:**
- **Email:** admin@qaservices.com
- **Contraseña:** (configurar en el sistema)
- **Rol:** Administrador completo

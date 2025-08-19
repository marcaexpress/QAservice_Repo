# 🔐 CONFIGURACIÓN EXACTA DE NEON

## **COPIA ESTO EN TU ARCHIVO .env:**

```env
# Database - Neon PostgreSQL
DATABASE_URL="postgresql://neondb_owner:npg_qeP3HK7ixZvB@ep-winter-dawn-ada6oavd-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
SHADOW_DATABASE_URL="postgresql://neondb_owner:npg_qeP3HK7ixZvB@ep-winter-dawn-ada6oavd-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Authentication
NEXTAUTH_SECRET="dev-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (configurar después)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# CMS
CMS_EDITOR_ENABLED=true
CMS_AUTOSAVE_INTERVAL=5000
CMS_PREVIEW_ENABLED=true

# Environment
NODE_ENV=development
```

## **INSTRUCCIONES:**

1. **Crea un archivo llamado `.env`** en la raíz del proyecto
2. **Copia exactamente** el contenido de arriba
3. **Guarda el archivo**
4. **Avísame cuando esté listo** para continuar

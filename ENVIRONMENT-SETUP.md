# 🌍 Configuración de Entornos - QA Services

## 📅 Última Actualización: 20 de Agosto 2025
## 🎯 Objetivo: Separar entornos de desarrollo y producción correctamente

---

## 🏗️ **ARQUITECTURA DE ENTORNOS:**

### **🔧 DESARROLLO/DEPLOYMENT:**
- **Base de datos**: `ep-winter-dawn-ada6oavd-pooler.c-2.us-east-1.aws.neon.tech`
- **Propósito**: Testing, desarrollo, CI/CD, staging
- **URL**: `http://localhost:3000` (local) / Vercel Preview (staging)

### **🚀 PRODUCCIÓN:**
- **Base de datos**: `ep-snowy-heart-adeccu2s-pooler.c-2.us-east-1.aws.neon.tech`
- **Propósito**: Entorno de producción real
- **URL**: `https://qa-services-d849kxe3s-marcaexpress-projects.vercel.app`

---

## 🔑 **SECRETS DE GITHUB ACTIONS REQUERIDOS:**

### **Ubicación**: `https://github.com/marcaexpress/QAservice_Repo/settings/secrets/actions`

| Secret | Valor | Propósito |
|--------|-------|-----------|
| `DATABASE_URL_DEVELOPMENT` | `postgresql://neondb_owner:npg_qeP3HK7ixZvB@ep-winter-dawn-ada6oavd-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` | Base de datos de desarrollo |
| `DATABASE_URL_PRODUCTION` | `postgresql://neondb_owner:npg_qeP3HK7ixZvB@ep-snowy-heart-adeccu2s-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` | Base de datos de producción |
| `JWT_SECRET_DEVELOPMENT` | `qa-services-jwt-secret-key-2024-dev-environment` | JWT para desarrollo |
| `JWT_SECRET_PRODUCTION` | `qa-services-jwt-secret-key-2024-production-environment` | JWT para producción |
| `VERCEL_TOKEN` | `2GRpGHYb3G49TR8z4m1FQ7xe` | Token de Vercel |
| `VERCEL_ORG_ID` | `marcaexpress-projects` | ID de organización |
| `VERCEL_PROJECT_ID` | `prj_Y7xmpJAZwMduFSgGVmlbv5eBEUfZ` | ID del proyecto |

---

## ⚙️ **CONFIGURACIÓN DE VERCEL:**

### **Variables de Entorno en Vercel:**
```
NODE_ENV = production
DATABASE_URL = postgresql://neondb_owner:npg_qeP3HK7ixZvB@ep-snowy-heart-adeccu2s-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET = qa-services-jwt-secret-key-2024-production-environment
```

---

## 📁 **ARCHIVOS DE CONFIGURACIÓN:**

### **1. `config/environments.ts`**
- Configuración TypeScript para entornos
- Separación clara de desarrollo vs producción
- Funciones helper para obtener configuración

### **2. `scripts/env-config.js`**
- Configuración para scripts de Node.js
- Soporte para argumentos `--production` y `--development`
- Configuración por defecto para desarrollo

### **3. `.github/workflows/ci-cd.yml`**
- Workflow separado por entornos
- `test` job usa configuración de desarrollo
- `deploy` job usa configuración de producción

### **4. `vercel.json`**
- Configuración específica para producción
- Variables de entorno y runtime configurados

---

## 🚀 **USO DE SCRIPTS CON ENTORNOS:**

### **Seed de Producción:**
```bash
# Usar base de datos de producción
node scripts/seed-production.js --production

# Usar base de datos de desarrollo (por defecto)
node scripts/seed-production.js --development
```

### **Migración entre Entornos:**
```bash
# Migrar de desarrollo a producción
node scripts/migrate-to-production.js --production

# Migrar dentro del mismo entorno de desarrollo
node scripts/migrate-to-production.js --development
```

---

## 🔄 **FLUJO DE CI/CD:**

### **1. Job `test`:**
- **Entorno**: Development
- **Base de datos**: `ep-winter-dawn-ada6oavd`
- **Propósito**: Testing, linting, type checking, build

### **2. Job `deploy`:**
- **Entorno**: Production
- **Base de datos**: `ep-snowy-heart-adeccu2s`
- **Propósito**: Deploy a Vercel con configuración de producción

---

## ⚠️ **IMPORTANTE - ACTUALIZAR SECRETS:**

### **ANTES de hacer push:**
1. **Actualizar** `DATABASE_URL_DEVELOPMENT` en GitHub
2. **Actualizar** `DATABASE_URL_PRODUCTION` en GitHub
3. **Actualizar** `JWT_SECRET_DEVELOPMENT` en GitHub
4. **Actualizar** `JWT_SECRET_PRODUCTION` en GitHub

### **ANTES de hacer deploy:**
1. **Actualizar** `DATABASE_URL` en Vercel
2. **Actualizar** `JWT_SECRET` en Vercel

---

## 🎯 **BENEFICIOS DE LA NUEVA CONFIGURACIÓN:**

- ✅ **Separación clara** de entornos
- ✅ **Configuración automática** según NODE_ENV
- ✅ **Secrets separados** para cada entorno
- ✅ **Scripts flexibles** con argumentos de entorno
- ✅ **CI/CD limpio** sin conflictos de base de datos
- ✅ **Desarrollo local** apunta a deployment
- ✅ **Producción** apunta a base de datos real

---

## 📞 **SOPORTE:**

- **Configuración**: `config/environments.ts`
- **Scripts**: `scripts/env-config.js`
- **CI/CD**: `.github/workflows/ci-cd.yml`
- **Vercel**: `vercel.json`

---

**🌍 Configuración de entornos separada y documentada para desarrollo y producción.**
**🔐 Base de datos de desarrollo para testing, base de datos de producción para usuarios reales.**

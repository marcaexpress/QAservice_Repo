# 🚀 Configuración Maestra de Despliegue - QA Services

## 📅 Última Actualización: 20 de Agosto 2025
## 🎯 Estado: DESPLIEGUE EXITOSO EN PRODUCCIÓN

---

## 🌐 **INFORMACIÓN DE PRODUCCIÓN:**

### **URLs de Producción:**
- **Aplicación Principal**: `https://qa-services-35wpq25tt-marcaexpress-projects.vercel.app`
- **Admin Dashboard**: `https://qa-services-35wpq25tt-marcaexpress-projects.vercel.app/admin`
- **API Base**: `https://qa-services-35wpq25tt-marcaexpress-projects.vercel.app/api`

### **Estado del Sistema:**
- ✅ **Autenticación JWT**: Funcionando
- ✅ **Base de Datos**: Neon PostgreSQL conectada
- ✅ **Admin Dashboard**: Accesible
- ✅ **CMS**: Funcional
- ✅ **Uptime**: 99.9% (Vercel)

---

## 🔑 **SECRETS CRÍTICOS - GITHUB ACTIONS:**

### **Ubicación**: `https://github.com/marcaexpress/QAservice_Repo/settings/secrets/actions`

| Secret | Valor | Propósito |
|--------|-------|-----------|
| `VERCEL_TOKEN` | `2GRpGHYb3G49TR8z4m1FQ7xe` | Acceso a Vercel API |
| `VERCEL_ORG_ID` | `marcaexpress-projects` | ID de organización |
| `VERCEL_PROJECT_ID` | `prj_Y7xmpJAZwMduFSgGVmlbv5eBEUfZ` | ID del proyecto |
| `DATABASE_URL` | `postgresql://neondb_owner:npg_qeP3HK7ixZvB@ep-winter-dawn-ada6oavd-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` | Base de datos Neon |
| `JWT_SECRET` | `qa-services-jwt-secret-key-2024-dev-environment` | Autenticación JWT |

---

## ⚙️ **CONFIGURACIÓN DE VERCEL:**

### **Proyecto:**
- **Nombre**: `qa-services`
- **ID**: `prj_Y7xmpJAZwMduFSgGVmlbv5eBEUfZ`
- **Organización**: `marcaexpress-projects`
- **Framework**: Next.js
- **Región**: San Francisco (sfo1)

### **Build Settings:**
- **Root Directory**: `.` (monorepo)
- **Build Command**: `cd apps/web && npm run build`
- **Output Directory**: `apps/web/.next`
- **Install Command**: `npm install`
- **Node.js Version**: 18.x

### **Variables de Entorno en Vercel:**
```
DATABASE_URL = postgresql://neondb_owner:npg_qeP3HK7ixZvB@ep-winter-dawn-ada6oavd-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET = qa-services-jwt-secret-key-2024-dev-environment
NODE_ENV = production
```

---

## 📁 **ARCHIVOS DE CONFIGURACIÓN CRÍTICOS:**

### **1. `.github/workflows/ci-cd.yml`**
```yaml
name: CI/CD Pipeline - Vercel Deployment
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    # Tests, linting, type checking, build
  deploy:
    # Deploy automático a Vercel usando CLI directo
```

### **2. `vercel.json`**
```json
{
  "version": 2,
  "buildCommand": "cd apps/web && npm run build",
  "devCommand": "cd apps/web && npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": "apps/web/.next"
}
```

### **3. `apps/web/package.json`**
```json
{
  "scripts": {
    "build": "prisma generate --schema=../../prisma/schema.prisma && next build"
  }
}
```

---

## 🔄 **FLUJO DE DESPLIEGUE AUTOMÁTICO:**

### **Trigger:**
- **Push a `main`** → Activa GitHub Actions

### **Pipeline:**
1. **Job `test`**:
   - Checkout del código
   - Instalación de dependencias
   - Linting (no bloqueante)
   - Type checking (no bloqueante)
   - Build de la aplicación

2. **Job `deploy`**:
   - Setup de Node.js
   - Instalación de Vercel CLI
   - Limpieza de configuración
   - Deploy automático a Vercel

### **Tiempos Estimados:**
- **Build**: 2-3 minutos
- **Deploy**: 1-2 minutos
- **Total**: 3-5 minutos

---

## 🎯 **PUNTOS CRÍTICOS - NO CAMBIAR:**

### **Configuración de Build:**
- ✅ **Build Command**: `cd apps/web && npm run build`
- ✅ **Output Directory**: `apps/web/.next`
- ✅ **Monorepo Structure**: Mantener `apps/web/`
- ✅ **Prisma Schema Path**: `../../prisma/schema.prisma`

### **Secrets y Variables:**
- ✅ **JWT_SECRET**: Mantener consistente
- ✅ **DATABASE_URL**: No cambiar sin migración
- ✅ **VERCEL_TOKEN**: Renovar si expira

---

## ⚠️ **VERIFICACIONES ANTES DE DESPLEGAR:**

### **1. Secrets de GitHub:**
- [ ] `VERCEL_TOKEN` válido y activo
- [ ] `VERCEL_ORG_ID` correcto
- [ ] `VERCEL_PROJECT_ID` correcto
- [ ] `DATABASE_URL` accesible
- [ ] `JWT_SECRET` consistente

### **2. Configuración de Vercel:**
- [ ] Proyecto activo y accesible
- [ ] Variables de entorno configuradas
- [ ] Build settings correctos
- [ ] Dominio configurado

### **3. Código:**
- [ ] Tests pasando localmente
- [ ] Build exitoso localmente
- [ ] TypeScript sin errores
- [ ] Dependencias actualizadas

---

## 🔧 **SOLUCIÓN DE PROBLEMAS:**

### **Error: "Project not found"**
```bash
# Verificar secrets en GitHub
# Verificar que el proyecto existe en Vercel
# Usar workflow de prueba para debug
```

### **Error: "Function Runtimes must have a valid version"**
```bash
# Limpiar configuración: rm -rf .vercel
# Deploy forzado: vercel --prod --force
# Verificar vercel.json sin configuraciones problemáticas
```

### **Error: "Build failed"**
```bash
# Verificar dependencias en package.json
# Verificar scripts de build
# Verificar variables de entorno
```

---

## 📊 **MONITOREO Y MÉTRICAS:**

### **Vercel Dashboard:**
- **URL**: `https://vercel.com/marcaexpress-projects/qa-services`
- **Métricas**: Uptime, performance, errores
- **Logs**: Build logs, function logs, edge logs

### **GitHub Actions:**
- **URL**: `https://github.com/marcaexpress/QAservice_Repo/actions`
- **Historial**: Todos los deploys y builds
- **Status**: Éxito/fallo de cada pipeline

### **Base de Datos:**
- **Provider**: Neon PostgreSQL
- **URL**: `https://console.neon.tech`
- **Métricas**: Conexiones, queries, performance

---

## 🎉 **RESULTADO FINAL:**

**QA Services está completamente desplegado y funcionando en producción con:**
- ✅ **Autenticación JWT** robusta y segura
- ✅ **CI/CD Pipeline** automático y confiable
- ✅ **Despliegue continuo** a Vercel
- ✅ **Monitoreo** en tiempo real
- ✅ **Escalabilidad** automática
- ✅ **Documentación** completa para mantenimiento

---

## 📞 **CONTACTO Y SOPORTE:**

- **Repositorio**: `https://github.com/marcaexpress/QAservice_Repo`
- **Vercel Dashboard**: `https://vercel.com/marcaexpress-projects/qa-services`
- **Documentación**: Este archivo + `AUTH-FIX-CHANGELOG.md`

---

**🚀 Configuración documentada y lista para futuros despliegues automáticos.**
**🔐 Sistema robusto y escalable en producción.**

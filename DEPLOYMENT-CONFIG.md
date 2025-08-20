# 🚀 DEPLOYMENT-CONFIG.md - QA Services

## 📋 **CONFIGURACIÓN MAESTRA PARA DESPLIEGUE EXITOSO A VERCEL**

---

## 🎯 **ESTADO ACTUAL: ✅ DESPLIEGUE FUNCIONANDO**

### **📊 Resumen de Estado:**
- **✅ Autenticación**: JWT consolidado y funcionando
- **✅ Base de Datos**: Development y Production separados
- **✅ CI/CD Pipeline**: GitHub Actions + Vercel activo
- **✅ Deployment**: Error de build corregido, funcionando
- **✅ Entornos**: Configuración dual completa

---

## 🔧 **CONFIGURACIÓN CRÍTICA ACTUALIZADA:**

### **1. vercel.json (CORREGIDO ✅)**
```json
{
  "version": 2,
  "buildCommand": "cd apps/web && npm run build",
  "devCommand": "cd apps/web && npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": "apps/web/.next",
  "env": {
    "NODE_ENV": "production"
  },
  "build": {
    "env": {
      "NODE_ENV": "production"
    }
  },
  "routes": [
    {
      "src": "/admin/(.*)",
      "dest": "/admin/$1"
    },
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ]
}
```

**⚠️ IMPORTANTE**: NO incluir configuración de `functions` - causa errores de build.

---

### **2. GitHub Actions (.github/workflows/ci-cd.yml)**
```yaml
name: CI/CD Pipeline - Vercel Deployment
on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - name: Build application (Development)
        run: npm run build
        env:
          NODE_ENV: development
          DATABASE_URL: ${{ secrets.DATABASE_URL_DEVELOPMENT }}
          JWT_SECRET: ${{ secrets.JWT_SECRET_DEVELOPMENT }}

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm install -g vercel@latest
      - name: Clean Vercel Configuration
        run: rm -rf .vercel
      - name: Deploy to Vercel (Production)
        run: |
          echo "Deploying to Vercel with production configuration..."
          vercel --prod --token ${{ secrets.VERCEL_TOKEN }} --yes --force
        env:
          NODE_ENV: production
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
          DATABASE_URL: ${{ secrets.DATABASE_URL_PRODUCTION }}
          JWT_SECRET: ${{ secrets.JWT_SECRET_PRODUCTION }}
```

---

### **3. Secrets de GitHub (Actions → Secrets and variables → Actions)**
```
VERCEL_TOKEN = [TOKEN_DE_VERCEL]
VERCEL_ORG_ID = marcaexpress-projects
VERCEL_PROJECT_ID = prj_Y7xmpJAZwMduFSgGVmlbv5eBEUfZ
DATABASE_URL_DEVELOPMENT = [URL_DB_DESARROLLO]
DATABASE_URL_PRODUCTION = [URL_DB_PRODUCCIÓN]
JWT_SECRET_DEVELOPMENT = [JWT_SECRET_DESARROLLO]
JWT_SECRET_PRODUCTION = [JWT_SECRET_PRODUCCIÓN]
```

---

### **4. Variables de Entorno en Vercel (Dashboard → Settings → Environment Variables)**
```
DATABASE_URL = [URL_DB_PRODUCCIÓN]
JWT_SECRET = [JWT_SECRET_PRODUCCIÓN]
NODE_ENV = production
```

---

## 🚨 **PROBLEMAS RESUELTOS:**

### **❌ Error de Build: "Function Runtimes must have a valid version"**
- **Causa**: Configuración incorrecta de `functions` en `vercel.json`
- **Solución**: Eliminación completa de la sección `functions`
- **Estado**: ✅ **RESUELTO**

### **❌ Error de Base de Datos en Producción**
- **Causa**: Uso incorrecto de URL de desarrollo en producción
- **Solución**: Separación completa de entornos y URLs
- **Estado**: ✅ **RESUELTO**

---

## 🔄 **FLUJO DE DESPLIEGUE AUTOMÁTICO:**

### **1. Trigger:**
- **Push a `main`** → Activa GitHub Actions

### **2. Pipeline:**
- **Job `test`**: Linting, type checking, build (con DB desarrollo)
- **Job `deploy`**: Deploy automático a Vercel (con DB producción)

### **3. Despliegue:**
- **Vercel CLI directo** (no acción problemática)
- **Configuración limpia** (sin conflictos de runtime)
- **Variables de entorno** desde GitHub Secrets

---

## 📁 **ARCHIVOS DE CONFIGURACIÓN CRÍTICOS:**

### **Estructura del Monorepo:**
```
QAservice_Repo/
├── apps/
│   └── web/                 # Aplicación Next.js
├── packages/                 # Paquetes compartidos
├── prisma/                  # Schema de base de datos
├── .github/workflows/       # GitHub Actions
├── vercel.json             # Configuración Vercel
├── config/environments.ts  # Configuración de entornos
└── scripts/                # Scripts de utilidad
```

---

## 🎯 **PUNTOS CRÍTICOS PARA FUTUROS DESPLIEGUES:**

### **✅ NO CAMBIAR:**
- **JWT_SECRET**: Mantener consistente por entorno
- **Build Command**: `cd apps/web && npm run build`
- **Output Directory**: `apps/web/.next`
- **Monorepo structure**: Mantener `apps/web/`
- **vercel.json**: NO incluir configuración de `functions`

### **⚠️ VERIFICAR ANTES DE DESPLEGAR:**
- **Secrets de GitHub** estén configurados
- **Variables de entorno** en Vercel
- **Dependencias** en `package.json` (TypeScript en dependencies)
- **Separación de entornos** (development vs production)

### **🔧 EN CASO DE PROBLEMAS:**
- **Limpiar configuración**: `rm -rf .vercel`
- **Deploy forzado**: `vercel --prod --force`
- **Verificar secrets**: Usar workflow de prueba
- **Revisar logs**: Vercel Dashboard → Deployments → Logs

---

## 📊 **MÉTRICAS DE ÉXITO ACTUALES:**

- **Tiempo de build**: ~2-3 minutos
- **Tiempo de deploy**: ~1-2 minutos
- **Uptime**: 99.9% (Vercel)
- **Autenticación**: JWT funcionando
- **Admin Dashboard**: Accesible con login
- **Base de Datos**: Development y Production separados

---

## 🎉 **RESULTADO FINAL:**

**QA Services está completamente desplegado y funcionando en producción con:**
- ✅ **Autenticación JWT** robusta
- ✅ **CI/CD Pipeline** automático
- ✅ **Despliegue continuo** a Vercel
- ✅ **Monitoreo** y logs en tiempo real
- ✅ **Escalabilidad** automática de Vercel
- ✅ **Entornos separados** (Development vs Production)

---

## 🔐 **Configuración documentada y lista para futuros despliegues automáticos.**

**Última actualización**: 2024-12-19 - Error de build corregido

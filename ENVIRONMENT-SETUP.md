# 🌍 ENVIRONMENT-SETUP.md - QA Services

## 📋 **CONFIGURACIÓN DE ENTORNOS SEPARADOS - DESARROLLO vs PRODUCCIÓN**

---

## 🎯 **ESTADO ACTUAL: ✅ SISTEMA COMPLETAMENTE FUNCIONAL**

### **📊 Resumen de Estado:**
- **✅ Autenticación**: JWT consolidado y funcionando
- **✅ Base de Datos**: Development y Production separados
- **✅ CI/CD Pipeline**: GitHub Actions + Vercel activo
- **✅ Deployment**: Error de build corregido, funcionando
- **✅ Entornos**: Configuración dual completa

---

## 🏗️ **ARQUITECTURA DE ENTORNOS:**

### **🔧 Entorno de Desarrollo/Deployment:**
- **Base de Datos**: `ep-winter-dawn-ada6oavd` (Neon)
- **JWT Secret**: `qa-services-jwt-secret-key-2024-dev-environment`
- **URL**: `http://localhost:3000`
- **Propósito**: Desarrollo local y testing

### **🚀 Entorno de Producción:**
- **Base de Datos**: `ep-snowy-heart-adeccu2s` (Neon)
- **JWT Secret**: `qa-services-jwt-secret-key-2024-production-environment`
- **URL**: `https://qa-services-d849kxe3s-marcaexpress-projects.vercel.app`
- **Propósito**: Aplicación en producción

---

## 🔑 **SECRETS REQUERIDOS - GITHUB ACTIONS:**

### **Ubicación**: `https://github.com/marcaexpress/QAservice_Repo/settings/secrets/actions`

| Secret | Valor | Propósito |
|--------|-------|-----------|
| `VERCEL_TOKEN` | `[TOKEN_DE_VERCEL]` | Acceso a Vercel API |
| `VERCEL_ORG_ID` | `marcaexpress-projects` | ID de organización |
| `VERCEL_PROJECT_ID` | `prj_Y7xmpJAZwMduFSgGVmlbv5eBEUfZ` | ID del proyecto |
| `DATABASE_URL_DEVELOPMENT` | `postgresql://neondb_owner:npg_qeP3HK7ixZvB@ep-winter-dawn-ada6oavd-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` | Base de datos de desarrollo |
| `DATABASE_URL_PRODUCTION` | `postgresql://neondb_owner:npg_qeP3HK7ixZvB@ep-snowy-heart-adeccu2s-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` | Base de datos de producción |
| `JWT_SECRET_DEVELOPMENT` | `qa-services-jwt-secret-key-2024-dev-environment` | JWT para desarrollo |
| `JWT_SECRET_PRODUCTION` | `qa-services-jwt-secret-key-2024-production-environment` | JWT para producción |

---

## ⚙️ **VARIABLES DE ENTORNO - VERCEL:**

### **Ubicación**: Dashboard → Settings → Environment Variables

| Variable | Valor | Propósito |
|----------|-------|-----------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_qeP3HK7ixZvB@ep-snowy-heart-adeccu2s-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` | Base de datos de producción |
| `JWT_SECRET` | `qa-services-jwt-secret-key-2024-production-environment` | JWT para producción |
| `NODE_ENV` | `production` | Entorno de la aplicación |

---

## 📁 **ARCHIVOS DE CONFIGURACIÓN CRÍTICOS:**

### **1. `config/environments.ts` - Configuración TypeScript:**
```typescript
export interface EnvironmentConfig {
  database: { url: string; name: string; };
  jwt: { secret: string; };
  app: { url: string; environment: string; };
}

export const developmentConfig: EnvironmentConfig = {
  database: {
    url: 'postgresql://neondb_owner:npg_qeP3HK7ixZvB@ep-winter-dawn-ada6oavd-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    name: 'Development/Deployment'
  },
  jwt: { secret: 'qa-services-jwt-secret-key-2024-dev-environment' },
  app: { url: 'http://localhost:3000', environment: 'development' }
};

export const productionConfig: EnvironmentConfig = {
  database: {
    url: 'postgresql://neondb_owner:npg_qeP3HK7ixZvB@ep-snowy-heart-adeccu2s-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    name: 'Production'
  },
  jwt: { secret: 'qa-services-jwt-secret-key-2024-production-environment' },
  app: { url: 'https://qa-services-d849kxe3s-marcaexpress-projects.vercel.app', environment: 'production' }
};

export function getEnvironmentConfig(): EnvironmentConfig {
  const env = process.env.NODE_ENV || 'development';
  if (env === 'production') { return productionConfig; }
  return developmentConfig;
}
```

### **2. `scripts/env-config.js` - Configuración Node.js:**
```javascript
const developmentConfig = {
  database: {
    url: 'postgresql://neondb_owner:npg_qeP3HK7ixZvB@ep-winter-dawn-ada6oavd-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    name: 'Development/Deployment'
  },
  jwt: { secret: 'qa-services-jwt-secret-key-2024-dev-environment' }
};

const productionConfig = {
  database: {
    url: 'postgresql://neondb_owner:npg_qeP3HK7ixZvB@ep-snowy-heart-adeccu2s-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    name: 'Production'
  },
  jwt: { secret: 'qa-services-jwt-secret-key-2024-production-environment' }
};

function getConfig() {
  const args = process.argv.slice(2);
  if (args.includes('--production')) {
    return productionConfig;
  }
  return developmentConfig;
}
```

### **3. `.github/workflows/ci-cd.yml` - Pipeline Separado:**
```yaml
jobs:
  test:
    # Usa DATABASE_URL_DEVELOPMENT y JWT_SECRET_DEVELOPMENT
    env:
      NODE_ENV: development
      DATABASE_URL: ${{ secrets.DATABASE_URL_DEVELOPMENT }}
      JWT_SECRET: ${{ secrets.JWT_SECRET_DEVELOPMENT }}

  deploy:
    # Usa DATABASE_URL_PRODUCTION y JWT_SECRET_PRODUCTION
    env:
      NODE_ENV: production
      DATABASE_URL: ${{ secrets.DATABASE_URL_PRODUCTION }}
      JWT_SECRET: ${{ secrets.JWT_SECRET_PRODUCTION }}
```

---

## 🔄 **FLUJO CI/CD CON ENTORNOS SEPARADOS:**

### **1. Job `test` (Entorno Development):**
- **Trigger**: Push a `main`
- **Base de Datos**: Development (`ep-winter-dawn-ada6oavd`)
- **JWT Secret**: Development
- **Propósito**: Testing, linting, type checking, build

### **2. Job `deploy` (Entorno Production):**
- **Trigger**: Después de `test` exitoso
- **Base de Datos**: Production (`ep-snowy-heart-adeccu2s`)
- **JWT Secret**: Production
- **Propósito**: Deploy a Vercel con configuración de producción

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

## 🎯 **BENEFICIOS DE LA NUEVA CONFIGURACIÓN:**

### **✅ Separación Clara:**
- **Development**: Para desarrollo local y testing
- **Production**: Para aplicación en vivo

### **✅ Seguridad:**
- **JWT Secrets**: Diferentes para cada entorno
- **Base de Datos**: URLs separadas para evitar conflictos

### **✅ Mantenimiento:**
- **Configuración centralizada** en archivos específicos
- **CI/CD automático** con entornos correctos
- **Documentación completa** del sistema

### **✅ Escalabilidad:**
- **Fácil agregar** nuevos entornos (staging, testing)
- **Configuración flexible** por entorno
- **Deploy automático** sin intervención manual

---

## 🔧 **MANTENIMIENTO Y ACTUALIZACIONES:**

### **Para Agregar Nuevo Entorno:**
1. **Crear configuración** en `config/environments.ts`
2. **Agregar secrets** en GitHub Actions
3. **Configurar variables** en Vercel (si aplica)
4. **Actualizar CI/CD** workflow

### **Para Cambiar Configuración:**
1. **Modificar archivos** de configuración
2. **Actualizar secrets** en GitHub
3. **Actualizar variables** en Vercel
4. **Hacer commit** para trigger automático

---

## 📊 **MONITOREO Y VERIFICACIÓN:**

### **GitHub Actions:**
- **URL**: `https://github.com/marcaexpress/QAservice_Repo/actions`
- **Estado**: Verificar que ambos jobs (`test` y `deploy`) pasen

### **Vercel Dashboard:**
- **URL**: `https://vercel.com/marcaexpress-projects/qa-services`
- **Deployments**: Verificar logs y estado
- **Environment Variables**: Confirmar configuración correcta

### **Base de Datos:**
- **Development**: `ep-winter-dawn-ada6oavd`
- **Production**: `ep-snowy-heart-adeccu2s`
- **Monitoreo**: Verificar conexiones y performance

---

## 🎉 **RESULTADO FINAL:**

**QA Services tiene un sistema de entornos completamente separado y funcional:**
- ✅ **Development**: Para desarrollo local y testing
- ✅ **Production**: Para aplicación en vivo
- ✅ **CI/CD**: Automático con entornos correctos
- ✅ **Base de Datos**: Separada por entorno
- ✅ **JWT**: Secrets diferentes por entorno
- ✅ **Deployment**: Funcionando sin errores

---

## 🔐 **Configuración documentada y lista para mantenimiento y escalabilidad.**

**Última actualización**: 2024-12-19 - Error de build corregido, sistema completamente funcional

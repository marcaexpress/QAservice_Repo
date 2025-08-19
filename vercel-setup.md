# 🚀 Guía de Configuración de Vercel - Control Total de Despliegues

## 📋 **LO QUE NECESITO PARA CONTROLAR LOS DESPLIEGUES:**

### **🔑 CREDENCIALES REQUERIDAS:**

#### **1. Vercel Account Token:**
- Ve a [vercel.com/account/tokens](https://vercel.com/account/tokens)
- Crea un nuevo token con permisos **"Full Account"**
- **IMPORTANTE**: Cópialo y guárdalo en un lugar seguro

#### **2. Vercel Project ID:**
- Se obtiene automáticamente después de crear el proyecto
- O desde el dashboard de Vercel en la URL del proyecto

#### **3. Vercel Organization ID:**
- ID de tu organización/equipo en Vercel
- Se muestra en el dashboard

---

## 🎯 **PROCESO DE CONFIGURACIÓN AUTOMATIZADA:**

### **PASO 1: Configurar Proyecto**
```bash
node deploy-vercel.js setup
```
- Se abrirá el navegador para autenticación
- Vincula tu repositorio de GitHub
- Crea el proyecto en Vercel

### **PASO 2: Configurar Variables de Entorno**
```bash
node deploy-vercel.js env
```
- Muestra todas las variables necesarias
- Te guía para configurarlas

### **PASO 3: Primer Despliegue**
```bash
node deploy-vercel.js deploy
```
- Despliega a producción
- Configura el dominio automáticamente

---

## 🌐 **VARIABLES DE ENTORNO CRÍTICAS:**

### **Base de Datos:**
```bash
DATABASE_URL="postgresql://neondb_owner:npg_qeP3HK7ixZvB@ep-winter-dawn-ada6oavd-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
SHADOW_DATABASE_URL="postgresql://neondb_owner:npg_qeP3HK7ixZvB@ep-winter-dawn-ada6oavd-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

### **Autenticación:**
```bash
JWT_SECRET="qa-services-jwt-secret-key-2024-dev-environment"
NODE_ENV="production"
```

---

## 🎮 **COMANDOS DE CONTROL DISPONIBLES:**

| Comando | Descripción |
|---------|-------------|
| `node deploy-vercel.js setup` | Configurar proyecto Vercel |
| `node deploy-vercel.js env` | Ver variables de entorno |
| `node deploy-vercel.js deploy` | Desplegar a producción |
| `node deploy-vercel.js preview` | Desplegar preview |
| `node deploy-vercel.js status` | Ver estado del proyecto |
| `node deploy-vercel.js help` | Mostrar ayuda |

---

## 🚨 **PROBLEMAS COMUNES Y SOLUCIONES:**

### **Error: "Not authorized"**
- Verifica que el token tenga permisos completos
- Regenera el token si es necesario

### **Error: "Project not found"**
- Ejecuta `node deploy-vercel.js setup` primero
- Verifica que el proyecto esté vinculado

### **Error: "Environment variables missing"**
- Usa `node deploy-vercel.js env` para ver qué falta
- Configura las variables desde el dashboard de Vercel

---

## 📱 **MONITOREO Y CONTROL:**

### **Ver Estado del Proyecto:**
```bash
node deploy-vercel.js status
```

### **Ver Deployments:**
```bash
vercel ls
```

### **Ver Logs en Tiempo Real:**
```bash
vercel logs
```

---

## 🔄 **FLUJO COMPLETO DE CI/CD:**

1. **Push a GitHub** → Trigger automático
2. **GitHub Actions** → Tests y build
3. **Vercel CLI** → Despliegue automático
4. **Monitoreo** → Logs y métricas

---

## ⚡ **INICIO RÁPIDO:**

```bash
# 1. Configurar proyecto
node deploy-vercel.js setup

# 2. Configurar variables de entorno (desde dashboard)

# 3. Primer despliegue
node deploy-vercel.js deploy

# 4. Verificar estado
node deploy-vercel.js status
```

---

## 📞 **SOPORTE:**

- **Documentación Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **CLI Reference**: [vercel.com/docs/cli](https://vercel.com/docs/cli)
- **Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)

---

**🎯 Con este script tendrás control total sobre los despliegues a Vercel desde la línea de comandos.**

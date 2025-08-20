# 🗄️ Sincronización de Base de Datos - QA Services

## 📅 Última Actualización: 20 de Agosto 2025
## 🎯 Objetivo: Sincronizar datos de desarrollo con producción en Neon

---

## 🌐 **ESTADO ACTUAL:**

### **Desarrollo:**
- ✅ Base de datos local con datos de prueba
- ✅ Usuarios, roles, permisos configurados
- ✅ Estructura de base de datos completa

### **Producción (Neon):**
- ✅ Base de datos Neon conectada
- ✅ Estructura de base de datos sincronizada
- ❌ **Datos de usuarios y configuración faltantes**

---

## 🚀 **OPCIONES DE SINCRONIZACIÓN:**

### **OPCIÓN 1: MIGRACIÓN COMPLETA (Recomendada)**
**Descripción**: Copiar todos los datos de desarrollo a producción
**Ventajas**: Datos exactos, configuración completa
**Desventajas**: Sobrescribe datos de producción

### **OPCIÓN 2: SEED LIMPIO (Alternativa)**
**Descripción**: Crear datos iniciales estándar en producción
**Ventajas**: Datos limpios, configuración estándar
**Desventajas**: No incluye datos personalizados de desarrollo

---

## 🔧 **IMPLEMENTACIÓN - OPCIÓN 1: MIGRACIÓN COMPLETA**

### **PASO 1: Preparar entorno**
```bash
# Configurar variables de entorno para desarrollo
export DATABASE_URL="postgresql://localhost:5432/qa_services_dev"

# Configurar variables de entorno para producción
export DATABASE_URL="postgresql://neondb_owner:npg_qeP3HK7ixZvB@ep-winter-dawn-ada6oavd-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

### **PASO 2: Ejecutar migración**
```bash
# Ejecutar migración completa
node scripts/migrate-to-production.js

# O con limpieza forzada (CUIDADO!)
node scripts/migrate-to-production.js --force-clean
```

### **PASO 3: Verificar migración**
```bash
# Conectar a producción y verificar
npx prisma studio --schema=prisma/schema.prisma
```

---

## 🌱 **IMPLEMENTACIÓN - OPCIÓN 2: SEED LIMPIO**

### **PASO 1: Configurar entorno de producción**
```bash
# Configurar DATABASE_URL para Neon
export DATABASE_URL="postgresql://neondb_owner:npg_qeP3HK7ixZvB@ep-winter-dawn-ada6oavd-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

### **PASO 2: Ejecutar seed**
```bash
# Ejecutar seed estándar
node scripts/seed-production.js

# O con limpieza forzada
node scripts/seed-production.js --force-clean
```

### **PASO 3: Verificar seed**
```bash
# Verificar que se crearon los datos
npx prisma studio --schema=prisma/schema.prisma
```

---

## 📋 **DATOS QUE SE MIGRAN/CREAN:**

### **Organizaciones:**
- ✅ **QA Services**: Organización principal

### **Permisos (15 total):**
- **Usuarios**: Crear, Leer, Actualizar, Eliminar
- **Organizaciones**: Crear, Leer, Actualizar, Eliminar
- **CMS**: Crear, Leer, Actualizar, Eliminar, Publicar
- **Administración**: Acceso Admin, Configuración Sistema

### **Roles (4 total):**
- **Super Administrador**: Acceso completo
- **Administrador**: Administración de organización
- **Editor CMS**: Gestión de contenido
- **Visualizador**: Solo lectura

### **Usuarios (4 total):**
- **superadmin@qaservices.com** / `superadmin123`
- **admin@qaservices.com** / `admin123`
- **editor@qaservices.com** / `editor123`
- **viewer@qaservices.com** / `viewer123`

---

## ⚠️ **ADVERTENCIAS IMPORTANTES:**

### **Antes de ejecutar:**
1. **Hacer backup** de la base de datos de producción
2. **Verificar** que no hay datos críticos en producción
3. **Confirmar** que quieres sobrescribir datos

### **Durante la ejecución:**
1. **No interrumpir** el proceso
2. **Verificar logs** para detectar errores
3. **Mantener conexión** estable a internet

### **Después de la ejecución:**
1. **Verificar** que todos los datos se migraron
2. **Probar** acceso con las credenciales
3. **Documentar** el estado final

---

## 🔍 **VERIFICACIÓN POST-MIGRACIÓN:**

### **1. Verificar estructura:**
```bash
# Conectar a producción
npx prisma db pull --schema=prisma/schema.prisma

# Verificar que no hay errores
npx prisma generate --schema=prisma/schema.prisma
```

### **2. Verificar datos:**
```bash
# Contar registros en cada tabla
npx prisma studio --schema=prisma/schema.prisma
```

### **3. Probar autenticación:**
- **URL**: `https://qa-services-35wpq25tt-marcaexpress-projects.vercel.app/admin`
- **Credenciales**: Usar las del seed/migración
- **Verificar**: Acceso al dashboard y CMS

---

## 🚨 **SOLUCIÓN DE PROBLEMAS:**

### **Error: "Connection failed"**
```bash
# Verificar DATABASE_URL
echo $DATABASE_URL

# Verificar conectividad a Neon
ping ep-winter-dawn-ada6oavd-pooler.c-2.us-east-1.aws.neon.tech
```

### **Error: "Table doesn't exist"**
```bash
# Verificar que el schema está sincronizado
npx prisma db push --schema=prisma/schema.prisma

# O regenerar desde producción
npx prisma db pull --schema=prisma/schema.prisma
```

### **Error: "Permission denied"**
```bash
# Verificar credenciales de Neon
# Verificar que el usuario tiene permisos de escritura
```

---

## 📊 **MÉTRICAS DE ÉXITO:**

### **Migración exitosa:**
- ✅ **Organizaciones**: 1 creada
- ✅ **Permisos**: 15 creados
- ✅ **Roles**: 4 creados
- ✅ **Usuarios**: 4 creados
- ✅ **Asignaciones**: Todas configuradas

### **Verificación exitosa:**
- ✅ **Login**: Todos los usuarios pueden acceder
- ✅ **Dashboard**: Admin dashboard accesible
- ✅ **CMS**: Editor puede crear contenido
- ✅ **Permisos**: Roles funcionan correctamente

---

## 🎯 **RECOMENDACIÓN FINAL:**

### **Para desarrollo/QA:**
- **Usar**: `scripts/seed-production.js`
- **Ventaja**: Datos estándar, configuración limpia

### **Para sincronización exacta:**
- **Usar**: `scripts/migrate-to-production.js`
- **Ventaja**: Datos exactos de desarrollo

### **Para producción final:**
- **Usar**: `scripts/seed-production.js`
- **Ventaja**: Datos seguros, configuración estándar

---

## 📞 **SOPORTE:**

- **Scripts**: `scripts/` directory
- **Documentación**: Este archivo
- **Schema**: `prisma/schema.prisma`
- **Logs**: Verificar salida de consola

---

**🗄️ Base de datos lista para sincronización entre desarrollo y producción.**
**🔐 Usuarios y permisos configurados para acceso completo al sistema.**

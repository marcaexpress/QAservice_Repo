# 🧪 INSTRUCCIONES PARA PROBAR LA AUTENTICACIÓN

## **🌐 FRONTEND (http://localhost:3000):**

### **1. Verificar que el header muestre:**
- ✅ Logo "QA Services"
- ✅ Navegación (Inicio, Servicios, Aprendizaje, Contacto)
- ✅ Botones "Iniciar Sesión" y "Registrarse"

### **2. Probar navegación:**
- **Haz clic en "Iniciar Sesión"** → Debe llevarte a `/auth/login`
- **Haz clic en "Registrarse"** → Debe llevarte a `/auth/registro`
- **Navega por las páginas** para ver que funcionan

## **🗄️ PRISMA STUDIO (http://localhost:5555):**

### **1. Verificar datos creados:**
- **Tabla "organizations":** Debe tener "QA Services"
- **Tabla "users":** Debe tener "admin@qaservices.com"
- **Tabla "roles":** Debe tener "Administrador"
- **Tabla "permissions":** Debe tener 8 permisos (create, read, update, delete para pages y users)

### **2. Verificar relaciones:**
- **Usuario admin** debe estar asignado al **rol de administrador**
- **Rol de administrador** debe tener **todos los permisos**

## **🔑 PROBAR LOGIN (Temporalmente):**

### **Opción 1: Google OAuth (Recomendado)**
1. **Configura Google OAuth** en [Google Cloud Console](https://console.cloud.google.com/)
2. **Obtén CLIENT_ID y CLIENT_SECRET**
3. **Actualiza .env** con las credenciales
4. **Reinicia el servidor**

### **Opción 2: Usuario de prueba directo**
1. **Ve a Prisma Studio**
2. **Crea un usuario manual** con email y contraseña
3. **Asigna el rol de administrador**

## **❌ PROBLEMAS COMUNES:**

### **Si no funciona el login:**
- ✅ **Verifica que .env tenga DATABASE_URL correcto**
- ✅ **Verifica que las tablas existan en Prisma Studio**
- ✅ **Verifica que el servidor esté corriendo en puerto 3000**
- ✅ **Verifica que NextAuth esté configurado correctamente**

### **Si hay errores de compilación:**
- ✅ **Ejecuta:** `npm run build` para ver errores
- ✅ **Verifica que todas las dependencias estén instaladas**
- ✅ **Revisa la consola del navegador** para errores JavaScript

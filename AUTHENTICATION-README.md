# 🔐 Sistema de Autenticación QA Services

## **📋 Resumen**

Se ha implementado un sistema de autenticación estándar y robusto usando **JWT + Cookies HttpOnly** que funciona tanto en desarrollo como en producción.

## **✅ Características Implementadas**

### **🔑 Autenticación JWT**
- **Tokens JWT** con expiración de 7 días
- **Cookies HttpOnly** para máxima seguridad
- **Verificación automática** de tokens
- **Middleware de protección** de rutas

### **👥 Sistema de Roles**
- **Administrador**: Acceso completo al sistema
- **Editor CMS**: Acceso al CMS y gestión de contenido
- **Usuario**: Acceso básico (registro automático)

### **🛡️ Seguridad**
- **Cookies HttpOnly** (no accesibles desde JavaScript)
- **Cookies Secure** en producción
- **SameSite Lax** para protección CSRF
- **Expiración automática** de sesiones

## **🚀 Cómo Usar**

### **1. Configuración del Entorno**

Agregar al archivo `.env`:
```bash
JWT_SECRET="tu-super-secret-jwt-key-cambiar-en-produccion"
```

### **2. Login de Usuario**

```typescript
import { useAuth } from '@/hooks/useAuth';

const { login } = useAuth();

const handleLogin = async () => {
  const result = await login(email, password);
  if (result.success) {
    // Usuario autenticado
    console.log('Usuario:', result.user.name);
    console.log('Roles:', result.roles);
  }
};
```

### **3. Verificación de Sesión**

```typescript
const { isAuthenticated, session } = useAuth();

if (isAuthenticated) {
  console.log('Usuario autenticado:', session.user.name);
  console.log('Roles:', session.user.roles);
}
```

### **4. Logout**

```typescript
const { logout } = useAuth();

const handleLogout = async () => {
  await logout();
  // Usuario desautenticado y redirigido
};
```

## **🔒 Rutas Protegidas**

### **Middleware Automático**
- `/admin/*` - Requiere rol Administrador o Editor CMS
- `/dashboard/*` - Requiere autenticación
- `/profile/*` - Requiere autenticación

### **Protección Manual**
```typescript
// En componentes del servidor
import { getTokenFromRequest, verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  
  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }
  
  // Usuario autenticado
  return NextResponse.json({ user: payload });
}
```

## **🧪 Pruebas del Sistema**

### **Usuarios de Prueba**
- **Admin**: `admin@qaservices.com` / `admin123`
- **Editor**: `editor@qaservices.com` / `editor123`

### **APIs Disponibles**
- `POST /api/auth/login` - Login de usuario
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/logout` - Logout de usuario
- `GET /api/auth/session` - Verificar sesión actual

## **🌐 URLs de la Aplicación**

- **Página Principal**: `http://localhost:3000/`
- **Login**: `http://localhost:3000/auth/login`
- **Registro**: `http://localhost:3000/auth/registro`
- **Admin**: `http://localhost:3000/admin` (requiere autenticación)

## **📱 Funcionamiento en el Navegador**

1. **Usuario hace login** → Se establece cookie HttpOnly
2. **Navegador envía cookie** automáticamente en cada petición
3. **Servidor verifica token** en cada petición protegida
4. **Usuario hace logout** → Se limpia cookie automáticamente

## **🚀 Despliegue en Producción**

### **Variables de Entorno Requeridas**
```bash
JWT_SECRET="clave-super-secreta-y-unica-en-produccion"
NODE_ENV="production"
```

### **Características de Producción**
- **Cookies Secure** (HTTPS obligatorio)
- **JWT_SECRET** único y complejo
- **Expiración de tokens** configurable
- **Logs de auditoría** habilitados

## **🔧 Solución de Problemas**

### **Error 401 en Sesión**
- Verificar que `JWT_SECRET` esté configurado
- Comprobar que las cookies estén habilitadas
- Verificar que el token no haya expirado

### **Login Fallido**
- Verificar credenciales en la base de datos
- Comprobar que el usuario tenga contraseña
- Verificar que el usuario tenga roles asignados

## **📈 Próximos Pasos**

1. **Implementar refresh tokens** para sesiones largas
2. **Agregar autenticación 2FA** para mayor seguridad
3. **Implementar rate limiting** en APIs de autenticación
4. **Agregar logs de auditoría** para seguridad

---

**✅ Sistema completamente funcional y listo para producción**

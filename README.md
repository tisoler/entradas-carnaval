# 🎭 Sistema de Entradas Digitales para Carnaval

Sistema completo para la gestión de entradas digitales con generación de QR codes, lectura de códigos QR y dashboard de administración.

## 🚀 Características

- **Generación de entradas digitales** con QR codes únicos
- **Sistema de autenticación** con roles (admin, vendedor, receptor)
- **Dashboard completo** para gestión de entradas
- **Lector QR** para registrar ingresos
- **Búsqueda avanzada** por DNI, nombre o apellido
- **Compartir entradas** vía WhatsApp/Telegram (mobile first)
- **Diseño festivo** inspirado en carnaval
- **Next.js** con API Routes integradas
- **Docker** para despliegue fácil

## 📋 Requisitos Previos

- Node.js 20+ 
- npm o yarn
- MySQL 8.0+ (o usar Docker)
- Docker y Docker Compose (para despliegue con Docker)

## 🛠️ Instalación

### Opción 1: Desarrollo Local

1. **Clonar el repositorio**
```bash
git clone <repo-url>
cd entradas-carnaval
```

2. **Instalar dependencias**

```bash
# Instalar dependencias de la app web
cd apps/web
npm install
```

3. **Configurar la base de datos**

Crear una base de datos MySQL y ejecutar el esquema:

```bash
# Conectar a MySQL
mysql -u root -p

# Crear base de datos
CREATE DATABASE carnaval_entradas;

# Ejecutar el esquema
source database/schema.sql
```

4. **Configurar variables de entorno**

Crear archivo `.env.local` en `apps/web/`:

```env
DATABASE_URL="mysql://usuario:password@localhost:3306/carnaval_entradas"
JWT_SECRET=tu-secret-key-super-segura-aqui
NODE_ENV=development
```

5. **Configurar Prisma**

```bash
cd apps/web
npx prisma generate
npx prisma db push
```

6. **Crear usuario inicial**

```bash
# En la terminal de MySQL
INSERT INTO usuario (nombreUsuario, password, rol) 
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin');
# Password: admin123 (hash bcrypt)
```

### Opción 2: Docker Compose (Recomendado)

1. **Configurar variables de entorno**

Crear archivo `.env` en la raíz:

```env
JWT_SECRET=tu-secret-key-super-segura-aqui
```

2. **Iniciar servicios**

```bash
docker-compose up -d
```

Esto iniciará:
- MySQL en puerto 3306
- Next.js en puerto 3000

## 🎮 Uso

### Desarrollo

```bash
cd apps/web
npm run dev
```

La aplicación estará disponible en:
- Frontend y API: http://localhost:3000

### Producción con Docker

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v
```

## 📱 Funcionalidades

### Login
- Accede con tu usuario y contraseña
- Los roles determinan los permisos

### Dashboard
- **Crear entrada**: Ingresa nombre, apellido y DNI para generar una entrada con QR
- **Listar entradas**: Visualiza todas las entradas creadas
- **Buscar**: Filtra por DNI, nombre o apellido
- **Toggle estado**: Cambia entre "pendiente ingreso" e "ingreso registrado"
- **Escanear QR**: Usa la cámara para leer códigos QR y registrar ingresos automáticamente
- **Compartir**: Comparte entradas vía WhatsApp/Telegram directamente desde el navegador

### Entrada Digital
- **QR Code grande** para fácil lectura
- **Datos de la persona** claramente visibles
- **Diseño festivo** con colores de carnaval
- **Estado visual** del ingreso

## 🏗️ Estructura del Proyecto

```
entradas-carnaval/
├── apps/
│   └── web/
│       ├── app/
│       │   ├── api/          # API Routes de Next.js
│       │   ├── dashboard/    # Página dashboard
│       │   ├── login/        # Página login
│       │   └── layout.tsx    # Layout raíz
│       ├── components/       # Componentes React (client components)
│       ├── contexts/         # Context providers
│       ├── lib/              # Utilidades y funciones (API client, DB, Auth)
│       └── types/            # TypeScript types
├── database/
│   └── schema.sql           # Esquema de base de datos
├── docker-compose.yml
├── Dockerfile
└── README.md
```

## 🔐 Roles de Usuario

- **admin**: Acceso completo al sistema
- **vendedor**: Puede crear y gestionar entradas
- **receptor**: Puede escanear QR y registrar ingresos

## 🛡️ Seguridad

- Passwords hasheados con bcrypt
- JWT tokens para autenticación
- Validación de datos en backend
- API Routes protegidas con middleware

## 📝 Base de Datos

El proyecto usa **Prisma ORM** con **MySQL**:
- **Schema Prisma**: `apps/web/prisma/schema.prisma`
- **SQL Schema**: `database/schema.sql` (para referencia)
- **Modelos**: `Usuario` y `Entrada`
- **Migraciones**: Usa `prisma db push` o `prisma migrate dev`

### Comandos Prisma útiles:
```bash
# Generar cliente Prisma
npx prisma generate

# Sincronizar schema con BD
npx prisma db push

# Crear migración
npx prisma migrate dev

# Abrir Prisma Studio (GUI)
npx prisma studio
```

## 🐛 Solución de Problemas

**Error de conexión a base de datos:**
- Verifica que MySQL esté corriendo
- Revisa las credenciales en `.env.local`
- Ejecuta `npx prisma generate` después de instalar dependencias

**Error de permisos de cámara (QR Scanner):**
- Asegúrate de usar HTTPS o localhost
- Verifica permisos del navegador

**Error al compilar Next.js:**
- Verifica que todas las dependencias estén instaladas
- Ejecuta `npm run build` para ver errores detallados

## 📄 Licencia

MIT License - Ver LICENSE para más detalles

## 👤 Autor

Diego Díaz Barroso

---

🎉 ¡Disfruta del sistema de entradas para carnaval!

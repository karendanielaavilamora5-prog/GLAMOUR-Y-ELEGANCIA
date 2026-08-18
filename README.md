# 👑 Glamur & Elegancia — Tienda Virtual de Alta Costura

Bienvenido a **Glamur & Elegancia**, una plataforma de comercio electrónico de lujo diseñada con una estética *Geometric Balance* (negro obsidiana y dorado metálico). Incluye catálogo con filtros avanzados, gestión de tallas y stock, carrito reactivo con cupón de descuento, flujo de checkout completo con múltiples métodos de pago, panel de cliente con libreta de direcciones y seguimiento de pedidos, panel administrativo con métricas y gestión de inventario, y base de datos relacional MySQL.

---

## 📋 Tabla de Contenidos
1. [Requisitos Previos del Sistema](#-requisitos-previos-del-sistema)
2. [Descarga y Clonación del Proyecto](#-descarga-y-clonación-del-proyecto)
3. [Instalación de Dependencias](#-instalación-de-dependencias)
4. [Configuración de la Base de Datos (MySQL)](#-configuración-de-la-base-de-datos-mysql)
5. [Variables de Entorno](#-variables-de-entorno)
6. [Ejecución en Entorno de Desarrollo](#-ejecución-en-entorno-de-desarrollo)
7. [Compilación y Despliegue en Producción](#-compilación-y-despliegue-en-producción)
8. [Cuentas de Acceso y Credenciales Demo](#-cuentas-de-acceso-y-credenciales-demo)
9. [Estructura del Proyecto](#-estructura-del-proyecto)
10. [Solución de Problemas Frecuentes](#-solución-de-problemas-frecuentes)

---

## 💻 Requisitos Previos del Sistema

Antes de iniciar, asegúrate de tener instalado en tu computadora:

- **Node.js**: Versión `18.x`, `20.x` o superior ([Descargar Node.js](https://nodejs.org/)).
- **NPM** (incluido con Node.js) o gestor alternativo (**pnpm** / **yarn**).
- **MySQL Server**: Versión `5.7+`, `8.0+` o **MariaDB** `10.3+` (puede ser mediante [XAMPP](https://www.apachefriends.org/), [WampServer](https://www.wampserver.com/), [Laragon](https://laragon.org/) o MySQL Community Server).
- **Git** (opcional, para clonar el repositorio) ([Descargar Git](https://git-scm.com/)).
- **Editor de código**: [Visual Studio Code](https://code.visualstudio.com/) recomendado.

---

## 📥 Descarga y Clonación del Proyecto

### Opción A: Mediante Git
Abre tu terminal y ejecuta:
```bash
git clone https://github.com/tu-usuario/glamur-elegancia.git
cd glamur-elegancia
```

### Opción B: Descarga directa ZIP
1. Descarga el archivo `.zip` desde el repositorio o menú de exportación.
2. Descomprime el archivo en una carpeta de tu preferencia (ej: `C:\proyectos\glamur-elegancia` o `~/proyectos/glamur-elegancia`).
3. Abre una terminal dentro de esa carpeta.

---

## 📦 Instalación de Dependencias

Ejecuta el siguiente comando en la raíz del proyecto para instalar todos los paquetes requeridos:

```bash
npm install
```

*(Si utilizas `pnpm`, ejecuta `pnpm install`; si utilizas `yarn`, ejecuta `yarn`)*.

---

## 🗄️ Configuración de la Base de Datos (MySQL)

El proyecto incluye el esquema SQL completo y datos de prueba (*seed data*) en la carpeta `database/`.

### Pasos para importar la base de datos:

#### Método 1: Usando phpMyAdmin (XAMPP / WAMP / Laragon)
1. Inicia los servicios de **Apache** y **MySQL** en tu panel de control (ej. XAMPP).
2. Abre tu navegador web e ingresa a: `http://localhost/phpmyadmin`
3. Ve a la pestaña **Importar** en el menú superior.
4. Haz clic en **Seleccionar archivo** y busca el archivo:
   `database/glamur_elegancia_schema.sql`
5. Deja las opciones predeterminadas y haz clic en el botón **Importar** (o **Continuar**).
6. Se creará automáticamente la base de datos `glamur_elegancia_db` con sus 13 tablas, índices y datos iniciales.

#### Método 2: Usando MySQL Workbench o DBeaver
1. Abre tu cliente SQL y conéctate a tu servidor local (`localhost:3306`).
2. Ve a **File > Open SQL Script...** y selecciona `database/glamur_elegancia_schema.sql`.
3. Presiona el botón de ejecutar (icono de rayo ⚡).

#### Método 3: Desde la Terminal / Consola de Comandos
```bash
mysql -u root -p < database/glamur_elegancia_schema.sql
```
*(Si no tienes contraseña configurada en tu MySQL local, simplemente presiona `Enter` cuando la solicite)*.

---

## ⚙️ Variables de Entorno

Si deseas conectar la aplicación a un servidor backend propio o servicios adicionales:

1. Crea un archivo `.env` en la raíz del proyecto (puedes basarte en `.env.example` si existe):
```env
# Configuración del servidor de desarrollo
PORT=3000
VITE_APP_NAME="Glamur & Elegancia"

# Conexión MySQL (para integración backend si se requiere)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=glamur_elegancia_db
```

---

## 🚀 Ejecución en Entorno de Desarrollo

Para iniciar el servidor de desarrollo local con recarga rápida:

```bash
npm run dev
```

Una vez iniciado, abre tu navegador en:
👉 **`http://localhost:3000`**

---

## 🏗️ Compilación y Despliegue en Producción

Para generar los archivos estáticos listos para producción:

```bash
npm run build
```

Los archivos optimizados y minificados se generarán dentro de la carpeta `dist/`.

Para previsualizar la compilación de producción localmente:
```bash
npm run preview
```

---

## 🔑 Cuentas de Acceso y Credenciales Demo

La aplicación cuenta con autenticación interactiva y roles diferenciados:

| Rol | Correo Electrónico | Contraseña Demo | Acceso / Capacidades |
| :--- | :--- | :--- | :--- |
| **Administrador** 👑 | `admin@glamur.com` | `admin123` | Control total, métricas financieras, gestión de catálogo, pedidos, cupones y mensajes |
| **Cliente VIP** ✨ | `cliente@glamur.com` | `daniela123` | Compra de prendas, historial de pedidos con rastreo, libreta de direcciones y lista de deseos |
| **Cliente General** | `santiago.m@example.com` | `santiago123` | Compras, navegación y reseñas de productos |

> 💡 *Tip: También puedes registrar un usuario nuevo directamente desde el botón **"Acceder"** en la barra de navegación.*

---

## 📁 Estructura del Proyecto

```text
glamur-elegancia/
├── database/                             # Base de datos relacional
│   ├── glamur_elegancia_schema.sql       # Script SQL con DDL, DML y Seed Data
│   └── README.md                         # Guía rápida específica de la base de datos
├── public/                               # Archivos públicos y favicon
├── src/
│   ├── components/                       # Componentes modulares de la interfaz
│   │   ├── AdminView.tsx                 # Panel administrativo de gestión
│   │   ├── AuthModal.tsx                 # Modal de Login / Registro
│   │   ├── CartDrawer.tsx                # Carrito lateral deslizable y cupones
│   │   ├── CatalogView.tsx               # Catálogo con filtros y ordenamiento
│   │   ├── CheckoutView.tsx              # Pasarela de pago y confirmación
│   │   ├── ContactView.tsx               # Formulario concierge y preguntas frecuentes
│   │   ├── FavoritesView.tsx             # Lista de deseos (Wishlist)
│   │   ├── Footer.tsx                    # Pie de página y sellos de confianza
│   │   ├── HomeView.tsx                  # Portada, colecciones y novedades
│   │   ├── Navbar.tsx                    # Navegación, buscador y accesos rápidos
│   │   ├── OrderConfirmationView.tsx     # Recibo de compra detallado
│   │   ├── OrderTrackingView.tsx         # Seguimiento de envío en tiempo real
│   │   ├── ProductDetailView.tsx         # Vista de detalle de prenda y selector de talla
│   │   └── ProfileView.tsx               # Perfil, direcciones y pedidos del usuario
│   ├── data/
│   │   └── initialData.ts                # Datos iniciales para el estado reactivo
│   ├── App.tsx                           # Enrutador y gestor de estado principal
│   ├── index.css                         # Estilos Tailwind y tema Geometric Balance
│   ├── main.tsx                          # Punto de entrada de React 19
│   └── types.ts                          # Interfaces y modelos TypeScript
├── index.html                            # Documento HTML principal con fuentes Cinzel/Montserrat
├── package.json                          # Manifiesto de dependencias y scripts
├── tsconfig.json                         # Configuración de TypeScript
├── vite.config.ts                        # Configuración del empaquetador Vite y Tailwind
└── README.md                             # Este manual de instrucciones
```

---

## 🛠️ Solución de Problemas Frecuentes

### 1. El puerto 3000 ya está en uso
Si el puerto 3000 está ocupado por otra aplicación, puedes iniciar Vite en otro puerto o liberarlo:
```bash
npx kill-port 3000
npm run dev
```

### 2. Error al importar el archivo SQL por tamaño o codificación
Asegúrate de que la codificación de tu servidor MySQL esté configurada en `utf8mb4`. En phpMyAdmin, selecciona **Juego de caracteres: utf-8**.

### 3. Las imágenes no cargan
Las imágenes del catálogo provienen de la CDN de Unsplash en alta definición. Asegúrate de tener conexión a Internet activa.

### 4. Limpiar caché de dependencias
Si experimentas algún comportamiento inesperado tras actualizar módulos:
```bash
npm run clean
npm install
npm run dev
```

---

## 💎 Créditos y Licencia
Desarrollado para **Glamur & Elegancia** — Alta Costura y Lujo Contemporáneo. Todos los derechos reservados.

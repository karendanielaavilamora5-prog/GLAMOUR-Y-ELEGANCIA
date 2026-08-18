# 👑 Glamur & Elegancia — Plataforma de Comercio Electrónico de Alta Costura

> **Manual Maestro de Configuración, Arquitectura Técnica y Despliegue Global**  
> *Versión del Documento: 1.0.0 | Entorno: Full-Stack React / TypeScript / MySQL*

---

## 📑 Tabla de Contenidos General
1. [Ficha Técnica del Sistema](#-1-ficha-técnica-del-sistema)
   - [Lenguajes de Programación](#lenguajes-de-programación)
   - [Frameworks y Librerías Frontend](#frameworks-y-librerías-frontend)
   - [Motor y Tipo de Base de Datos](#motor-y-tipo-de-base-de-datos)
   - [Herramientas de Compilación y Estilos](#herramientas-de-compilación-y-estilos)
2. [Requisitos Previos del Sistema](#-2-requisitos-previos-del-sistema)
3. [Configuración Inicial del Entorno](#-3-configuración-inicial-del-entorno)
   - [Instalación de Node.js y Gestor de Paquetes](#paso-31-instalación-de-nodejs-y-npm)
   - [Instalación del Servidor MySQL](#paso-32-instalación-y-arranque-del-servidor-mysql)
4. [Descarga y Configuración del Proyecto](#-4-descarga-y-configuración-del-proyecto)
   - [Clonación o Extracción](#paso-41-obtención-del-código-fuente)
   - [Instalación de Módulos (npm install)](#paso-42-instalación-de-dependencias)
5. [Configuración Global del Entorno](#-5-configuración-global-del-entorno)
   - [Archivo de Variables de Entorno (.env)](#51-archivo-de-variables-de-entorno-env)
   - [Configuración de Red, Host y Puerto](#52-configuración-de-red-host-y-puerto)
   - [Configuración del Compilador TypeScript](#53-configuración-del-compilador-typescript-tsconfigjson)
6. [Configuración y Carga de la Base de Datos (MySQL)](#-6-configuración-y-carga-de-la-base-de-datos-mysql)
   - [Estructura del Modelo Relacional](#61-estructura-del-modelo-relacional)
   - [Importación vía phpMyAdmin (XAMPP / Wamp / Laragon)](#62-importación-mediante-phpmyadmin)
   - [Importación vía MySQL Workbench o DBeaver](#63-importación-mediante-mysql-workbench--dbeaver)
   - [Importación vía Consola / Terminal](#64-importación-mediante-consola--terminal)
7. [Ejecución y Flujo de Trabajo](#-7-ejecución-y-flujo-de-trabajo)
   - [Modo Desarrollo (Live Reload)](#71-ejecución-en-modo-desarrollo)
   - [Compilación y Construcción para Producción (Build)](#72-compilación-para-producción)
   - [Validación de Tipos y Sintaxis (Lint)](#73-validación-de-código-y-tipos)
8. [Cuentas de Acceso y Roles Preconfigurados](#-8-cuentas-de-acceso-y-roles-preconfigurados)
9. [Estructura de Directorios y Módulos](#-9-estructura-de-directorios-y-módulos)
10. [Solución de Problemas Frecuentes (Troubleshooting)](#-10-solución-de-problemas-frecuentes-troubleshooting)

---

## 💎 1. Ficha Técnica del Sistema

La plataforma **Glamur & Elegancia** ha sido construida bajo estándares modernos de desarrollo web, priorizando tipado estricto, rendimiento de renderizado y una arquitectura relacional sólida.

### Lenguajes de Programación
- **TypeScript 5.8+**: Lenguaje principal de toda la aplicación (Frontend y tipos de datos), garantizando seguridad de tipos, interfaces estrictas y autocompletado inteligente.
- **JavaScript (ECMAScript 2023 / ES Modules)**: Estándar modular moderno (`"type": "module"` en `package.json`).
- **SQL (Structured Query Language)**: Dialecto MySQL / MariaDB para la definición de esquemas (DDL), manipulación de datos (DML) y vistas analíticas.
- **HTML5 & CSS3 Moderno**: Semántica web accesible y diseño responsivo de alto contraste.

### Frameworks y Librerías Frontend
- **React 19 (`react` & `react-dom` v19.0.1)**: Biblioteca núcleo para interfaces reactivas basada en componentes funcionales y *Hooks* (`useState`, `useEffect`, `useMemo`, `useCallback`).
- **Vite 6 (`vite` & `@vitejs/plugin-react` v5+)**: Entorno de desarrollo de ultra-alta velocidad y empaquetador para producción con *Hot Module Replacement* (HMR).
- **Tailwind CSS v4 (`@tailwindcss/vite` & `tailwindcss` v4.1+)**: Framework de utilidades CSS con arquitectura *Geometric Balance*, definiendo paleta de lujo en negro obsidiana (`#000000`), dorado metálico (`#d4af37`) y superficies calibradas.
- **Motion (`motion` v12+)**: Motor de animaciones fluidas para transiciones de vista, apertura de modales y drawers.
- **Lucide React (`lucide-react` v0.546+)**: Conjunto de iconografía vectorial SVG de alta precisión.

### Motor y Tipo de Base de Datos
- **Tipo de Base de Datos**: Relacional (RDBMS / SQL).
- **Motor Soportado**: **MySQL Server 5.7+ / 8.0+** o **MariaDB 10.3+**.
- **Motor de Almacenamiento**: `InnoDB` (soporte completo para transacciones ACID, restricciones de clave foránea `FOREIGN KEY` y bloqueos a nivel de fila).
- **Juego de Caracteres**: `utf8mb4` (soporte universal para caracteres especiales, tildes, eñes y emojis).
- **Colación**: `utf8mb4_unicode_ci`.

### Herramientas de Compilación y Estilos
- **Esbuild**: Compilador ultrarrápido para optimización de bundles.
- **PostCSS / Autoprefixer**: Prefijado automático de propiedades CSS para compatibilidad entre navegadores.
- **TSX**: Ejecutor de TypeScript para scripts de servidor o utilidades Node.js.

---

## 💻 2. Requisitos Previos del Sistema

Asegúrate de contar con el siguiente software instalado en tu estación de trabajo (Windows, macOS o Linux):

| Herramienta | Versión Recomendada | Enlace Oficial |
| :--- | :--- | :--- |
| **Node.js** | `v18.20.0`, `v20.x` o superior (LTS) | [nodejs.org](https://nodejs.org/) |
| **NPM** | `v9.x` o `v10.x` (se instala con Node.js) | [npmjs.com](https://www.npmjs.com/) |
| **Servidor MySQL** | MySQL 8.0+ o MariaDB (XAMPP / Wamp / Laragon) | [apachefriends.org](https://www.apachefriends.org/) |
| **Git** | `v2.40+` (opcional para clonación) | [git-scm.com](https://git-scm.com/) |
| **VS Code** | Última versión (recomendado) | [code.visualstudio.com](https://code.visualstudio.com/) |

---

## 🛠️ 3. Configuración Inicial del Entorno

### Paso 3.1: Instalación de Node.js y NPM
1. Descarga el instalador de **Node.js LTS** correspondiente a tu sistema operativo.
2. Ejecuta el instalador siguiendo los pasos predeterminados.
3. Abre una terminal (PowerShell, CMD, Bash o Zsh) y verifica la instalación ejecutando:
   ```bash
   node -v
   npm -v
   ```
   *Deberías ver las versiones instaladas (ejemplo: `v20.12.0` y `10.5.0`).*

### Paso 3.2: Instalación y Arranque del Servidor MySQL
- **Si usas XAMPP / WampServer / Laragon:**
  1. Abre el Panel de Control de XAMPP.
  2. Inicia los módulos **Apache** y **MySQL** haciendo clic en **Start**.
  3. Comprueba que el puerto `3306` esté activo.
- **Si usas MySQL Server instalado nativamente:**
  1. Asegúrate de que el servicio `MySQL80` esté en ejecución en tus Servicios de Windows o daemon de Linux/macOS.

---

## 📥 4. Descarga y Configuración del Proyecto

### Paso 4.1: Obtención del Código Fuente

#### Opción A — Clonación mediante Git:
```bash
git clone https://github.com/tu-usuario/glamur-elegancia.git
cd glamur-elegancia
```

#### Opción B — Descarga manual en archivo ZIP:
1. Descarga el paquete `.zip` del proyecto.
2. Descomprímelo en una ruta sin caracteres especiales ni espacios largos (ejemplo: `C:\workspace\glamur-elegancia` o `~/dev/glamur-elegancia`).
3. Abre tu terminal y posiciónate en el directorio raíz del proyecto:
   ```bash
   cd glamur-elegancia
   ```

### Paso 4.2: Instalación de Dependencias
Ejecuta el siguiente comando en la raíz del proyecto para descargar e instalar automáticamente todas las librerías declaradas en `package.json`:

```bash
npm install
```

*(El proceso creará la carpeta `node_modules/` y resolverá el árbol de dependencias con `package-lock.json`)*.

---

## 🌐 5. Configuración Global del Entorno

### 5.1. Archivo de Variables de Entorno (`.env`)
Crea un archivo llamado `.env` en la raíz del proyecto (junto a `package.json`) con la siguiente configuración base:

```env
# =====================================================================
# CONFIGURACIÓN GLOBAL — GLAMUR & ELEGANCIA
# =====================================================================

# Configuración del Servidor y Vite
PORT=3000
HOST=0.0.0.0
NODE_ENV=development

# Nombre público de la aplicación
VITE_APP_NAME="Glamur & Elegancia"
VITE_APP_TAGLINE="Alta Costura & Lujo Contemporáneo"

# Parámetros de Conexión a Base de Datos MySQL (para Backend / API)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=glamur_elegancia_db
```

### 5.2. Configuración de Red, Host y Puerto
La aplicación está configurada de forma predeterminada para escuchar en:
- **Host**: `0.0.0.0` (permite acceso local y desde otros dispositivos en la red LAN).
- **Puerto**: `3000`.

En `package.json`:
```json
"scripts": {
  "dev": "vite --port=3000 --host=0.0.0.0",
  "build": "vite build",
  "preview": "vite preview",
  "clean": "rm -rf dist server.js",
  "lint": "tsc --noEmit"
}
```

### 5.3. Configuración del Compilador TypeScript (`tsconfig.json`)
El compilador TypeScript está configurado en modo estricto (`"strict": true`) para asegurar:
- Verificación exhaustiva de valores `null` e `undefined`.
- Compatibilidad nativa con JSX de React 19 (`"jsx": "react-jsx"`).
- Resolución de módulos con estándar Bundler (`"moduleResolution": "bundler"`).

---

## 🗄️ 6. Configuración y Carga de la Base de Datos (MySQL)

El archivo maestro de base de datos se encuentra ubicado en:
📂 **`/database/glamur_elegancia_schema.sql`**

### 6.1. Estructura del Modelo Relacional
El script crea la base de datos `glamur_elegancia_db` e inicializa **13 tablas relacionales normalizadas**:

1. `usuarios`: Clientes y administradores con roles (`cliente`, `administrador`), datos personales y hashes de contraseña.
2. `direcciones_usuario`: Libreta de direcciones de despacho asociadas a cada usuario (`1:N`) con marca de predeterminada.
3. `categorias`: Colecciones principales (*Mujer, Hombre, Niños, Zapatos, Accesorios*) con slugs únicos.
4. `productos`: Catálogo con SKU único, precios normales y de oferta, banderas promocionales, stock total y calificaciones.
5. `producto_imagenes`: Galería de fotos secundarias en alta definición (`1:N`).
6. `producto_tallas`: Control de inventario discriminado por talla (*XS, S, M, L, XL, 36-42, 4-12, Única*).
7. `resenas`: Opiniones y puntuaciones de 1 a 5 estrellas con validación de clave foránea de usuario y producto.
8. `cupones`: Códigos promocionales (*GLAMURVIP, ORO2026, ELEGANCIA10, BIENVENIDA*) con límites de uso y compra mínima.
9. `pedidos`: Cabecera de órdenes con número único (`GLE-2026-XXXX`), totales monetarios, métodos de pago y código de rastreo.
10. `pedido_detalles`: Items individuales por pedido con snapshot de precio, prenda y talla.
11. `pedido_historial_estados`: Línea de tiempo de logística (*Pendiente, Confirmado, En preparación, Enviado, Entregado*).
12. `favoritos`: Lista de deseos (*Wishlist*) con clave única compuesta (`id_usuario`, `id_producto`).
13. `mensajes_contacto`: Buzón de asesoría VIP y solicitudes corporativas.
14. **Vistas SQL**: `vista_resumen_pedidos` y `vista_catalogo_activo` para reportería rápida.

---

### 6.2. Importación mediante phpMyAdmin
1. Abre tu navegador web en: `http://localhost/phpmyadmin`
2. Haz clic en la pestaña superior **Importar**.
3. Haz clic en **Seleccionar archivo** (*Choose file*) y navega hasta la carpeta del proyecto:
   `glamur-elegancia/database/glamur_elegancia_schema.sql`
4. En **Juego de caracteres del archivo**, asegúrate de que esté en `utf-8`.
5. Haz clic en el botón inferior **Importar** o **Continuar**.
6. Recibirás un mensaje de confirmación en verde indicando que todas las consultas se ejecutaron con éxito.

---

### 6.3. Importación mediante MySQL Workbench / DBeaver
1. Abre **MySQL Workbench** o **DBeaver** y conéctate a tu instancia local (`localhost:3306`).
2. Ve al menú superior: **File** > **Open SQL Script...** (o presiona `Ctrl + Shift + O`).
3. Selecciona el archivo `database/glamur_elegancia_schema.sql`.
4. Haz clic en el icono del **Rayo ⚡** (*Execute all statements*).
5. En el panel izquierdo de *Schemas*, haz clic derecho y selecciona **Refresh All** para ver la base de datos `glamur_elegancia_db`.

---

### 6.4. Importación mediante Consola / Terminal
Si prefieres la línea de comandos de MySQL:

```bash
# En Windows / Linux / macOS:
mysql -u root -p < database/glamur_elegancia_schema.sql
```
*(Ingresa tu contraseña de MySQL o presiona Enter si el usuario root no tiene clave)*.

---

## 🚀 7. Ejecución y Flujo de Trabajo

### 7.1. Ejecución en Modo Desarrollo
Para levantar el servidor de desarrollo local con recarga instantánea en caliente:

```bash
npm run dev
```

La consola te indicará la URL activa:
```text
  VITE v6.2.3  ready in 240 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.1.XX:3000/
```

Abre tu navegador en: 👉 **`http://localhost:3000`**

---

### 7.2. Compilación para Producción
Para compilar la aplicación, optimizar los activos, generar minificación y verificar tipos:

```bash
npm run build
```
El resultado se generará en la carpeta `/dist/`, listo para ser servido por cualquier servidor web (Nginx, Apache, AWS S3, Cloud Run, Vercel, Netlify).

Para probar localmente el bundle compilado:
```bash
npm run preview
```

---

### 7.3. Validación de Código y Tipos
Para ejecutar el linter y verificar que no existan inconsistencias de tipado TypeScript:

```bash
npm run lint
```

---

## 🔑 8. Cuentas de Acceso y Roles Preconfigurados

La aplicación cuenta con autenticación reactiva y control de acceso basado en roles (*RBAC*):

| Rol | Correo Electrónico | Contraseña Demo | Vista y Funcionalidades |
| :--- | :--- | :--- | :--- |
| **👑 Administrador** | `admin@glamur.com` | `admin123` | **Panel Admin Completo**: Métricas financieras en tiempo real, creación/edición de prendas con tallas y stock, gestión de estados de pedidos con actualización de guía, creación de cupones de descuento y lectura del buzón VIP. |
| **✨ Cliente VIP** | `cliente@glamur.com` | `daniela123` | **Portal de Cliente**: Historial de órdenes con rastreo en vivo de mensajería, libreta de direcciones múltiples, lista de deseos sincronizada y configuración de cuenta. |
| **👤 Cliente Regular** | `santiago.m@example.com` | `santiago123` | **Portal de Cliente**: Catálogo, compras y valoraciones. |

> 💡 *Nota: También puedes crear usuarios nuevos en cualquier momento utilizando el botón **"Registrarse"** del modal de acceso.*

---

## 📂 9. Estructura de Directorios y Módulos

```text
glamur-elegancia/
├── database/                             # Base de datos relacional MySQL
│   ├── glamur_elegancia_schema.sql       # Script SQL maestro (DDL + DML + Seed Data)
│   └── README.md                         # Instrucciones breves de la base de datos
├── public/                               # Archivos estáticos y favicons
├── src/                                  # Código fuente de la aplicación
│   ├── components/                       # Componentes modulares de interfaz de usuario
│   │   ├── AdminView.tsx                 # Panel de administración, inventario y métricas
│   │   ├── AuthModal.tsx                 # Modal de autenticación (Login / Registro / Switch demo)
│   │   ├── CartDrawer.tsx                # Carrito deslizable lateral con cálculo y cupones
│   │   ├── CatalogView.tsx               # Catálogo con filtros de categoría, precio, tallas y búsqueda
│   │   ├── CheckoutView.tsx              # Pasarela de pago multicriterio (Tarjeta, PSE, Contra Entrega)
│   │   ├── ContactView.tsx               # Formulario de atención VIP, concierge y FAQ
│   │   ├── FavoritesView.tsx             # Vista de lista de deseos (Wishlist)
│   │   ├── Footer.tsx                    # Pie de página de lujo con enlaces y sellos de seguridad
│   │   ├── HomeView.tsx                  # Portada interactiva, banner de gala y colecciones
│   │   ├── Navbar.tsx                    # Barra superior con buscador en vivo, categorías y accesos
│   │   ├── OrderConfirmationView.tsx     # Recibo y resumen de compra confirmada
│   │   ├── OrderTrackingView.tsx         # Seguimiento de envío con trazabilidad paso a paso
│   │   ├── ProductDetailView.tsx         # Ficha técnica de producto, galería y selector de tallas
│   │   └── ProfileView.tsx               # Perfil de usuario, libreta de direcciones y pedidos
│   ├── data/
│   │   └── initialData.ts                # Semilla de datos iniciales y estado reactivo sincronizado
│   ├── App.tsx                           # Enrutador de vistas y estado centralizado de la app
│   ├── index.css                         # Configuración Tailwind v4, temas y fuentes de lujo
│   ├── main.tsx                          # Punto de montaje principal de React 19
│   └── types.ts                          # Definición de tipos, interfaces y enums de TypeScript
├── index.html                            # Entrada HTML5 con carga de fuentes Cinzel y Montserrat
├── package.json                          # Metadatos, dependencias y scripts de ejecución
├── tsconfig.json                         # Configuración estricta del compilador TypeScript
├── vite.config.ts                        # Configuración del bundler Vite y plugins
└── README.md                             # Manual completo del proyecto (este archivo)
```

---

## 🔧 10. Solución de Problemas Frecuentes (Troubleshooting)

### ❓ Problema 1: El puerto 3000 está ocupado por otro proceso
**Causa**: Otra aplicación (como otro servidor Node.js o Docker) está utilizando el puerto 3000.  
**Solución**:
- En Windows (PowerShell):
  ```powershell
  npx kill-port 3000
  npm run dev
  ```
- O modifica el puerto en `package.json`:
  ```json
  "dev": "vite --port=3001 --host=0.0.0.0"
  ```

---

### ❓ Problema 2: Error `Access denied for user 'root'@'localhost'` en MySQL
**Causa**: Las credenciales de acceso a tu servidor MySQL son diferentes a las predeterminadas sin contraseña.  
**Solución**:
Asegúrate de pasar el parámetro `-p` e introducir la contraseña correcta de tu usuario root de MySQL:
```bash
mysql -u root -p tu_contrasena < database/glamur_elegancia_schema.sql
```

---

### ❓ Problema 3: Error `max_allowed_packet` al importar el archivo SQL
**Causa**: La configuración de tu servidor MySQL tiene un límite bajo para paquetes SQL grandes.  
**Solución**:
Abre tu archivo `my.ini` (en XAMPP: *Config > my.ini*) y ajusta la siguiente directiva:
```ini
max_allowed_packet = 64M
```
Reinicia el servicio MySQL en XAMPP y reintenta la importación.

---

### ❓ Problema 4: Error `Cannot find module` o discrepancias tras clonar
**Causa**: La carpeta `node_modules` no se ha instalado correctamente o la caché de NPM está corrupta.  
**Solución**:
```bash
npm run clean
npm cache clean --force
npm install
npm run dev
```

---

## 🏛️ Licencia y Propiedad Intelectual
Proyecto desarrollado con los más altos estándares para la boutique de lujo **Glamur & Elegancia**.  
Todos los derechos reservados © 2026.

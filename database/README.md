# 🏛️ Base de Datos MySQL — Glamur & Elegancia

Este directorio contiene el script SQL completo para inicializar y desplegar la base de datos relacional para la tienda virtual **"Glamur & Elegancia"**.

---

## 📁 Archivos Disponibles
- **`glamur_elegancia_schema.sql`**: Script DDL y DML completo con creación de base de datos, tablas normalizadas, claves foráneas, índices, restricciones y datos iniciales (*seed data*).

---

## 🗄️ Estructura de Tablas Incluidas

1. **`usuarios`**: Clientes y administradores con roles (`cliente`, `administrador`), estado y datos de contacto.
2. **`direcciones_usuario`**: Libreta de direcciones de envío por usuario con bandera de predeterminada.
3. **`categorias`**: Categorías de la boutique (*Mujer, Hombre, Niños, Zapatos, Accesorios*).
4. **`productos`**: Catálogo con SKU único, precios normales y de oferta, banderas (*novedad, destacado, oferta*), stock y calificaciones.
5. **`producto_imagenes`**: Galería de fotos secundarias de alta resolución por prenda.
6. **`producto_tallas`**: Inventario discriminado por talla (*XS, S, M, L, XL, 36-42, 4-12, Única*).
7. **`resenas`**: Valoraciones y comentarios de 1 a 5 estrellas dejadas por los usuarios.
8. **`cupones`**: Cupones promocionales con descuento porcentual o monto fijo, compra mínima y límites de uso.
9. **`pedidos`**: Órdenes con número de pedido (`GLE-2026-XXXX`), datos de cliente, totales, estado de pago y guía de transporte.
10. **`pedido_detalles`**: Prendas, tallas, cantidades y subtotales por cada orden.
11. **`pedido_historial_estados`**: Trazabilidad del envío en 4 etapas (*Confirmado, En preparación, Enviado, Entregado*).
12. **`favoritos`**: Artículos guardados en la lista de deseos por cada usuario.
13. **`mensajes_contacto`**: Buzón de mensajes y solicitudes VIP recibidas a través del formulario de contacto.

---

## 🚀 Cómo Ejecutar e Importar en MySQL

### Opción 1: Desde la Terminal (Línea de Comandos)
```bash
mysql -u tu_usuario -p < database/glamur_elegancia_schema.sql
```

### Opción 2: Desde phpMyAdmin (XAMPP / WAMP / CPanel)
1. Abre tu navegador e ingresa a `http://localhost/phpmyadmin`.
2. Haz clic en la pestaña **Importar** (en la parte superior).
3. Selecciona el archivo `database/glamur_elegancia_schema.sql`.
4. Haz clic en **Continuar** o **Importar**.

### Opción 3: Desde MySQL Workbench / DBeaver / Navicat
1. Abre tu cliente SQL y conéctate a tu servidor MySQL.
2. Ve a `File` -> `Open SQL Script...` y selecciona `glamur_elegancia_schema.sql`.
3. Haz clic en el botón de ejecutar (icono de rayo ⚡).

---

## 👤 Cuentas de Acceso Incluidas en la Semilla
- **Administrador:**
  - Correo: `admin@glamur.com`
  - Contraseña demo: `admin123`
- **Cliente VIP:**
  - Correo: `cliente@glamur.com`
  - Contraseña demo: `daniela123`

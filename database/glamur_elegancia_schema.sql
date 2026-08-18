-- =====================================================================
-- BASE DE DATOS: GLAMUR & ELEGANCIA (TIENDA VIRTUAL DE ALTA COSTURA)
-- Motor: MySQL 5.7+ / MySQL 8.0+ / MariaDB 10.3+
-- Codificación: UTF-8 (utf8mb4_unicode_ci)
-- =====================================================================

-- 1. CREACIÓN DE LA BASE DE DATOS
DROP DATABASE IF EXISTS `glamur_elegancia_db`;
CREATE DATABASE IF NOT EXISTS `glamur_elegancia_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `glamur_elegancia_db`;

-- Deshabilitar chequeo de claves foráneas temporalmente para creación limpia
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================================
-- 2. TABLAS PRINCIPALES DEL SISTEMA
-- =====================================================================

-- -----------------------------------------------------
-- Tabla: usuarios
-- -----------------------------------------------------
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id` VARCHAR(50) NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `apellido` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `telefono` VARCHAR(30) NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `rol` ENUM('cliente', 'administrador') NOT NULL DEFAULT 'cliente',
  `estado` ENUM('activo', 'inactivo', 'bloqueado') NOT NULL DEFAULT 'activo',
  `avatar_url` VARCHAR(500) NULL,
  `fecha_registro` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_usuarios_email` (`email`),
  INDEX `idx_usuarios_rol` (`rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Tabla: direcciones_usuario
-- -----------------------------------------------------
DROP TABLE IF EXISTS `direcciones_usuario`;
CREATE TABLE `direcciones_usuario` (
  `id` VARCHAR(50) NOT NULL,
  `id_usuario` VARCHAR(50) NOT NULL,
  `titulo` VARCHAR(80) NOT NULL DEFAULT 'Residencia', -- ej: 'Casa', 'Oficina', 'Sede Central'
  `nombre_contacto` VARCHAR(150) NOT NULL,
  `telefono_contacto` VARCHAR(30) NOT NULL,
  `direccion_linea1` VARCHAR(255) NOT NULL,
  `direccion_linea2` VARCHAR(255) NULL,
  `ciudad` VARCHAR(100) NOT NULL,
  `departamento_estado` VARCHAR(100) NOT NULL,
  `codigo_postal` VARCHAR(20) NULL,
  `pais` VARCHAR(100) NOT NULL DEFAULT 'Colombia',
  `es_predeterminada` BOOLEAN NOT NULL DEFAULT FALSE,
  `fecha_creacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_direcciones_usuario` (`id_usuario`),
  CONSTRAINT `fk_direcciones_usuario`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `usuarios` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Tabla: categorias
-- -----------------------------------------------------
DROP TABLE IF EXISTS `categorias`;
CREATE TABLE `categorias` (
  `id` VARCHAR(50) NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(120) NOT NULL UNIQUE,
  `descripcion` TEXT NULL,
  `imagen_url` VARCHAR(500) NULL,
  `icono` VARCHAR(50) NULL,
  `orden` INT NOT NULL DEFAULT 1,
  `activo` BOOLEAN NOT NULL DEFAULT TRUE,
  `fecha_creacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_categorias_slug` (`slug`),
  INDEX `idx_categorias_orden` (`orden`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Tabla: productos
-- -----------------------------------------------------
DROP TABLE IF EXISTS `productos`;
CREATE TABLE `productos` (
  `id` VARCHAR(50) NOT NULL,
  `id_categoria` VARCHAR(50) NOT NULL,
  `sku` VARCHAR(50) NOT NULL UNIQUE,
  `nombre` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(220) NOT NULL UNIQUE,
  `descripcion` TEXT NOT NULL,
  `precio` DECIMAL(12, 2) NOT NULL,
  `precio_oferta` DECIMAL(12, 2) NULL,
  `en_oferta` BOOLEAN NOT NULL DEFAULT FALSE,
  `es_novedad` BOOLEAN NOT NULL DEFAULT FALSE,
  `es_destacado` BOOLEAN NOT NULL DEFAULT FALSE,
  `imagen_principal` VARCHAR(500) NOT NULL,
  `stock_total` INT NOT NULL DEFAULT 0,
  `calificacion_promedio` DECIMAL(3, 2) NOT NULL DEFAULT 5.00,
  `total_resenas` INT NOT NULL DEFAULT 0,
  `activo` BOOLEAN NOT NULL DEFAULT TRUE,
  `fecha_creacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_productos_categoria` (`id_categoria`),
  INDEX `idx_productos_sku` (`sku`),
  INDEX `idx_productos_slug` (`slug`),
  INDEX `idx_productos_destacado` (`es_destacado`),
  INDEX `idx_productos_oferta` (`en_oferta`),
  CONSTRAINT `fk_productos_categoria`
    FOREIGN KEY (`id_categoria`)
    REFERENCES `categorias` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Tabla: producto_imagenes (Galería de imágenes adicionales)
-- -----------------------------------------------------
DROP TABLE IF EXISTS `producto_imagenes`;
CREATE TABLE `producto_imagenes` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `id_producto` VARCHAR(50) NOT NULL,
  `imagen_url` VARCHAR(500) NOT NULL,
  `orden` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  INDEX `idx_imagenes_producto` (`id_producto`),
  CONSTRAINT `fk_imagenes_producto`
    FOREIGN KEY (`id_producto`)
    REFERENCES `productos` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Tabla: producto_tallas (Inventario desglosado por talla)
-- -----------------------------------------------------
DROP TABLE IF EXISTS `producto_tallas`;
CREATE TABLE `producto_tallas` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `id_producto` VARCHAR(50) NOT NULL,
  `talla` VARCHAR(20) NOT NULL, -- 'XS', 'S', 'M', 'L', 'XL', '4', '6', '8', '36', '37', '38', 'Única', etc.
  `stock` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_producto_talla` (`id_producto`, `talla`),
  INDEX `idx_tallas_producto` (`id_producto`),
  CONSTRAINT `fk_tallas_producto`
    FOREIGN KEY (`id_producto`)
    REFERENCES `productos` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Tabla: resenas (Opiniones y valoraciones de clientes)
-- -----------------------------------------------------
DROP TABLE IF EXISTS `resenas`;
CREATE TABLE `resenas` (
  `id` VARCHAR(50) NOT NULL,
  `id_producto` VARCHAR(50) NOT NULL,
  `id_usuario` VARCHAR(50) NOT NULL,
  `nombre_usuario` VARCHAR(150) NOT NULL,
  `calificacion` INT NOT NULL CHECK (`calificacion` BETWEEN 1 AND 5),
  `titulo` VARCHAR(200) NULL,
  `comentario` TEXT NOT NULL,
  `fecha` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_resenas_producto` (`id_producto`),
  INDEX `idx_resenas_usuario` (`id_usuario`),
  CONSTRAINT `fk_resenas_producto`
    FOREIGN KEY (`id_producto`)
    REFERENCES `productos` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_resenas_usuario`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `usuarios` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Tabla: cupones (Códigos promocionales de descuento)
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cupones`;
CREATE TABLE `cupones` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `codigo` VARCHAR(50) NOT NULL UNIQUE,
  `descripcion` VARCHAR(255) NULL,
  `tipo_descuento` ENUM('porcentaje', 'monto_fijo') NOT NULL DEFAULT 'porcentaje',
  `valor_descuento` DECIMAL(10, 2) NOT NULL, -- ej: 10 para 10%, o 20000 para $20.000 COP
  `compra_minima` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `usos_maximos` INT NULL DEFAULT NULL,
  `usos_actuales` INT NOT NULL DEFAULT 0,
  `activo` BOOLEAN NOT NULL DEFAULT TRUE,
  `fecha_expiracion` DATETIME NULL,
  `fecha_creacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_cupones_codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Tabla: pedidos
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pedidos`;
CREATE TABLE `pedidos` (
  `id` VARCHAR(50) NOT NULL,
  `numero_pedido` VARCHAR(50) NOT NULL UNIQUE, -- ej: 'GLE-2026-8941'
  `id_usuario` VARCHAR(50) NULL,
  `nombre_cliente` VARCHAR(150) NOT NULL,
  `email_cliente` VARCHAR(150) NOT NULL,
  `telefono_cliente` VARCHAR(30) NOT NULL,
  
  -- Información de dirección de despacho snapshot
  `direccion_linea1` VARCHAR(255) NOT NULL,
  `direccion_linea2` VARCHAR(255) NULL,
  `ciudad` VARCHAR(100) NOT NULL,
  `departamento_estado` VARCHAR(100) NOT NULL,
  `pais` VARCHAR(100) NOT NULL DEFAULT 'Colombia',
  `codigo_postal` VARCHAR(20) NULL,
  
  -- Valores monetarios
  `subtotal` DECIMAL(12, 2) NOT NULL,
  `costo_envio` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `descuento` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `codigo_descuento` VARCHAR(50) NULL,
  `total` DECIMAL(12, 2) NOT NULL,
  
  -- Métodos de pago y estado
  `metodo_pago` ENUM('tarjeta_credito', 'pse_transferencia', 'contra_entrega', 'efecty_puntos') NOT NULL,
  `referencia_pago` VARCHAR(100) NOT NULL,
  `estado_pago` ENUM('completado', 'pendiente', 'fallido', 'reembolsado') NOT NULL DEFAULT 'completado',
  
  -- Logística y seguimiento
  `estado` ENUM('Pendiente', 'Confirmado', 'En preparación', 'Enviado', 'Entregado', 'Cancelado') NOT NULL DEFAULT 'Pendiente',
  `codigo_rastreo` VARCHAR(100) NOT NULL, -- ej: 'TRACK-GLE-8941-CO'
  `empresa_envio` VARCHAR(100) NOT NULL DEFAULT 'Glamur Express VIP',
  `notas_cliente` TEXT NULL,
  `fecha_pedido` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_entrega_estimada` DATE NOT NULL,
  `fecha_actualizacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_pedidos_numero` (`numero_pedido`),
  INDEX `idx_pedidos_usuario` (`id_usuario`),
  INDEX `idx_pedidos_rastreo` (`codigo_rastreo`),
  INDEX `idx_pedidos_estado` (`estado`),
  INDEX `idx_pedidos_fecha` (`fecha_pedido`),
  CONSTRAINT `fk_pedidos_usuario`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `usuarios` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Tabla: pedido_detalles (Prendas individuales en el pedido)
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pedido_detalles`;
CREATE TABLE `pedido_detalles` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `id_pedido` VARCHAR(50) NOT NULL,
  `id_producto` VARCHAR(50) NOT NULL,
  `nombre_producto` VARCHAR(200) NOT NULL,
  `imagen_producto` VARCHAR(500) NOT NULL,
  `nombre_talla` VARCHAR(20) NOT NULL,
  `cantidad` INT NOT NULL DEFAULT 1,
  `precio_unitario` DECIMAL(12, 2) NOT NULL,
  `subtotal` DECIMAL(12, 2) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_detalles_pedido` (`id_pedido`),
  INDEX `idx_detalles_producto` (`id_producto`),
  CONSTRAINT `fk_detalles_pedido`
    FOREIGN KEY (`id_pedido`)
    REFERENCES `pedidos` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_detalles_producto`
    FOREIGN KEY (`id_producto`)
    REFERENCES `productos` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Tabla: pedido_historial_estados (Línea de tiempo de envíos)
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pedido_historial_estados`;
CREATE TABLE `pedido_historial_estados` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `id_pedido` VARCHAR(50) NOT NULL,
  `estado` ENUM('Pendiente', 'Confirmado', 'En preparación', 'Enviado', 'Entregado', 'Cancelado') NOT NULL,
  `fecha` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `nota` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_historial_pedido` (`id_pedido`),
  CONSTRAINT `fk_historial_pedido`
    FOREIGN KEY (`id_pedido`)
    REFERENCES `pedidos` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Tabla: favoritos (Lista de deseos / Wishlist)
-- -----------------------------------------------------
DROP TABLE IF EXISTS `favoritos`;
CREATE TABLE `favoritos` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `id_usuario` VARCHAR(50) NOT NULL,
  `id_producto` VARCHAR(50) NOT NULL,
  `fecha_agregado` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_usuario_favorito` (`id_usuario`, `id_producto`),
  INDEX `idx_favoritos_usuario` (`id_usuario`),
  INDEX `idx_favoritos_producto` (`id_producto`),
  CONSTRAINT `fk_favoritos_usuario`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `usuarios` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_favoritos_producto`
    FOREIGN KEY (`id_producto`)
    REFERENCES `productos` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Tabla: mensajes_contacto (Buzón Concierge / Asesoría)
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mensajes_contacto`;
CREATE TABLE `mensajes_contacto` (
  `id` VARCHAR(50) NOT NULL,
  `nombre` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `telefono` VARCHAR(30) NULL,
  `asunto` VARCHAR(200) NOT NULL,
  `mensaje` TEXT NOT NULL,
  `leido` BOOLEAN NOT NULL DEFAULT FALSE,
  `respondido` BOOLEAN NOT NULL DEFAULT FALSE,
  `fecha_envio` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_mensajes_leido` (`leido`),
  INDEX `idx_mensajes_fecha` (`fecha_envio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reactivar chequeo de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;


-- =====================================================================
-- 3. INSERCIÓN DE DATOS INICIALES (SEMILLA / SEED DATA)
-- =====================================================================

-- A. CATEGORÍAS
INSERT INTO `categorias` (`id`, `nombre`, `slug`, `descripcion`, `imagen_url`, `icono`, `orden`, `activo`) VALUES
('cat-1', 'Mujer', 'mujer', 'Vestidos de alta costura, blazers estructurados, sastrería y conjuntos de seda pura.', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop', 'Sparkles', 1, 1),
('cat-2', 'Hombre', 'hombre', 'Smokings de gala, camisas oxford slim fit, trajes italianos y chaquetas con apliques dorados.', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop', 'UserCheck', 2, 1),
('cat-3', 'Niños', 'ninos', 'Prendas infantiles refinadas, vestidos de fiesta y conjuntos cómodos con finos detalles de oro.', 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=1000&auto=format&fit=crop', 'Smile', 3, 1),
('cat-4', 'Zapatos', 'zapatos', 'Stilettos en terciopelo y oro, mocasines en piel de ternera lustrada y botas de diseñador.', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop', 'Footprints', 4, 1),
('cat-5', 'Accesorios', 'accesorios', 'Relojes de precisión con baño de oro, bolsos clutch, joyería contemporánea y gafas de sol.', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop', 'Crown', 5, 1);

-- B. PRODUCTOS
INSERT INTO `productos` (`id`, `id_categoria`, `sku`, `nombre`, `slug`, `descripcion`, `precio`, `precio_oferta`, `en_oferta`, `es_novedad`, `es_destacado`, `imagen_principal`, `stock_total`, `calificacion_promedio`, `total_resenas`, `activo`, `fecha_creacion`) VALUES
('prod-1', 'cat-1', 'GLE-DR-001', 'Vestido de Noche Noir & Gold Silhouette', 'vestido-noche-noir-gold', 'Exclusivo vestido largo de corte sirena confeccionado en satén negro con bordados a mano en hilo de oro de 24 quilates. Espalda descubierta con delicada cadena dorada. Perfecto para recepciones, alfombras rojas y ocasiones memorables.', 289000.00, 239000.00, 1, 0, 1, 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop', 35, 4.90, 18, 1, '2026-07-15 10:00:00'),
('prod-2', 'cat-2', 'GLE-SM-002', 'Smoking Ejecutivo Imperial Black Gold', 'smoking-ejecutivo-imperial', 'Traje de gala formal entallado en lana fría italiana súper 150s. Solapa de pico en satén de seda con fino ribete en hilo de oro. Forro de seda con bolsillo especial para reloj de bolsillo.', 420000.00, 360000.00, 1, 1, 1, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop', 20, 5.00, 14, 1, '2026-08-01 11:30:00'),
('prod-3', 'cat-1', 'GLE-BL-003', 'Blazer Sastrería Aura Dorada', 'blazer-sastreria-aura-dorada', 'Blazer estructurado cruzado con botones metálicos dorados grabados con el monograma Glamur. Tejido con caída impecable, hombreras suaves y corte moderno que estiliza el torso.', 195000.00, NULL, 0, 1, 1, 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop', 42, 4.80, 9, 1, '2026-08-05 09:15:00'),
('prod-4', 'cat-5', 'GLE-AC-004', 'Reloj Cronógrafo Royal Gold 42mm', 'reloj-cronografo-royal-gold', 'Reloj de alta precisión en acero inoxidable con baño PVD en oro amarillo de 18k y esfera en negro mate. Cristal de zafiro antirreflejos y correa de piel genuina con pespuntes finos.', 310000.00, 269000.00, 1, 1, 1, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop', 15, 4.90, 22, 1, '2026-07-28 14:00:00'),
('prod-5', 'cat-4', 'GLE-ZP-005', 'Stilettos Velvet Gold Heel 10cm', 'stilettos-velvet-gold-heel', 'Tacones stiletto en terciopelo negro de tacto ultra sedoso con tacón metálico dorado esculpido y plantilla de amortiguación ergonómica.', 215000.00, NULL, 0, 1, 1, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop', 28, 4.70, 11, 1, '2026-08-02 16:45:00'),
('prod-6', 'cat-4', 'GLE-ZP-006', 'Mocasines Italianos Leather Gold Buckle', 'mocasines-italianos-gold-buckle', 'Mocasines masculinos en cuero suave de ternera lustrado en negro profundo con hebilla ecuestre dorada. Suela reforzada cosida a mano para máxima durabilidad.', 240000.00, 199000.00, 1, 0, 0, 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1000&auto=format&fit=crop', 22, 4.80, 7, 1, '2026-07-20 12:00:00'),
('prod-7', 'cat-3', 'GLE-NI-007', 'Conjunto Gala Petit Prince', 'conjunto-gala-petit-prince', 'Conjunto infantil de vestir de tres piezas: pantalón de corte recto, camisa de algodón egipcio y chaleco negro con botones dorados. Suave al tacto y flexible para los pequeños.', 145000.00, NULL, 0, 1, 0, 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=1000&auto=format&fit=crop', 30, 5.00, 6, 1, '2026-08-08 08:30:00'),
('prod-8', 'cat-3', 'GLE-NI-008', 'Vestido Niña Petite Étoile Dorée', 'vestido-nina-petite-etoile', 'Delicado vestido de tul negro con forro 100% algodón hipoalergénico, salpicado con destellos dorados y cinta de raso en la cintura.', 135000.00, 115000.00, 1, 0, 0, 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=1000&auto=format&fit=crop', 25, 4.90, 8, 1, '2026-07-22 15:20:00'),
('prod-9', 'cat-5', 'GLE-AC-009', 'Bolso Clutch Gala Night Chain', 'bolso-clutch-gala-night', 'Bolso de mano rígido en acabado mate negro con cierre geométrico dorado y cadena desmontable para llevar al hombro.', 165000.00, NULL, 0, 1, 1, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop', 18, 4.80, 12, 1, '2026-08-04 10:40:00'),
('prod-10', 'cat-2', 'GLE-HM-010', 'Camisa Oxford Slim Black Gold Stitch', 'camisa-oxford-black-gold', 'Camisa formal de corte entallado en algodón peinado de alta densidad. Costuras reforzadas con hilo dorado tenue y botones oscuros perlados.', 130000.00, 105000.00, 1, 1, 0, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000&auto=format&fit=crop', 50, 4.60, 15, 1, '2026-08-07 13:00:00'),
('prod-11', 'cat-1', 'GLE-MJ-011', 'Jumpsuit Palazzo Oro Líquido', 'jumpsuit-palazzo-oro-liquido', 'Enterizo palazzo con escote cruzado en V, cinturón metálico dorado ajustable y caída fluida. Elegancia moderna y sofisticación pura.', 220000.00, 185000.00, 1, 1, 1, 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop', 32, 4.90, 10, 1, '2026-08-09 17:10:00'),
('prod-12', 'cat-5', 'GLE-AC-012', 'Gafas de Sol Aviator Gold Edition', 'gafas-aviator-gold-edition', 'Montura ligera en aleación dorada pulida a espejo con lentes oscuros polarizados y protección UV400 completa. Incluye estuche rígido forrado en terciopelo.', 98000.00, 79000.00, 1, 0, 0, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop', 40, 4.70, 16, 1, '2026-07-10 11:00:00');

-- C. IMÁGENES SECUNDARIAS
INSERT INTO `producto_imagenes` (`id_producto`, `imagen_url`, `orden`) VALUES
('prod-1', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop', 1),
('prod-1', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1000&auto=format&fit=crop', 2),
('prod-2', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop', 1),
('prod-3', 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1000&auto=format&fit=crop', 1),
('prod-4', 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop', 1),
('prod-5', 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=1000&auto=format&fit=crop', 1),
('prod-6', 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=1000&auto=format&fit=crop', 1);

-- D. TALLAS Y STOCK
INSERT INTO `producto_tallas` (`id_producto`, `talla`, `stock`) VALUES
('prod-1', 'XS', 6),
('prod-1', 'S', 12),
('prod-1', 'M', 10),
('prod-1', 'L', 5),
('prod-1', 'XL', 2),
('prod-2', 'S', 4),
('prod-2', 'M', 8),
('prod-2', 'L', 6),
('prod-2', 'XL', 2),
('prod-3', 'XS', 8),
('prod-3', 'S', 14),
('prod-3', 'M', 12),
('prod-3', 'L', 6),
('prod-3', 'XL', 2),
('prod-4', 'Única', 15),
('prod-5', '36', 5),
('prod-5', '37', 8),
('prod-5', '38', 9),
('prod-5', '39', 4),
('prod-5', '40', 2),
('prod-6', '39', 5),
('prod-6', '40', 8),
('prod-6', '41', 6),
('prod-6', '42', 3),
('prod-7', '4', 6),
('prod-7', '6', 8),
('prod-7', '8', 8),
('prod-7', '10', 5),
('prod-7', '12', 3),
('prod-8', '4', 7),
('prod-8', '6', 9),
('prod-8', '8', 6),
('prod-8', '10', 3),
('prod-9', 'Única', 18),
('prod-10', 'S', 10),
('prod-10', 'M', 20),
('prod-10', 'L', 15),
('prod-10', 'XL', 5),
('prod-11', 'XS', 6),
('prod-11', 'S', 12),
('prod-11', 'M', 10),
('prod-11', 'L', 4),
('prod-12', 'Única', 40);

-- E. USUARIOS (Password 'admin123' y 'daniela123' encriptados en bcrypt para demo)
INSERT INTO `usuarios` (`id`, `nombre`, `apellido`, `email`, `telefono`, `password_hash`, `rol`, `estado`, `fecha_registro`) VALUES
('usr-1', 'Karen', 'Administradora', 'admin@glamur.com', '+57 300 987 6543', '$2a$12$e9iX/zCgXgYQ.Q/hP7n7.OKqB1qPj01fO6T.Zk5pGq2D2tS1qU.K2', 'administrador', 'activo', '2026-01-10 08:00:00'),
('usr-2', 'Daniela', 'Ávila', 'cliente@glamur.com', '+57 310 123 4567', '$2a$12$K1rZ4Xv3mJqQ2yE8rP0oOuWzUeM4Q8v5J8sE3dK7gH1mQ5aC8xR3y', 'cliente', 'activo', '2026-03-12 14:20:00'),
('usr-3', 'Santiago', 'Mendoza', 'santiago.m@example.com', '+57 315 789 0123', '$2a$12$P2kZ5Yw4nKrR3zF9sQ1pPvXzVfN5R9w6K9tF4eL8hI2nR6bD9yS4z', 'cliente', 'activo', '2026-05-20 18:30:00');

-- F. DIRECCIONES DE USUARIO
INSERT INTO `direcciones_usuario` (`id`, `id_usuario`, `titulo`, `nombre_contacto`, `telefono_contacto`, `direccion_linea1`, `direccion_linea2`, `ciudad`, `departamento_estado`, `codigo_postal`, `pais`, `es_predeterminada`) VALUES
('dir-admin-1', 'usr-1', 'Sede Central Glamur', 'Karen Administradora', '+57 300 987 6543', 'Carrera 11 # 84 - 09, Piso 8', 'Zona Rosa', 'Bogotá', 'Cundinamarca', '110221', 'Colombia', 1),
('dir-1', 'usr-2', 'Residencia Principal', 'Daniela Ávila', '+57 310 123 4567', 'Carrera 15 # 93 - 40, Apto 802', 'Torre Dorada', 'Bogotá', 'Cundinamarca', '110221', 'Colombia', 1),
('dir-2', 'usr-2', 'Oficina Ejecutiva', 'Daniela Ávila', '+57 310 123 4567', 'Calle 72 # 10 - 34, Piso 12', 'Edificio Financiero', 'Bogotá', 'Cundinamarca', '110231', 'Colombia', 0),
('dir-3', 'usr-3', 'Casa Campestre', 'Santiago Mendoza', '+57 315 789 0123', 'Avenida Las Palmas Km 7', 'Condominio El Dorado', 'Medellín', 'Antioquia', '050021', 'Colombia', 1);

-- G. CUPONES DE DESCUENTO
INSERT INTO `cupones` (`codigo`, `descripcion`, `tipo_descuento`, `valor_descuento`, `compra_minima`, `usos_maximos`, `usos_actuales`, `activo`, `fecha_expiracion`) VALUES
('GLAMURVIP', 'Bono de bienvenida exclusivo VIP 20% OFF', 'porcentaje', 20.00, 100000.00, 500, 12, 1, '2026-12-31 23:59:59'),
('ORO2026', 'Descuento especial de temporada de gala 15% OFF', 'porcentaje', 15.00, 150000.00, 300, 45, 1, '2026-12-31 23:59:59'),
('ELEGANCIA10', '10% de descuento en cualquier compra', 'porcentaje', 10.00, 0.00, 1000, 89, 1, '2026-12-31 23:59:59'),
('BIENVENIDA', '10% en tu primera orden', 'porcentaje', 10.00, 50000.00, NULL, 150, 1, NULL);

-- H. PEDIDOS
INSERT INTO `pedidos` (`id`, `numero_pedido`, `id_usuario`, `nombre_cliente`, `email_cliente`, `telefono_cliente`, `direccion_linea1`, `direccion_linea2`, `ciudad`, `departamento_estado`, `pais`, `subtotal`, `costo_envio`, `descuento`, `codigo_descuento`, `total`, `metodo_pago`, `referencia_pago`, `estado_pago`, `estado`, `codigo_rastreo`, `empresa_envio`, `notas_cliente`, `fecha_pedido`, `fecha_entrega_estimada`) VALUES
('ord-1', 'GLE-2026-8941', 'usr-2', 'Daniela Ávila', 'cliente@glamur.com', '+57 310 123 4567', 'Carrera 15 # 93 - 40, Apto 802', 'Torre Dorada', 'Bogotá', 'Cundinamarca', 'Colombia', 239000.00, 0.00, 20000.00, 'GLAMURVIP', 219000.00, 'tarjeta_credito', 'TXN-VISA-98214-DEMO', 'completado', 'En preparación', 'TRACK-GLE-8941-CO', 'Glamur Express VIP', 'Favor entregar en portería con clave de seguridad.', '2026-08-17 14:30:00', '2026-08-20'),
('ord-2', 'GLE-2026-8120', 'usr-2', 'Daniela Ávila', 'cliente@glamur.com', '+57 310 123 4567', 'Carrera 15 # 93 - 40, Apto 802', 'Torre Dorada', 'Bogotá', 'Cundinamarca', 'Colombia', 348000.00, 0.00, 0.00, NULL, 348000.00, 'pse_transferencia', 'TXN-PSE-64821-DEMO', 'completado', 'Entregado', 'TRACK-GLE-8120-CO', 'Glamur Express VIP', NULL, '2026-08-08 10:15:00', '2026-08-11');

-- I. DETALLES DE PEDIDO
INSERT INTO `pedido_detalles` (`id_pedido`, `id_producto`, `nombre_producto`, `imagen_producto`, `nombre_talla`, `cantidad`, `precio_unitario`, `subtotal`) VALUES
('ord-1', 'prod-1', 'Vestido de Noche Noir & Gold Silhouette', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop', 'M', 1, 239000.00, 239000.00),
('ord-2', 'prod-4', 'Reloj Cronógrafo Royal Gold 42mm', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop', 'Única', 1, 269000.00, 269000.00),
('ord-2', 'prod-12', 'Gafas de Sol Aviator Gold Edition', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop', 'Única', 1, 79000.00, 79000.00);

-- J. HISTORIAL DE ESTADOS DE PEDIDO
INSERT INTO `pedido_historial_estados` (`id_pedido`, `estado`, `fecha`, `nota`) VALUES
('ord-1', 'Pendiente', '2026-08-17 14:30:00', 'Pedido recibido correctamente'),
('ord-1', 'Confirmado', '2026-08-17 14:35:00', 'Pago verificado exitosamente'),
('ord-1', 'En preparación', '2026-08-18 09:00:00', 'Prenda empacada en estuche de lujo con sello dorado'),
('ord-2', 'Pendiente', '2026-08-08 10:15:00', 'Pedido registrado'),
('ord-2', 'Confirmado', '2026-08-08 10:20:00', 'Transferencia PSE aprobada'),
('ord-2', 'En preparación', '2026-08-08 15:00:00', 'Empaque de accesorios completado'),
('ord-2', 'Enviado', '2026-08-09 08:30:00', 'En ruta con mensajería privada'),
('ord-2', 'Entregado', '2026-08-10 16:45:00', 'Entregado y recibido a conformidad');

-- K. RESEÑAS
INSERT INTO `resenas` (`id`, `id_producto`, `id_usuario`, `nombre_usuario`, `calificacion`, `titulo`, `comentario`, `fecha`) VALUES
('rev-1', 'prod-1', 'usr-2', 'Daniela Ávila', 5, 'Impresionante calidad y caída', 'El vestido superó todas mis expectativas. Los detalles en dorado son finísimos y la tela tiene un peso perfecto. La talla M me quedó a la medida exacta.', '2026-08-12 11:00:00'),
('rev-2', 'prod-2', 'usr-3', 'Santiago Mendoza', 5, 'Elegancia de otro nivel', 'Lo usé para mi graduación de posgrado y recibí halagos toda la noche. El corte es estilizado y el forro dorado interior luce espectacular.', '2026-08-05 16:20:00'),
('rev-3', 'prod-4', 'usr-2', 'Daniela Ávila', 5, 'Hermoso acabado en oro', 'El reloj tiene una presencia imponente. El contraste entre el negro mate y el bisel dorado es idéntico a las fotos.', '2026-08-11 19:45:00');

-- L. MENSAJES DE CONTACTO
INSERT INTO `mensajes_contacto` (`id`, `nombre`, `email`, `telefono`, `asunto`, `mensaje`, `leido`, `respondido`, `fecha_envio`) VALUES
('msg-1', 'Valentina Gómez', 'valentina@empresa.com', '+57 312 445 6677', 'Consulta para confección corporativa', 'Hola, nos encantó su catálogo de trajes. Quisiéramos cotizar 15 smokings con apliques dorados para nuestro evento de gala anual en noviembre.', 1, 1, '2026-08-15 11:20:00'),
('msg-2', 'Andrés Castro', 'andres.c@gmail.com', '+57 320 889 1122', 'Disponibilidad de talla en Blazer Aura Dorada', 'Buenas tardes, ¿volverán a tener stock de la talla XL del Blazer Aura Dorada? Quisiera comprar dos unidades.', 0, 0, '2026-08-17 18:40:00');

-- M. FAVORITOS DE EJEMPLO
INSERT INTO `favoritos` (`id_usuario`, `id_producto`, `fecha_agregado`) VALUES
('usr-2', 'prod-1', '2026-08-15 10:00:00'),
('usr-2', 'prod-4', '2026-08-16 11:30:00'),
('usr-2', 'prod-9', '2026-08-17 09:15:00');


-- =====================================================================
-- 4. VISTAS SQL ÚTILES (CONSULTAS FRECUENTES)
-- =====================================================================

-- Vista: Resumen completo de pedidos con datos de cliente y totales
CREATE OR REPLACE VIEW `vista_resumen_pedidos` AS
SELECT 
  p.id AS id_pedido,
  p.numero_pedido,
  p.fecha_pedido,
  p.nombre_cliente,
  p.email_cliente,
  p.telefono_cliente,
  p.ciudad,
  p.departamento_estado,
  p.total,
  p.metodo_pago,
  p.estado_pago,
  p.estado AS estado_logistica,
  p.codigo_rastreo,
  COUNT(pd.id) AS total_items_diferentes,
  COALESCE(SUM(pd.cantidad), 0) AS total_unidades
FROM `pedidos` p
LEFT JOIN `pedido_detalles` pd ON p.id = pd.id_pedido
GROUP BY p.id;

-- Vista: Catálogo de productos con categoría y stock disponible
CREATE OR REPLACE VIEW `vista_catalogo_activo` AS
SELECT 
  pr.id AS id_producto,
  pr.sku,
  pr.nombre AS producto,
  pr.slug,
  cat.nombre AS categoria,
  pr.precio,
  pr.precio_oferta,
  CASE WHEN pr.en_oferta = 1 THEN pr.precio_oferta ELSE pr.precio END AS precio_final,
  pr.en_oferta,
  pr.es_novedad,
  pr.es_destacado,
  pr.stock_total,
  pr.calificacion_promedio,
  pr.total_resenas,
  pr.imagen_principal
FROM `productos` pr
INNER JOIN `categorias` cat ON pr.id_categoria = cat.id
WHERE pr.activo = 1;

-- =====================================================================
-- FIN DEL SCRIPT SQL - GLAMUR & ELEGANCIA
-- =====================================================================

-- ==========================================================
-- BASE DE DATOS: GLAMUR Y ELEGANCIA
-- Tienda Virtual de Moda Exclusiva y Elegante
-- Paleta Oficial: NEGRO (#0B0B0B, #121212) y DORADO (#D4AF37, #F5D77F)
-- ==========================================================

CREATE DATABASE IF NOT EXISTS glamur_elegancia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE glamur_elegancia;

-- Deshabilitar chequeo de claves foráneas para recreación segura
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS contactos;
DROP TABLE IF EXISTS resenas;
DROP TABLE IF EXISTS favoritos;
DROP TABLE IF EXISTS pagos;
DROP TABLE IF EXISTS detalle_pedido;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS detalle_carrito;
DROP TABLE IF EXISTS carritos;
DROP TABLE IF EXISTS producto_tallas;
DROP TABLE IF EXISTS tallas;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS direcciones;
DROP TABLE IF EXISTS administradores;
DROP TABLE IF EXISTS usuarios;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. TABLA: USUARIOS
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefono VARCHAR(30) NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('cliente', 'administrador') DEFAULT 'cliente' NOT NULL,
    estado ENUM('activo', 'inactivo', 'bloqueado') DEFAULT 'activo' NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso DATETIME NULL
) ENGINE=InnoDB;

-- 2. TABLA: ADMINISTRADORES (Detalle de permisos y nivel de acceso)
CREATE TABLE administradores (
    id_admin INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE,
    cargo VARCHAR(100) DEFAULT 'Administrador General',
    nivel_acceso INT DEFAULT 1,
    fecha_asignacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. TABLA: DIRECCIONES (Gestión de direcciones de envío del usuario)
CREATE TABLE direcciones (
    id_direccion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    titulo VARCHAR(50) DEFAULT 'Principal', -- Ej: Casa, Trabajo, Oficina
    nombre_contacto VARCHAR(150) NOT NULL,
    telefono_contacto VARCHAR(30) NOT NULL,
    direccion_linea1 VARCHAR(255) NOT NULL,
    direccion_linea2 VARCHAR(255) NULL,
    ciudad VARCHAR(100) NOT NULL,
    departamento_estado VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(20) NULL,
    pais VARCHAR(100) DEFAULT 'Colombia' NOT NULL,
    es_predeterminada BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. TABLA: CATEGORIAS
CREATE TABLE categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE,
    descripcion TEXT NULL,
    imagen_url VARCHAR(500) NULL,
    icono VARCHAR(50) NULL,
    orden INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB;

-- 5. TABLA: PRODUCTOS
CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    slug VARCHAR(250) NOT NULL UNIQUE,
    descripcion TEXT NOT NULL,
    precio DECIMAL(12, 2) NOT NULL,
    precio_oferta DECIMAL(12, 2) NULL,
    en_oferta BOOLEAN DEFAULT FALSE,
    es_novedad BOOLEAN DEFAULT FALSE,
    es_destacado BOOLEAN DEFAULT FALSE,
    imagen_principal VARCHAR(500) NOT NULL,
    imagenes_secundarias JSON NULL, -- Galería de URLs
    sku VARCHAR(60) UNIQUE,
    stock_total INT DEFAULT 0 NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 6. TABLA: TALLAS (Letras y Numéricas)
CREATE TABLE tallas (
    id_talla INT AUTO_INCREMENT PRIMARY KEY,
    nombre_talla VARCHAR(20) NOT NULL UNIQUE, -- XS, S, M, L, XL, 4, 6, 8, 10, 12, etc.
    tipo ENUM('letra', 'numero', 'calzado', 'general') DEFAULT 'letra' NOT NULL,
    orden INT DEFAULT 0
) ENGINE=InnoDB;

-- 7. TABLA INTERMEDIA: PRODUCTO_TALLAS (Stock específico por talla)
CREATE TABLE producto_tallas (
    id_producto_talla INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    id_talla INT NOT NULL,
    stock INT DEFAULT 0 NOT NULL,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE,
    FOREIGN KEY (id_talla) REFERENCES tallas(id_talla) ON DELETE RESTRICT,
    UNIQUE KEY unique_prod_talla (id_producto, id_talla)
) ENGINE=InnoDB;

-- 8. TABLA: CARRITOS
CREATE TABLE carritos (
    id_carrito INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NULL UNIQUE,
    session_token VARCHAR(255) NULL,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. TABLA: DETALLE_CARRITO
CREATE TABLE detalle_carrito (
    id_detalle_carrito INT AUTO_INCREMENT PRIMARY KEY,
    id_carrito INT NOT NULL,
    id_producto INT NOT NULL,
    id_talla INT NOT NULL,
    cantidad INT DEFAULT 1 NOT NULL,
    precio_unitario DECIMAL(12, 2) NOT NULL,
    FOREIGN KEY (id_carrito) REFERENCES carritos(id_carrito) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE,
    FOREIGN KEY (id_talla) REFERENCES tallas(id_talla) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 10. TABLA: PEDIDOS
CREATE TABLE pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    numero_pedido VARCHAR(50) NOT NULL UNIQUE, -- Ej: GLE-2026-8941
    id_usuario INT NOT NULL,
    id_direccion INT NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    costo_envio DECIMAL(12, 2) DEFAULT 0.00 NOT NULL,
    descuento DECIMAL(12, 2) DEFAULT 0.00 NOT NULL,
    total DECIMAL(12, 2) NOT NULL,
    estado ENUM('Pendiente', 'Confirmado', 'En preparación', 'Enviado', 'Entregado', 'Cancelado') DEFAULT 'Pendiente' NOT NULL,
    codigo_rastreo VARCHAR(100) NULL,
    empresa_envio VARCHAR(100) DEFAULT 'Glamur Express VIP',
    notas_cliente TEXT NULL,
    fecha_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_entrega_estimada DATE NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT,
    FOREIGN KEY (id_direccion) REFERENCES direcciones(id_direccion) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 11. TABLA: DETALLE_PEDIDO
CREATE TABLE detalle_pedido (
    id_detalle_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL,
    nombre_producto VARCHAR(200) NOT NULL,
    nombre_talla VARCHAR(20) NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(12, 2) NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 12. TABLA: PAGOS
CREATE TABLE pagos (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL UNIQUE,
    metodo_pago ENUM('tarjeta_credito', 'pse_transferencia', 'contra_entrega', 'efecty_puntos') NOT NULL,
    estado_pago ENUM('completado', 'pendiente', 'fallido', 'reembolsado') DEFAULT 'completado' NOT NULL,
    referencia_transaccion VARCHAR(100) NOT NULL,
    monto DECIMAL(12, 2) NOT NULL,
    fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 13. TABLA: FAVORITOS
CREATE TABLE favoritos (
    id_favorito INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_producto INT NOT NULL,
    fecha_agregado DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE,
    UNIQUE KEY unique_user_prod_fav (id_usuario, id_producto)
) ENGINE=InnoDB;

-- 14. TABLA: RESEÑAS
CREATE TABLE resenas (
    id_resena INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    id_usuario INT NOT NULL,
    calificacion INT NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
    titulo VARCHAR(150) NULL,
    comentario TEXT NOT NULL,
    fecha_resena DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 15. TABLA: CONTACTOS (Mensajes enviados desde el formulario)
CREATE TABLE contactos (
    id_contacto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefono VARCHAR(30) NULL,
    asunto VARCHAR(150) NOT NULL,
    mensaje TEXT NOT NULL,
    leido BOOLEAN DEFAULT FALSE,
    respondido BOOLEAN DEFAULT FALSE,
    fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ==========================================================
-- DATOS INICIALES (SEED DATA)
-- ==========================================================

-- 1. Insertar Tallas (Letras y Números solicitados)
INSERT INTO tallas (nombre_talla, tipo, orden) VALUES
('XS', 'letra', 1),
('S', 'letra', 2),
('M', 'letra', 3),
('L', 'letra', 4),
('XL', 'letra', 5),
('4', 'numero', 6),
('6', 'numero', 7),
('8', 'numero', 8),
('10', 'numero', 9),
('12', 'numero', 10),
('36', 'calzado', 11),
('37', 'calzado', 12),
('38', 'calzado', 13),
('39', 'calzado', 14),
('40', 'calzado', 15),
('41', 'calzado', 16),
('42', 'calzado', 17),
('Única', 'general', 18);

-- 2. Insertar Categorías
INSERT INTO categorias (nombre, slug, descripcion, imagen_url, icono, orden, activo) VALUES
('Mujer', 'mujer', 'Vestidos de gala, blusas de seda, sastrería y conjuntos de alta costura.', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop', 'Sparkles', 1, TRUE),
('Hombre', 'hombre', 'Trajes ejecutivos, camisería italiana, chaquetas de cuero y porte elegante.', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop', 'UserCheck', 2, TRUE),
('Niños', 'ninos', 'Moda infantil sofisticada, conjuntos para ocasiones especiales y confort de lujo.', 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=1000&auto=format&fit=crop', 'Smile', 3, TRUE),
('Zapatos', 'zapatos', 'Calzado en cuero genuino, tacones dorados, botines y mocasines de diseñador.', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop', 'Footprints', 4, TRUE),
('Accesorios', 'accesorios', 'Relojes de oro, joyería fina, bolsos de noche, cinturones y gafas de sol.', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop', 'Crown', 5, TRUE);

-- 3. Insertar Usuarios Semilla (Admin y Cliente)
-- Las contraseñas en PHP se verifican con password_verify(), ej: hash de admin123 y cliente123
INSERT INTO usuarios (nombre, apellido, email, telefono, password_hash, rol, estado) VALUES
('Karen', 'Administradora', 'admin@glamur.com', '+57 300 987 6543', '$2y$10$e8wFvQYdG0p.2LqgQG7wK.pZb6zKx7qB8fQG7wK.pZb6zKx7qB8fQ', 'administrador', 'activo'),
('Daniela', 'Ávila', 'cliente@glamur.com', '+57 310 123 4567', '$2y$10$e8wFvQYdG0p.2LqgQG7wK.pZb6zKx7qB8fQG7wK.pZb6zKx7qB8fQ', 'cliente', 'activo'),
('Santiago', 'Mendoza', 'santiago.m@example.com', '+57 315 789 0123', '$2y$10$e8wFvQYdG0p.2LqgQG7wK.pZb6zKx7qB8fQG7wK.pZb6zKx7qB8fQ', 'cliente', 'activo');

-- Asignar rol admin en tabla administradores
INSERT INTO administradores (id_usuario, cargo, nivel_acceso) VALUES
(1, 'Directora Ejecutiva & Admin General', 1);

-- 4. Insertar Direcciones de prueba
INSERT INTO direcciones (id_usuario, titulo, nombre_contacto, telefono_contacto, direccion_linea1, direccion_linea2, ciudad, departamento_estado, codigo_postal, pais, es_predeterminada) VALUES
(2, 'Residencia Principal', 'Daniela Ávila', '+57 310 123 4567', 'Carrera 15 # 93 - 40, Apto 802', 'Torre Dorada', 'Bogotá', 'Cundinamarca', '110221', 'Colombia', TRUE),
(2, 'Oficina Empresarial', 'Daniela Ávila', '+57 310 123 4567', 'Calle 72 # 10 - 34, Piso 12', 'Edificio Financiero', 'Bogotá', 'Cundinamarca', '110231', 'Colombia', FALSE),
(3, 'Casa Campestre', 'Santiago Mendoza', '+57 315 789 0123', 'Avenida Las Palmas Km 7', 'Condominio El Dorado', 'Medellín', 'Antioquia', '050021', 'Colombia', TRUE);

-- 5. Insertar Productos de Lujo
INSERT INTO productos (id_categoria, nombre, slug, descripcion, precio, precio_oferta, en_oferta, es_novedad, es_destacado, imagen_principal, imagenes_secundarias, sku, stock_total) VALUES
(1, 'Vestido de Noche Noir & Gold Silhouette', 'vestido-noche-noir-gold', 'Exclusivo vestido largo de corte sirena en satén negro con bordados a mano en hilo de oro de 24k. Espalda descubierta con detalle de cadena dorada. Perfecto para eventos de gala, recepciones y ocasiones de máxima elegancia.', 289000.00, 239000.00, TRUE, FALSE, TRUE, 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop", "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1000&auto=format&fit=crop"]', 'GLE-DR-001', 35),
(2, 'Smoking Ejecutivo Imperial Black Gold', 'smoking-ejecutivo-imperial', 'Traje formal entallado confeccionado en lana fría italiana súper 150s. Solapa de pico en seda negra con fino ribete en hilo de oro. Forro interior de seda dorada con bolsillo secreto para reloj de bolsillo.', 420000.00, 360000.00, TRUE, TRUE, TRUE, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop"]', 'GLE-SM-002', 20),
(1, 'Blazer Sastrería Aura Dorada', 'blazer-sastreria-aura-dorada', 'Blazer estructurado cruzado con botones metálicos dorados grabados con el monograma Glamur. Tejido con caída impecable y forro suave para máxima comodidad y presencia ejecutiva.', 195000.00, NULL, FALSE, TRUE, TRUE, 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1000&auto=format&fit=crop"]', 'GLE-BL-003', 42),
(5, 'Reloj Cronógrafo Royal Gold 42mm', 'reloj-cronografo-royal-gold', 'Reloj de precisión en acero inoxidable con baño de oro amarillo PVD y esfera en negro mate. Cristal de zafiro antirreflejos y correa de piel genuina negra con hebilla dorada.', 310000.00, 269000.00, TRUE, TRUE, TRUE, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop"]', 'GLE-AC-004', 15),
(4, 'Stilettos Velvet Gold Heel 10cm', 'stilettos-velvet-gold-heel', 'Tacones stiletto en terciopelo negro de alta densidad con tacón bañado en oro y plantilla de amortiguación ergonómica. Diseñados para estilizar la figura sin perder el confort.', 215000.00, NULL, FALSE, TRUE, TRUE, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=1000&auto=format&fit=crop"]', 'GLE-ZP-005', 28),
(4, 'Mocasines Italianos Leather Gold Buckle', 'mocasines-italianos-gold-buckle', 'Mocasines masculinos en cuero suave de ternera lustrado en negro profundo con hebilla ecuestre dorada. Suela cosida a mano con refuerzo antideslizante.', 240000.00, 199000.00, TRUE, FALSE, FALSE, 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=1000&auto=format&fit=crop"]', 'GLE-ZP-006', 22),
(3, 'Conjunto Gala Petit Prince', 'conjunto-gala-petit-prince', 'Conjunto infantil de vestir de tres piezas: pantalón de corte recto, camisa de algodón egipcio y chaleco negro con botones dorados. Suave al tacto y flexible.', 145000.00, NULL, FALSE, TRUE, FALSE, 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=1000&auto=format&fit=crop', '[]', 'GLE-NI-007', 30),
(3, 'Vestido Niña Petite Étoile Dorée', 'vestido-nina-petite-etoile', 'Delicado vestido de tul con forro 100% algodón hipoalergénico, salpicado con destellos dorados y cinta de raso en la cintura.', 135000.00, 115000.00, TRUE, FALSE, FALSE, 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=1000&auto=format&fit=crop', '[]', 'GLE-NI-008', 25),
(5, 'Bolso Clutch Gala Night Chain', 'bolso-clutch-gala-night', 'Bolso de mano rígido en acabado mate negro con cierre geométrico dorado y cadena desmontable para llevar al hombro.', 165000.00, NULL, FALSE, TRUE, TRUE, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop', '[]', 'GLE-AC-009', 18),
(2, 'Camisa Oxford Slim Black Gold Stitch', 'camisa-oxford-black-gold', 'Camisa formal masculina en algodón de alta densidad negro profundo con costuras reforzadas en hilo dorado tenue y botones nácar oscuros.', 130000.00, 105000.00, TRUE, TRUE, FALSE, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000&auto=format&fit=crop', '[]', 'GLE-HM-010', 50),
(1, 'Jumpsuit Palazzo Oro Líquido', 'jumpsuit-palazzo-oro-liquido', 'Enterizo palazzo con escote cruzado en V, cinturón metálico dorado ajustable y caída fluida. Elegancia moderna y sofisticación pura.', 220000.00, 185000.00, TRUE, TRUE, TRUE, 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop', '[]', 'GLE-MJ-011', 32),
(5, 'Gafas de Sol Aviator Gold Edition', 'gafas-aviator-gold-edition', 'Montura ligera en aleación dorada con lentes oscuros polarizados y protección UV400 completa. Incluye estuche de cuero negro.', 98000.00, 79000.00, TRUE, FALSE, FALSE, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop', '[]', 'GLE-AC-012', 40);

-- 6. Insertar Stock por Tallas (Mapeo detallado)
-- Vestido Noir (XS, S, M, L)
INSERT INTO producto_tallas (id_producto, id_talla, stock) VALUES
(1, 1, 8), (1, 2, 12), (1, 3, 10), (1, 4, 5),
-- Smoking Imperial (S, M, L, XL)
(2, 2, 4), (2, 3, 8), (2, 4, 6), (2, 5, 2),
-- Blazer Aura Dorada (XS, S, M, L, XL)
(3, 1, 6), (3, 2, 12), (3, 3, 14), (3, 4, 8), (3, 5, 2),
-- Reloj Royal Gold (Talla Única)
(4, 18, 15),
-- Stilettos (36, 37, 38, 39, 40)
(5, 11, 4), (5, 12, 8), (5, 13, 10), (5, 14, 4), (5, 15, 2),
-- Mocasines (39, 40, 41, 42)
(6, 14, 5), (6, 15, 8), (6, 16, 6), (6, 17, 3),
-- Conjunto Petit Prince (4, 6, 8, 10, 12)
(7, 6, 6), (7, 7, 8), (7, 8, 8), (7, 9, 5), (7, 10, 3),
-- Vestido Niña Petite (4, 6, 8, 10)
(8, 6, 7), (8, 7, 9), (8, 8, 6), (8, 9, 3),
-- Bolso Clutch (Única)
(9, 18, 18),
-- Camisa Oxford (S, M, L, XL)
(10, 2, 10), (10, 3, 20), (10, 4, 15), (10, 5, 5),
-- Jumpsuit Palazzo (XS, S, M, L)
(11, 1, 6), (11, 2, 12), (11, 3, 10), (11, 4, 4),
-- Gafas Aviator (Única)
(12, 18, 40);

-- 7. Insertar Reseñas de clientes
INSERT INTO resenas (id_producto, id_usuario, calificacion, titulo, comentario) VALUES
(1, 2, 5, 'Impresionante calidad y caída', 'El vestido superó todas mis expectativas. Los detalles en dorado son finísimos y la tela tiene un peso perfecto.'),
(2, 3, 5, 'Elegancia de otro nivel', 'Lo usé para mi graduación de posgrado y recibí halagos toda la noche. Ajuste impecable.'),
(4, 2, 5, 'Hermoso acabado en oro', 'El reloj tiene una presencia imponente. El contraste entre el negro y el dorado es idéntico a las fotos.'),
(5, 3, 4, 'Muy cómodos y elegantes', 'A pesar del tacón alto, la almohadilla interior hace que se sientan muy estables.');

-- 8. Insertar Pedidos Semilla
INSERT INTO pedidos (numero_pedido, id_usuario, id_direccion, subtotal, costo_envio, descuento, total, estado, codigo_rastreo, fecha_pedido) VALUES
('GLE-2026-8941', 2, 1, 239000.00, 0.00, 20000.00, 219000.00, 'En preparación', 'TRACK-GLE-8941-CO', NOW() - INTERVAL 1 DAY),
('GLE-2026-8120', 2, 1, 310000.00, 0.00, 0.00, 310000.00, 'Entregado', 'TRACK-GLE-8120-CO', NOW() - INTERVAL 10 DAY),
('GLE-2026-7645', 3, 3, 360000.00, 0.00, 0.00, 360000.00, 'Enviado', 'TRACK-GLE-7645-CO', NOW() - INTERVAL 3 DAY);

-- 9. Insertar Detalles de Pedidos
INSERT INTO detalle_pedido (id_pedido, id_producto, nombre_producto, nombre_talla, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 'Vestido de Noche Noir & Gold Silhouette', 'M', 1, 239000.00, 239000.00),
(2, 4, 'Reloj Cronógrafo Royal Gold 42mm', 'Única', 1, 310000.00, 310000.00),
(3, 2, 'Smoking Ejecutivo Imperial Black Gold', 'L', 1, 360000.00, 360000.00);

-- 10. Insertar Pagos
INSERT INTO pagos (id_pedido, metodo_pago, estado_pago, referencia_transaccion, monto) VALUES
(1, 'tarjeta_credito', 'completado', 'TXN-VISA-98214-DEMO', 219000.00),
(2, 'pse_transferencia', 'completado', 'TXN-PSE-64821-DEMO', 310000.00),
(3, 'tarjeta_credito', 'completado', 'TXN-MC-33109-DEMO', 360000.00);

-- 11. Insertar Favoritos Semilla
INSERT INTO favoritos (id_usuario, id_producto) VALUES
(2, 4),
(2, 5),
(2, 9),
(3, 1);

-- 12. Insertar Mensajes de Contacto iniciales
INSERT INTO contactos (nombre, email, telefono, asunto, mensaje, leido, respondido) VALUES
('Valentina Gómez', 'valentina@empresa.com', '+57 312 445 6677', 'Consulta para confección corporativa', 'Hola, nos encantó su catálogo de trajes. Quisiéramos cotizar 15 smokings para nuestro evento anual.', TRUE, TRUE),
('Andrés Castro', 'andres.c@gmail.com', '+57 320 889 1122', 'Disponibilidad de talla en Blazer', 'Buenas tardes, ¿volverán a tener stock de la talla XL del Blazer Aura Dorada?', FALSE, FALSE);

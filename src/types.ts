export type SizeName = 
  | 'XS' | 'S' | 'M' | 'L' | 'XL' 
  | '4' | '6' | '8' | '10' | '12' 
  | '36' | '37' | '38' | '39' | '40' | '41' | '42' 
  | 'Única';

export interface SizeStock {
  talla: SizeName;
  stock: number;
}

export interface Review {
  id: string;
  id_producto: string;
  id_usuario: string;
  nombre_usuario: string;
  calificacion: number;
  titulo?: string;
  comentario: string;
  fecha: string;
}

export interface Product {
  id: string;
  id_categoria: string;
  nombre_categoria: string;
  nombre: string;
  slug: string;
  descripcion: string;
  precio: number;
  precio_oferta?: number | null;
  en_oferta: boolean;
  es_novedad: boolean;
  es_destacado: boolean;
  imagen_principal: string;
  imagenes_secundarias: string[];
  sku: string;
  tallas: SizeStock[];
  stock_total: number;
  activo: boolean;
  fecha_creacion: string;
  calificacion_promedio: number;
  total_resenas: number;
}

export interface Category {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  imagen_url: string;
  icono?: string;
  orden: number;
  activo: boolean;
}

export interface UserAddress {
  id: string;
  id_usuario: string;
  titulo: string; // ej: "Casa", "Oficina"
  nombre_contacto: string;
  telefono_contacto: string;
  direccion_linea1: string;
  direccion_linea2?: string;
  ciudad: string;
  departamento_estado: string;
  codigo_postal?: string;
  pais: string;
  es_predeterminada: boolean;
}

export interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rol: 'cliente' | 'administrador';
  estado: 'activo' | 'inactivo';
  fecha_registro: string;
  direcciones: UserAddress[];
}

export interface CartItem {
  id: string; // generated unique id item+size
  producto: Product;
  talla_seleccionada: SizeName;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export type OrderStatus = 
  | 'Pendiente' 
  | 'Confirmado' 
  | 'En preparación' 
  | 'Enviado' 
  | 'Entregado' 
  | 'Cancelado';

export type PaymentMethodType = 
  | 'tarjeta_credito' 
  | 'pse_transferencia' 
  | 'contra_entrega' 
  | 'efecty_puntos';

export interface OrderItem {
  id_producto: string;
  nombre_producto: string;
  imagen_producto: string;
  nombre_talla: SizeName;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface Order {
  id: string;
  numero_pedido: string; // ej: GLE-2026-8941
  id_usuario: string;
  nombre_cliente: string;
  email_cliente: string;
  telefono_cliente: string;
  direccion_envio: UserAddress;
  items: OrderItem[];
  subtotal: number;
  costo_envio: number;
  descuento: number;
  codigo_descuento?: string;
  total: number;
  metodo_pago: PaymentMethodType;
  referencia_pago: string;
  estado_pago: 'completado' | 'pendiente' | 'fallido';
  estado: OrderStatus;
  codigo_rastreo: string;
  empresa_envio: string;
  notas_cliente?: string;
  fecha_pedido: string;
  fecha_entrega_estimada: string;
  historial_estados: {
    estado: OrderStatus;
    fecha: string;
    nota: string;
  }[];
}

export interface ContactMessage {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  asunto: string;
  mensaje: string;
  leido: boolean;
  respondido: boolean;
  fecha_envio: string;
}

export type ActiveView = 
  | 'inicio' 
  | 'catalogo' 
  | 'producto_detalle' 
  | 'carrito' 
  | 'checkout' 
  | 'confirmacion_pedido' 
  | 'seguimiento_pedido' 
  | 'perfil' 
  | 'favoritos' 
  | 'contacto' 
  | 'admin';

export interface FilterState {
  categoriaId: string | null;
  talla: SizeName | null;
  precioMin: number;
  precioMax: number;
  soloDisponibles: boolean;
  soloOfertas: boolean;
  soloNovedades: boolean;
  busqueda: string;
  ordenarPor: 'precio_asc' | 'precio_desc' | 'recientes' | 'mas_vendidos' | 'calificacion';
}

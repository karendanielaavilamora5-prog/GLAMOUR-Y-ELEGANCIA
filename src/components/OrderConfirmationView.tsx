import React from 'react';
import { 
  Crown, 
  Truck, 
  MapPin, 
  CreditCard, 
  Printer, 
  ShoppingBag
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OrderConfirmationView: React.FC = () => {
  const { currentOrder, setActiveView } = useStore();

  if (!currentOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#f5d77f]">No hay ningún pedido activo para mostrar</h2>
        <button
          onClick={() => setActiveView('catalogo')}
          className="px-6 py-2.5 rounded-full bg-[#d4af37] text-[#000000] text-xs font-bold uppercase"
        >
          Volver a la tienda
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      
      {/* Top Gold Congratulations Card */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#181409] via-[#100e07] to-[#0a0a0a] border border-[#d4af37] text-center space-y-4 shadow-2xl shadow-[#d4af37]/15">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#d4af37] to-[#f5d77f] text-[#080808] flex items-center justify-center mx-auto shadow-lg shadow-[#d4af37]/30">
          <Crown className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-xs uppercase font-bold tracking-widest text-[#d4af37] font-cinzel">
            ¡Pago Confirmado Exitosamente!
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#ffffff] font-cinzel">
            Gracias por tu Compra en Glamur & Elegancia
          </h1>
        </div>

        <p className="text-xs sm:text-sm text-[#cccccc] max-w-lg mx-auto">
          Hemos recibido tu orden y nuestro taller de alta costura ya está preparando tu empaque VIP con acabados de seda y sello dorado.
        </p>

        {/* Tracking Number & Order Code */}
        <div className="pt-4 flex flex-wrap justify-center gap-4 text-xs">
          <div className="px-4 py-2 rounded-xl bg-[#0a0a0a] border border-[#d4af37]/50">
            <span className="text-[#888888] block text-[10px] uppercase">Número de Pedido</span>
            <strong className="text-[#f5d77f] font-mono text-sm">{currentOrder.numero_pedido}</strong>
          </div>

          <div className="px-4 py-2 rounded-xl bg-[#0a0a0a] border border-[#d4af37]/50">
            <span className="text-[#888888] block text-[10px] uppercase">Guía de Rastreo Express</span>
            <strong className="text-[#f5d77f] font-mono text-sm">{currentOrder.codigo_rastreo}</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 flex flex-wrap justify-center gap-3">
          <button
            id="track-order-action-btn"
            onClick={() => setActiveView('seguimiento_pedido')}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-[#080808] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-2 shadow-lg"
          >
            <Truck className="w-4 h-4" />
            <span>Rastrear mi Pedido en Tiempo Real</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-3 rounded-full bg-[#161616] border border-[#d4af37]/40 text-[#f5d77f] text-xs font-semibold hover:bg-[#222222] transition-colors flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Recibo</span>
          </button>

          <button
            onClick={() => setActiveView('catalogo')}
            className="px-5 py-3 rounded-full bg-[#161616] border border-[#d4af37]/40 text-[#f5d77f] text-xs font-semibold hover:bg-[#222222] transition-colors flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Seguir Comprando</span>
          </button>
        </div>
      </div>

      {/* Order Details Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Shipping & Recipient Card */}
        <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-[#262626] space-y-3 text-xs">
          <div className="flex items-center gap-2 text-[#f5d77f] font-bold uppercase font-cinzel border-b border-[#222222] pb-2">
            <MapPin className="w-4 h-4 text-[#d4af37]" />
            <span>Datos de Envío</span>
          </div>

          <div className="space-y-1 text-[#cccccc]">
            <p><strong className="text-[#f4f4f4]">Destinatario:</strong> {currentOrder.nombre_cliente}</p>
            <p><strong className="text-[#f4f4f4]">Dirección:</strong> {currentOrder.direccion_envio.direccion_linea1}</p>
            {currentOrder.direccion_envio.direccion_linea2 && (
              <p><strong className="text-[#f4f4f4]">Detalles:</strong> {currentOrder.direccion_envio.direccion_linea2}</p>
            )}
            <p><strong className="text-[#f4f4f4]">Ciudad:</strong> {currentOrder.direccion_envio.ciudad}, {currentOrder.direccion_envio.departamento_estado}</p>
            <p><strong className="text-[#f4f4f4]">Teléfono:</strong> {currentOrder.telefono_cliente}</p>
          </div>
        </div>

        {/* Payment & Status */}
        <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-[#262626] space-y-3 text-xs">
          <div className="flex items-center gap-2 text-[#f5d77f] font-bold uppercase font-cinzel border-b border-[#222222] pb-2">
            <CreditCard className="w-4 h-4 text-[#d4af37]" />
            <span>Método de Pago & Estado</span>
          </div>

          <div className="space-y-1 text-[#cccccc]">
            <p><strong className="text-[#f4f4f4]">Método:</strong> {currentOrder.metodo_pago.toUpperCase()}</p>
            <p><strong className="text-[#f4f4f4]">Estado del Pago:</strong> <span className="text-[#55ff77] font-semibold">APROBADO (DEMO)</span></p>
            <p><strong className="text-[#f4f4f4]">Fecha de Orden:</strong> {new Date(currentOrder.fecha_pedido).toLocaleString('es-CO')}</p>
            <p><strong className="text-[#f4f4f4]">Entrega Estimada:</strong> {currentOrder.fecha_entrega_estimada}</p>
          </div>
        </div>

      </div>

      {/* Items in the order */}
      <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-[#262626] space-y-4">
        <h3 className="text-xs font-bold text-[#f5d77f] uppercase tracking-wider font-cinzel border-b border-[#222222] pb-3">
          Prendas Incluidas en la Orden
        </h3>

        <div className="divide-y divide-[#202020]">
          {currentOrder.items.map((item) => (
            <div key={`${item.id_producto}-${item.nombre_talla}`} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={item.imagen_producto}
                  alt={item.nombre_producto}
                  className="w-12 h-14 object-cover rounded-lg border border-[#d4af37]/30"
                />
                <div>
                  <h4 className="text-xs font-semibold text-[#f4f4f4]">{item.nombre_producto}</h4>
                  <p className="text-[11px] text-[#888888]">
                    Talla: <span className="text-[#d4af37] font-bold">{item.nombre_talla}</span> | Cantidad: {item.cantidad}
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold text-[#f5d77f]">
                ${item.subtotal.toLocaleString('es-CO')}
              </span>
            </div>
          ))}
        </div>

        {/* Total Summary */}
        <div className="pt-4 border-t border-[#222222] space-y-1.5 text-xs text-[#aaaaaa]">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${currentOrder.subtotal.toLocaleString('es-CO')}</span>
          </div>
          {currentOrder.descuento > 0 && (
            <div className="flex justify-between text-[#f5d77f]">
              <span>Descuento</span>
              <span>-${currentOrder.descuento.toLocaleString('es-CO')}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Costo de Envío</span>
            <span>{currentOrder.costo_envio === 0 ? 'GRATIS' : `$${currentOrder.costo_envio.toLocaleString('es-CO')}`}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-[#f5d77f] pt-2 border-t border-[#222222]">
            <span>Total Pagado</span>
            <span>${currentOrder.total.toLocaleString('es-CO')}</span>
          </div>
        </div>
      </div>

    </div>
  );
};

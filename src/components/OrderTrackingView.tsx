import React, { useState } from 'react';
import { 
  Search, 
  Package, 
  CheckCircle2, 
  Crown, 
  Phone, 
  ArrowLeft
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';

export const OrderTrackingView: React.FC = () => {
  const { orders, currentOrder, setActiveView } = useStore();

  const [searchCode, setSearchCode] = useState<string>(
    currentOrder ? currentOrder.numero_pedido : orders[0]?.numero_pedido || ''
  );
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(
    currentOrder || orders[0] || null
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchCode.trim().toLowerCase();
    const found = orders.find(
      (o) =>
        o.numero_pedido.toLowerCase().includes(query) ||
        o.codigo_rastreo.toLowerCase().includes(query)
    );
    if (found) {
      setSelectedOrder(found);
    } else {
      setSelectedOrder(null);
    }
  };

  // Steps definition
  const steps: { key: OrderStatus; title: string; desc: string }[] = [
    { key: 'Confirmado', title: 'Pedido Confirmado', desc: 'Pago aprobado y orden registrada en el sistema' },
    { key: 'En preparación', title: 'Taller & Empaque VIP', desc: 'Control de calidad y embalaje con sello dorado' },
    { key: 'Enviado', title: 'En Tránsito Express', desc: 'Despachado con mensajero exclusivo Glamur' },
    { key: 'Entregado', title: 'Entregado con Éxito', desc: 'Recibido a satisfacción por el titular' },
  ];

  const getStepStatus = (stepKey: OrderStatus, currentStatus: OrderStatus) => {
    const orderIndexMap: Record<OrderStatus, number> = {
      'Pendiente': 0,
      'Confirmado': 0,
      'En preparación': 1,
      'Enviado': 2,
      'Entregado': 3,
      'Cancelado': -1,
    };
    const curIdx = orderIndexMap[currentStatus] ?? 0;
    const targetIdx = orderIndexMap[stepKey] ?? 0;

    if (curIdx > targetIdx) return 'completed';
    if (curIdx === targetIdx) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#242424] pb-4">
        <button
          onClick={() => setActiveView('catalogo')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#f5d77f] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la tienda</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-[#d4af37]">
          <Crown className="w-3.5 h-3.5" />
          <span>Glamur Express Logistics</span>
        </div>
      </div>

      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl font-bold text-[#ffffff] font-cinzel">
          Seguimiento de tu Pedido VIP
        </h1>
        <p className="text-xs text-[#888888]">
          Consulta el estado de preparación y despacho de tus prendas en tiempo real.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            placeholder="Ingresa # de pedido (ej: GLE-2026-8941) o guía"
            className="w-full bg-[#101010] border border-[#d4af37]/40 rounded-xl py-3 pl-10 pr-4 text-xs text-[#f4f4f4] placeholder-[#666666] focus:outline-none focus:border-[#d4af37]"
          />
          <Search className="w-4 h-4 text-[#d4af37] absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-[#d4af37] text-[#080808] text-xs font-bold uppercase tracking-wider hover:bg-[#f5d77f] transition-all"
        >
          Buscar
        </button>
      </form>

      {/* Quick Select from existing orders */}
      {orders.length > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-[#777777]">Tus pedidos recientes:</span>
          {orders.map((o) => (
            <button
              key={o.id}
              onClick={() => {
                setSelectedOrder(o);
                setSearchCode(o.numero_pedido);
              }}
              className={`px-3 py-1 rounded-lg border text-[11px] font-mono ${
                selectedOrder?.id === o.id
                  ? 'bg-[#1e1909] border-[#d4af37] text-[#f5d77f]'
                  : 'bg-[#121212] border-[#292929] text-[#aaaaaa] hover:border-[#444444]'
              }`}
            >
              {o.numero_pedido}
            </button>
          ))}
        </div>
      )}

      {/* Selected Order Tracking Content */}
      {selectedOrder ? (
        <div className="space-y-8">
          
          {/* Order Snapshot Card */}
          <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-[#d4af37]/40 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-[#d4af37]">Pedido</span>
                <span className="text-base font-bold font-mono text-[#ffffff]">{selectedOrder.numero_pedido}</span>
              </div>
              <p className="text-xs text-[#888888]">
                Guía de transporte: <span className="text-[#f5d77f] font-mono">{selectedOrder.codigo_rastreo}</span>
              </p>
            </div>

            <div className="flex items-center gap-6 text-xs">
              <div>
                <span className="text-[#666666] block">Fecha</span>
                <span className="text-[#cccccc] font-medium">{new Date(selectedOrder.fecha_pedido).toLocaleDateString('es-CO')}</span>
              </div>
              <div>
                <span className="text-[#666666] block">Total</span>
                <span className="text-[#f5d77f] font-bold">${selectedOrder.total.toLocaleString('es-CO')}</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-[#181409] border border-[#d4af37] text-[#f5d77f] uppercase font-bold text-[10px]">
                {selectedOrder.estado.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0f0f0f] border border-[#242424] space-y-8">
            <h3 className="text-sm font-bold text-[#f5d77f] uppercase font-cinzel tracking-wider">
              Línea de Tiempo del Envío
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {steps.map((step, idx) => {
                const status = getStepStatus(step.key, selectedOrder.estado);

                return (
                  <div key={step.key} className="space-y-3 relative">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          status === 'completed'
                            ? 'bg-[#d4af37] text-[#000000] shadow-md shadow-[#d4af37]/30'
                            : status === 'current'
                            ? 'bg-[#000000] border-2 border-[#d4af37] text-[#f5d77f] ring-4 ring-[#d4af37]/20 animate-pulse'
                            : 'bg-[#181818] border border-[#333333] text-[#666666]'
                        }`}
                      >
                        {status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>

                      <span
                        className={`text-xs font-bold ${
                          status === 'completed' || status === 'current'
                            ? 'text-[#f5d77f]'
                            : 'text-[#666666]'
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#888888] pl-11 md:pl-0">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline Events details */}
          <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-[#242424] space-y-4">
            <h4 className="text-xs font-bold uppercase text-[#e0e0e0] tracking-wider">
              Historial de Novedades de Envío
            </h4>

            <div className="space-y-4 text-xs border-l-2 border-[#d4af37]/40 pl-4 ml-2">
              <div className="space-y-1 relative">
                <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37] absolute -left-[21px] top-1" />
                <span className="text-[10px] text-[#777777]">Hoy - En proceso</span>
                <p className="font-semibold text-[#f4f4f4]">
                  {selectedOrder.estado === 'Entregado'
                    ? 'Paquete entregado en portería y firmado por el titular.'
                    : selectedOrder.estado === 'Enviado'
                    ? 'En ruta de entrega local con mensajero prioritario.'
                    : selectedOrder.estado === 'En preparación'
                    ? 'Prenda en inspección de planchado y embalaje de gala con lazo dorado.'
                    : 'Pago verificado. Orden transmitida a taller.'}
                </p>
                <p className="text-[11px] text-[#888888]">Centro de Distribución Bogotá Zona Rosa</p>
              </div>

              <div className="space-y-1 relative">
                <div className="w-2.5 h-2.5 rounded-full bg-[#555555] absolute -left-[21px] top-1" />
                <span className="text-[10px] text-[#777777]">Registro Inicial</span>
                <p className="font-semibold text-[#cccccc]">Generación de guía de rastreo y validación de dirección.</p>
              </div>
            </div>
          </div>

          {/* Help Concierge Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#161207] to-[#0a0a0a] border border-[#d4af37]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs">
              <div className="p-2.5 rounded-full bg-[#1e1909] text-[#d4af37] border border-[#d4af37]/40">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-bold text-[#f5d77f]">¿Necesitas ayuda con tu entrega?</h5>
                <p className="text-[#888888] text-[11px]">Nuestros asesores VIP están disponibles para asistirte.</p>
              </div>
            </div>

            <button
              onClick={() => setActiveView('contacto')}
              className="px-5 py-2.5 rounded-full bg-[#d4af37] text-[#080808] font-bold text-xs uppercase hover:bg-[#f5d77f] transition-all"
            >
              Contactar Concierge
            </button>
          </div>

        </div>
      ) : (
        <div className="p-12 text-center bg-[#0e0e0e] border border-[#262626] rounded-2xl space-y-3">
          <Package className="w-10 h-10 text-[#555555] mx-auto" />
          <h3 className="text-base font-bold text-[#f4f4f4] font-cinzel">No se encontró ningún pedido con ese código</h3>
          <p className="text-xs text-[#777777] max-w-sm mx-auto">
            Verifica que el número de pedido (ej: GLE-2026-8941) o la guía estén escritos correctamente.
          </p>
        </div>
      )}

    </div>
  );
};

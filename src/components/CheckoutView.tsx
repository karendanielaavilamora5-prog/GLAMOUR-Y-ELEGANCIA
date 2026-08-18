import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  MapPin, 
  Plus, 
  Check, 
  Lock, 
  ArrowLeft, 
  Sparkles, 
  Building, 
  Banknote,
  Receipt,
  Crown
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PaymentMethodType, UserAddress } from '../types';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTotal,
    appliedCoupon,
    addresses,
    addAddress,
    createOrder,
    currentUser,
    setActiveView,
    addToast
  } = useStore();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#f5d77f] font-cinzel">No tienes productos en tu carrito</h2>
        <p className="text-xs text-[#888888]">Agrega algunas prendas exclusivas antes de proceder al checkout.</p>
        <button
          onClick={() => setActiveView('catalogo')}
          className="px-6 py-3 rounded-full bg-[#d4af37] text-[#080808] font-bold text-xs uppercase"
        >
          Explorar Catálogo
        </button>
      </div>
    );
  }

  // Address Selection State
  const defaultAddr = addresses.find((a) => a.es_predeterminada) || addresses[0];
  const [selectedAddressId, setSelectedAddressId] = useState<string>(defaultAddr ? defaultAddr.id : 'new');
  const [showNewAddressForm, setShowNewAddressForm] = useState<boolean>(addresses.length === 0);

  // New Address Form State
  const [newAddrTitle, setNewAddrTitle] = useState('Residencia');
  const [newAddrName, setNewAddrName] = useState(currentUser ? `${currentUser.nombre} ${currentUser.apellido}` : '');
  const [newAddrPhone, setNewAddrPhone] = useState(currentUser ? currentUser.telefono : '');
  const [newAddrLine1, setNewAddrLine1] = useState('');
  const [newAddrLine2, setNewAddrLine2] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('Bogotá');
  const [newAddrState, setNewAddrState] = useState('Cundinamarca');

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('tarjeta_credito');
  const [customerNotes, setCustomerNotes] = useState('');

  // Demo Card State
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8921');
  const [cardHolder, setCardHolder] = useState(currentUser ? `${currentUser.nombre} ${currentUser.apellido}`.toUpperCase() : 'CLIENTE VIP GLAMUR');
  const [cardExp, setCardExp] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('888');

  // Bank PSE State
  const [selectedBank, setSelectedBank] = useState('Bancolombia');

  const [isProcessing, setIsProcessing] = useState(false);

  const handleCreateNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrLine1.trim() || !newAddrName.trim() || !newAddrPhone.trim()) {
      addToast('Por favor completa todos los campos de la dirección.', 'error');
      return;
    }
    addAddress({
      titulo: newAddrTitle,
      nombre_contacto: newAddrName,
      telefono_contacto: newAddrPhone,
      direccion_linea1: newAddrLine1,
      direccion_linea2: newAddrLine2,
      ciudad: newAddrCity,
      departamento_estado: newAddrState,
      pais: 'Colombia',
      es_predeterminada: addresses.length === 0,
    });
    setShowNewAddressForm(false);
  };

  const handleConfirmOrder = () => {
    let finalAddress: UserAddress;

    if (showNewAddressForm || addresses.length === 0) {
      if (!newAddrLine1.trim() || !newAddrName.trim() || !newAddrPhone.trim()) {
        addToast('Por favor ingresa la dirección de entrega.', 'error');
        return;
      }
      finalAddress = {
        id: `dir-${Date.now()}`,
        id_usuario: currentUser ? currentUser.id : 'temp',
        titulo: newAddrTitle,
        nombre_contacto: newAddrName,
        telefono_contacto: newAddrPhone,
        direccion_linea1: newAddrLine1,
        direccion_linea2: newAddrLine2,
        ciudad: newAddrCity,
        departamento_estado: newAddrState,
        pais: 'Colombia',
        es_predeterminada: true,
      };
    } else {
      const found = addresses.find((a) => a.id === selectedAddressId);
      if (!found) {
        addToast('Selecciona una dirección de entrega válida.', 'error');
        return;
      }
      finalAddress = found;
    }

    setIsProcessing(true);
    setTimeout(() => {
      createOrder({
        address: finalAddress,
        paymentMethod,
        customerNotes,
        cardDetails: {
          number: cardNumber,
          holder: cardHolder,
          exp: cardExp,
          cvv: cardCvv,
        },
      });
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header & Back */}
      <div className="flex items-center justify-between border-b border-[#242424] pb-4">
        <button
          onClick={() => setActiveView('catalogo')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#f5d77f] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-[#d4af37]">
          <Lock className="w-3.5 h-3.5" />
          <span>Checkout Seguro & Protegido</span>
        </div>
      </div>

      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs text-[#d4af37] font-cinzel uppercase font-bold tracking-wider">
          <Crown className="w-4 h-4" />
          <span>Glamur y Elegancia</span>
        </div>
        <h1 className="text-3xl font-bold text-[#ffffff] font-cinzel">
          Finalizar tu Compra VIP
        </h1>
        <p className="text-xs text-[#888888]">
          Revisa tus prendas, selecciona tu dirección y escoge tu método de pago de demostración.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Addresses & Payment Methods (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* 1. SECCIÓN DE DIRECCIÓN DE ENVÍO */}
          <div className="p-6 rounded-2xl bg-[#101010] border border-[#d4af37]/40 space-y-6">
            <div className="flex items-center justify-between border-b border-[#222222] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#d4af37] text-[#000000] font-bold text-xs flex items-center justify-center">
                  1
                </div>
                <h3 className="text-sm font-bold text-[#f5d77f] uppercase font-cinzel">
                  Dirección de Entrega VIP
                </h3>
              </div>

              {addresses.length > 0 && !showNewAddressForm && (
                <button
                  onClick={() => setShowNewAddressForm(true)}
                  className="text-xs text-[#d4af37] hover:underline flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar nueva
                </button>
              )}
            </div>

            {/* Existing Addresses list */}
            {!showNewAddressForm && addresses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? 'bg-[#1a160a] border-[#d4af37] shadow-lg shadow-[#d4af37]/15'
                        : 'bg-[#141414] border-[#262626] hover:border-[#444444]'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-[#f5d77f] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#d4af37]" /> {addr.titulo}
                      </span>
                      {selectedAddressId === addr.id && (
                        <span className="p-0.5 rounded-full bg-[#d4af37] text-[#000000]">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-[#f4f4f4]">{addr.nombre_contacto}</p>
                    <p className="text-xs text-[#aaaaaa] mt-1">{addr.direccion_linea1}</p>
                    {addr.direccion_linea2 && (
                      <p className="text-[11px] text-[#777777]">{addr.direccion_linea2}</p>
                    )}
                    <p className="text-xs text-[#aaaaaa]">{addr.ciudad}, {addr.departamento_estado}</p>
                    <p className="text-[11px] text-[#777777] mt-1">Tel: {addr.telefono_contacto}</p>
                  </div>
                ))}
              </div>
            ) : (
              /* New Address Form */
              <form onSubmit={handleCreateNewAddress} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-[#888888] block mb-1">Nombre Completo del Receptor</label>
                    <input
                      type="text"
                      value={newAddrName}
                      onChange={(e) => setNewAddrName(e.target.value)}
                      required
                      placeholder="Ej: Daniela Ávila"
                      className="w-full bg-[#161616] border border-[#d4af37]/40 rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#888888] block mb-1">Teléfono Móvil</label>
                    <input
                      type="text"
                      value={newAddrPhone}
                      onChange={(e) => setNewAddrPhone(e.target.value)}
                      required
                      placeholder="Ej: +57 310 123 4567"
                      className="w-full bg-[#161616] border border-[#d4af37]/40 rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-[#888888] block mb-1">Dirección Principal (Calle/Carrera/Avenida)</label>
                  <input
                    type="text"
                    value={newAddrLine1}
                    onChange={(e) => setNewAddrLine1(e.target.value)}
                    required
                    placeholder="Ej: Carrera 15 # 93 - 40"
                    className="w-full bg-[#161616] border border-[#d4af37]/40 rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-[#888888] block mb-1">Apto / Casa / Oficina (Opcional)</label>
                    <input
                      type="text"
                      value={newAddrLine2}
                      onChange={(e) => setNewAddrLine2(e.target.value)}
                      placeholder="Apto 802 Torre Dorada"
                      className="w-full bg-[#161616] border border-[#333333] rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#888888] block mb-1">Ciudad</label>
                    <input
                      type="text"
                      value={newAddrCity}
                      onChange={(e) => setNewAddrCity(e.target.value)}
                      required
                      className="w-full bg-[#161616] border border-[#333333] rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#888888] block mb-1">Departamento</label>
                    <input
                      type="text"
                      value={newAddrState}
                      onChange={(e) => setNewAddrState(e.target.value)}
                      required
                      className="w-full bg-[#161616] border border-[#333333] rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                {addresses.length > 0 && (
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(false)}
                      className="px-4 py-1.5 rounded-lg bg-[#222222] text-xs text-[#cccccc]"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-[#d4af37] text-[#000000] text-xs font-bold"
                    >
                      Guardar Dirección
                    </button>
                  </div>
                )}
              </form>
            )}

            {/* Delivery instructions */}
            <div className="pt-2">
              <label className="text-[11px] text-[#888888] block mb-1">Notas especiales para la entrega (Opcional)</label>
              <textarea
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                rows={2}
                placeholder="Ej: Dejar en recepción con portería, llamar antes de llegar..."
                className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          {/* 2. SECCIÓN DE MÉTODO DE PAGO DEMO */}
          <div className="p-6 rounded-2xl bg-[#101010] border border-[#d4af37]/40 space-y-6">
            <div className="flex items-center gap-2.5 border-b border-[#222222] pb-3">
              <div className="w-7 h-7 rounded-full bg-[#d4af37] text-[#000000] font-bold text-xs flex items-center justify-center">
                2
              </div>
              <h3 className="text-sm font-bold text-[#f5d77f] uppercase font-cinzel">
                Método de Pago (Modo Demostración)
              </h3>
            </div>

            {/* Payment Options Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              <button
                type="button"
                onClick={() => setPaymentMethod('tarjeta_credito')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                  paymentMethod === 'tarjeta_credito'
                    ? 'bg-[#1a160a] border-[#d4af37] text-[#f5d77f] shadow-lg shadow-[#d4af37]/15'
                    : 'bg-[#141414] border-[#262626] text-[#888888] hover:border-[#444444]'
                }`}
              >
                <CreditCard className="w-5 h-5 text-[#d4af37]" />
                <span className="text-xs font-semibold">Tarjeta VIP</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('pse_transferencia')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                  paymentMethod === 'pse_transferencia'
                    ? 'bg-[#1a160a] border-[#d4af37] text-[#f5d77f] shadow-lg shadow-[#d4af37]/15'
                    : 'bg-[#141414] border-[#262626] text-[#888888] hover:border-[#444444]'
                }`}
              >
                <Building className="w-5 h-5 text-[#d4af37]" />
                <span className="text-xs font-semibold">PSE / Transferencia</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('contra_entrega')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                  paymentMethod === 'contra_entrega'
                    ? 'bg-[#1a160a] border-[#d4af37] text-[#f5d77f] shadow-lg shadow-[#d4af37]/15'
                    : 'bg-[#141414] border-[#262626] text-[#888888] hover:border-[#444444]'
                }`}
              >
                <Banknote className="w-5 h-5 text-[#d4af37]" />
                <span className="text-xs font-semibold">Contra Entrega</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('efecty_puntos')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                  paymentMethod === 'efecty_puntos'
                    ? 'bg-[#1a160a] border-[#d4af37] text-[#f5d77f] shadow-lg shadow-[#d4af37]/15'
                    : 'bg-[#141414] border-[#262626] text-[#888888] hover:border-[#444444]'
                }`}
              >
                <Receipt className="w-5 h-5 text-[#d4af37]" />
                <span className="text-xs font-semibold">Efecty / Puntos</span>
              </button>

            </div>

            {/* Dynamic details for chosen payment method */}
            {paymentMethod === 'tarjeta_credito' && (
              <div className="space-y-4 pt-2">
                {/* 3D-styled Gold Card Simulation */}
                <div className="max-w-sm mx-auto p-5 rounded-2xl bg-gradient-to-tr from-[#0a0a0a] via-[#1f1a0b] to-[#3a2c07] border border-[#d4af37] shadow-xl text-[#f4f4f4] space-y-4 relative overflow-hidden">
                  <div className="flex justify-between items-center">
                    <span className="font-cinzel text-xs tracking-widest text-[#f5d77f] font-bold">
                      GLAMUR GOLD MEMBER
                    </span>
                    <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  </div>

                  <div className="text-sm tracking-widest font-mono text-[#f5d77f] py-2">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>

                  <div className="flex justify-between text-[10px] text-[#cccccc]">
                    <div>
                      <span className="block text-[8px] text-[#888888] uppercase">Titular</span>
                      <span className="font-bold tracking-wider">{cardHolder || 'NOMBRE TITULAR'}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-[#888888] uppercase">Vence</span>
                      <span className="font-bold">{cardExp || 'MM/AA'}</span>
                    </div>
                  </div>
                </div>

                {/* Card Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-[#888888] block mb-1">Número de Tarjeta (Simulado)</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4532 8901 2345 8921"
                      className="w-full bg-[#141414] border border-[#d4af37]/40 rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#888888] block mb-1">Nombre en la Tarjeta</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full bg-[#141414] border border-[#333333] rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-[#888888] block mb-1">Expiración</label>
                      <input
                        type="text"
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        placeholder="MM/AA"
                        className="w-full bg-[#141414] border border-[#333333] rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#888888] block mb-1">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        maxLength={4}
                        placeholder="888"
                        className="w-full bg-[#141414] border border-[#333333] rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'pse_transferencia' && (
              <div className="p-4 rounded-xl bg-[#141414] border border-[#2a2a2a] space-y-3">
                <label className="text-xs text-[#cccccc] block font-semibold">
                  Selecciona tu entidad financiera:
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full bg-[#0e0e0e] border border-[#d4af37]/40 rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="Bancolombia">Bancolombia</option>
                  <option value="Davivienda">Davivienda</option>
                  <option value="Banco de Bogotá">Banco de Bogotá</option>
                  <option value="BBVA">BBVA Colombia</option>
                  <option value="Nequi">Nequi</option>
                  <option value="DaviPlata">DaviPlata</option>
                </select>
                <p className="text-[11px] text-[#888888]">
                  Transacción de demostración: Al hacer clic en confirmar pedido, se simulará la aprobación inmediata del débito bancario.
                </p>
              </div>
            )}

            {paymentMethod === 'contra_entrega' && (
              <div className="p-4 rounded-xl bg-[#141414] border border-[#2a2a2a] space-y-2 text-xs text-[#cccccc]">
                <p className="font-semibold text-[#f5d77f]">Pago en Efectivo o Datafono al Recibir</p>
                <p className="text-[#888888]">
                  Pagarás al mensajero de Glamur Express en el momento de la entrega en tu domicilio. Ten listo el monto exacto o tarjeta física.
                </p>
              </div>
            )}

            {paymentMethod === 'efecty_puntos' && (
              <div className="p-4 rounded-xl bg-[#141414] border border-[#2a2a2a] space-y-2 text-xs text-[#cccccc]">
                <p className="font-semibold text-[#f5d77f]">Convenio Nacional Efecty / PagaTodo</p>
                <p className="text-[#888888]">
                  Al confirmar, se generará tu pin de pago con vigencia de 48 horas.
                </p>
              </div>
            )}

          </div>

        </div>

        {/* Right Column: Order Items Summary & Final CTA (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-[#d4af37]/40 space-y-6 sticky top-28">
            <h3 className="text-sm font-bold text-[#f5d77f] uppercase font-cinzel border-b border-[#222222] pb-3">
              Resumen del Pedido ({cart.length} prendas)
            </h3>

            {/* Products preview */}
            <div className="divide-y divide-[#202020] max-h-64 overflow-y-auto pr-2 space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex gap-3 items-center">
                  <img
                    src={item.producto.imagen_principal}
                    alt={item.producto.nombre}
                    className="w-14 h-16 object-cover rounded-lg border border-[#d4af37]/30 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-medium text-[#f4f4f4] truncate">{item.producto.nombre}</h4>
                    <p className="text-[11px] text-[#888888]">
                      Talla: <span className="text-[#d4af37] font-bold">{item.talla_seleccionada}</span> × {item.cantidad}
                    </p>
                    <p className="text-xs font-bold text-[#f5d77f] mt-0.5">
                      ${item.subtotal.toLocaleString('es-CO')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div className="space-y-2 pt-4 border-t border-[#222222] text-xs text-[#aaaaaa]">
              <div className="flex justify-between">
                <span>Subtotal prendas</span>
                <span className="text-[#f4f4f4] font-medium">${cartSubtotal.toLocaleString('es-CO')}</span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-[#f5d77f]">
                  <span>Descuento VIP ({appliedCoupon})</span>
                  <span>-${cartDiscount.toLocaleString('es-CO')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Costo de Envío</span>
                <span>
                  {cartShipping === 0 ? (
                    <strong className="text-[#f5d77f]">GRATIS (VIP)</strong>
                  ) : (
                    `$${cartShipping.toLocaleString('es-CO')}`
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-[#222222] flex justify-between items-center text-lg font-bold text-[#ffffff]">
                <span className="font-cinzel text-[#f5d77f]">Total a Pagar</span>
                <span className="font-cinzel text-[#f5d77f] text-xl">
                  ${cartTotal.toLocaleString('es-CO')}
                </span>
              </div>
            </div>

            {/* Confirm Purchase Button */}
            <button
              id="confirm-checkout-order-btn"
              onClick={handleConfirmOrder}
              disabled={isProcessing}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f5d77f] to-[#aa820a] text-[#080808] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-2xl shadow-[#d4af37]/30 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="w-4 h-4 text-[#080808] animate-spin" />
                  <span>Procesando Pedido VIP...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#080808]" />
                  <span>Confirmar y Realizar Pedido</span>
                </>
              )}
            </button>

            <p className="text-[10px] text-center text-[#777777]">
              Al confirmar aceptas nuestros Términos de Servicio y Política de Garantía VIP.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

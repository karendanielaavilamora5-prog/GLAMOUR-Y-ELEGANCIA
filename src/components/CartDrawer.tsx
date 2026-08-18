import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Tag,
  Truck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setActiveView
  } = useStore();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput);
      setCouponInput('');
    }
  };

  const handleGoToCheckout = () => {
    setIsCartDrawerOpen(false);
    setActiveView('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-[#000000]/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0d0d0d] border-l border-[#d4af37]/40 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-[#242424] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
              <h2 className="text-lg font-bold text-[#f5d77f] font-cinzel">
                Tu Carrito VIP ({cart.reduce((s, i) => s + i.cantidad, 0)})
              </h2>
            </div>
            <button
              id="close-cart-drawer-btn"
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 rounded-full text-[#888888] hover:text-[#d4af37] hover:bg-[#181818] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length > 0 ? (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-[#141414] border border-[#262626] flex gap-3.5 relative group"
                  >
                    {/* Item Image */}
                    <img
                      src={item.producto.imagen_principal}
                      alt={item.producto.nombre}
                      className="w-20 h-24 object-cover rounded-lg border border-[#d4af37]/30 flex-shrink-0"
                    />

                    {/* Item Info */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-semibold text-[#f4f4f4] truncate">
                            {item.producto.nombre}
                          </h4>
                          <button
                            id={`remove-cart-item-${item.id}`}
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#666666] hover:text-[#ff5555] p-1"
                            title="Eliminar producto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-[11px] text-[#d4af37] font-medium mt-0.5">
                          Talla: <span className="text-[#ffffff] font-bold">{item.talla_seleccionada}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#202020]">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-[#333333] rounded-lg bg-[#0a0a0a]">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.cantidad - 1)}
                            className="px-2 py-1 text-xs text-[#888888] hover:text-[#f5d77f]"
                            title="Disminuir"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 py-0.5 text-xs font-bold text-[#ffffff]">
                            {item.cantidad}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.cantidad + 1)}
                            className="px-2 py-1 text-xs text-[#888888] hover:text-[#f5d77f]"
                            title="Aumentar"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Subtotal */}
                        <p className="text-xs font-bold text-[#f5d77f]">
                          ${item.subtotal.toLocaleString('es-CO')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Free shipping progress indicator */}
                <div className="p-3 rounded-xl bg-[#161208] border border-[#d4af37]/30 text-xs text-[#cccccc]">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="flex items-center gap-1 text-[#f5d77f]">
                      <Truck className="w-3.5 h-3.5" /> Envío VIP Gratis
                    </span>
                    <span>
                      {cartSubtotal >= 200000 ? (
                        <strong className="text-[#f5d77f]">¡Calificas para Envío Gratis!</strong>
                      ) : (
                        `Faltan $${(200000 - cartSubtotal).toLocaleString('es-CO')}`
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-[#2a2a2a] h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#d4af37] to-[#f5d77f] h-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (cartSubtotal / 200000) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center space-y-4">
                <ShoppingBag className="w-12 h-12 text-[#444444] mx-auto" />
                <p className="text-sm font-semibold text-[#888888] font-cinzel">
                  Tu carrito está vacío
                </p>
                <p className="text-xs text-[#666666] max-w-xs mx-auto">
                  Explora nuestras colecciones exclusivas en negro y dorado para añadir piezas únicas.
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setActiveView('catalogo');
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#d4af37] text-[#080808] text-xs font-bold uppercase tracking-wider hover:bg-[#f5d77f] transition-all"
                >
                  Explorar Catálogo
                </button>
              </div>
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#242424] bg-[#0a0a0a] space-y-4">
              
              {/* Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#181408] border border-[#d4af37]/40 text-xs">
                    <span className="text-[#f5d77f] font-semibold flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" /> Cupón: {appliedCoupon}
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-[#ff5555] hover:underline text-[11px]"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Código de descuento (ej: ELEGANCIA10)"
                      className="flex-1 bg-[#141414] border border-[#333333] rounded-lg py-2 px-3 text-xs text-[#f4f4f4] placeholder-[#777777] uppercase focus:outline-none focus:border-[#d4af37]"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-lg bg-[#222222] border border-[#d4af37]/40 text-[#f5d77f] text-xs font-semibold hover:bg-[#d4af37] hover:text-[#000000] transition-colors"
                    >
                      Aplicar
                    </button>
                  </form>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#aaaaaa]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#ffffff]">${cartSubtotal.toLocaleString('es-CO')}</span>
                </div>

                {cartDiscount > 0 && (
                  <div className="flex justify-between text-[#f5d77f]">
                    <span>Descuento Aplicado</span>
                    <span>-${cartDiscount.toLocaleString('es-CO')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Costo de Envío VIP</span>
                  <span>
                    {cartShipping === 0 ? (
                      <strong className="text-[#f5d77f]">GRATIS</strong>
                    ) : (
                      `$${cartShipping.toLocaleString('es-CO')}`
                    )}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#222222] flex justify-between text-base font-bold text-[#ffffff]">
                  <span className="font-cinzel text-[#f5d77f]">Total</span>
                  <span className="text-[#f5d77f] text-lg font-cinzel">
                    ${cartTotal.toLocaleString('es-CO')}
                  </span>
                </div>
              </div>

              {/* Go to Checkout Button */}
              <button
                id="cart-drawer-checkout-btn"
                onClick={handleGoToCheckout}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f5d77f] to-[#aa820a] text-[#080808] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#d4af37]/20 cursor-pointer"
              >
                <span>Finalizar Compra</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

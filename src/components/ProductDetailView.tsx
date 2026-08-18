import React, { useState } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  ArrowLeft, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Crown, 
  Sparkles, 
  Share2, 
  Check,
  Send,
  Zap
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SizeName } from '../types';
import { ProductCard } from './HomeView';

export const ProductDetailView: React.FC = () => {
  const {
    selectedProduct,
    setActiveView,
    addToCart,
    buyNow,
    toggleFavorite,
    isFavorite,
    products,
    openProductDetail,
    getProductReviews,
    addReview,
    addToast
  } = useStore();

  if (!selectedProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-sm text-[#888888]">No se ha seleccionado ningún producto.</p>
        <button
          onClick={() => setActiveView('catalogo')}
          className="px-6 py-2 rounded-full bg-[#d4af37] text-[#000000] text-xs font-bold uppercase"
        >
          Ir al catálogo
        </button>
      </div>
    );
  }

  // Active gallery image
  const [activeImage, setActiveImage] = useState<string>(selectedProduct.imagen_principal);
  
  // Selected size state (default to first available with stock > 0)
  const defaultSize = selectedProduct.tallas.find((t) => t.stock > 0)?.talla || selectedProduct.tallas[0]?.talla || 'M';
  const [selectedSize, setSelectedSize] = useState<SizeName>(defaultSize);
  const [quantity, setQuantity] = useState<number>(1);

  // Review Form State
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewTitle, setReviewTitle] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>('');

  const currentPrice = selectedProduct.precio_oferta || selectedProduct.precio;
  const isFav = isFavorite(selectedProduct.id);
  const reviews = getProductReviews(selectedProduct.id);

  // Active size stock info
  const selectedSizeInfo = selectedProduct.tallas.find((t) => t.talla === selectedSize);
  const availableStockForSize = selectedSizeInfo ? selectedSizeInfo.stock : 0;

  // All gallery images
  const allImages = [selectedProduct.imagen_principal, ...(selectedProduct.imagenes_secundarias || [])];

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.activo && p.id_categoria === selectedProduct.id_categoria && p.id !== selectedProduct.id)
    .slice(0, 4);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      addToast('Por favor escribe un comentario para tu reseña.', 'error');
      return;
    }
    addReview(selectedProduct.id, reviewRating, reviewTitle || 'Experiencia Glamur', reviewComment);
    setReviewTitle('');
    setReviewComment('');
    setReviewRating(5);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('Enlace de la prenda copiado al portapapeles.', 'dorado');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* Back Button and Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          id="product-back-btn"
          onClick={() => setActiveView('catalogo')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#f5d77f] hover:text-[#ffd700] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo</span>
        </button>

        <div className="text-xs text-[#777777] hidden sm:block">
          Inicio / {selectedProduct.nombre_categoria} / <span className="text-[#d4af37]">{selectedProduct.nombre}</span>
        </div>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        
        {/* Left Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-[#121212] border border-[#d4af37]/40 shadow-2xl shadow-[#d4af37]/10">
            <img
              src={activeImage}
              alt={selectedProduct.nombre}
              className="w-full h-full object-cover transition-all duration-500"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {selectedProduct.en_oferta && (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-[#080808] shadow-lg">
                  Oferta VIP
                </span>
              )}
              {selectedProduct.es_novedad && (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0a0a0a]/90 text-[#f5d77f] border border-[#d4af37]/60 shadow-lg">
                  Nueva Colección
                </span>
              )}
            </div>

            {/* Favorite & Share Buttons */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button
                id="product-detail-fav-btn"
                onClick={() => toggleFavorite(selectedProduct.id)}
                className={`p-3 rounded-full backdrop-blur-md transition-all shadow-xl ${
                  isFav
                    ? 'bg-[#d4af37] text-[#080808]'
                    : 'bg-[#080808]/80 text-[#f5d77f] border border-[#d4af37]/40 hover:bg-[#d4af37] hover:text-[#080808]'
                }`}
                title={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
              >
                <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-3 rounded-full bg-[#080808]/80 text-[#f5d77f] border border-[#d4af37]/40 hover:bg-[#d4af37] hover:text-[#080808] transition-all shadow-xl"
                title="Compartir prenda"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Thumbnails row */}
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activeImage === img
                      ? 'border-[#d4af37] ring-2 ring-[#d4af37]/30 scale-105'
                      : 'border-[#242424] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Vista ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Info & Actions */}
        <div className="space-y-6">
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                Línea {selectedProduct.nombre_categoria}
              </span>
              <span className="text-xs text-[#777777] font-mono">
                SKU: {selectedProduct.sku}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-[#ffffff] font-cinzel leading-tight">
              {selectedProduct.nombre}
            </h1>

            {/* Ratings & reviews indicator */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex text-[#d4af37]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(selectedProduct.calificacion_promedio)
                        ? 'fill-current'
                        : 'text-[#333333]'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-[#f5d77f]">
                {selectedProduct.calificacion_promedio.toFixed(1)}
              </span>
              <span className="text-xs text-[#777777]">
                ({reviews.length} reseñas verificadas)
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-[#121212] border border-[#d4af37]/40 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-[#888888] uppercase tracking-wider block">
                Precio Exclusivo
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#f5d77f]">
                  ${currentPrice.toLocaleString('es-CO')}
                </span>
                {selectedProduct.en_oferta && (
                  <span className="text-sm text-[#888888] line-through">
                    ${selectedProduct.precio.toLocaleString('es-CO')}
                  </span>
                )}
              </div>
            </div>

            {selectedProduct.en_oferta && selectedProduct.precio_oferta && (
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-[#1e1708] border border-[#d4af37] text-xs font-bold text-[#f5d77f] rounded-full">
                  Ahorras ${(selectedProduct.precio - selectedProduct.precio_oferta).toLocaleString('es-CO')}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#e0e0e0]">
              Descripción & Detalles de Alta Costura
            </h3>
            <p className="text-sm text-[#bbbbbb] leading-relaxed font-light">
              {selectedProduct.descripcion}
            </p>
          </div>

          {/* Size Selector */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#e0e0e0] uppercase">
                Selecciona tu Talla: <span className="text-[#f5d77f]">{selectedSize}</span>
              </span>
              <span className="text-[#888888]">
                {availableStockForSize > 0 ? (
                  <span className="text-[#d4af37] font-medium">● {availableStockForSize} disponibles</span>
                ) : (
                  <span className="text-[#ff5555]">Agotada en esta talla</span>
                )}
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {selectedProduct.tallas.map((t) => (
                <button
                  key={t.talla}
                  id={`size-select-btn-${t.talla}`}
                  onClick={() => {
                    setSelectedSize(t.talla);
                    setQuantity(1);
                  }}
                  disabled={t.stock <= 0}
                  className={`py-3 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center gap-0.5 ${
                    selectedSize === t.talla
                      ? 'bg-gradient-to-br from-[#f5d77f] to-[#d4af37] text-[#080808] border-[#d4af37] shadow-lg shadow-[#d4af37]/20 scale-105'
                      : t.stock > 0
                      ? 'bg-[#141414] text-[#f4f4f4] border-[#2c2c2c] hover:border-[#d4af37]'
                      : 'bg-[#0e0e0e] text-[#444444] border-[#1f1f1f] cursor-not-allowed line-through'
                  }`}
                >
                  <span>{t.talla}</span>
                  <span className="text-[9px] font-normal opacity-80">
                    {t.stock > 0 ? `${t.stock} unid.` : '0'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold uppercase text-[#e0e0e0]">Cantidad</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-[#d4af37]/40 rounded-xl bg-[#141414] overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-sm text-[#f5d77f] hover:bg-[#201c12]"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-5 py-2 text-sm font-bold text-[#ffffff]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(availableStockForSize, quantity + 1))}
                  className="px-4 py-2 text-sm text-[#f5d77f] hover:bg-[#201c12]"
                  disabled={quantity >= availableStockForSize}
                >
                  +
                </button>
              </div>

              <span className="text-xs text-[#888888]">
                Subtotal: <strong className="text-[#f5d77f]">${(currentPrice * quantity).toLocaleString('es-CO')}</strong>
              </span>
            </div>
          </div>

          {/* Action Buttons: Agregar al Carrito & Comprar Ahora */}
          <div className="space-y-3 pt-4 border-t border-[#222222]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Add to Cart */}
              <button
                id="product-add-to-cart-action-btn"
                onClick={() => addToCart(selectedProduct, selectedSize, quantity)}
                disabled={availableStockForSize <= 0}
                className="py-4 px-6 rounded-full bg-[#161616] border border-[#d4af37] text-[#f5d77f] font-bold text-xs uppercase tracking-wider hover:bg-[#d4af37] hover:text-[#080808] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Agregar al Carrito</span>
              </button>

              {/* Buy Now Direct */}
              <button
                id="product-buy-now-action-btn"
                onClick={() => buyNow(selectedProduct, selectedSize, quantity)}
                disabled={availableStockForSize <= 0}
                className="py-4 px-6 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f5d77f] to-[#aa820a] text-[#080808] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#d4af37]/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>Comprar Ahora</span>
              </button>

            </div>
          </div>

          {/* Value Accordion / Badges */}
          <div className="space-y-3 pt-4 border-t border-[#222222] text-xs text-[#a0a0a0]">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0e0e0e] border border-[#222222]">
              <Truck className="w-5 h-5 text-[#d4af37] flex-shrink-0" />
              <div>
                <strong className="text-[#f5d77f]">Envío Nacional Seguro:</strong> Entrega estimada en 2 a 3 días hábiles. Gratis en compras mayores a $200.000 COP.
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0e0e0e] border border-[#222222]">
              <ShieldCheck className="w-5 h-5 text-[#d4af37] flex-shrink-0" />
              <div>
                <strong className="text-[#f5d77f]">Empaque de Lujo:</strong> Incluye estuche rígido negro satinado con sello dorado y certificado de calidad.
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0e0e0e] border border-[#222222]">
              <RotateCcw className="w-5 h-5 text-[#d4af37] flex-shrink-0" />
              <div>
                <strong className="text-[#f5d77f]">Garantía de Talla:</strong> Primer cambio de talla 100% gratuito sin trámites complicados.
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Reviews & Ratings Section */}
      <section className="border-t border-[#222222] pt-12 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] font-cinzel">
              Opiniones de Clientes VIP
            </span>
            <h2 className="text-2xl font-bold text-[#ffffff] font-cinzel">
              Reseñas y Calificaciones ({reviews.length})
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Write a review form */}
          <div className="bg-[#101010] border border-[#d4af37]/30 rounded-2xl p-6 space-y-4 h-fit">
            <h3 className="text-sm font-bold text-[#f5d77f] uppercase font-cinzel">
              Dejar una Reseña
            </h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs text-[#888888] block">Tu Calificación</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="text-[#d4af37] hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewRating ? 'fill-current' : 'text-[#333333]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#888888] block">Título de tu experiencia</label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Ej: Calidad insuperable y ajuste perfecto"
                  className="w-full bg-[#181818] border border-[#d4af37]/40 rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#888888] block">Comentario detallado</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={3}
                  placeholder="Cuéntanos sobre la tela, la talla, la caída y tu experiencia con Glamur..."
                  required
                  className="w-full bg-[#181818] border border-[#d4af37]/40 rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-[#080808] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publicar Reseña</span>
              </button>
            </form>
          </div>

          {/* List of customer reviews */}
          <div className="lg:col-span-2 space-y-4">
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="p-5 rounded-2xl bg-[#0e0e0e] border border-[#242424] space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#181818] border border-[#d4af37]/40 text-[#f5d77f] font-bold text-xs flex items-center justify-center">
                          {r.nombre_usuario.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#f4f4f4]">{r.nombre_usuario}</p>
                          <p className="text-[10px] text-[#777777]">{r.fecha}</p>
                        </div>
                      </div>

                      <div className="flex text-[#d4af37]">
                        {[...Array(5)].map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-3.5 h-3.5 ${
                              idx < r.calificacion ? 'fill-current' : 'text-[#333333]'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {r.titulo && (
                      <h4 className="text-xs font-bold text-[#f5d77f]">{r.titulo}</h4>
                    )}
                    <p className="text-xs text-[#b8b8b8] leading-relaxed">{r.comentario}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-[#0e0e0e] border border-[#222222] rounded-2xl text-xs text-[#777777]">
                Sé el primero en dejar una reseña sobre esta prenda exclusiva.
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-[#222222] pt-12 space-y-6">
          <h2 className="text-2xl font-bold text-[#ffffff] font-cinzel">
            Prendas Relacionadas que te Pueden Interesar
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onOpenDetail={() => openProductDetail(p)}
                onAddToCart={() => addToCart(p, p.tallas[0]?.talla || 'M', 1)}
                onToggleFavorite={() => toggleFavorite(p.id)}
                isFav={isFavorite(p.id)}
              />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

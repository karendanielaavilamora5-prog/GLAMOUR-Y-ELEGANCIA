import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Crown, 
  Flame, 
  Tag, 
  Star, 
  ShieldCheck, 
  Truck, 
  Heart, 
  ShoppingBag,
  Eye
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

export const HomeView: React.FC = () => {
  const {
    products,
    categories,
    setActiveView,
    filterByCategory,
    openProductDetail,
    addToCart,
    toggleFavorite,
    isFavorite,
  } = useStore();

  const featuredProducts = products.filter(p => p.activo && p.es_destacado).slice(0, 4);
  const newProducts = products.filter(p => p.activo && p.es_novedad).slice(0, 4);
  const offerProducts = products.filter(p => p.activo && p.en_oferta).slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[580px] lg:min-h-[660px] flex items-center justify-center overflow-hidden rounded-b-3xl border-b border-[#d4af37]/30 bg-[#080808]">
        {/* Background Image with dark luxury gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
            alt="Glamur y Elegancia Colección"
            className="w-full h-full object-cover object-center opacity-35 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/70 to-[#080808]/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 pt-12">
          
          {/* Subtle gold badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#121212]/90 border border-[#d4af37]/50 backdrop-blur-md shadow-lg shadow-[#d4af37]/10">
            <Crown className="w-4 h-4 text-[#d4af37]" />
            <span className="text-xs font-semibold tracking-widest text-[#f5d77f] uppercase font-cinzel">
              Colección Exclusiva 2026
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight font-cinzel text-[#ffffff] leading-tight">
            GLAMUR & <span className="gold-gradient-text">ELEGANCIA</span>
          </h1>

          {/* Subphrase on Fashion and Distinction */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#d8d8d8] font-light leading-relaxed font-cormorant italic">
            "El arte de vestir con distinción y porte sublime, donde la nobleza del negro profundo se entrelaza con el resplandor eterno del dorado."
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              id="hero-shop-now-btn"
              onClick={() => {
                filterByCategory(null);
                setActiveView('catalogo');
              }}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f5d77f] to-[#aa820a] text-[#080808] font-bold text-sm uppercase tracking-wider hover:brightness-110 transition-all shadow-xl shadow-[#d4af37]/25 flex items-center gap-2 group cursor-pointer"
            >
              <span>Comprar Ahora</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="hero-offers-btn"
              onClick={() => filterByCategory('ofertas')}
              className="px-8 py-4 rounded-full bg-[#121212]/80 border border-[#d4af37]/70 text-[#f5d77f] font-semibold text-sm uppercase tracking-wider hover:bg-[#d4af37]/15 transition-all backdrop-blur-sm cursor-pointer flex items-center gap-2"
            >
              <Tag className="w-4 h-4 text-[#d4af37]" />
              <span>Ver Ofertas VIP</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="pt-10 grid grid-cols-3 max-w-lg mx-auto border-t border-[#d4af37]/20 text-center">
            <div>
              <p className="text-xl sm:text-2xl font-bold text-[#f5d77f] font-cinzel">100%</p>
              <p className="text-[11px] text-[#999999] uppercase tracking-wider">Alta Calidad</p>
            </div>
            <div className="border-x border-[#d4af37]/20">
              <p className="text-xl sm:text-2xl font-bold text-[#f5d77f] font-cinzel">VIP</p>
              <p className="text-[11px] text-[#999999] uppercase tracking-wider">Envío Express</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-[#f5d77f] font-cinzel">24/7</p>
              <p className="text-[11px] text-[#999999] uppercase tracking-wider">Asesoría</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. CATEGORIES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#222222] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] font-cinzel">
              Explora Nuestras Líneas
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#f4f4f4] font-cinzel">
              Categorías Exclusivas
            </h2>
          </div>
          <button
            onClick={() => { filterByCategory(null); setActiveView('catalogo'); }}
            className="text-xs font-semibold text-[#f5d77f] hover:underline flex items-center gap-1.5"
          >
            Ver catálogo completo →
          </button>
        </div>

        {/* 5 Distinct Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => filterByCategory(cat.slug)}
              className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer border border-[#d4af37]/30 hover:border-[#d4af37] transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-[#d4af37]/20 bg-[#121212]"
            >
              <img
                src={cat.imagen_url}
                alt={cat.nombre}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-70 group-hover:opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/40 to-transparent" />
              
              <div className="absolute bottom-0 inset-x-0 p-4 text-center space-y-1">
                <span className="text-[10px] text-[#d4af37] uppercase tracking-widest font-semibold block">
                  Línea
                </span>
                <h3 className="text-lg font-bold text-[#f5d77f] font-cinzel group-hover:text-[#ffd700] transition-colors">
                  {cat.nombre}
                </h3>
                <p className="text-[11px] text-[#b0b0b0] line-clamp-1">
                  {cat.descripcion}
                </p>
                <div className="pt-2">
                  <span className="inline-block px-3 py-1 text-[10px] uppercase font-bold text-[#080808] bg-[#d4af37] rounded-full group-hover:bg-[#f5d77f] transition-colors">
                    Ver prendas
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (DESTACADOS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#222222] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#181818] border border-[#d4af37]/40 text-[#d4af37]">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] font-cinzel">
                Selección de Lujo
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#f4f4f4] font-cinzel">
                Productos Destacados
              </h2>
            </div>
          </div>
          <button
            onClick={() => { filterByCategory(null); setActiveView('catalogo'); }}
            className="text-xs font-semibold text-[#f5d77f] hover:underline"
          >
            Ver todos los destacados →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetail={() => openProductDetail(product)}
              onAddToCart={() => addToCart(product, product.tallas[0]?.talla || 'M', 1)}
              onToggleFavorite={() => toggleFavorite(product.id)}
              isFav={isFavorite(product.id)}
            />
          ))}
        </div>
      </section>

      {/* 4. PROMOTIONAL GOLD BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-[#d4af37]/60 bg-gradient-to-r from-[#14120c] via-[#241a05] to-[#14120c] p-8 sm:p-12 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a0a0a] border border-[#d4af37] text-xs font-bold text-[#f5d77f] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" /> Oferta Especial de Temporada
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#ffffff] font-cinzel">
              HASTA <span className="gold-gradient-text">20% OFF</span> EN ALTA COSTURA
            </h2>
            <p className="text-sm text-[#cccccc] leading-relaxed">
              Descubre trajes, smokings y vestidos de gala confeccionados con acabados artesanales y detalles dorados. Usa el cupón <strong className="text-[#f5d77f] border-b border-[#f5d77f]">GLAMUR20</strong> al finalizar tu compra.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => filterByCategory('ofertas')}
                className="px-6 py-3 rounded-full bg-[#d4af37] text-[#080808] text-xs font-bold uppercase tracking-wider hover:bg-[#f5d77f] transition-all cursor-pointer shadow-lg"
              >
                Aprovechar Ofertas
              </button>
              <button
                onClick={() => { filterByCategory(null); setActiveView('catalogo'); }}
                className="px-6 py-3 rounded-full border border-[#d4af37]/60 text-[#f5d77f] text-xs font-semibold uppercase tracking-wider hover:bg-[#1f190d] transition-all cursor-pointer"
              >
                Ver Todo el Catálogo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEW ARRIVALS (NOVEDADES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#222222] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#181818] border border-[#d4af37]/40 text-[#d4af37]">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] font-cinzel">
                Lanzamientos Recientes
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#f4f4f4] font-cinzel">
                Novedades 2026
              </h2>
            </div>
          </div>
          <button
            onClick={() => filterByCategory('novedades')}
            className="text-xs font-semibold text-[#f5d77f] hover:underline"
          >
            Ver todas las novedades →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetail={() => openProductDetail(product)}
              onAddToCart={() => addToCart(product, product.tallas[0]?.talla || 'M', 1)}
              onToggleFavorite={() => toggleFavorite(product.id)}
              isFav={isFavorite(product.id)}
            />
          ))}
        </div>
      </section>

      {/* 6. BRAND ESSENCE & TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-[#d4af37]/30 space-y-4">
            <div className="flex text-[#d4af37]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-sm text-[#cccccc] italic font-cormorant leading-relaxed">
              "El vestido Noir & Gold es una obra de arte. El calce es perfecto y el brillo del hilo de oro en persona es inigualable."
            </p>
            <div className="border-t border-[#222222] pt-3">
              <p className="text-xs font-bold text-[#f5d77f]">Daniela Ávila</p>
              <p className="text-[10px] text-[#888888]">Cliente VIP Bogotá</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-[#d4af37]/30 space-y-4">
            <div className="flex text-[#d4af37]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-sm text-[#cccccc] italic font-cormorant leading-relaxed">
              "Compré el smoking imperial para un evento de gala. Llegó perfectamente empacado y con una confección de primer nivel."
            </p>
            <div className="border-t border-[#222222] pt-3">
              <p className="text-xs font-bold text-[#f5d77f]">Santiago Mendoza</p>
              <p className="text-[10px] text-[#888888]">Cliente VIP Medellín</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-[#d4af37]/30 space-y-4">
            <div className="flex text-[#d4af37]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-sm text-[#cccccc] italic font-cormorant leading-relaxed">
              "La atención personalizada y el proceso de compra son impecables. Excelente opción para quienes buscamos moda sofisticada."
            </p>
            <div className="border-t border-[#222222] pt-3">
              <p className="text-xs font-bold text-[#f5d77f]">Valentina Gómez</p>
              <p className="text-[10px] text-[#888888]">Cliente VIP Cali</p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

// Reusable Product Card Component
export const ProductCard: React.FC<{
  product: Product;
  onOpenDetail: () => void;
  onAddToCart: () => void;
  onToggleFavorite: () => void;
  isFav: boolean;
}> = ({ product, onOpenDetail, onAddToCart, onToggleFavorite, isFav }) => {
  const currentPrice = product.precio_oferta || product.precio;

  return (
    <div className="group relative bg-[#121212] rounded-2xl border border-[#d4af37]/30 hover:border-[#d4af37] transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-xl hover:shadow-[#d4af37]/15">
      
      {/* Product Image & Badges */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#0c0c0c] cursor-pointer" onClick={onOpenDetail}>
        <img
          src={product.imagen_principal}
          alt={product.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-60" />

        {/* Badges on Top-Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.en_oferta && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-[#080808] shadow-md">
              Oferta
            </span>
          )}
          {product.es_novedad && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0a0a0a]/90 text-[#f5d77f] border border-[#d4af37]/60 shadow-md">
              Novedad
            </span>
          )}
        </div>

        {/* Wishlist Button on Top-Right */}
        <button
          id={`favorite-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            isFav
              ? 'bg-[#d4af37] text-[#080808] shadow-lg shadow-[#d4af37]/30'
              : 'bg-[#080808]/70 text-[#f5d77f] border border-[#d4af37]/40 hover:bg-[#d4af37] hover:text-[#080808]'
          }`}
          title={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail();
            }}
            className="flex-1 py-2 rounded-xl bg-[#080808]/90 text-[#f5d77f] border border-[#d4af37]/80 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#d4af37] hover:text-[#080808] transition-all backdrop-blur-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ver Detalle</span>
          </button>
        </div>
      </div>

      {/* Product Details info */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-[#a0a0a0]">
            <span className="uppercase tracking-wider text-[#d4af37]/80">{product.nombre_categoria}</span>
            <div className="flex items-center gap-1 text-[#f5d77f]">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.calificacion_promedio.toFixed(1)}</span>
            </div>
          </div>

          <h3 
            onClick={onOpenDetail}
            className="text-sm font-semibold text-[#f4f4f4] hover:text-[#f5d77f] cursor-pointer line-clamp-1 transition-colors"
          >
            {product.nombre}
          </h3>

          <p className="text-xs text-[#888888] line-clamp-2 leading-relaxed">
            {product.descripcion}
          </p>
        </div>

        {/* Sizes summary */}
        <div className="flex items-center gap-1 flex-wrap pt-1">
          <span className="text-[10px] text-[#777777]">Tallas:</span>
          {product.tallas.map(t => (
            <span
              key={t.talla}
              className={`text-[9px] px-1.5 py-0.5 rounded border ${
                t.stock > 0
                  ? 'border-[#333333] text-[#bbbbbb] bg-[#181818]'
                  : 'border-transparent text-[#555555] line-through'
              }`}
            >
              {t.talla}
            </span>
          ))}
        </div>

        {/* Pricing & Add to Cart button */}
        <div className="pt-2 border-t border-[#222222] flex items-center justify-between gap-2">
          <div>
            <p className="text-base font-bold text-[#f5d77f]">
              ${currentPrice.toLocaleString('es-CO')}
            </p>
            {product.en_oferta && (
              <p className="text-xs text-[#888888] line-through">
                ${product.precio.toLocaleString('es-CO')}
              </p>
            )}
          </div>

          <button
            id={`add-cart-btn-${product.id}`}
            onClick={onAddToCart}
            className="p-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-[#080808] hover:brightness-110 transition-all shadow-md shadow-[#d4af37]/20 cursor-pointer"
            title="Agregar al carrito"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

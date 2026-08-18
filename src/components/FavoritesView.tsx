import React from 'react';
import { 
  Heart, 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  Crown, 
  Sparkles, 
  Star 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './HomeView';

export const FavoritesView: React.FC = () => {
  const {
    products,
    favorites,
    toggleFavorite,
    openProductDetail,
    addToCart,
    isFavorite,
    setActiveView
  } = useStore();

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#242424] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs uppercase font-bold text-[#d4af37] font-cinzel">
            <Heart className="w-4 h-4 fill-current" />
            <span>Lista de Deseos VIP</span>
          </div>
          <h1 className="text-3xl font-bold text-[#ffffff] font-cinzel">
            Tus Prendas Favoritas ({favoriteProducts.length})
          </h1>
          <p className="text-xs text-[#888888]">
            Prendas que has guardado para adquirir en tu próxima ocasión especial.
          </p>
        </div>

        <button
          onClick={() => setActiveView('catalogo')}
          className="px-5 py-2.5 rounded-full bg-[#181818] border border-[#d4af37]/40 text-[#f5d77f] text-xs font-semibold hover:bg-[#d4af37] hover:text-[#000000] transition-all"
        >
          Explorar Más Prendas
        </button>
      </div>

      {/* Favorites Grid */}
      {favoriteProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetail={() => openProductDetail(product)}
              onAddToCart={() => addToCart(product, product.tallas[0]?.talla || 'M', 1)}
              onToggleFavorite={() => toggleFavorite(product.id)}
              isFav={true}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-[#0e0e0e] border border-[#222222] rounded-3xl space-y-4 max-w-md mx-auto p-8">
          <div className="w-16 h-16 rounded-full bg-[#181409] border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#f5d77f] font-cinzel">
            No tienes prendas en favoritos
          </h3>
          <p className="text-xs text-[#888888]">
            Haz clic en el icono del corazón en cualquier prenda del catálogo para guardarla aquí.
          </p>
          <button
            onClick={() => setActiveView('catalogo')}
            className="px-6 py-3 rounded-full bg-[#d4af37] text-[#080808] text-xs font-bold uppercase tracking-wider hover:bg-[#f5d77f] transition-all"
          >
            Descubrir Catálogo
          </button>
        </div>
      )}

    </div>
  );
};

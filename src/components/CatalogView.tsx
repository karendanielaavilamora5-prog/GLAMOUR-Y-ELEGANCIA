import React, { useState } from 'react';
import { 
  Filter, 
  X, 
  RotateCcw, 
  SlidersHorizontal, 
  Sparkles, 
  Search, 
  Check,
  Tag,
  Flame,
  Crown
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './HomeView';
import { SizeName } from '../types';

const ALL_SIZES: SizeName[] = ['XS', 'S', 'M', 'L', 'XL', '4', '6', '8', '10', '12', '36', '37', '38', '39', '40', '41', '42', 'Única'];

export const CatalogView: React.FC = () => {
  const {
    filteredProducts,
    categories,
    filters,
    setFilters,
    resetFilters,
    openProductDetail,
    addToCart,
    toggleFavorite,
    isFavorite,
  } = useStore();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const activeCategory = categories.find((c) => c.id === filters.categoriaId);

  // Quick active filters count
  let activeFiltersCount = 0;
  if (filters.categoriaId) activeFiltersCount++;
  if (filters.talla) activeFiltersCount++;
  if (filters.precioMax < 500000) activeFiltersCount++;
  if (filters.soloDisponibles) activeFiltersCount++;
  if (filters.soloOfertas) activeFiltersCount++;
  if (filters.soloNovedades) activeFiltersCount++;
  if (filters.busqueda) activeFiltersCount++;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header Banner & Title */}
      <div className="rounded-2xl bg-gradient-to-r from-[#121212] via-[#1a160d] to-[#121212] border border-[#d4af37]/30 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#d4af37]">
            <Crown className="w-4 h-4" />
            <span>Colección Glamur & Elegancia</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#ffffff] font-cinzel">
            {filters.soloOfertas
              ? 'Ofertas Exclusivas'
              : filters.soloNovedades
              ? 'Novedades de Alta Costura'
              : activeCategory
              ? `Línea: ${activeCategory.nombre}`
              : 'Catálogo Completo'}
          </h1>
          <p className="text-xs sm:text-sm text-[#a8a8a8] max-w-xl">
            {activeCategory
              ? activeCategory.descripcion
              : 'Prendas confeccionadas con los más altos estándares textiles y detalles artesanales dorados.'}
          </p>
        </div>

        {/* Search inside catalog */}
        <div className="w-full md:w-72">
          <div className="relative">
            <input
              type="text"
              value={filters.busqueda}
              onChange={(e) => setFilters((prev) => ({ ...prev, busqueda: e.target.value }))}
              placeholder="Filtrar por nombre o tela..."
              className="w-full bg-[#0a0a0a] border border-[#d4af37]/40 rounded-xl py-2.5 pl-9 pr-8 text-xs text-[#f4f4f4] placeholder-[#777777] focus:outline-none focus:border-[#d4af37]"
            />
            <Search className="w-4 h-4 text-[#d4af37] absolute left-3 top-1/2 -translate-y-1/2" />
            {filters.busqueda && (
              <button
                onClick={() => setFilters((prev) => ({ ...prev, busqueda: '' }))}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#888888] hover:text-[#f5d77f]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Controls Bar (Mobile filter toggle + Sort Dropdown) */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#101010] border border-[#222222]">
        
        {/* Filter toggle on mobile */}
        <button
          id="toggle-mobile-filters-btn"
          onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg bg-[#181818] border border-[#d4af37]/40 text-xs font-semibold text-[#f5d77f]"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#d4af37]" />
          <span>Filtros ({activeFiltersCount})</span>
        </button>

        {/* Product Count indicator */}
        <div className="text-xs text-[#a0a0a0]">
          Mostrando <span className="text-[#f5d77f] font-bold">{filteredProducts.length}</span> prendas de lujo
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <label htmlFor="catalog-sort-select" className="text-xs text-[#888888] hidden sm:inline">
            Ordenar por:
          </label>
          <select
            id="catalog-sort-select"
            value={filters.ordenarPor}
            onChange={(e) => setFilters((prev) => ({ ...prev, ordenarPor: e.target.value as any }))}
            className="bg-[#181818] border border-[#d4af37]/40 rounded-lg py-1.5 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37] cursor-pointer"
          >
            <option value="recientes">Más Recientes</option>
            <option value="precio_asc">Precio: Menor a Mayor</option>
            <option value="precio_desc">Precio: Mayor a Menor</option>
            <option value="mas_vendidos">Más Vendidos</option>
            <option value="calificacion">Mejor Calificados</option>
          </select>
        </div>
      </div>

      {/* Active Filter Pills */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-[#888888]">Filtros activos:</span>

          {filters.categoriaId && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18150a] border border-[#d4af37]/50 text-xs text-[#f5d77f]">
              {activeCategory?.nombre}
              <button
                onClick={() => setFilters((prev) => ({ ...prev, categoriaId: null }))}
                className="hover:text-[#ffffff]"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.talla && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18150a] border border-[#d4af37]/50 text-xs text-[#f5d77f]">
              Talla: {filters.talla}
              <button
                onClick={() => setFilters((prev) => ({ ...prev, talla: null }))}
                className="hover:text-[#ffffff]"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.soloOfertas && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18150a] border border-[#d4af37]/50 text-xs text-[#f5d77f]">
              Solo Ofertas
              <button
                onClick={() => setFilters((prev) => ({ ...prev, soloOfertas: false }))}
                className="hover:text-[#ffffff]"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.soloNovedades && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18150a] border border-[#d4af37]/50 text-xs text-[#f5d77f]">
              Solo Novedades
              <button
                onClick={() => setFilters((prev) => ({ ...prev, soloNovedades: false }))}
                className="hover:text-[#ffffff]"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.soloDisponibles && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18150a] border border-[#d4af37]/50 text-xs text-[#f5d77f]">
              En Stock
              <button
                onClick={() => setFilters((prev) => ({ ...prev, soloDisponibles: false }))}
                className="hover:text-[#ffffff]"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.precioMax < 500000 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18150a] border border-[#d4af37]/50 text-xs text-[#f5d77f]">
              Hasta ${filters.precioMax.toLocaleString('es-CO')}
              <button
                onClick={() => setFilters((prev) => ({ ...prev, precioMax: 500000 }))}
                className="hover:text-[#ffffff]"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            id="clear-all-filters-btn"
            onClick={resetFilters}
            className="text-xs text-[#d4af37] underline hover:text-[#f5d77f] ml-2 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Limpiar filtros
          </button>
        </div>
      )}

      {/* 3. Catalog Layout (Sidebar Filters + Products Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filter Panel */}
        <aside className="hidden lg:block space-y-6 bg-[#0f0f0f] border border-[#d4af37]/30 rounded-2xl p-6 h-fit sticky top-28">
          <div className="flex items-center justify-between border-b border-[#222222] pb-3">
            <h3 className="text-sm font-bold text-[#f5d77f] uppercase tracking-wider font-cinzel flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#d4af37]" />
              Filtros
            </h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-[11px] text-[#888888] hover:text-[#d4af37] transition-colors"
              >
                Restablecer
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#e0e0e0] uppercase tracking-wider">
              Categorías
            </h4>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setFilters((prev) => ({ ...prev, categoriaId: null, soloOfertas: false, soloNovedades: false }))}
                className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-colors flex justify-between ${
                  !filters.categoriaId && !filters.soloOfertas && !filters.soloNovedades
                    ? 'bg-[#d4af37] text-[#000000] font-bold'
                    : 'text-[#a0a0a0] hover:bg-[#181818] hover:text-[#f5d77f]'
                }`}
              >
                <span>Todas</span>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilters((prev) => ({ ...prev, categoriaId: cat.id, soloOfertas: false, soloNovedades: false }))}
                  className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-colors flex justify-between ${
                    filters.categoriaId === cat.id
                      ? 'bg-[#d4af37] text-[#000000] font-bold'
                      : 'text-[#a0a0a0] hover:bg-[#181818] hover:text-[#f5d77f]'
                  }`}
                >
                  <span>{cat.nombre}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-3 border-t border-[#222222] pt-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-[#e0e0e0] uppercase tracking-wider">
                Tallas
              </h4>
              {filters.talla && (
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, talla: null }))}
                  className="text-[10px] text-[#d4af37] hover:underline"
                >
                  Borrar
                </button>
              )}
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {ALL_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      talla: prev.talla === size ? null : size,
                    }))
                  }
                  className={`py-1.5 text-xs rounded border transition-all ${
                    filters.talla === size
                      ? 'bg-[#d4af37] text-[#000000] font-bold border-[#d4af37]'
                      : 'bg-[#141414] text-[#cccccc] border-[#2c2c2c] hover:border-[#d4af37]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3 border-t border-[#222222] pt-4">
            <h4 className="text-xs font-bold text-[#e0e0e0] uppercase tracking-wider">
              Precio Máximo
            </h4>
            <input
              type="range"
              min={50000}
              max={500000}
              step={10000}
              value={filters.precioMax}
              onChange={(e) => setFilters((prev) => ({ ...prev, precioMax: Number(e.target.value) }))}
              className="w-full accent-[#d4af37] bg-[#222222] h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-xs text-[#a0a0a0]">
              <span>$50.000</span>
              <span className="font-bold text-[#f5d77f]">
                ${filters.precioMax.toLocaleString('es-CO')}
              </span>
            </div>
          </div>

          {/* Quick Toggles */}
          <div className="space-y-2 border-t border-[#222222] pt-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-[#cccccc] hover:text-[#f5d77f]">
              <input
                type="checkbox"
                checked={filters.soloDisponibles}
                onChange={(e) => setFilters((prev) => ({ ...prev, soloDisponibles: e.target.checked }))}
                className="rounded accent-[#d4af37] bg-[#1a1a1a] border-[#333333]"
              />
              <span>Solo en inventario disponible</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-[#cccccc] hover:text-[#f5d77f]">
              <input
                type="checkbox"
                checked={filters.soloOfertas}
                onChange={(e) => setFilters((prev) => ({ ...prev, soloOfertas: e.target.checked }))}
                className="rounded accent-[#d4af37] bg-[#1a1a1a] border-[#333333]"
              />
              <span>Solo productos en oferta</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-[#cccccc] hover:text-[#f5d77f]">
              <input
                type="checkbox"
                checked={filters.soloNovedades}
                onChange={(e) => setFilters((prev) => ({ ...prev, soloNovedades: e.target.checked }))}
                className="rounded accent-[#d4af37] bg-[#1a1a1a] border-[#333333]"
              />
              <span>Solo novedades de temporada</span>
            </label>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
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
          ) : (
            <div className="p-12 text-center bg-[#101010] border border-[#d4af37]/30 rounded-2xl space-y-4">
              <Sparkles className="w-10 h-10 text-[#d4af37] mx-auto animate-pulse" />
              <h3 className="text-lg font-bold text-[#f4f4f4] font-cinzel">
                No encontramos prendas con estos filtros
              </h3>
              <p className="text-xs text-[#888888] max-w-md mx-auto">
                Prueba ajustando el rango de precios, seleccionando otra talla o restableciendo los filtros para ver todo nuestro catálogo exclusivo.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-full bg-[#d4af37] text-[#080808] text-xs font-bold uppercase tracking-wider hover:bg-[#f5d77f] transition-all"
              >
                Restablecer Filtros
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-[#080808]/95 backdrop-blur-md p-6 overflow-y-auto lg:hidden">
          <div className="flex items-center justify-between border-b border-[#d4af37]/30 pb-4 mb-6">
            <h3 className="text-base font-bold text-[#f5d77f] uppercase tracking-wider font-cinzel">
              Filtros de Búsqueda
            </h3>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="p-2 rounded-full bg-[#181818] text-[#d4af37]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Categories */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#e0e0e0] uppercase">Categorías</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, categoriaId: null, soloOfertas: false, soloNovedades: false }))}
                  className={`p-2.5 text-xs rounded-lg border ${
                    !filters.categoriaId && !filters.soloOfertas && !filters.soloNovedades
                      ? 'bg-[#d4af37] text-[#000000] font-bold border-[#d4af37]'
                      : 'bg-[#141414] text-[#cccccc] border-[#222222]'
                  }`}
                >
                  Todas
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFilters((prev) => ({ ...prev, categoriaId: cat.id, soloOfertas: false, soloNovedades: false }))}
                    className={`p-2.5 text-xs rounded-lg border ${
                      filters.categoriaId === cat.id
                        ? 'bg-[#d4af37] text-[#000000] font-bold border-[#d4af37]'
                        : 'bg-[#141414] text-[#cccccc] border-[#222222]'
                    }`}
                  >
                    {cat.nombre}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#e0e0e0] uppercase">Tallas</h4>
              <div className="grid grid-cols-4 gap-2">
                {ALL_SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setFilters((prev) => ({ ...prev, talla: prev.talla === size ? null : size }))}
                    className={`py-2 text-xs rounded-lg border ${
                      filters.talla === size
                        ? 'bg-[#d4af37] text-[#000000] font-bold border-[#d4af37]'
                        : 'bg-[#141414] text-[#cccccc] border-[#222222]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Max */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-[#e0e0e0] uppercase">Precio Máximo:</span>
                <span className="text-[#f5d77f] font-bold">${filters.precioMax.toLocaleString('es-CO')}</span>
              </div>
              <input
                type="range"
                min={50000}
                max={500000}
                step={10000}
                value={filters.precioMax}
                onChange={(e) => setFilters((prev) => ({ ...prev, precioMax: Number(e.target.value) }))}
                className="w-full accent-[#d4af37] bg-[#222222] h-2 rounded-lg"
              />
            </div>

            {/* Quick check toggles */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 text-xs text-[#cccccc]">
                <input
                  type="checkbox"
                  checked={filters.soloDisponibles}
                  onChange={(e) => setFilters((prev) => ({ ...prev, soloDisponibles: e.target.checked }))}
                  className="w-4 h-4 accent-[#d4af37]"
                />
                <span>Solo disponibles en inventario</span>
              </label>

              <label className="flex items-center gap-3 text-xs text-[#cccccc]">
                <input
                  type="checkbox"
                  checked={filters.soloOfertas}
                  onChange={(e) => setFilters((prev) => ({ ...prev, soloOfertas: e.target.checked }))}
                  className="w-4 h-4 accent-[#d4af37]"
                />
                <span>Solo ofertas</span>
              </label>

              <label className="flex items-center gap-3 text-xs text-[#cccccc]">
                <input
                  type="checkbox"
                  checked={filters.soloNovedades}
                  onChange={(e) => setFilters((prev) => ({ ...prev, soloNovedades: e.target.checked }))}
                  className="w-4 h-4 accent-[#d4af37]"
                />
                <span>Solo novedades</span>
              </label>
            </div>

            {/* Mobile Apply and Reset Buttons */}
            <div className="pt-6 border-t border-[#222222] flex gap-3">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-[#080808] font-bold text-xs uppercase tracking-wider"
              >
                Ver {filteredProducts.length} Prendas
              </button>
              <button
                onClick={() => { resetFilters(); setMobileFiltersOpen(false); }}
                className="px-4 py-3 rounded-xl bg-[#141414] border border-[#d4af37]/40 text-xs text-[#f5d77f]"
              >
                Restablecer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

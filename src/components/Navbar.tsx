import React, { useState, useRef, useEffect } from 'react';
import { 
  Crown, 
  Search, 
  Heart, 
  ShoppingBag, 
  User as UserIcon, 
  Menu, 
  X, 
  Sparkles, 
  ShieldCheck, 
  LogOut, 
  Package, 
  MapPin, 
  LayoutDashboard,
  ChevronDown,
  Tag,
  Flame
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    cartItemCount,
    setIsCartDrawerOpen,
    favorites,
    currentUser,
    isAuthenticated,
    isAdmin,
    logout,
    openAuthModal,
    categories,
    filterByCategory,
    products,
    openProductDetail,
    filters,
    setFilters
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Quick live search matching items
  const quickSearchResults = searchQuery.trim().length > 1 
    ? products.filter(p => 
        p.activo && (
          p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.nombre_categoria.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setFilters(prev => ({ ...prev, busqueda: searchQuery.trim(), categoriaId: null }));
      setActiveView('catalogo');
      setSearchDropdownOpen(false);
    }
  };

  const handleCategoryClick = (catSlug: string) => {
    filterByCategory(catSlug);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080808]/95 backdrop-blur-md border-b border-[#d4af37]/30 transition-all">
      {/* Top Luxury Announcement Bar */}
      <div className="bg-gradient-to-r from-[#121212] via-[#241c09] to-[#121212] py-1.5 px-4 text-center text-xs border-b border-[#d4af37]/20 flex items-center justify-center gap-3">
        <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
        <span className="text-[#f5d77f] font-medium tracking-wider">
          COLECCIÓN DE ALTA COSTURA 2026 | ENVÍO VIP GRATIS EN COMPRAS MAYORES A $200.000 COP
        </span>
        <span className="hidden sm:inline text-xs text-[#d4af37] border border-[#d4af37]/40 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
          Cupón 10%: ELEGANCIA10
        </span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#d4af37] hover:text-[#f5d77f] hover:bg-[#181818] focus:outline-none"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveView('inicio')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] via-[#aa820a] to-[#594405] p-0.5 flex items-center justify-center shadow-lg shadow-[#d4af37]/10 group-hover:shadow-[#d4af37]/30 transition-all duration-300">
              <div className="w-full h-full rounded-full bg-[#0a0a0a] flex items-center justify-center">
                <Crown className="w-5 h-5 text-[#d4af37] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-cinzel text-xl sm:text-2xl font-bold tracking-widest text-[#f5d77f] group-hover:text-[#ffd700] transition-colors">
                GLAMUR & ELEGANCIA
              </span>
              <span className="text-[9px] tracking-[0.3em] text-[#d4af37]/80 uppercase font-medium">
                Haute Couture & Luxury Fashion
              </span>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                id="navbar-desktop-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchDropdownOpen(true);
                }}
                onFocus={() => setSearchDropdownOpen(true)}
                placeholder="Buscar vestidos, smokings, relojes..."
                className="w-full bg-[#141414] border border-[#d4af37]/40 rounded-full py-2 pl-10 pr-10 text-sm text-[#f4f4f4] placeholder-[#888888] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all"
              />
              <Search className="w-4 h-4 text-[#d4af37] absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchDropdownOpen(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#888888] hover:text-[#d4af37]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Live Search Quick Results Dropdown */}
            {searchDropdownOpen && searchQuery.trim().length > 1 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#121212] border border-[#d4af37]/50 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-2 border-b border-[#242424] flex justify-between items-center text-xs text-[#d4af37]">
                  <span>Resultados para "{searchQuery}"</span>
                  <button 
                    onClick={handleSearchSubmit}
                    className="hover:underline font-semibold"
                  >
                    Ver todos en catálogo →
                  </button>
                </div>
                {quickSearchResults.length > 0 ? (
                  <div className="divide-y divide-[#222222]">
                    {quickSearchResults.map(product => (
                      <div
                        key={product.id}
                        onClick={() => {
                          openProductDetail(product);
                          setSearchDropdownOpen(false);
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-[#1c1a14] cursor-pointer transition-colors"
                      >
                        <img 
                          src={product.imagen_principal} 
                          alt={product.nombre}
                          className="w-12 h-12 object-cover rounded-md border border-[#d4af37]/30"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#f4f4f4] truncate">{product.nombre}</p>
                          <p className="text-xs text-[#d4af37]/80">{product.nombre_categoria}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-[#f5d77f]">
                            ${(product.precio_oferta || product.precio).toLocaleString('es-CO')}
                          </p>
                          {product.en_oferta && (
                            <span className="text-[10px] text-[#aa820a] line-through">
                              ${product.precio.toLocaleString('es-CO')}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-[#999999]">
                    No se encontraron prendas con ese término. Intente con otra palabra clave.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Icons & User Menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Wishlist / Favoritos */}
            <button
              id="navbar-favorites-btn"
              onClick={() => setActiveView('favoritos')}
              className={`p-2.5 rounded-full transition-all relative ${
                activeView === 'favoritos' 
                  ? 'bg-[#d4af37]/20 text-[#f5d77f] border border-[#d4af37]' 
                  : 'text-[#d4af37] hover:bg-[#181818] hover:text-[#f5d77f]'
              }`}
              title="Mis Favoritos"
              aria-label="Mis Favoritos"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-br from-[#f5d77f] to-[#d4af37] text-[#000000] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Shopping Cart */}
            <button
              id="navbar-cart-btn"
              onClick={() => setIsCartDrawerOpen(true)}
              className="p-2.5 rounded-full text-[#d4af37] hover:bg-[#181818] hover:text-[#f5d77f] transition-all relative"
              title="Carrito de Compras"
              aria-label="Carrito de Compras"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-br from-[#f5d77f] to-[#d4af37] text-[#000000] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Account / Profile Menu */}
            <div ref={userMenuRef} className="relative">
              {isAuthenticated ? (
                <button
                  id="navbar-user-menu-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-[#161616] border border-[#d4af37]/40 hover:border-[#d4af37] text-[#f4f4f4] transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-[#d4af37] text-[#000000] font-bold text-xs flex items-center justify-center">
                    {currentUser?.nombre.charAt(0)}
                  </div>
                  <span className="text-xs font-medium hidden sm:inline text-[#f5d77f] max-w-[100px] truncate">
                    {currentUser?.nombre}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#d4af37]" />
                </button>
              ) : (
                <button
                  id="navbar-login-btn"
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-[#0a0a0a] text-xs font-bold hover:from-[#f5d77f] hover:to-[#d4af37] transition-all shadow-md shadow-[#d4af37]/20"
                >
                  <UserIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Ingresar</span>
                </button>
              )}

              {/* User Dropdown Menu */}
              {userDropdownOpen && isAuthenticated && (
                <div className="absolute right-0 mt-2 w-64 bg-[#121212] border border-[#d4af37]/50 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-[#242424]">
                    <p className="text-xs text-[#888888]">Conectado como</p>
                    <p className="text-sm font-semibold text-[#f5d77f] truncate">
                      {currentUser?.nombre} {currentUser?.apellido}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        isAdmin 
                          ? 'bg-[#d4af37] text-[#000000]' 
                          : 'bg-[#222222] text-[#d4af37] border border-[#d4af37]/40'
                      }`}>
                        {isAdmin ? '👑 Administrador' : '⭐ Cliente VIP'}
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      id="dropdown-mi-perfil-btn"
                      onClick={() => {
                        setActiveView('perfil');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#e0e0e0] hover:bg-[#1f1a0e] hover:text-[#f5d77f] flex items-center gap-2.5 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-[#d4af37]" />
                      Mi Perfil
                    </button>

                    <button
                      id="dropdown-mis-pedidos-btn"
                      onClick={() => {
                        setActiveView('perfil');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#e0e0e0] hover:bg-[#1f1a0e] hover:text-[#f5d77f] flex items-center gap-2.5 transition-colors"
                    >
                      <Package className="w-4 h-4 text-[#d4af37]" />
                      Mis Pedidos & Historial
                    </button>

                    <button
                      id="dropdown-direcciones-btn"
                      onClick={() => {
                        setActiveView('perfil');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#e0e0e0] hover:bg-[#1f1a0e] hover:text-[#f5d77f] flex items-center gap-2.5 transition-colors"
                    >
                      <MapPin className="w-4 h-4 text-[#d4af37]" />
                      Direcciones de Envío
                    </button>

                    <button
                      id="dropdown-favoritos-btn"
                      onClick={() => {
                        setActiveView('favoritos');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#e0e0e0] hover:bg-[#1f1a0e] hover:text-[#f5d77f] flex items-center gap-2.5 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-[#d4af37]" />
                      Lista de Deseos ({favorites.length})
                    </button>

                    {/* Admin Panel Direct Access */}
                    <div className="my-1 border-t border-[#242424]"></div>
                    <button
                      id="dropdown-admin-panel-btn"
                      onClick={() => {
                        setActiveView('admin');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-[#f5d77f] hover:bg-[#2a220d] flex items-center gap-2.5 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#d4af37]" />
                      Panel de Administrador
                    </button>
                    
                    <div className="my-1 border-t border-[#242424]"></div>
                    <button
                      id="dropdown-logout-btn"
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-[#ff5555] hover:bg-[#251010] flex items-center gap-2.5 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-[#ff5555]" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Admin Navigation Button for Convenience */}
            <button
              id="navbar-admin-quick-btn"
              onClick={() => setActiveView('admin')}
              className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                activeView === 'admin'
                  ? 'bg-[#d4af37] text-[#080808] border-[#d4af37]'
                  : 'bg-[#141414] text-[#d4af37] border-[#d4af37]/40 hover:border-[#d4af37] hover:bg-[#201a0a]'
              }`}
              title="Panel Administrativo"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>

          </div>
        </div>

        {/* Secondary Category Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center justify-center space-x-6 py-2.5 border-t border-[#d4af37]/20 text-xs font-medium uppercase tracking-wider">
          <button
            id="nav-link-inicio"
            onClick={() => setActiveView('inicio')}
            className={`transition-colors hover:text-[#f5d77f] ${
              activeView === 'inicio' ? 'text-[#f5d77f] font-bold border-b border-[#d4af37] pb-0.5' : 'text-[#c0c0c0]'
            }`}
          >
            Inicio
          </button>

          <button
            id="nav-link-catalogo"
            onClick={() => {
              setFilters(prev => ({ ...prev, categoriaId: null, soloOfertas: false, soloNovedades: false }));
              setActiveView('catalogo');
            }}
            className={`transition-colors hover:text-[#f5d77f] ${
              activeView === 'catalogo' && !filters.soloOfertas && !filters.soloNovedades && !filters.categoriaId
                ? 'text-[#f5d77f] font-bold border-b border-[#d4af37] pb-0.5' 
                : 'text-[#c0c0c0]'
            }`}
          >
            Catálogo Completo
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`nav-link-cat-${cat.slug}`}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`transition-colors hover:text-[#f5d77f] ${
                activeView === 'catalogo' && filters.categoriaId === cat.id
                  ? 'text-[#f5d77f] font-bold border-b border-[#d4af37] pb-0.5'
                  : 'text-[#c0c0c0]'
              }`}
            >
              {cat.nombre}
            </button>
          ))}

          <button
            id="nav-link-ofertas"
            onClick={() => handleCategoryClick('ofertas')}
            className={`flex items-center gap-1 transition-colors hover:text-[#f5d77f] ${
              filters.soloOfertas ? 'text-[#f5d77f] font-bold border-b border-[#d4af37] pb-0.5' : 'text-[#d4af37]'
            }`}
          >
            <Tag className="w-3 h-3 text-[#d4af37]" />
            Ofertas
          </button>

          <button
            id="nav-link-novedades"
            onClick={() => handleCategoryClick('novedades')}
            className={`flex items-center gap-1 transition-colors hover:text-[#f5d77f] ${
              filters.soloNovedades ? 'text-[#f5d77f] font-bold border-b border-[#d4af37] pb-0.5' : 'text-[#d4af37]'
            }`}
          >
            <Flame className="w-3 h-3 text-[#d4af37]" />
            Novedades
          </button>

          <button
            id="nav-link-contacto"
            onClick={() => setActiveView('contacto')}
            className={`transition-colors hover:text-[#f5d77f] ${
              activeView === 'contacto' ? 'text-[#f5d77f] font-bold border-b border-[#d4af37] pb-0.5' : 'text-[#c0c0c0]'
            }`}
          >
            Contacto
          </button>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[110px] bg-[#080808]/98 border-t border-[#d4af37]/30 z-50 overflow-y-auto p-5 animate-in fade-in">
          {/* Mobile Search input */}
          <form onSubmit={handleSearchSubmit} className="mb-6 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en el catálogo..."
              className="w-full bg-[#141414] border border-[#d4af37]/40 rounded-xl py-3 pl-10 pr-4 text-sm text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
            />
            <Search className="w-5 h-5 text-[#d4af37] absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          <div className="space-y-4">
            <p className="text-xs uppercase font-bold text-[#d4af37] tracking-widest">Navegación</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setActiveView('inicio'); setMobileMenuOpen(false); }}
                className="p-3 bg-[#121212] border border-[#d4af37]/30 rounded-lg text-left text-sm font-medium text-[#f4f4f4] hover:border-[#d4af37]"
              >
                Inicio
              </button>
              <button
                onClick={() => {
                  setFilters(prev => ({ ...prev, categoriaId: null, soloOfertas: false, soloNovedades: false }));
                  setActiveView('catalogo');
                  setMobileMenuOpen(false);
                }}
                className="p-3 bg-[#121212] border border-[#d4af37]/30 rounded-lg text-left text-sm font-medium text-[#f4f4f4] hover:border-[#d4af37]"
              >
                Catálogo Total
              </button>
              <button
                onClick={() => handleCategoryClick('ofertas')}
                className="p-3 bg-[#1c1608] border border-[#d4af37]/50 rounded-lg text-left text-sm font-bold text-[#f5d77f] flex items-center gap-1.5"
              >
                <Tag className="w-4 h-4 text-[#d4af37]" /> Ofertas
              </button>
              <button
                onClick={() => handleCategoryClick('novedades')}
                className="p-3 bg-[#1c1608] border border-[#d4af37]/50 rounded-lg text-left text-sm font-bold text-[#f5d77f] flex items-center gap-1.5"
              >
                <Flame className="w-4 h-4 text-[#d4af37]" /> Novedades
              </button>
            </div>

            <p className="text-xs uppercase font-bold text-[#d4af37] tracking-widest pt-2">Categorías</p>
            <div className="space-y-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className="w-full text-left p-2.5 rounded-lg text-sm text-[#e0e0e0] hover:bg-[#1a1812] hover:text-[#f5d77f] flex justify-between items-center"
                >
                  <span>{cat.nombre}</span>
                  <span className="text-xs text-[#d4af37]">→</span>
                </button>
              ))}
            </div>

            <p className="text-xs uppercase font-bold text-[#d4af37] tracking-widest pt-2">Mi Cuenta</p>
            <div className="space-y-1.5">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => { setActiveView('perfil'); setMobileMenuOpen(false); }}
                    className="w-full text-left p-2.5 rounded-lg text-sm text-[#f5d77f] bg-[#141414] border border-[#d4af37]/30 flex items-center gap-2"
                  >
                    <UserIcon className="w-4 h-4 text-[#d4af37]" /> Mi Perfil y Pedidos
                  </button>
                  <button
                    onClick={() => { setActiveView('admin'); setMobileMenuOpen(false); }}
                    className="w-full text-left p-2.5 rounded-lg text-sm font-semibold text-[#000000] bg-[#d4af37] flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Panel de Administrador
                  </button>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="w-full text-left p-2.5 rounded-lg text-sm text-[#ff5555] hover:bg-[#251010] flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Cerrar Sesión
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { openAuthModal('login'); setMobileMenuOpen(false); }}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-[#0a0a0a] text-sm font-bold text-center"
                >
                  Iniciar Sesión / Registrarse
                </button>
              )}
            </div>

            <div className="pt-4 border-t border-[#242424]">
              <button
                onClick={() => { setActiveView('contacto'); setMobileMenuOpen(false); }}
                className="w-full text-center py-2 text-xs text-[#c0c0c0] hover:text-[#f5d77f]"
              >
                Atención al Cliente & Contacto VIP
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

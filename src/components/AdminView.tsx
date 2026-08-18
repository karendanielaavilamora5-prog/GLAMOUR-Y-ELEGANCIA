import React, { useState, useMemo } from 'react';
import { 
  Crown, 
  Package, 
  FolderTree, 
  ShoppingBag, 
  Users, 
  Tag, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  ArrowLeft, 
  BarChart3, 
  Eye, 
  TrendingUp, 
  DollarSign,
  Search,
  Check,
  AlertTriangle,
  Mail,
  SlidersHorizontal,
  Layers,
  Save,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, Order, SizeName, OrderStatus } from '../types';

export const AdminView: React.FC = () => {
  const {
    products,
    categories,
    orders,
    adminUsersList,
    adminAddProduct,
    adminUpdateProduct,
    adminDeleteProduct,
    adminAddCategory,
    adminDeleteCategory,
    adminToggleUserStatus,
    updateOrderStatus,
    appliedCoupon,
    applyCoupon,
    contactMessages,
    markContactRead,
    markContactAnswered,
    setActiveView,
    addToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'resumen' | 'productos' | 'precios' | 'categorias' | 'pedidos' | 'usuarios' | 'cupones' | 'mensajes'>('productos');

  // --- Search & Filters in Admin Catalog ---
  const [adminSearch, setAdminSearch] = useState('');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState('todas');
  const [adminStockFilter, setAdminStockFilter] = useState<'todos' | 'bajo' | 'agotado'>('todos');

  // --- Product Form Modal State ---
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [pNombre, setPNombre] = useState('');
  const [pSku, setPSku] = useState('');
  const [pCategoriaId, setPCategoriaId] = useState(categories[0]?.id || 'cat-1');
  const [pPrecio, setPPrecio] = useState(250000);
  const [pPrecioOferta, setPPrecioOferta] = useState<number | undefined>(undefined);
  const [pDescripcion, setPDescripcion] = useState('');
  const [pImagen, setPImagen] = useState('');
  const [pImagenesSecundarias, setPImagenesSecundarias] = useState<string[]>([]);
  const [newSecImgUrl, setNewSecImgUrl] = useState('');
  const [pEnOferta, setPEnOferta] = useState(false);
  const [pEsNovedad, setPEsNovedad] = useState(false);
  const [pEsDestacado, setPEsDestacado] = useState(true);
  const [pTallas, setPTallas] = useState<{ talla: SizeName; stock: number }[]>([
    { talla: 'S', stock: 5 },
    { talla: 'M', stock: 8 },
    { talla: 'L', stock: 4 },
  ]);
  const [customSizeInput, setCustomSizeInput] = useState<SizeName>('XL');

  // --- Category Form State ---
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [catNombre, setCatNombre] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImg, setCatImg] = useState('');

  // --- Order detail inspection modal ---
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // --- Bulk Price Tool State ---
  const [bulkCategory, setBulkCategory] = useState('todas');
  const [bulkActionType, setBulkActionType] = useState<'incrementar_porcentaje' | 'descuento_porcentaje' | 'fijar_oferta'>('descuento_porcentaje');
  const [bulkPercentValue, setBulkPercentValue] = useState(10);

  // --- Fast Inline Editing State for Prices tab ---
  const [inlinePriceMap, setInlinePriceMap] = useState<Record<string, { precio: number; precio_oferta: number | null; en_oferta: boolean }>>({});

  // Summary Metrics calculations
  const totalSales = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.estado !== 'Cancelado' ? o.total : 0), 0);
  }, [orders]);

  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.estado === 'Pendiente' || o.estado === 'En preparación').length;
  const totalProductsCount = products.length;
  const totalUsersCount = adminUsersList.length;
  const unreadMessagesCount = contactMessages.filter((m) => !m.leido).length;

  const lowStockProducts = useMemo(() => {
    return products.filter((p) => p.stock_total <= 5 && p.activo);
  }, [products]);

  // Filtered products for admin tables
  const displayedAdminProducts = useMemo(() => {
    return products.filter((p) => {
      if (adminCategoryFilter !== 'todas' && p.id_categoria !== adminCategoryFilter) return false;
      if (adminStockFilter === 'bajo' && (p.stock_total > 5 || p.stock_total === 0)) return false;
      if (adminStockFilter === 'agotado' && p.stock_total > 0) return false;
      if (adminSearch.trim()) {
        const query = adminSearch.toLowerCase();
        const matchName = p.nombre.toLowerCase().includes(query);
        const matchSku = p.sku.toLowerCase().includes(query);
        const matchCat = p.nombre_categoria.toLowerCase().includes(query);
        if (!matchName && !matchSku && !matchCat) return false;
      }
      return true;
    });
  }, [products, adminCategoryFilter, adminStockFilter, adminSearch]);

  const handleOpenNewProduct = () => {
    setEditingProductId(null);
    setPNombre('');
    setPSku(`GLE-${Math.floor(1000 + Math.random() * 9000)}`);
    setPCategoriaId(categories[0]?.id || 'cat-1');
    setPPrecio(250000);
    setPPrecioOferta(undefined);
    setPDescripcion('');
    setPImagen('https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop');
    setPImagenesSecundarias([]);
    setNewSecImgUrl('');
    setPEnOferta(false);
    setPEsNovedad(true);
    setPEsDestacado(false);
    setPTallas([
      { talla: 'S', stock: 5 },
      { talla: 'M', stock: 8 },
      { talla: 'L', stock: 4 },
    ]);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setPNombre(prod.nombre);
    setPSku(prod.sku);
    setPCategoriaId(prod.id_categoria);
    setPPrecio(prod.precio);
    setPPrecioOferta(prod.precio_oferta || undefined);
    setPDescripcion(prod.descripcion);
    setPImagen(prod.imagen_principal);
    setPImagenesSecundarias(prod.imagenes_secundarias || []);
    setNewSecImgUrl('');
    setPEnOferta(prod.en_oferta);
    setPEsNovedad(prod.es_novedad);
    setPEsDestacado(prod.es_destacado);
    setPTallas(prod.tallas && prod.tallas.length > 0 ? prod.tallas : [{ talla: 'Única', stock: prod.stock_total }]);
    setIsProductModalOpen(true);
  };

  const handleAddSizeToForm = () => {
    if (pTallas.some((t) => t.talla === customSizeInput)) {
      addToast(`La talla ${customSizeInput} ya está agregada en la lista.`, 'info');
      return;
    }
    setPTallas([...pTallas, { talla: customSizeInput, stock: 5 }]);
  };

  const handleRemoveSizeFromForm = (sizeName: SizeName) => {
    if (pTallas.length <= 1) {
      addToast('El producto debe tener al menos una talla configurada.', 'error');
      return;
    }
    setPTallas(pTallas.filter((t) => t.talla !== sizeName));
  };

  const handleUpdateSizeStock = (sizeName: SizeName, stockValue: number) => {
    setPTallas(
      pTallas.map((t) => (t.talla === sizeName ? { ...t, stock: Math.max(0, stockValue) } : t))
    );
  };

  const handleAddSecondaryImage = () => {
    if (!newSecImgUrl.trim()) return;
    setPImagenesSecundarias([...pImagenesSecundarias, newSecImgUrl.trim()]);
    setNewSecImgUrl('');
  };

  const handleRemoveSecondaryImage = (index: number) => {
    setPImagenesSecundarias(pImagenesSecundarias.filter((_, i) => i !== index));
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pNombre.trim() || !pSku.trim()) {
      addToast('Por favor completa el nombre y el código SKU de la prenda.', 'error');
      return;
    }

    if (!pImagen.trim()) {
      addToast('Por favor especifica la URL de la imagen principal.', 'error');
      return;
    }

    const catObj = categories.find((c) => c.id === pCategoriaId);
    const totalStockCalc = pTallas.reduce((sum, t) => sum + Number(t.stock), 0);

    const validSecondaryImages = pImagenesSecundarias.length > 0 ? pImagenesSecundarias : [pImagen];

    if (editingProductId) {
      adminUpdateProduct(editingProductId, {
        nombre: pNombre,
        sku: pSku,
        id_categoria: pCategoriaId,
        nombre_categoria: catObj?.nombre || 'General',
        precio: Number(pPrecio),
        precio_oferta: pEnOferta && pPrecioOferta ? Number(pPrecioOferta) : null,
        descripcion: pDescripcion,
        imagen_principal: pImagen,
        imagenes_secundarias: validSecondaryImages,
        en_oferta: pEnOferta,
        es_novedad: pEsNovedad,
        es_destacado: pEsDestacado,
        tallas: pTallas,
        stock_total: totalStockCalc,
      });
    } else {
      adminAddProduct({
        nombre: pNombre,
        sku: pSku,
        id_categoria: pCategoriaId,
        nombre_categoria: catObj?.nombre || 'General',
        precio: Number(pPrecio),
        precio_oferta: pEnOferta && pPrecioOferta ? Number(pPrecioOferta) : null,
        descripcion: pDescripcion,
        imagen_principal: pImagen,
        imagenes_secundarias: validSecondaryImages,
        tallas: pTallas,
        stock_total: totalStockCalc,
        en_oferta: pEnOferta,
        es_novedad: pEsNovedad,
        es_destacado: pEsDestacado,
        activo: true,
      });
    }

    setIsProductModalOpen(false);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catNombre.trim()) {
      addToast('El nombre de la categoría es obligatorio.', 'error');
      return;
    }
    adminAddCategory({
      nombre: catNombre,
      descripcion: catDesc || `Colección exclusiva de ${catNombre}`,
      imagen_url: catImg || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
      orden: categories.length + 1,
      activo: true,
    });
    setIsCategoryModalOpen(false);
    setCatNombre('');
    setCatDesc('');
    setCatImg('');
  };

  // --- Inline Price Handlers ---
  const handleGetInlineValue = (prod: Product) => {
    if (inlinePriceMap[prod.id]) {
      return inlinePriceMap[prod.id];
    }
    return {
      precio: prod.precio,
      precio_oferta: prod.precio_oferta,
      en_oferta: prod.en_oferta
    };
  };

  const handleSetInlineValue = (prodId: string, field: 'precio' | 'precio_oferta' | 'en_oferta', value: any) => {
    const prod = products.find(p => p.id === prodId);
    if (!prod) return;
    const current = handleGetInlineValue(prod);
    setInlinePriceMap(prev => ({
      ...prev,
      [prodId]: {
        ...current,
        [field]: value
      }
    }));
  };

  const handleSaveInlineProductPrice = (prodId: string) => {
    const values = inlinePriceMap[prodId];
    if (!values) return;

    adminUpdateProduct(prodId, {
      precio: Number(values.precio),
      precio_oferta: values.en_oferta && values.precio_oferta ? Number(values.precio_oferta) : null,
      en_oferta: Boolean(values.en_oferta)
    });
    addToast('Precios de la prenda actualizados en tienda.', 'exito');
  };

  // --- Bulk Price Adjustment Execution ---
  const handleExecuteBulkPriceChange = () => {
    let targetProds = products;
    if (bulkCategory !== 'todas') {
      targetProds = products.filter(p => p.id_categoria === bulkCategory);
    }

    if (targetProds.length === 0) {
      addToast('No hay productos en la categoría seleccionada.', 'error');
      return;
    }

    targetProds.forEach(p => {
      let newPrice = p.precio;
      let newOfferPrice = p.precio_oferta;
      let newEnOferta = p.en_oferta;

      if (bulkActionType === 'incrementar_porcentaje') {
        const factor = 1 + (bulkPercentValue / 100);
        newPrice = Math.round((p.precio * factor) / 1000) * 1000;
        if (newOfferPrice) {
          newOfferPrice = Math.round((newOfferPrice * factor) / 1000) * 1000;
        }
      } else if (bulkActionType === 'descuento_porcentaje') {
        const discountFactor = 1 - (bulkPercentValue / 100);
        newOfferPrice = Math.round((p.precio * discountFactor) / 1000) * 1000;
        newEnOferta = true;
      } else if (bulkActionType === 'fijar_oferta') {
        newEnOferta = false;
        newOfferPrice = null;
      }

      adminUpdateProduct(p.id, {
        precio: newPrice,
        precio_oferta: newOfferPrice,
        en_oferta: newEnOferta
      });
    });

    addToast(`Ajuste masivo aplicado exitosamente a ${targetProds.length} prendas.`, 'dorado');
  };

  const knownCoupons = [
    { code: 'ELEGANCIA10', desc: '10% de descuento en toda la tienda' },
    { code: 'GLAMURVIP', desc: '20% de descuento para clientes VIP' },
    { code: 'ORO2026', desc: '15% de descuento en colección de gala' },
    { code: 'BIENVENIDA', desc: '10% de descuento en primera orden' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#161208] via-[#241c09] to-[#161208] border border-[#d4af37]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2 text-xs uppercase font-bold text-[#d4af37] font-cinzel tracking-widest">
            <Crown className="w-4 h-4 text-[#d4af37]" />
            <span>Sistema Central de Administración & Catálogo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#ffffff] font-cinzel">
            Panel de Administrador VIP
          </h1>
          <p className="text-xs text-[#b8a068] max-w-2xl">
            Control total de catálogo, fijación de precios, control de stock por tallas, logística de pedidos, usuarios y promociones de alta costura.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <button
            id="admin-new-product-top-btn"
            onClick={handleOpenNewProduct}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-[#080808] text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-[#d4af37]/20"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Prenda</span>
          </button>

          <button
            onClick={() => setActiveView('inicio')}
            className="px-4 py-2.5 rounded-full bg-[#121212] border border-[#d4af37]/40 text-[#f5d77f] text-xs font-semibold hover:bg-[#d4af37] hover:text-[#080808] transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ver Tienda</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[#242424]">
        <button
          id="admin-tab-productos-btn"
          onClick={() => setActiveTab('productos')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'productos'
              ? 'bg-[#d4af37] text-[#080808] shadow-md shadow-[#d4af37]/20'
              : 'bg-[#121212] text-[#888888] hover:text-[#f5d77f]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Catálogo & Prendas ({products.length})</span>
        </button>

        <button
          id="admin-tab-precios-btn"
          onClick={() => setActiveTab('precios')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'precios'
              ? 'bg-[#d4af37] text-[#080808] shadow-md shadow-[#d4af37]/20'
              : 'bg-[#121212] text-[#888888] hover:text-[#f5d77f]'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Gestión de Precios & Ofertas</span>
        </button>

        <button
          id="admin-tab-categorias-btn"
          onClick={() => setActiveTab('categorias')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'categorias'
              ? 'bg-[#d4af37] text-[#080808] shadow-md shadow-[#d4af37]/20'
              : 'bg-[#121212] text-[#888888] hover:text-[#f5d77f]'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Categorías ({categories.length})</span>
        </button>

        <button
          id="admin-tab-pedidos-btn"
          onClick={() => setActiveTab('pedidos')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'pedidos'
              ? 'bg-[#d4af37] text-[#080808] shadow-md shadow-[#d4af37]/20'
              : 'bg-[#121212] text-[#888888] hover:text-[#f5d77f]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Pedidos ({orders.length})</span>
          {pendingOrdersCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-[#ff5555] animate-pulse" />
          )}
        </button>

        <button
          id="admin-tab-resumen-btn"
          onClick={() => setActiveTab('resumen')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'resumen'
              ? 'bg-[#d4af37] text-[#080808] shadow-md shadow-[#d4af37]/20'
              : 'bg-[#121212] text-[#888888] hover:text-[#f5d77f]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Métricas Financieras</span>
        </button>

        <button
          id="admin-tab-usuarios-btn"
          onClick={() => setActiveTab('usuarios')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'usuarios'
              ? 'bg-[#d4af37] text-[#080808] shadow-md shadow-[#d4af37]/20'
              : 'bg-[#121212] text-[#888888] hover:text-[#f5d77f]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Usuarios ({adminUsersList.length})</span>
        </button>

        <button
          id="admin-tab-cupones-btn"
          onClick={() => setActiveTab('cupones')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'cupones'
              ? 'bg-[#d4af37] text-[#080808] shadow-md shadow-[#d4af37]/20'
              : 'bg-[#121212] text-[#888888] hover:text-[#f5d77f]'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Cupones</span>
        </button>

        <button
          id="admin-tab-mensajes-btn"
          onClick={() => setActiveTab('mensajes')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'mensajes'
              ? 'bg-[#d4af37] text-[#080808] shadow-md shadow-[#d4af37]/20'
              : 'bg-[#121212] text-[#888888] hover:text-[#f5d77f]'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Buzón VIP ({contactMessages.length})</span>
          {unreadMessagesCount > 0 && (
            <span className="px-1.5 py-0.2 bg-[#d4af37] text-[#000000] text-[9px] font-bold rounded-full">
              {unreadMessagesCount}
            </span>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. TAB: CATÁLOGO & PRENDAS (Creación, Edición Completa, Stock por Tallas) */}
      {/* ========================================================================= */}
      {activeTab === 'productos' && (
        <div className="space-y-6">
          
          {/* Controls Bar */}
          <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-[#242424] flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <div className="flex-1 flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#d4af37] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  placeholder="Filtrar por nombre, SKU o categoría..."
                  className="w-full bg-[#141414] border border-[#333333] focus:border-[#d4af37] rounded-xl py-2 pl-9 pr-3 text-xs text-[#ffffff] focus:outline-none"
                />
              </div>

              {/* Category Filter */}
              <select
                value={adminCategoryFilter}
                onChange={(e) => setAdminCategoryFilter(e.target.value)}
                className="bg-[#141414] border border-[#333333] focus:border-[#d4af37] rounded-xl py-2 px-3 text-xs text-[#f5d77f] focus:outline-none"
              >
                <option value="todas">Todas las categorías</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>

              {/* Stock Filter */}
              <select
                value={adminStockFilter}
                onChange={(e) => setAdminStockFilter(e.target.value as any)}
                className="bg-[#141414] border border-[#333333] focus:border-[#d4af37] rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none"
              >
                <option value="todos">Todos los niveles de stock</option>
                <option value="bajo">⚠️ Stock bajo (≤ 5)</option>
                <option value="agotado">🚫 Agotados (0)</option>
              </select>
            </div>

            <button
              id="admin-add-product-main-btn"
              onClick={handleOpenNewProduct}
              className="px-5 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#f5d77f] text-[#080808] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Prenda</span>
            </button>
          </div>

          {/* Low Stock Alert if any */}
          {lowStockProducts.length > 0 && (
            <div className="p-4 rounded-xl bg-[#241a05] border border-[#d4af37] flex items-center justify-between text-xs text-[#f5d77f]">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-[#d4af37] flex-shrink-0" />
                <span>
                  Hay <strong>{lowStockProducts.length}</strong> prendas con stock crítico (5 unidades o menos). Considera reabastecer el taller de confección.
                </span>
              </div>
              <button
                onClick={() => setAdminStockFilter('bajo')}
                className="text-[#ffffff] underline font-bold hover:text-[#d4af37]"
              >
                Ver prendas críticas
              </button>
            </div>
          )}

          {/* Products Table */}
          <div className="bg-[#0f0f0f] border border-[#242424] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#cccccc]">
                <thead className="bg-[#141414] border-b border-[#242424] text-[#888888] uppercase text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Prenda / Foto</th>
                    <th className="py-3.5 px-4">SKU</th>
                    <th className="py-3.5 px-4">Categoría</th>
                    <th className="py-3.5 px-4">Precio Regular</th>
                    <th className="py-3.5 px-4">Precio Oferta</th>
                    <th className="py-3.5 px-4">Tallas & Stock</th>
                    <th className="py-3.5 px-4">Estado</th>
                    <th className="py-3.5 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c1c1c]">
                  {displayedAdminProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-[#141414]/80 transition-colors">
                      <td className="py-3.5 px-4 flex items-center gap-3">
                        <img
                          src={p.imagen_principal}
                          alt={p.nombre}
                          className="w-12 h-14 object-cover rounded-lg border border-[#d4af37]/30 flex-shrink-0 shadow-sm"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-[#f4f4f4] max-w-xs truncate">{p.nombre}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            {p.en_oferta && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#d4af37] text-[#000000]">
                                Oferta
                              </span>
                            )}
                            {p.es_novedad && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#181409] border border-[#d4af37] text-[#f5d77f]">
                                Novedad
                              </span>
                            )}
                            {p.es_destacado && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#222222] text-[#d4af37]">
                                Destacado
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-[#d4af37]">{p.sku}</td>
                      <td className="py-3.5 px-4 text-[#e0e0e0]">{p.nombre_categoria}</td>
                      
                      <td className="py-3.5 px-4 font-bold text-[#f4f4f4]">
                        ${p.precio.toLocaleString('es-CO')}
                      </td>

                      <td className="py-3.5 px-4">
                        {p.en_oferta && p.precio_oferta ? (
                          <div>
                            <span className="font-bold text-[#55ff77]">
                              ${p.precio_oferta.toLocaleString('es-CO')}
                            </span>
                            <span className="block text-[10px] text-[#d4af37]">
                              -{Math.round(((p.precio - p.precio_oferta) / p.precio) * 100)}% OFF
                            </span>
                          </div>
                        ) : (
                          <span className="text-[#666666] italic">Sin oferta</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {p.tallas.map((t) => (
                            <span
                              key={t.talla}
                              className={`px-1.5 py-0.5 rounded border text-[10px] ${
                                t.stock === 0
                                  ? 'bg-[#200f0f] border-[#ff4444] text-[#ffaaaa]'
                                  : t.stock <= 3
                                  ? 'bg-[#241a05] border-[#d4af37] text-[#f5d77f]'
                                  : 'bg-[#181818] border-[#2a2a2a] text-[#cccccc]'
                              }`}
                            >
                              {t.talla}: <strong>{t.stock}</strong>
                            </span>
                          ))}
                        </div>
                        <span className="text-[10px] text-[#777777] block mt-1">
                          Total: <strong>{p.stock_total}</strong> unid.
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => adminUpdateProduct(p.id, { activo: !p.activo })}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                            p.activo
                              ? 'bg-[#142414] border border-[#55ff77]/40 text-[#55ff77]'
                              : 'bg-[#251010] border border-[#ff4444]/40 text-[#ff7777]'
                          }`}
                        >
                          {p.activo ? 'Activo' : 'Pausado'}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            id={`edit-prod-${p.id}`}
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-2 rounded-lg bg-[#181818] text-[#f5d77f] hover:bg-[#d4af37] hover:text-[#000000] transition-colors"
                            title="Editar prenda y tallas"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            id={`delete-prod-${p.id}`}
                            onClick={() => {
                              if (confirm(`¿Estás seguro de eliminar la prenda "${p.nombre}" del catálogo?`)) {
                                adminDeleteProduct(p.id);
                              }
                            }}
                            className="p-2 rounded-lg bg-[#181818] text-[#ff5555] hover:bg-[#ff5555] hover:text-[#ffffff] transition-colors"
                            title="Eliminar prenda"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TAB: GESTIÓN DE PRECIOS & OFERTAS (Ajustes Rápidos & Masivos) */}
      {/* ========================================================================= */}
      {activeTab === 'precios' && (
        <div className="space-y-8">
          
          {/* Bulk Price Adjustment Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#161208] via-[#1f1706] to-[#161208] border border-[#d4af37]/60 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#d4af37] font-cinzel">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Herramienta de Modificación Masiva de Precios</span>
            </div>
            
            <p className="text-xs text-[#cccccc]">
              Aplica incrementos, descuentos promocionales por porcentaje o restablece precios de oferta para una categoría completa en un solo clic.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end pt-2">
              <div>
                <label className="text-xs text-[#888888] block mb-1">Categoría Destino</label>
                <select
                  value={bulkCategory}
                  onChange={(e) => setBulkCategory(e.target.value)}
                  className="w-full bg-[#141414] border border-[#d4af37]/40 rounded-xl py-2 px-3 text-xs text-[#f5d77f] focus:outline-none"
                >
                  <option value="todas">Todas las Categorías ({products.length} prendas)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre} ({products.filter(p => p.id_categoria === c.id).length} prendas)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-[#888888] block mb-1">Tipo de Acción</label>
                <select
                  value={bulkActionType}
                  onChange={(e) => setBulkActionType(e.target.value as any)}
                  className="w-full bg-[#141414] border border-[#d4af37]/40 rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none"
                >
                  <option value="descuento_porcentaje">Aplicar Descuento de Oferta (%)</option>
                  <option value="incrementar_porcentaje">Aumentar Precio Regular (%)</option>
                  <option value="fijar_oferta">Quitar Todas las Ofertas</option>
                </select>
              </div>

              {bulkActionType !== 'fijar_oferta' && (
                <div>
                  <label className="text-xs text-[#888888] block mb-1">Porcentaje (%)</label>
                  <input
                    type="number"
                    min={1}
                    max={90}
                    value={bulkPercentValue}
                    onChange={(e) => setBulkPercentValue(Number(e.target.value))}
                    className="w-full bg-[#141414] border border-[#d4af37]/40 rounded-xl py-2 px-3 text-xs text-[#f5d77f] focus:outline-none"
                  />
                </div>
              )}

              <button
                onClick={handleExecuteBulkPriceChange}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-[#080808] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>Aplicar a Catálogo</span>
              </button>
            </div>
          </div>

          {/* Quick Inline Price Editing Table */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-[#ffffff] font-cinzel">
                  Edición Rápida de Precios por Prenda
                </h3>
                <p className="text-xs text-[#888888]">
                  Modifica precios directamente en la tabla y guarda cada uno sin abrir modales.
                </p>
              </div>
            </div>

            <div className="bg-[#0f0f0f] border border-[#242424] rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#cccccc]">
                  <thead className="bg-[#141414] border-b border-[#242424] text-[#888888] uppercase text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4">Prenda</th>
                      <th className="py-3.5 px-4">Categoría</th>
                      <th className="py-3.5 px-4">Precio Regular ($ COP)</th>
                      <th className="py-3.5 px-4">En Oferta</th>
                      <th className="py-3.5 px-4">Precio Oferta ($ COP)</th>
                      <th className="py-3.5 px-4">Descuento Calculado</th>
                      <th className="py-3.5 px-4 text-right">Guardar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1c1c1c]">
                    {products.map((p) => {
                      const currentVals = handleGetInlineValue(p);
                      const discountCalc = currentVals.en_oferta && currentVals.precio_oferta && currentVals.precio > 0
                        ? Math.round(((currentVals.precio - currentVals.precio_oferta) / currentVals.precio) * 100)
                        : null;

                      return (
                        <tr key={p.id} className="hover:bg-[#141414]/60">
                          <td className="py-3 px-4 flex items-center gap-3">
                            <img
                              src={p.imagen_principal}
                              alt={p.nombre}
                              className="w-10 h-12 object-cover rounded-md border border-[#d4af37]/30 flex-shrink-0"
                            />
                            <div>
                              <p className="font-bold text-[#f4f4f4] max-w-[200px] truncate">{p.nombre}</p>
                              <span className="text-[10px] font-mono text-[#d4af37]">{p.sku}</span>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-[#aaaaaa]">{p.nombre_categoria}</td>

                          <td className="py-3 px-4">
                            <div className="relative max-w-[140px]">
                              <input
                                type="number"
                                step={1000}
                                value={currentVals.precio}
                                onChange={(e) => handleSetInlineValue(p.id, 'precio', Number(e.target.value))}
                                className="w-full bg-[#181818] border border-[#333333] focus:border-[#d4af37] rounded-lg py-1.5 px-2.5 text-xs text-[#ffffff] font-bold"
                              />
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={currentVals.en_oferta}
                                onChange={(e) => handleSetInlineValue(p.id, 'en_oferta', e.target.checked)}
                                className="accent-[#d4af37] w-4 h-4"
                              />
                              <span className="text-[11px] text-[#f5d77f]">Activar</span>
                            </label>
                          </td>

                          <td className="py-3 px-4">
                            <div className="relative max-w-[140px]">
                              <input
                                type="number"
                                step={1000}
                                disabled={!currentVals.en_oferta}
                                value={currentVals.precio_oferta || ''}
                                onChange={(e) => handleSetInlineValue(p.id, 'precio_oferta', e.target.value ? Number(e.target.value) : null)}
                                placeholder="Precio oferta"
                                className={`w-full bg-[#181818] border rounded-lg py-1.5 px-2.5 text-xs font-bold ${
                                  currentVals.en_oferta
                                    ? 'border-[#55ff77]/50 text-[#55ff77]'
                                    : 'border-[#222222] text-[#555555] cursor-not-allowed'
                                }`}
                              />
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            {discountCalc && discountCalc > 0 ? (
                              <span className="px-2 py-0.5 rounded bg-[#181409] border border-[#d4af37] text-[#f5d77f] font-bold text-[10px]">
                                {discountCalc}% OFF
                              </span>
                            ) : (
                              <span className="text-[#555555] text-[10px]">—</span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleSaveInlineProductPrice(p.id)}
                              className="px-3 py-1.5 rounded-lg bg-[#181818] hover:bg-[#d4af37] hover:text-[#000000] text-xs font-semibold text-[#f5d77f] transition-all flex items-center gap-1.5 ml-auto"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Guardar</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAB: CATEGORÍAS */}
      {/* ========================================================================= */}
      {activeTab === 'categorias' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#ffffff] font-cinzel">
                Líneas y Colecciones ({categories.length})
              </h2>
              <p className="text-xs text-[#888888]">
                Crea nuevas colecciones de marca o edita sus nombres y portadas.
              </p>
            </div>

            <button
              id="admin-add-category-btn"
              onClick={() => setIsCategoryModalOpen(true)}
              className="px-5 py-2.5 rounded-full bg-[#d4af37] text-[#080808] font-bold text-xs uppercase tracking-wider hover:bg-[#f5d77f] transition-all flex items-center gap-1.5 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Categoría</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-5 rounded-2xl bg-[#0f0f0f] border border-[#262626] space-y-4 relative overflow-hidden group hover:border-[#d4af37]/60 transition-all shadow-xl"
              >
                <div className="aspect-[16/9] rounded-xl overflow-hidden bg-[#181818] relative">
                  <img src={cat.imagen_url} alt={cat.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-[#000000]/80 text-[#f5d77f] text-[10px] font-bold font-mono">
                    /{cat.slug}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#f5d77f] font-cinzel">{cat.nombre}</h3>
                  <p className="text-xs text-[#aaaaaa] line-clamp-2">{cat.descripcion}</p>
                </div>

                <div className="pt-3 border-t border-[#202020] flex justify-between items-center text-xs">
                  <span className="text-[#888888]">
                    <strong>{products.filter((p) => p.id_categoria === cat.id).length}</strong> prendas activas
                  </span>
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar categoría "${cat.nombre}"?`)) {
                        adminDeleteCategory(cat.id);
                      }
                    }}
                    className="text-[#ff5555] hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB: PEDIDOS & LOGÍSTICA */}
      {/* ========================================================================= */}
      {activeTab === 'pedidos' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#ffffff] font-cinzel">
              Gestión de Pedidos & Logística ({orders.length})
            </h2>
            <p className="text-xs text-[#888888]">
              Monitorea y actualiza el estado de confección, despacho y entrega de cada orden.
            </p>
          </div>

          <div className="bg-[#0f0f0f] border border-[#242424] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#cccccc]">
                <thead className="bg-[#141414] border-b border-[#242424] text-[#888888] uppercase text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4"># Pedido / Guía</th>
                    <th className="py-3.5 px-4">Cliente & Destino</th>
                    <th className="py-3.5 px-4">Prendas</th>
                    <th className="py-3.5 px-4">Total Pagado</th>
                    <th className="py-3.5 px-4">Estado Logístico</th>
                    <th className="py-3.5 px-4 text-right">Detalle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c1c1c]">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#141414]/60">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-[#f5d77f] block">{ord.numero_pedido}</span>
                        <span className="text-[10px] text-[#777777] font-mono">{ord.codigo_rastreo}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-[#f4f4f4]">{ord.nombre_cliente}</p>
                        <p className="text-[11px] text-[#888888]">{ord.direccion_envio.ciudad}, {ord.direccion_envio.direccion_linea1}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-[#e0e0e0] font-medium">{ord.items.length} prendas</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#f5d77f]">${ord.total.toLocaleString('es-CO')}</span>
                        <span className="block text-[10px] text-[#888888]">{ord.metodo_pago}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={ord.estado}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className="bg-[#181818] border border-[#d4af37]/40 rounded-lg py-1 px-2.5 text-xs text-[#f5d77f] focus:outline-none focus:border-[#d4af37]"
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="Confirmado">Confirmado</option>
                          <option value="En preparación">En Taller / Confección</option>
                          <option value="Enviado">Enviado Express VIP</option>
                          <option value="Entregado">Entregado</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrderDetails(ord)}
                          className="p-2 rounded-lg bg-[#181818] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#000000] transition-colors"
                          title="Ver detalle del pedido"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB: RESUMEN FINANCIERO */}
      {/* ========================================================================= */}
      {activeTab === 'resumen' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-[#d4af37]/40 space-y-2">
              <div className="flex justify-between items-center text-[#888888]">
                <span className="text-xs font-semibold uppercase tracking-wider">Ventas Totales</span>
                <DollarSign className="w-5 h-5 text-[#d4af37]" />
              </div>
              <p className="text-2xl font-bold text-[#f5d77f] font-cinzel">
                ${totalSales.toLocaleString('es-CO')}
              </p>
              <p className="text-[11px] text-[#55ff77] flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +18.4% de crecimiento
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-[#d4af37]/40 space-y-2">
              <div className="flex justify-between items-center text-[#888888]">
                <span className="text-xs font-semibold uppercase tracking-wider">Pedidos Generados</span>
                <Package className="w-5 h-5 text-[#d4af37]" />
              </div>
              <p className="text-2xl font-bold text-[#ffffff] font-cinzel">
                {totalOrdersCount}
              </p>
              <p className="text-[11px] text-[#f5d77f]">
                {pendingOrdersCount} pedidos en taller
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-[#d4af37]/40 space-y-2">
              <div className="flex justify-between items-center text-[#888888]">
                <span className="text-xs font-semibold uppercase tracking-wider">Prendas en Catálogo</span>
                <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
              </div>
              <p className="text-2xl font-bold text-[#ffffff] font-cinzel">
                {totalProductsCount} prendas
              </p>
              <p className="text-[11px] text-[#aaaaaa]">
                En {categories.length} colecciones de lujo
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-[#d4af37]/40 space-y-2">
              <div className="flex justify-between items-center text-[#888888]">
                <span className="text-xs font-semibold uppercase tracking-wider">Usuarios Registrados</span>
                <Users className="w-5 h-5 text-[#d4af37]" />
              </div>
              <p className="text-2xl font-bold text-[#ffffff] font-cinzel">
                {totalUsersCount} miembros
              </p>
              <p className="text-[11px] text-[#55ff77]">
                Membresías VIP activas
              </p>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB: USUARIOS */}
      {/* ========================================================================= */}
      {activeTab === 'usuarios' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#ffffff] font-cinzel">
              Usuarios y Clientes Registrados ({adminUsersList.length})
            </h2>
            <p className="text-xs text-[#888888]">
              Administra permisos de acceso, roles administrativos y cuentas de clientes.
            </p>
          </div>

          <div className="bg-[#0f0f0f] border border-[#242424] rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs text-[#cccccc]">
              <thead className="bg-[#141414] border-b border-[#242424] text-[#888888] uppercase text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Usuario</th>
                  <th className="py-3.5 px-4">Correo Electrónico</th>
                  <th className="py-3.5 px-4">Teléfono</th>
                  <th className="py-3.5 px-4">Rol</th>
                  <th className="py-3.5 px-4 text-right">Estado / Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c1c1c]">
                {adminUsersList.map((u) => (
                  <tr key={u.id} className="hover:bg-[#141414]/60">
                    <td className="py-3.5 px-4 font-semibold text-[#f4f4f4]">
                      {u.nombre} {u.apellido}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#d4af37]">{u.email}</td>
                    <td className="py-3.5 px-4">{u.telefono}</td>
                    <td className="py-3.5 px-4">
                      {u.rol === 'administrador' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#d4af37] text-[#000000]">
                          👑 Administrador
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#181409] border border-[#d4af37] text-[#f5d77f]">
                          ⭐ Cliente VIP
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => adminToggleUserStatus(u.id)}
                        className={`text-xs hover:underline font-bold ${
                          u.estado === 'activo' ? 'text-[#ff7777]' : 'text-[#55ff77]'
                        }`}
                      >
                        {u.estado === 'activo' ? 'Desactivar Cuenta' : 'Activar Cuenta'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. TAB: CUPONES */}
      {/* ========================================================================= */}
      {activeTab === 'cupones' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#ffffff] font-cinzel">
              Cupones & Promociones de Descuento
            </h2>
            <p className="text-xs text-[#888888]">
              Códigos activos para campañas de temporada de gala.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {knownCoupons.map((c) => (
              <div
                key={c.code}
                className="p-5 rounded-2xl bg-[#0f0f0f] border border-[#d4af37]/40 space-y-3 relative shadow-lg"
              >
                <div className="flex justify-between items-start">
                  <span className="text-sm font-bold font-mono text-[#f5d77f] px-2.5 py-1 rounded bg-[#181409] border border-[#d4af37]">
                    {c.code}
                  </span>
                  <span className="text-[10px] text-[#55ff77] bg-[#142414] px-2 py-0.5 rounded">
                    Activo
                  </span>
                </div>

                <p className="text-xs text-[#cccccc]">{c.desc}</p>
                <button
                  onClick={() => applyCoupon(c.code)}
                  className="w-full py-2 rounded-xl bg-[#181818] hover:bg-[#d4af37] hover:text-[#080808] text-xs text-[#f5d77f] transition-all font-semibold"
                >
                  Probar Cupón en Carrito
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. TAB: BUZÓN VIP / MENSAJES */}
      {/* ========================================================================= */}
      {activeTab === 'mensajes' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#ffffff] font-cinzel">
              Buzón de Atención al Cliente & Concierge ({contactMessages.length})
            </h2>
            <p className="text-xs text-[#888888]">
              Solicitudes de cotización corporativa, dudas de tallas y pedidos especiales.
            </p>
          </div>

          <div className="space-y-4">
            {contactMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-6 rounded-2xl border transition-all ${
                  !msg.leido
                    ? 'bg-[#181409] border-[#d4af37] shadow-lg shadow-[#d4af37]/10'
                    : 'bg-[#0f0f0f] border-[#222222]'
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                  <div>
                    <span className="text-xs font-bold text-[#f5d77f] uppercase font-cinzel">
                      {msg.asunto}
                    </span>
                    <h4 className="text-sm font-semibold text-[#ffffff]">{msg.nombre} ({msg.email})</h4>
                  </div>
                  <span className="text-[11px] text-[#888888]">{msg.fecha_envio}</span>
                </div>

                <p className="text-xs text-[#dddddd] bg-[#141414] p-3 rounded-xl border border-[#262626]">
                  "{msg.mensaje}"
                </p>

                <div className="flex items-center justify-between pt-3 text-xs">
                  <span className="text-[#888888]">
                    Teléfono de contacto: <strong className="text-[#d4af37]">{msg.telefono || 'No especificado'}</strong>
                  </span>

                  <div className="flex items-center gap-3">
                    {!msg.leido && (
                      <button
                        onClick={() => markContactRead(msg.id)}
                        className="text-xs text-[#d4af37] hover:underline"
                      >
                        Marcar leído
                      </button>
                    )}
                    {!msg.respondido ? (
                      <button
                        onClick={() => markContactAnswered(msg.id)}
                        className="px-3 py-1 rounded-lg bg-[#d4af37] text-[#000000] font-bold text-xs hover:bg-[#f5d77f]"
                      >
                        Marcar como Respondido
                      </button>
                    ) : (
                      <span className="text-[#55ff77] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Respondido
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: REGISTRAR / EDITAR PRENDA COMPLETA */}
      {/* ========================================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-[#000000]/85 backdrop-blur-md">
          <div className="w-full max-w-3xl bg-[#0e0e0e] border border-[#d4af37] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-[#242424] pb-4">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-[#d4af37]" />
                <h3 className="text-lg font-bold text-[#f5d77f] font-cinzel">
                  {editingProductId ? 'Editar Prenda de Alta Costura' : 'Registrar Nueva Prenda en Catálogo'}
                </h3>
              </div>
              <button onClick={() => setIsProductModalOpen(false)} className="text-[#888888] hover:text-[#ffffff] p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-5">
              
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#d4af37] block mb-1">Nombre de la Prenda *</label>
                  <input
                    type="text"
                    value={pNombre}
                    onChange={(e) => setPNombre(e.target.value)}
                    required
                    placeholder="ej: Vestido de Noche Noir Imperial"
                    className="w-full bg-[#141414] border border-[#d4af37]/40 rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#d4af37] block mb-1">Código SKU de Inventario *</label>
                  <input
                    type="text"
                    value={pSku}
                    onChange={(e) => setPSku(e.target.value)}
                    required
                    placeholder="GLE-DR-001"
                    className="w-full bg-[#141414] border border-[#d4af37]/40 rounded-xl py-2 px-3 text-xs text-[#f4f4f4] font-mono focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              {/* Category and Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-[#888888] block mb-1">Categoría / Colección</label>
                  <select
                    value={pCategoriaId}
                    onChange={(e) => setPCategoriaId(e.target.value)}
                    className="w-full bg-[#141414] border border-[#d4af37]/40 rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-[#888888] block mb-1">Precio Regular ($ COP) *</label>
                  <input
                    type="number"
                    step={1000}
                    value={pPrecio}
                    onChange={(e) => setPPrecio(Number(e.target.value))}
                    required
                    className="w-full bg-[#141414] border border-[#d4af37]/40 rounded-xl py-2 px-3 text-xs text-[#f4f4f4] font-bold focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#888888] block mb-1">Precio Oferta ($ COP)</label>
                  <input
                    type="number"
                    step={1000}
                    value={pPrecioOferta || ''}
                    onChange={(e) => {
                      const val = e.target.value ? Number(e.target.value) : undefined;
                      setPPrecioOferta(val);
                      if (val) setPEnOferta(true);
                    }}
                    placeholder="Opcional"
                    className="w-full bg-[#141414] border border-[#333333] rounded-xl py-2 px-3 text-xs text-[#55ff77] font-bold focus:outline-none focus:border-[#55ff77]"
                  />
                </div>
              </div>

              {/* Main Image URL */}
              <div>
                <label className="text-xs text-[#888888] block mb-1">URL de Imagen Principal *</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={pImagen}
                    onChange={(e) => setPImagen(e.target.value)}
                    required
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-[#141414] border border-[#d4af37]/40 rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                  />
                  {pImagen && (
                    <img src={pImagen} alt="preview" className="w-10 h-10 object-cover rounded-lg border border-[#d4af37]/40" />
                  )}
                </div>
              </div>

              {/* Secondary Images Gallery */}
              <div>
                <label className="text-xs text-[#888888] block mb-1">Galería de Fotos Secundarias</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={newSecImgUrl}
                    onChange={(e) => setNewSecImgUrl(e.target.value)}
                    placeholder="Pegar URL de foto adicional..."
                    className="flex-1 bg-[#141414] border border-[#333333] rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                  />
                  <button
                    type="button"
                    onClick={handleAddSecondaryImage}
                    className="px-4 py-2 bg-[#1c1c1c] hover:bg-[#d4af37] hover:text-[#000000] text-xs font-semibold rounded-xl text-[#f5d77f] transition-colors"
                  >
                    Agregar Foto
                  </button>
                </div>

                {pImagenesSecundarias.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {pImagenesSecundarias.map((url, idx) => (
                      <div key={idx} className="relative group w-12 h-14 rounded-lg overflow-hidden border border-[#d4af37]/30">
                        <img src={url} alt={`Secundaria ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveSecondaryImage(idx)}
                          className="absolute inset-0 bg-[#ff0000]/80 text-[#ffffff] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sizes and Stock Management */}
              <div className="p-4 rounded-2xl bg-[#141414] border border-[#242424] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#f5d77f] uppercase">
                    Inventario & Tallas Disponibles
                  </span>
                  
                  {/* Add Size Controls */}
                  <div className="flex items-center gap-2">
                    <select
                      value={customSizeInput}
                      onChange={(e) => setCustomSizeInput(e.target.value as SizeName)}
                      className="bg-[#1c1c1c] border border-[#333333] rounded-lg py-1 px-2 text-xs text-[#f4f4f4]"
                    >
                      <option value="XS">Talla XS</option>
                      <option value="S">Talla S</option>
                      <option value="M">Talla M</option>
                      <option value="L">Talla L</option>
                      <option value="XL">Talla XL</option>
                      <option value="4">Talla 4 (Niños)</option>
                      <option value="6">Talla 6 (Niños)</option>
                      <option value="8">Talla 8 (Niños)</option>
                      <option value="10">Talla 10 (Niños)</option>
                      <option value="12">Talla 12 (Niños)</option>
                      <option value="36">Talla 36 (Calzado)</option>
                      <option value="37">Talla 37 (Calzado)</option>
                      <option value="38">Talla 38 (Calzado)</option>
                      <option value="39">Talla 39 (Calzado)</option>
                      <option value="40">Talla 40 (Calzado)</option>
                      <option value="41">Talla 41 (Calzado)</option>
                      <option value="42">Talla 42 (Calzado)</option>
                      <option value="Única">Talla Única</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddSizeToForm}
                      className="px-3 py-1 rounded-lg bg-[#d4af37] text-[#000000] font-bold text-xs hover:bg-[#f5d77f]"
                    >
                      + Añadir Talla
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {pTallas.map((t) => (
                    <div key={t.talla} className="p-2.5 rounded-xl bg-[#0e0e0e] border border-[#2a2a2a] flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-[#f5d77f]">{t.talla}</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={0}
                          value={t.stock}
                          onChange={(e) => handleUpdateSizeStock(t.talla, Number(e.target.value))}
                          className="w-14 bg-[#181818] border border-[#333333] rounded py-1 px-1.5 text-xs text-center text-[#ffffff] font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSizeFromForm(t.talla)}
                          className="text-[#888888] hover:text-[#ff5555]"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-[#888888]">
                  Stock total calculado: <strong className="text-[#d4af37]">{pTallas.reduce((acc, curr) => acc + curr.stock, 0)}</strong> unidades.
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs text-[#888888] block mb-1">Descripción de la Prenda y Materiales</label>
                <textarea
                  value={pDescripcion}
                  onChange={(e) => setPDescripcion(e.target.value)}
                  rows={3}
                  placeholder="Detalles sobre corte, tela, satén, seda, hilos dorados, ocasiones de uso..."
                  className="w-full bg-[#141414] border border-[#333333] rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-6 text-xs pt-1">
                <label className="flex items-center gap-2 text-[#cccccc] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pEnOferta}
                    onChange={(e) => setPEnOferta(e.target.checked)}
                    className="accent-[#d4af37] w-4 h-4"
                  />
                  <span>Marcar en Oferta Especial</span>
                </label>

                <label className="flex items-center gap-2 text-[#cccccc] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pEsNovedad}
                    onChange={(e) => setPEsNovedad(e.target.checked)}
                    className="accent-[#d4af37] w-4 h-4"
                  />
                  <span>Insignia Nueva Colección</span>
                </label>

                <label className="flex items-center gap-2 text-[#cccccc] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pEsDestacado}
                    onChange={(e) => setPEsDestacado(e.target.checked)}
                    className="accent-[#d4af37] w-4 h-4"
                  />
                  <span>Destacado en Portada</span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#242424]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-[#1c1c1c] text-xs text-[#aaaaaa] hover:text-[#ffffff]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-[#080808] font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110"
                >
                  {editingProductId ? 'Guardar Cambios' : 'Crear Prenda'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: NUEVA CATEGORÍA */}
      {/* ========================================================================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-[#000000]/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0e0e0e] border border-[#d4af37] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-[#242424] pb-4">
              <h3 className="text-lg font-bold text-[#f5d77f] font-cinzel">Crear Nueva Categoría</h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-[#888888] hover:text-[#ffffff]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="text-xs text-[#888888] block mb-1">Nombre de Colección *</label>
                <input
                  type="text"
                  value={catNombre}
                  onChange={(e) => setCatNombre(e.target.value)}
                  required
                  placeholder="ej: Joyería Fina & Relojería"
                  className="w-full bg-[#141414] border border-[#d4af37]/40 rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="text-xs text-[#888888] block mb-1">URL de Imagen de Portada</label>
                <input
                  type="url"
                  value={catImg}
                  onChange={(e) => setCatImg(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#141414] border border-[#d4af37]/40 rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="text-xs text-[#888888] block mb-1">Descripción</label>
                <textarea
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  rows={2}
                  placeholder="Descripción de la línea de alta costura..."
                  className="w-full bg-[#141414] border border-[#333333] rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#242424]">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-full bg-[#1c1c1c] text-xs text-[#aaaaaa]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#d4af37] text-[#080808] font-bold text-xs uppercase"
                >
                  Crear Categoría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: INSPECCIÓN DETALLADA DE PEDIDO */}
      {/* ========================================================================= */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-[#000000]/85 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#0e0e0e] border border-[#d4af37] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-[#242424] pb-4">
              <div>
                <span className="text-[11px] text-[#d4af37] uppercase font-bold tracking-widest font-cinzel">
                  Inspección de Pedido VIP
                </span>
                <h3 className="text-xl font-bold text-[#ffffff] font-mono">
                  {selectedOrderDetails.numero_pedido}
                </h3>
              </div>
              <button onClick={() => setSelectedOrderDetails(null)} className="text-[#888888] hover:text-[#ffffff]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#141414] border border-[#222222]">
                <div>
                  <p className="text-[#888888]">Cliente</p>
                  <p className="font-semibold text-[#f4f4f4]">{selectedOrderDetails.nombre_cliente}</p>
                  <p className="text-[#aaaaaa]">{selectedOrderDetails.email_cliente}</p>
                  <p className="text-[#d4af37]">{selectedOrderDetails.telefono_cliente}</p>
                </div>
                <div>
                  <p className="text-[#888888]">Dirección de Despacho</p>
                  <p className="font-semibold text-[#f4f4f4]">{selectedOrderDetails.direccion_envio.direccion_linea1}</p>
                  <p className="text-[#aaaaaa]">{selectedOrderDetails.direccion_envio.ciudad}, {selectedOrderDetails.direccion_envio.departamento_estado}</p>
                  <p className="text-[#d4af37] font-mono">Guía: {selectedOrderDetails.codigo_rastreo}</p>
                </div>
              </div>

              <div>
                <p className="text-[#888888] font-bold mb-2 uppercase">Prendas en el Pedido:</p>
                <div className="divide-y divide-[#202020] bg-[#141414] rounded-xl border border-[#222222] p-3 space-y-2">
                  {selectedOrderDetails.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center pt-2 first:pt-0">
                      <div className="flex items-center gap-3">
                        <img src={item.imagen_producto} alt={item.nombre_producto} className="w-10 h-10 object-cover rounded-md" />
                        <div>
                          <p className="font-semibold text-[#f4f4f4]">{item.nombre_producto}</p>
                          <p className="text-[#888888]">Talla: <span className="text-[#f5d77f] font-bold">{item.nombre_talla}</span> x {item.cantidad}</p>
                        </div>
                      </div>
                      <span className="font-bold text-[#f5d77f]">${item.subtotal.toLocaleString('es-CO')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center p-4 rounded-xl bg-[#181409] border border-[#d4af37]">
                <span className="text-[#f5d77f] font-bold">Total Facturado</span>
                <span className="text-lg font-bold text-[#f5d77f]">${selectedOrderDetails.total.toLocaleString('es-CO')}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-6 py-2 rounded-full bg-[#d4af37] text-[#000000] font-bold text-xs uppercase"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

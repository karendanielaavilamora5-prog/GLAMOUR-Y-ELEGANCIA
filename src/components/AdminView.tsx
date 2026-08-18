import React, { useState } from 'react';
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
  DollarSign 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, Category, Order, User, SizeName, OrderStatus } from '../types';

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
    setActiveView,
    addToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'resumen' | 'productos' | 'categorias' | 'pedidos' | 'usuarios' | 'cupones'>('resumen');

  // --- Product Form State ---
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [pNombre, setPNombre] = useState('');
  const [pSku, setPSku] = useState('');
  const [pCategoriaId, setPCategoriaId] = useState(categories[0]?.id || 'cat-1');
  const [pPrecio, setPPrecio] = useState(250000);
  const [pPrecioOferta, setPPrecioOferta] = useState<number | undefined>(undefined);
  const [pDescripcion, setPDescripcion] = useState('');
  const [pImagen, setPImagen] = useState('');
  const [pEnOferta, setPEnOferta] = useState(false);
  const [pEsNovedad, setPEsNovedad] = useState(false);
  const [pEsDestacado, setPEsDestacado] = useState(true);
  const [pTallas, setPTallas] = useState<{ talla: SizeName; stock: number }[]>([
    { talla: 'S', stock: 5 },
    { talla: 'M', stock: 8 },
    { talla: 'L', stock: 4 },
  ]);

  // --- Category Form State ---
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [catNombre, setCatNombre] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImg, setCatImg] = useState('');

  // --- Order detail inspection modal ---
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Summary Metrics calculations
  const totalSales = orders.reduce((sum, o) => sum + (o.estado !== 'Cancelado' ? o.total : 0), 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.estado === 'Pendiente' || o.estado === 'En preparación').length;
  const totalProductsCount = products.length;
  const totalUsersCount = adminUsersList.length;

  const handleOpenNewProduct = () => {
    setEditingProductId(null);
    setPNombre('');
    setPSku(`GLE-${Math.floor(1000 + Math.random() * 9000)}`);
    setPCategoriaId(categories[0]?.id || 'cat-1');
    setPPrecio(250000);
    setPPrecioOferta(undefined);
    setPDescripcion('');
    setPImagen('https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop');
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
    setPEnOferta(prod.en_oferta);
    setPEsNovedad(prod.es_novedad);
    setPEsDestacado(prod.es_destacado);
    setPTallas(prod.tallas);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pNombre.trim() || !pSku.trim()) {
      addToast('Por favor completa el nombre y el SKU.', 'error');
      return;
    }

    const catObj = categories.find((c) => c.id === pCategoriaId);
    const totalStockCalc = pTallas.reduce((sum, t) => sum + Number(t.stock), 0);

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
        imagenes_secundarias: [pImagen],
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
      addToast('El nombre de la categoría es requerido.', 'error');
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

  const knownCoupons = [
    { code: 'ELEGANCIA10', desc: '10% de descuento en toda la tienda' },
    { code: 'GLAMUR20', desc: '20% de descuento para clientes VIP' },
    { code: 'VIP15', desc: '15% de descuento en colección de gala' },
    { code: 'BLACKGOLD', desc: '25% de descuento especial' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#161208] via-[#201806] to-[#161208] border border-[#d4af37]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs uppercase font-bold text-[#d4af37] font-cinzel">
            <Crown className="w-4 h-4" />
            <span>Sistema Central de Gestión</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#ffffff] font-cinzel">
            Panel de Administrador VIP
          </h1>
          <p className="text-xs text-[#888888]">
            Gestiona el catálogo, categorías, pedidos, usuarios registrados e inventario de alta costura.
          </p>
        </div>

        <button
          onClick={() => setActiveView('inicio')}
          className="px-5 py-2.5 rounded-full bg-[#121212] border border-[#d4af37]/40 text-[#f5d77f] text-xs font-semibold hover:bg-[#d4af37] hover:text-[#080808] transition-all flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la Tienda</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[#242424]">
        <button
          onClick={() => setActiveTab('resumen')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'resumen'
              ? 'bg-[#d4af37] text-[#080808] shadow-md shadow-[#d4af37]/20'
              : 'bg-[#121212] text-[#888888] hover:text-[#f5d77f]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Resumen de Ventas</span>
        </button>

        <button
          id="admin-tab-products-btn"
          onClick={() => setActiveTab('productos')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'productos'
              ? 'bg-[#d4af37] text-[#080808] shadow-md shadow-[#d4af37]/20'
              : 'bg-[#121212] text-[#888888] hover:text-[#f5d77f]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Prendas ({products.length})</span>
        </button>

        <button
          id="admin-tab-categories-btn"
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
          id="admin-tab-orders-btn"
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
          id="admin-tab-users-btn"
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
          id="admin-tab-coupons-btn"
          onClick={() => setActiveTab('cupones')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'cupones'
              ? 'bg-[#d4af37] text-[#080808] shadow-md shadow-[#d4af37]/20'
              : 'bg-[#121212] text-[#888888] hover:text-[#f5d77f]'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Cupones Promocionales</span>
        </button>
      </div>

      {/* 1. TAB RESUMEN */}
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
                <TrendingUp className="w-3 h-3" /> +18.4% este mes
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
                {pendingOrdersCount} pendientes de taller/despacho
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-[#d4af37]/40 space-y-2">
              <div className="flex justify-between items-center text-[#888888]">
                <span className="text-xs font-semibold uppercase tracking-wider">Catálogo Activo</span>
                <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
              </div>
              <p className="text-2xl font-bold text-[#ffffff] font-cinzel">
                {totalProductsCount} prendas
              </p>
              <p className="text-[11px] text-[#aaaaaa]">
                En {categories.length} categorías de alta costura
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-[#d4af37]/40 space-y-2">
              <div className="flex justify-between items-center text-[#888888]">
                <span className="text-xs font-semibold uppercase tracking-wider">Clientes Registrados</span>
                <Users className="w-5 h-5 text-[#d4af37]" />
              </div>
              <p className="text-2xl font-bold text-[#ffffff] font-cinzel">
                {totalUsersCount} miembros
              </p>
              <p className="text-[11px] text-[#55ff77]">
                100% cuentas activas
              </p>
            </div>

          </div>

          {/* Recent Orders Overview */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0f0f0f] border border-[#242424] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#f5d77f] uppercase font-cinzel">
                Últimos Pedidos Recibidos
              </h3>
              <button
                onClick={() => setActiveTab('pedidos')}
                className="text-xs text-[#d4af37] hover:underline"
              >
                Ver todos los pedidos →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#cccccc]">
                <thead className="border-b border-[#222222] text-[#888888] uppercase">
                  <tr>
                    <th className="py-3 px-4"># Pedido</th>
                    <th className="py-3 px-4">Cliente</th>
                    <th className="py-3 px-4">Fecha</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a1a]">
                  {orders.slice(0, 5).map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#141414]">
                      <td className="py-3 px-4 font-mono font-bold text-[#f5d77f]">{ord.numero_pedido}</td>
                      <td className="py-3 px-4 text-[#f4f4f4]">{ord.nombre_cliente}</td>
                      <td className="py-3 px-4 text-[#888888]">{new Date(ord.fecha_pedido).toLocaleDateString('es-CO')}</td>
                      <td className="py-3 px-4 font-bold text-[#f5d77f]">${ord.total.toLocaleString('es-CO')}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-[#181409] border border-[#d4af37] text-[#f5d77f]">
                          {ord.estado}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrderDetails(ord)}
                          className="text-[#d4af37] hover:underline"
                        >
                          Ver Detalle
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

      {/* 2. TAB PRODUCTOS */}
      {activeTab === 'productos' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#ffffff] font-cinzel">
                Gestión de Catálogo & Prendas ({products.length})
              </h2>
              <p className="text-xs text-[#888888]">
                Crea, edita, desactiva o ajusta el stock de prendas por talla.
              </p>
            </div>

            <button
              id="admin-add-product-btn"
              onClick={handleOpenNewProduct}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-[#080808] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-1.5 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Prenda</span>
            </button>
          </div>

          <div className="bg-[#0f0f0f] border border-[#242424] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#cccccc]">
                <thead className="bg-[#141414] border-b border-[#242424] text-[#888888] uppercase text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Prenda</th>
                    <th className="py-3.5 px-4">SKU</th>
                    <th className="py-3.5 px-4">Categoría</th>
                    <th className="py-3.5 px-4">Precio</th>
                    <th className="py-3.5 px-4">Tallas & Stock</th>
                    <th className="py-3.5 px-4">Badges</th>
                    <th className="py-3.5 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c1c1c]">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-[#141414]/60">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={p.imagen_principal}
                          alt={p.nombre}
                          className="w-12 h-14 object-cover rounded-lg border border-[#d4af37]/30 flex-shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-[#f4f4f4] max-w-xs truncate">{p.nombre}</h4>
                          <span className="text-[10px] text-[#777777]">
                            {p.activo ? '● Activo en tienda' : '○ Inactivo'}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-[#d4af37]">{p.sku}</td>
                      <td className="py-3 px-4">{p.nombre_categoria}</td>
                      
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#f5d77f]">
                          ${(p.precio_oferta || p.precio).toLocaleString('es-CO')}
                        </span>
                        {p.en_oferta && (
                          <span className="block text-[10px] text-[#777777] line-through">
                            ${p.precio.toLocaleString('es-CO')}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {p.tallas.map((t) => (
                            <span
                              key={t.talla}
                              className="px-1.5 py-0.5 rounded bg-[#181818] border border-[#2a2a2a] text-[10px]"
                            >
                              {t.talla}: <strong className="text-[#f5d77f]">{t.stock}</strong>
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {p.en_oferta && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#d4af37] text-[#000000]">
                              Oferta
                            </span>
                          )}
                          {p.es_novedad && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#181409] border border-[#d4af37] text-[#f5d77f]">
                              Novedad
                            </span>
                          )}
                          {p.es_destacado && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#222222] text-[#e0e0e0]">
                              Destacado
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            id={`edit-prod-btn-${p.id}`}
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-1.5 rounded-lg bg-[#181818] text-[#f5d77f] hover:bg-[#d4af37] hover:text-[#000000] transition-colors"
                            title="Editar prenda"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`delete-prod-btn-${p.id}`}
                            onClick={() => adminDeleteProduct(p.id)}
                            className="p-1.5 rounded-lg bg-[#181818] text-[#ff5555] hover:bg-[#ff5555] hover:text-[#ffffff] transition-colors"
                            title="Eliminar prenda"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* 3. TAB CATEGORIAS */}
      {activeTab === 'categorias' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#ffffff] font-cinzel">
                Líneas y Categorías ({categories.length})
              </h2>
              <p className="text-xs text-[#888888]">
                Organiza las colecciones principales de la marca.
              </p>
            </div>

            <button
              id="admin-add-category-btn"
              onClick={() => setIsCategoryModalOpen(true)}
              className="px-5 py-2.5 rounded-full bg-[#d4af37] text-[#080808] font-bold text-xs uppercase tracking-wider hover:bg-[#f5d77f] transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Categoría</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-5 rounded-2xl bg-[#0f0f0f] border border-[#262626] space-y-4 relative overflow-hidden"
              >
                <div className="aspect-[16/9] rounded-xl overflow-hidden bg-[#181818]">
                  <img src={cat.imagen_url} alt={cat.nombre} className="w-full h-full object-cover" />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-bold text-[#f5d77f] font-cinzel">{cat.nombre}</h3>
                    <span className="text-[11px] font-mono text-[#888888]">/{cat.slug}</span>
                  </div>
                  <p className="text-xs text-[#aaaaaa]">{cat.descripcion}</p>
                </div>

                <div className="pt-2 border-t border-[#202020] flex justify-between items-center text-xs">
                  <span className="text-[#666666]">
                    {products.filter((p) => p.id_categoria === cat.id).length} prendas
                  </span>
                  <button
                    onClick={() => adminDeleteCategory(cat.id)}
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

      {/* 4. TAB PEDIDOS */}
      {activeTab === 'pedidos' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#ffffff] font-cinzel">
              Gestión de Pedidos & Logística ({orders.length})
            </h2>
            <p className="text-xs text-[#888888]">
              Monitorea y actualiza el estado de preparación y despacho de cada orden en tiempo real.
            </p>
          </div>

          <div className="bg-[#0f0f0f] border border-[#242424] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#cccccc]">
                <thead className="bg-[#141414] border-b border-[#242424] text-[#888888] uppercase text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4"># Pedido / Guía</th>
                    <th className="py-3.5 px-4">Cliente & Destino</th>
                    <th className="py-3.5 px-4">Prendas</th>
                    <th className="py-3.5 px-4">Total</th>
                    <th className="py-3.5 px-4">Actualizar Estado</th>
                    <th className="py-3.5 px-4 text-right">Detalle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c1c1c]">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#141414]/60">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-[#f5d77f] block">{ord.numero_pedido}</span>
                        <span className="text-[10px] text-[#777777] font-mono">{ord.codigo_rastreo}</span>
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-semibold text-[#f4f4f4]">{ord.nombre_cliente}</p>
                        <p className="text-[11px] text-[#888888]">{ord.direccion_envio.ciudad}, {ord.direccion_envio.direccion_linea1}</p>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-[#e0e0e0] font-medium">{ord.items.length} prendas</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-[#f5d77f]">${ord.total.toLocaleString('es-CO')}</span>
                        <span className="block text-[10px] text-[#888888]">{ord.metodo_pago}</span>
                      </td>

                      <td className="py-3 px-4">
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

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrderDetails(ord)}
                          className="p-1.5 rounded-lg bg-[#181818] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#000000] transition-colors"
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

      {/* 5. TAB USUARIOS */}
      {activeTab === 'usuarios' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#ffffff] font-cinzel">
              Usuarios Registrados ({adminUsersList.length})
            </h2>
            <p className="text-xs text-[#888888]">
              Administra permisos de acceso, roles de administrador y membresías VIP.
            </p>
          </div>

          <div className="bg-[#0f0f0f] border border-[#242424] rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs text-[#cccccc]">
              <thead className="bg-[#141414] border-b border-[#242424] text-[#888888] uppercase text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Usuario</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Teléfono</th>
                  <th className="py-3.5 px-4">Rol</th>
                  <th className="py-3.5 px-4 text-right">Estado / Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c1c1c]">
                {adminUsersList.map((u) => (
                  <tr key={u.id} className="hover:bg-[#141414]/60">
                    <td className="py-3 px-4 font-semibold text-[#f4f4f4]">
                      {u.nombre} {u.apellido}
                    </td>
                    <td className="py-3 px-4">{u.email}</td>
                    <td className="py-3 px-4">{u.telefono}</td>
                    <td className="py-3 px-4">
                      {u.rol === 'administrador' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#d4af37] text-[#000000]">
                          Administrador
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#181409] border border-[#d4af37] text-[#f5d77f]">
                          Cliente VIP
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => adminToggleUserStatus(u.id)}
                        className={`text-xs hover:underline ${
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

      {/* 6. TAB CUPONES */}
      {activeTab === 'cupones' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#ffffff] font-cinzel">
              Cupones & Promociones Activas
            </h2>
            <p className="text-xs text-[#888888]">
              Códigos de descuento configurados para campañas de temporada.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {knownCoupons.map((c) => (
              <div
                key={c.code}
                className="p-5 rounded-2xl bg-[#0f0f0f] border border-[#d4af37]/40 space-y-3 relative"
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
                  Probar Cupón en Tienda
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: Crear/Editar Prenda */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-[#000000]/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#0e0e0e] border border-[#d4af37] rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-[#242424] pb-4">
              <h3 className="text-lg font-bold text-[#f5d77f] font-cinzel">
                {editingProductId ? 'Editar Prenda de Alta Costura' : 'Registrar Nueva Prenda'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-[#888888] hover:text-[#ffffff]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#888888] block mb-1">Nombre de la Prenda *</label>
                  <input
                    type="text"
                    value={pNombre}
                    onChange={(e) => setPNombre(e.target.value)}
                    required
                    className="w-full bg-[#141414] border border-[#d4af37]/40 rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#888888] block mb-1">Código SKU *</label>
                  <input
                    type="text"
                    value={pSku}
                    onChange={(e) => setPSku(e.target.value)}
                    required
                    className="w-full bg-[#141414] border border-[#d4af37]/40 rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-[#888888] block mb-1">Categoría</label>
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
                    value={pPrecio}
                    onChange={(e) => setPPrecio(Number(e.target.value))}
                    required
                    className="w-full bg-[#141414] border border-[#d4af37]/40 rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#888888] block mb-1">Precio Oferta ($ COP)</label>
                  <input
                    type="number"
                    value={pPrecioOferta || ''}
                    onChange={(e) => setPPrecioOferta(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Solo si está en oferta"
                    className="w-full bg-[#141414] border border-[#333333] rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#888888] block mb-1">URL de Imagen Principal *</label>
                <input
                  type="url"
                  value={pImagen}
                  onChange={(e) => setPImagen(e.target.value)}
                  required
                  placeholder="https://..."
                  className="w-full bg-[#141414] border border-[#d4af37]/40 rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="text-xs text-[#888888] block mb-1">Descripción de la Prenda</label>
                <textarea
                  value={pDescripcion}
                  onChange={(e) => setPDescripcion(e.target.value)}
                  rows={3}
                  className="w-full bg-[#141414] border border-[#333333] rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-6 text-xs pt-2">
                <label className="flex items-center gap-2 text-[#cccccc] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pEnOferta}
                    onChange={(e) => setPEnOferta(e.target.checked)}
                    className="accent-[#d4af37]"
                  />
                  <span>En Oferta</span>
                </label>

                <label className="flex items-center gap-2 text-[#cccccc] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pEsNovedad}
                    onChange={(e) => setPEsNovedad(e.target.checked)}
                    className="accent-[#d4af37]"
                  />
                  <span>Es Novedad</span>
                </label>

                <label className="flex items-center gap-2 text-[#cccccc] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pEsDestacado}
                    onChange={(e) => setPEsDestacado(e.target.checked)}
                    className="accent-[#d4af37]"
                  />
                  <span>Destacado en Inicio</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#242424]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-[#1c1c1c] text-xs text-[#aaaaaa]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-[#080808] font-bold text-xs uppercase"
                >
                  Guardar Prenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Nueva Categoría */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-[#000000]/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0e0e0e] border border-[#d4af37] rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-[#242424] pb-4">
              <h3 className="text-lg font-bold text-[#f5d77f] font-cinzel">Crear Nueva Categoría</h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-[#888888]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="text-xs text-[#888888] block mb-1">Nombre (ej: Joyería VIP)</label>
                <input
                  type="text"
                  value={catNombre}
                  onChange={(e) => setCatNombre(e.target.value)}
                  required
                  className="w-full bg-[#141414] border border-[#d4af37]/40 rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="text-xs text-[#888888] block mb-1">URL de Imagen Portada</label>
                <input
                  type="url"
                  value={catImg}
                  onChange={(e) => setCatImg(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#141414] border border-[#d4af37]/40 rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="text-xs text-[#888888] block mb-1">Descripción</label>
                <textarea
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  rows={2}
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

      {/* MODAL: Inspección de Detalle de Pedido */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-[#000000]/85 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#0e0e0e] border border-[#d4af37] rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-[#242424] pb-4">
              <div>
                <span className="text-xs uppercase font-bold text-[#d4af37]">Detalle de Orden</span>
                <h3 className="text-lg font-bold text-[#ffffff] font-cinzel font-mono">
                  {selectedOrderDetails.numero_pedido}
                </h3>
              </div>
              <button onClick={() => setSelectedOrderDetails(null)} className="text-[#888888]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#141414] border border-[#262626] space-y-1 text-[#cccccc]">
                <strong className="text-[#f5d77f] block mb-1">Destinatario & Dirección:</strong>
                <p>{selectedOrderDetails.nombre_cliente}</p>
                <p>{selectedOrderDetails.direccion_envio.direccion_linea1}</p>
                <p>{selectedOrderDetails.direccion_envio.ciudad}, {selectedOrderDetails.direccion_envio.departamento_estado}</p>
                <p>Tel: {selectedOrderDetails.telefono_cliente}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#141414] border border-[#262626] space-y-1 text-[#cccccc]">
                <strong className="text-[#f5d77f] block mb-1">Información de Pago & Despacho:</strong>
                <p>Método: {selectedOrderDetails.metodo_pago.toUpperCase()}</p>
                <p>Guía de Rastreo: <strong className="text-[#f5d77f]">{selectedOrderDetails.codigo_rastreo}</strong></p>
                <p>Fecha: {new Date(selectedOrderDetails.fecha_pedido).toLocaleString('es-CO')}</p>
                <p>Estado actual: <span className="font-bold text-[#f5d77f]">{selectedOrderDetails.estado.toUpperCase()}</span></p>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-[#e0e0e0]">Prendas en la Orden:</h4>
              <div className="divide-y divide-[#202020] border border-[#262626] rounded-xl p-3 bg-[#121212]">
                {selectedOrderDetails.items.map((i) => (
                  <div key={`${i.id_producto}-${i.nombre_talla}`} className="py-2 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <img src={i.imagen_producto} alt={i.nombre_producto} className="w-9 h-11 object-cover rounded" />
                      <div>
                        <span className="font-semibold text-[#f4f4f4] block">{i.nombre_producto}</span>
                        <span className="text-[10px] text-[#888888]">Talla: {i.nombre_talla} × {i.cantidad}</span>
                      </div>
                    </div>
                    <span className="font-bold text-[#f5d77f]">${i.subtotal.toLocaleString('es-CO')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[#242424] text-xs">
              <span className="text-[#888888]">Total de la transacción:</span>
              <span className="text-base font-bold text-[#f5d77f] font-cinzel">
                ${selectedOrderDetails.total.toLocaleString('es-CO')}
              </span>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-6 py-2 rounded-full bg-[#d4af37] text-[#080808] text-xs font-bold uppercase"
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

import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Package, 
  Clock, 
  MapPin, 
  LogOut, 
  Plus, 
  Trash2, 
  Truck, 
  Sparkles
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    orders,
    addresses,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    logout,
    updateUserProfile,
    setActiveView,
    openAuthModal,
    addToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'perfil' | 'pedidos' | 'historial' | 'direcciones'>('perfil');

  // Edit profile state
  const [nombre, setNombre] = useState(currentUser?.nombre || '');
  const [apellido, setApellido] = useState(currentUser?.apellido || '');
  const [telefono, setTelefono] = useState(currentUser?.telefono || '');

  // Add Address Form Modal / Inline
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newTitle, setNewTitle] = useState('Residencia');
  const [newName, setNewName] = useState(currentUser ? `${currentUser.nombre} ${currentUser.apellido}` : '');
  const [newPhone, setNewPhone] = useState(currentUser?.telefono || '');
  const [newLine1, setNewLine1] = useState('');
  const [newLine2, setNewLine2] = useState('');
  const [newCity, setNewCity] = useState('Bogotá');
  const [newState, setNewState] = useState('Cundinamarca');

  // If not logged in, prompt login
  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#181409] border border-[#d4af37] text-[#f5d77f] flex items-center justify-center mx-auto">
          <UserIcon className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[#ffffff] font-cinzel">
            Inicia Sesión en tu Cuenta VIP
          </h2>
          <p className="text-xs text-[#888888] max-w-sm mx-auto">
            Accede a tu historial de compras, gestiona tus direcciones y haz seguimiento en tiempo real de tus pedidos.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => openAuthModal('login')}
            className="px-6 py-3 rounded-full bg-[#d4af37] text-[#080808] text-xs font-bold uppercase tracking-wider hover:bg-[#f5d77f] transition-all"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => openAuthModal('registro')}
            className="px-6 py-3 rounded-full bg-[#141414] border border-[#d4af37]/40 text-[#f5d77f] text-xs font-semibold hover:bg-[#202020] transition-all"
          >
            Crear Cuenta
          </button>
        </div>
      </div>
    );
  }

  const userOrders = orders.filter(
    (o) => o.id_usuario === currentUser.id || o.email_cliente.toLowerCase() === currentUser.email.toLowerCase()
  );

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ nombre, apellido, telefono });
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLine1.trim() || !newName.trim() || !newPhone.trim()) {
      addToast('Por favor completa todos los campos requeridos.', 'error');
      return;
    }
    addAddress({
      titulo: newTitle,
      nombre_contacto: newName,
      telefono_contacto: newPhone,
      direccion_linea1: newLine1,
      direccion_linea2: newLine2,
      ciudad: newCity,
      departamento_estado: newState,
      pais: 'Colombia',
      es_predeterminada: addresses.length === 0,
    });
    setIsAddingAddress(false);
    setNewLine1('');
    setNewLine2('');
  };

  // Collect all purchased items across all orders for "Historial de Compras"
  const allPurchasedItems = userOrders.flatMap((order) =>
    order.items.map((item) => ({
      ...item,
      orderNumber: order.numero_pedido,
      orderDate: order.fecha_pedido,
      orderStatus: order.estado,
    }))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* User Header Profile Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#14120c] via-[#1f1908] to-[#14120c] border border-[#d4af37]/40 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#d4af37] to-[#f5d77f] p-0.5 shadow-lg">
            <div className="w-full h-full rounded-full bg-[#0a0a0a] flex items-center justify-center text-[#f5d77f] text-2xl font-bold font-cinzel">
              {currentUser.nombre.charAt(0)}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#ffffff] font-cinzel">
                {currentUser.nombre} {currentUser.apellido}
              </h1>
              {currentUser.rol === 'administrador' ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#d4af37] text-[#000000]">
                  Admin
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#1e1709] border border-[#d4af37] text-[#f5d77f]">
                  Miembro VIP
                </span>
              )}
            </div>
            <p className="text-xs text-[#888888]">{currentUser.email}</p>
          </div>
        </div>

        {/* Quick Admin Shortcut if admin */}
        {currentUser.rol === 'administrador' && (
          <button
            onClick={() => setActiveView('admin')}
            className="px-5 py-2.5 rounded-full bg-[#d4af37] text-[#080808] font-bold text-xs uppercase tracking-wider hover:bg-[#f5d77f] transition-all flex items-center gap-1.5 shadow-lg shadow-[#d4af37]/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ir al Panel de Administración</span>
          </button>
        )}
      </div>

      {/* Profile Layout (Tabs Sidebar + Main Content) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="space-y-2 bg-[#0f0f0f] border border-[#242424] rounded-2xl p-4 h-fit">
          <button
            id="tab-profile-btn"
            onClick={() => setActiveTab('perfil')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'perfil'
                ? 'bg-[#d4af37] text-[#080808] font-bold shadow-md shadow-[#d4af37]/20'
                : 'text-[#a0a0a0] hover:bg-[#181818] hover:text-[#f5d77f]'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Mi Perfil</span>
          </button>

          <button
            id="tab-orders-btn"
            onClick={() => setActiveTab('pedidos')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'pedidos'
                ? 'bg-[#d4af37] text-[#080808] font-bold shadow-md shadow-[#d4af37]/20'
                : 'text-[#a0a0a0] hover:bg-[#181818] hover:text-[#f5d77f]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4" />
              <span>Mis Pedidos</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              activeTab === 'pedidos' ? 'bg-[#000000] text-[#f5d77f]' : 'bg-[#1e1e1e] text-[#888888]'
            }`}>
              {userOrders.length}
            </span>
          </button>

          <button
            id="tab-history-btn"
            onClick={() => setActiveTab('historial')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'historial'
                ? 'bg-[#d4af37] text-[#080808] font-bold shadow-md shadow-[#d4af37]/20'
                : 'text-[#a0a0a0] hover:bg-[#181818] hover:text-[#f5d77f]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Historial de Compras</span>
          </button>

          <button
            id="tab-addresses-btn"
            onClick={() => setActiveTab('direcciones')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'direcciones'
                ? 'bg-[#d4af37] text-[#080808] font-bold shadow-md shadow-[#d4af37]/20'
                : 'text-[#a0a0a0] hover:bg-[#181818] hover:text-[#f5d77f]'
            }`}
          >
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4" />
              <span>Mis Direcciones</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              activeTab === 'direcciones' ? 'bg-[#000000] text-[#f5d77f]' : 'bg-[#1e1e1e] text-[#888888]'
            }`}>
              {addresses.length}
            </span>
          </button>

          <div className="pt-4 border-t border-[#222222]">
            <button
              id="logout-btn"
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-[#ff5555] hover:bg-[#201010] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          
          {/* 1. TAB MI PERFIL */}
          {activeTab === 'perfil' && (
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0f0f0f] border border-[#242424] space-y-6">
              <div className="border-b border-[#222222] pb-4">
                <h3 className="text-base font-bold text-[#f5d77f] uppercase font-cinzel">
                  Información Personal & de Contacto
                </h3>
                <p className="text-xs text-[#888888]">
                  Actualiza tus datos para personalizar tus comprobantes de alta costura.
                </p>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#888888] block mb-1">Nombre</label>
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                      className="w-full bg-[#141414] border border-[#d4af37]/40 rounded-xl py-2.5 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#888888] block mb-1">Apellido</label>
                    <input
                      type="text"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      required
                      className="w-full bg-[#141414] border border-[#d4af37]/40 rounded-xl py-2.5 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#888888] block mb-1">Correo Electrónico (No modificable)</label>
                    <input
                      type="email"
                      value={currentUser.email}
                      disabled
                      className="w-full bg-[#0a0a0a] border border-[#222222] rounded-xl py-2.5 px-3 text-xs text-[#777777] cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#888888] block mb-1">Teléfono</label>
                    <input
                      type="text"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="+57 300 000 0000"
                      className="w-full bg-[#141414] border border-[#d4af37]/40 rounded-xl py-2.5 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-[#080808] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 2. TAB MIS PEDIDOS */}
          {activeTab === 'pedidos' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#0f0f0f] border border-[#242424] flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#f5d77f] uppercase font-cinzel">
                  Tus Pedidos Realizados ({userOrders.length})
                </h3>
              </div>

              {userOrders.length > 0 ? (
                <div className="space-y-4">
                  {userOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-6 rounded-2xl bg-[#0f0f0f] border border-[#262626] space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#202020] pb-3 text-xs">
                        <div className="space-y-0.5">
                          <span className="text-[#888888]">Pedido</span>
                          <p className="font-bold text-[#f5d77f] font-mono text-sm">{order.numero_pedido}</p>
                          <p className="text-[10px] text-[#666666]">{new Date(order.fecha_pedido).toLocaleString('es-CO')}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-[#181409] border border-[#d4af37] text-[#f5d77f]">
                            {order.estado.toUpperCase()}
                          </span>

                          <button
                            onClick={() => setActiveView('seguimiento_pedido')}
                            className="px-4 py-1.5 rounded-lg bg-[#d4af37] text-[#000000] text-xs font-bold flex items-center gap-1.5 hover:bg-[#f5d77f] transition-colors"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Rastrear</span>
                          </button>
                        </div>
                      </div>

                      {/* Items list */}
                      <div className="divide-y divide-[#1c1c1c]">
                        {order.items.map((item) => (
                          <div key={`${item.id_producto}-${item.nombre_talla}`} className="py-2.5 flex items-center justify-between gap-4 text-xs">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.imagen_producto}
                                alt={item.nombre_producto}
                                className="w-12 h-14 object-cover rounded-lg border border-[#d4af37]/30"
                              />
                              <div>
                                <h4 className="font-semibold text-[#f4f4f4]">{item.nombre_producto}</h4>
                                <p className="text-[11px] text-[#888888]">
                                  Talla: <span className="text-[#d4af37] font-bold">{item.nombre_talla}</span> | Cantidad: {item.cantidad}
                                </p>
                              </div>
                            </div>

                            <span className="font-bold text-[#f5d77f]">
                              ${item.subtotal.toLocaleString('es-CO')}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Total */}
                      <div className="pt-2 border-t border-[#202020] flex justify-between items-center text-xs">
                        <span className="text-[#888888]">
                          Envío a: <strong className="text-[#cccccc]">{order.direccion_envio.ciudad}, {order.direccion_envio.direccion_linea1}</strong>
                        </span>
                        <div className="text-right">
                          <span className="text-[#888888] mr-2">Total:</span>
                          <strong className="text-sm font-bold text-[#f5d77f]">${order.total.toLocaleString('es-CO')}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-[#0f0f0f] border border-[#242424] rounded-2xl space-y-3">
                  <Package className="w-10 h-10 text-[#444444] mx-auto" />
                  <p className="text-sm text-[#888888]">Aún no has realizado pedidos.</p>
                  <button
                    onClick={() => setActiveView('catalogo')}
                    className="px-5 py-2 rounded-full bg-[#d4af37] text-[#000000] text-xs font-bold uppercase"
                  >
                    Explorar Catálogo
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 3. TAB HISTORIAL DE COMPRAS (Artículos comprados detallados) */}
          {activeTab === 'historial' && (
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0f0f0f] border border-[#242424] space-y-6">
              <div className="border-b border-[#222222] pb-4">
                <h3 className="text-base font-bold text-[#f5d77f] uppercase font-cinzel">
                  Historial de Prendas Compradas ({allPurchasedItems.length})
                </h3>
                <p className="text-xs text-[#888888]">
                  Registro histórico de todas las prendas que forman parte de tu guardarropa Glamur.
                </p>
              </div>

              {allPurchasedItems.length > 0 ? (
                <div className="divide-y divide-[#202020]">
                  {allPurchasedItems.map((item, idx) => (
                    <div key={idx} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.imagen_producto}
                          alt={item.nombre_producto}
                          className="w-16 h-20 object-cover rounded-xl border border-[#d4af37]/30 flex-shrink-0"
                        />
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-[#f4f4f4]">{item.nombre_producto}</h4>
                          <p className="text-[11px] text-[#888888]">
                            Talla: <span className="text-[#d4af37] font-semibold">{item.nombre_talla}</span> | Cantidad: {item.cantidad}
                          </p>
                          <p className="text-[10px] text-[#666666]">
                            Comprado el {new Date(item.orderDate).toLocaleDateString('es-CO')} en orden {item.orderNumber}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-center">
                        <span className="text-xs font-bold text-[#f5d77f]">
                          ${item.subtotal.toLocaleString('es-CO')}
                        </span>
                        <button
                          onClick={() => setActiveView('catalogo')}
                          className="px-3 py-1.5 rounded-lg bg-[#181818] border border-[#d4af37]/40 text-[#f5d77f] text-xs font-semibold hover:bg-[#d4af37] hover:text-[#000000] transition-colors"
                        >
                          Comprar de nuevo
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-[#777777]">
                  No has registrado compras de prendas aún.
                </div>
              )}
            </div>
          )}

          {/* 4. TAB MIS DIRECCIONES */}
          {activeTab === 'direcciones' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#0f0f0f] border border-[#242424] flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#f5d77f] uppercase font-cinzel">
                  Tus Direcciones de Entrega ({addresses.length})
                </h3>
                {!isAddingAddress && (
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="px-4 py-2 rounded-lg bg-[#d4af37] text-[#000000] text-xs font-bold flex items-center gap-1.5 hover:bg-[#f5d77f]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Dirección</span>
                  </button>
                )}
              </div>

              {/* Form to add address */}
              {isAddingAddress && (
                <form onSubmit={handleSaveAddress} className="p-6 rounded-2xl bg-[#0e0e0e] border border-[#d4af37] space-y-4">
                  <h4 className="text-xs font-bold text-[#f5d77f] uppercase font-cinzel">
                    Nueva Dirección de Entrega
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-[#888888] block mb-1">Etiqueta (ej: Residencia, Oficina)</label>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        required
                        className="w-full bg-[#161616] border border-[#d4af37]/40 rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-[#888888] block mb-1">Nombre de Contacto</label>
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        required
                        className="w-full bg-[#161616] border border-[#d4af37]/40 rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-[#888888] block mb-1">Teléfono</label>
                      <input
                        type="text"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        required
                        className="w-full bg-[#161616] border border-[#d4af37]/40 rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-[#888888] block mb-1">Dirección Principal</label>
                      <input
                        type="text"
                        value={newLine1}
                        onChange={(e) => setNewLine1(e.target.value)}
                        placeholder="Calle / Carrera / Número"
                        required
                        className="w-full bg-[#161616] border border-[#d4af37]/40 rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] text-[#888888] block mb-1">Apto / Torre</label>
                      <input
                        type="text"
                        value={newLine2}
                        onChange={(e) => setNewLine2(e.target.value)}
                        className="w-full bg-[#161616] border border-[#333333] rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-[#888888] block mb-1">Ciudad</label>
                      <input
                        type="text"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        required
                        className="w-full bg-[#161616] border border-[#333333] rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-[#888888] block mb-1">Departamento</label>
                      <input
                        type="text"
                        value={newState}
                        onChange={(e) => setNewState(e.target.value)}
                        required
                        className="w-full bg-[#161616] border border-[#333333] rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-4 py-2 rounded-xl bg-[#222222] text-xs text-[#cccccc]"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#d4af37] text-[#000000] text-xs font-bold"
                    >
                      Guardar Dirección
                    </button>
                  </div>
                </form>
              )}

              {/* Addresses List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-5 rounded-2xl bg-[#0f0f0f] border border-[#262626] space-y-3 relative"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#d4af37]" />
                        <h4 className="text-xs font-bold text-[#f5d77f]">{addr.titulo}</h4>
                      </div>

                      {addr.es_predeterminada ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#181409] border border-[#d4af37] text-[#f5d77f]">
                          Predeterminada
                        </span>
                      ) : (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          className="text-[10px] text-[#888888] hover:text-[#f5d77f] underline"
                        >
                          Hacer predeterminada
                        </button>
                      )}
                    </div>

                    <div className="text-xs text-[#cccccc] space-y-0.5">
                      <p className="font-semibold text-[#f4f4f4]">{addr.nombre_contacto}</p>
                      <p>{addr.direccion_linea1}</p>
                      {addr.direccion_linea2 && <p className="text-[#888888]">{addr.direccion_linea2}</p>}
                      <p>{addr.ciudad}, {addr.departamento_estado}</p>
                      <p className="text-[#888888] text-[11px]">Tel: {addr.telefono_contacto}</p>
                    </div>

                    <div className="pt-2 border-t border-[#202020] flex justify-end">
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="text-xs text-[#ff5555] hover:text-[#ff7777] flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Product,
  Category,
  User,
  UserAddress,
  CartItem,
  Order,
  Review,
  ContactMessage,
  ActiveView,
  FilterState,
  SizeName,
  OrderStatus,
  PaymentMethodType
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_USERS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_CONTACT_MESSAGES,
  PROMO_COUPONS
} from '../data/initialData';

export interface ToastNotification {
  id: string;
  mensaje: string;
  tipo: 'exito' | 'error' | 'info' | 'dorado';
}

interface StoreContextType {
  // Navigation & View
  activeView: ActiveView;
  setActiveView: (view: ActiveView, options?: { scrollToTop?: boolean }) => void;
  selectedProduct: Product | null;
  openProductDetail: (product: Product) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'registro' | 'recuperar';
  openAuthModal: (tab?: 'login' | 'registro' | 'recuperar') => void;
  closeAuthModal: () => void;

  // Authentication & Profile
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => { success: boolean; message: string };
  register: (userData: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    password: string;
    direccion?: string;
  }) => { success: boolean; message: string };
  logout: () => void;
  updateUserProfile: (data: Partial<Pick<User, 'nombre' | 'apellido' | 'email' | 'telefono'>>) => boolean;
  changeUserPassword: (oldPass: string, newPass: string) => { success: boolean; message: string };
  
  // Addresses
  addresses: UserAddress[];
  addAddress: (address: Omit<UserAddress, 'id' | 'id_usuario'>) => void;
  updateAddress: (id: string, address: Partial<UserAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Catalog & Products
  products: Product[];
  categories: Category[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  filterByCategory: (categoryIdentifier: string | null) => void;
  filteredProducts: Product[];

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: SizeName, quantity?: number) => void;
  buyNow: (product: Product, size: SizeName, quantity?: number) => void;
  updateCartQuantity: (cartItemId: string, newQuantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartItemCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartTotal: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Favorites (Wishlist)
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  favoriteProducts: Product[];
  moveFavoriteToCart: (product: Product, size: SizeName) => void;

  // Checkout & Orders
  orders: Order[];
  currentOrder: Order | null;
  setCurrentOrder: (order: Order | null) => void;
  createOrder: (checkoutData: {
    address: UserAddress;
    paymentMethod: PaymentMethodType;
    customerNotes?: string;
    cardDetails?: { number: string; holder: string; exp: string; cvv: string };
  }) => Order;
  trackingSearchCode: string;
  setTrackingSearchCode: (code: string) => void;
  findOrderByTrackingCodeOrNumber: (query: string) => Order | undefined;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;

  // Reviews
  reviews: Review[];
  getProductReviews: (productId: string) => Review[];
  addReview: (productId: string, rating: number, title: string, comment: string) => void;

  // Contact
  contactMessages: ContactMessage[];
  sendContactMessage: (data: { nombre: string; email: string; telefono?: string; asunto: string; mensaje: string }) => boolean;
  markContactRead: (id: string) => void;
  markContactAnswered: (id: string) => void;

  // Admin Management
  adminAddProduct: (newProduct: Omit<Product, 'id' | 'slug' | 'calificacion_promedio' | 'total_resenas' | 'fecha_creacion'>) => void;
  adminUpdateProduct: (id: string, updated: Partial<Product>) => void;
  adminDeleteProduct: (id: string) => void;
  adminAddCategory: (category: Omit<Category, 'id' | 'slug'>) => void;
  adminUpdateCategory: (id: string, updated: Partial<Category>) => void;
  adminDeleteCategory: (id: string) => void;
  adminToggleUserStatus: (userId: string) => void;
  adminUsersList: User[];

  // Toasts
  toasts: ToastNotification[];
  addToast: (mensaje: string, tipo?: 'exito' | 'error' | 'info' | 'dorado') => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'glamur_products_v1',
  CATEGORIES: 'glamur_categories_v1',
  USERS: 'glamur_users_v1',
  CURRENT_USER: 'glamur_curr_user_v1',
  CART: 'glamur_cart_v1',
  FAVORITES: 'glamur_favs_v1',
  ORDERS: 'glamur_orders_v1',
  REVIEWS: 'glamur_reviews_v1',
  CONTACTS: 'glamur_contacts_v1',
  COUPON: 'glamur_coupon_v1',
};

const DEFAULT_FILTERS: FilterState = {
  categoriaId: null,
  talla: null,
  precioMin: 0,
  precioMax: 500000,
  soloDisponibles: false,
  soloOfertas: false,
  soloNovedades: false,
  busqueda: '',
  ordenarPor: 'recientes',
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial states from LocalStorage or defaults
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return saved ? JSON.parse(saved) : INITIAL_USERS[1]; // Default active client for instant testing
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return saved ? JSON.parse(saved) : ['prod-1', 'prod-4', 'prod-5'];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONTACTS);
    return saved ? JSON.parse(saved) : INITIAL_CONTACT_MESSAGES;
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.COUPON) || null;
  });

  // UI Navigation States
  const [activeView, setActiveViewState] = useState<ActiveView>('inicio');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(INITIAL_PRODUCTS[0]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [trackingSearchCode, setTrackingSearchCode] = useState<string>('GLE-2026-8941');
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'registro' | 'recuperar'>('login');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Synchronize to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contactMessages));
  }, [contactMessages]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem(STORAGE_KEYS.COUPON, appliedCoupon);
    } else {
      localStorage.removeItem(STORAGE_KEYS.COUPON);
    }
  }, [appliedCoupon]);

  // Toast Helpers
  const addToast = (mensaje: string, tipo: 'exito' | 'error' | 'info' | 'dorado' = 'dorado') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, mensaje, tipo }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // View Navigation
  const setActiveView = (view: ActiveView, options?: { scrollToTop?: boolean }) => {
    setActiveViewState(view);
    if (options?.scrollToTop !== false) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setActiveView('producto_detalle');
  };

  const openAuthModal = (tab: 'login' | 'registro' | 'recuperar' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Auth Functions
  const isAuthenticated = currentUser !== null;
  const isAdmin = currentUser?.rol === 'administrador';

  const login = (email: string, password: string, rememberMe = true) => {
    const userFound = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    
    if (!userFound) {
      return { success: false, message: 'No existe una cuenta registrada con este correo electrónico.' };
    }

    if (userFound.estado === 'inactivo') {
      return { success: false, message: 'Esta cuenta ha sido desactivada temporalmente. Contacte a soporte.' };
    }

    // Passwords for demo check (supports standard demo passwords or any entered for newly registered)
    const valid = password === 'admin123' || password === 'cliente123' || password.length >= 4;
    if (!valid) {
      return { success: false, message: 'Contraseña incorrecta.' };
    }

    setCurrentUser(userFound);
    closeAuthModal();
    addToast(`¡Bienvenido de nuevo, ${userFound.nombre}!`, 'dorado');
    return { success: true, message: 'Inicio de sesión exitoso.' };
  };

  const register = (userData: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    password: string;
    direccion?: string;
  }) => {
    const exists = users.some((u) => u.email.toLowerCase() === userData.email.toLowerCase());
    if (exists) {
      return { success: false, message: 'Ya existe una cuenta con este correo electrónico.' };
    }

    const newUserId = `usr-${Date.now()}`;
    const initialAddress: UserAddress[] = userData.direccion ? [{
      id: `dir-${Date.now()}`,
      id_usuario: newUserId,
      titulo: 'Principal',
      nombre_contacto: `${userData.nombre} ${userData.apellido}`,
      telefono_contacto: userData.telefono,
      direccion_linea1: userData.direccion,
      ciudad: 'Bogotá',
      departamento_estado: 'Cundinamarca',
      pais: 'Colombia',
      es_predeterminada: true,
    }] : [];

    const newUser: User = {
      id: newUserId,
      nombre: userData.nombre,
      apellido: userData.apellido,
      email: userData.email,
      telefono: userData.telefono,
      rol: 'cliente',
      estado: 'activo',
      fecha_registro: new Date().toISOString().split('T')[0],
      direcciones: initialAddress,
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    closeAuthModal();
    addToast(`¡Cuenta creada con éxito! Bienvenido a Glamur y Elegancia, ${newUser.nombre}.`, 'dorado');
    return { success: true, message: 'Registro completado.' };
  };

  const logout = () => {
    setCurrentUser(null);
    addToast('Sesión cerrada correctamente.', 'info');
    if (activeView === 'perfil' || activeView === 'admin') {
      setActiveView('inicio');
    }
  };

  const updateUserProfile = (data: Partial<Pick<User, 'nombre' | 'apellido' | 'email' | 'telefono'>>) => {
    if (!currentUser) return false;
    const updatedUser = { ...currentUser, ...data };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    addToast('Perfil actualizado correctamente.', 'exito');
    return true;
  };

  const changeUserPassword = (oldPass: string, newPass: string) => {
    if (newPass.length < 6) {
      return { success: false, message: 'La nueva contraseña debe tener al menos 6 caracteres.' };
    }
    addToast('Contraseña actualizada con éxito.', 'exito');
    return { success: true, message: 'Contraseña cambiada exitosamente.' };
  };

  // Addresses CRUD
  const addresses = useMemo(() => {
    return currentUser?.direcciones || [];
  }, [currentUser]);

  const addAddress = (addressData: Omit<UserAddress, 'id' | 'id_usuario'>) => {
    if (!currentUser) return;
    const newAddress: UserAddress = {
      ...addressData,
      id: `dir-${Date.now()}`,
      id_usuario: currentUser.id,
      es_predeterminada: currentUser.direcciones.length === 0 ? true : addressData.es_predeterminada,
    };

    let updatedList = [...currentUser.direcciones];
    if (newAddress.es_predeterminada) {
      updatedList = updatedList.map((d) => ({ ...d, es_predeterminada: false }));
    }
    updatedList.push(newAddress);

    const updatedUser = { ...currentUser, direcciones: updatedList };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    addToast('Dirección guardada exitosamente.', 'exito');
  };

  const updateAddress = (id: string, updatedData: Partial<UserAddress>) => {
    if (!currentUser) return;
    let updatedList = currentUser.direcciones.map((d) => {
      if (d.id === id) {
        return { ...d, ...updatedData };
      }
      if (updatedData.es_predeterminada) {
        return { ...d, es_predeterminada: false };
      }
      return d;
    });

    const updatedUser = { ...currentUser, direcciones: updatedList };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    addToast('Dirección actualizada.', 'exito');
  };

  const deleteAddress = (id: string) => {
    if (!currentUser) return;
    const updatedList = currentUser.direcciones.filter((d) => d.id !== id);
    if (updatedList.length > 0 && !updatedList.some((d) => d.es_predeterminada)) {
      updatedList[0].es_predeterminada = true;
    }
    const updatedUser = { ...currentUser, direcciones: updatedList };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    addToast('Dirección eliminada.', 'info');
  };

  const setDefaultAddress = (id: string) => {
    if (!currentUser) return;
    const updatedList = currentUser.direcciones.map((d) => ({
      ...d,
      es_predeterminada: d.id === id,
    }));
    const updatedUser = { ...currentUser, direcciones: updatedList };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    addToast('Dirección predeterminada actualizada.', 'exito');
  };

  // Catalog Filtering & Sorting
  const filterByCategory = (categoryIdentifier: string | null) => {
    if (!categoryIdentifier || categoryIdentifier === 'todas') {
      setFilters((prev) => ({ ...prev, categoriaId: null, soloOfertas: false, soloNovedades: false }));
    } else if (categoryIdentifier === 'ofertas') {
      setFilters((prev) => ({ ...prev, soloOfertas: true, soloNovedades: false, categoriaId: null }));
    } else if (categoryIdentifier === 'novedades') {
      setFilters((prev) => ({ ...prev, soloNovedades: true, soloOfertas: false, categoriaId: null }));
    } else {
      // Look up category by slug or id
      const cat = categories.find((c) => c.slug === categoryIdentifier || c.id === categoryIdentifier);
      setFilters((prev) => ({
        ...prev,
        categoriaId: cat ? cat.id : null,
        soloOfertas: false,
        soloNovedades: false,
      }));
    }
    setActiveView('catalogo');
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (!product.activo) return false;

      // Category filter
      if (filters.categoriaId && product.id_categoria !== filters.categoriaId) {
        return false;
      }

      // Size filter
      if (filters.talla) {
        const hasSizeWithStock = product.tallas.some(
          (t) => t.talla === filters.talla && t.stock > 0
        );
        if (!hasSizeWithStock) return false;
      }

      // Price filter
      const effectivePrice = product.precio_oferta || product.precio;
      if (effectivePrice < filters.precioMin || effectivePrice > filters.precioMax) {
        return false;
      }

      // Availability filter
      if (filters.soloDisponibles && product.stock_total <= 0) {
        return false;
      }

      // Offers filter
      if (filters.soloOfertas && !product.en_oferta) {
        return false;
      }

      // New arrivals filter
      if (filters.soloNovedades && !product.es_novedad) {
        return false;
      }

      // Search keyword filter
      if (filters.busqueda.trim()) {
        const query = filters.busqueda.toLowerCase();
        const matchesName = product.nombre.toLowerCase().includes(query);
        const matchesDesc = product.descripcion.toLowerCase().includes(query);
        const matchesCat = product.nombre_categoria.toLowerCase().includes(query);
        const matchesSku = product.sku.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat && !matchesSku) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.precio_oferta || a.precio;
      const priceB = b.precio_oferta || b.precio;

      if (filters.ordenarPor === 'precio_asc') return priceA - priceB;
      if (filters.ordenarPor === 'precio_desc') return priceB - priceA;
      if (filters.ordenarPor === 'mas_vendidos') return b.total_resenas - a.total_resenas;
      if (filters.ordenarPor === 'calificacion') return b.calificacion_promedio - a.calificacion_promedio;
      // recientes default
      return new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime();
    });
  }, [products, filters]);

  // Cart Management
  const addToCart = (product: Product, size: SizeName, quantity = 1) => {
    const sizeData = product.tallas.find((t) => t.talla === size);
    const maxStock = sizeData ? sizeData.stock : product.stock_total;

    if (maxStock <= 0) {
      addToast('Lo sentimos, esta talla está temporalmente agotada.', 'error');
      return;
    }

    const priceToUse = product.precio_oferta || product.precio;
    const cartItemId = `${product.id}-${size}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        const newQty = Math.min(existing.cantidad + quantity, maxStock);
        return prev.map((item) =>
          item.id === cartItemId
            ? { ...item, cantidad: newQty, subtotal: newQty * priceToUse }
            : item
        );
      } else {
        const qty = Math.min(quantity, maxStock);
        return [
          ...prev,
          {
            id: cartItemId,
            producto: product,
            talla_seleccionada: size,
            cantidad: qty,
            precio_unitario: priceToUse,
            subtotal: qty * priceToUse,
          }
        ];
      }
    });

    addToast(`"${product.nombre}" (Talla ${size}) agregado al carrito.`, 'dorado');
    setIsCartDrawerOpen(true);
  };

  const buyNow = (product: Product, size: SizeName, quantity = 1) => {
    addToCart(product, size, quantity);
    setIsCartDrawerOpen(false);
    setActiveView('checkout');
  };

  const updateCartQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const sizeData = item.producto.tallas.find((t) => t.talla === item.talla_seleccionada);
          const maxStock = sizeData ? sizeData.stock : item.producto.stock_total;
          const clampedQty = Math.min(newQuantity, maxStock);
          return {
            ...item,
            cantidad: clampedQty,
            subtotal: clampedQty * item.precio_unitario,
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    addToast('Producto eliminado del carrito.', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartItemCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.cantidad, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.subtotal, 0);
  }, [cart]);

  const cartDiscount = useMemo(() => {
    if (!appliedCoupon || !PROMO_COUPONS[appliedCoupon]) return 0;
    const discountRate = PROMO_COUPONS[appliedCoupon];
    return Math.round(cartSubtotal * discountRate);
  }, [cartSubtotal, appliedCoupon]);

  const cartShipping = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    return cartSubtotal >= 200000 ? 0 : 15000; // Free shipping over $200.000 COP
  }, [cartSubtotal]);

  const cartTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - cartDiscount + cartShipping);
  }, [cartSubtotal, cartDiscount, cartShipping]);

  const applyCoupon = (code: string) => {
    const formatted = code.trim().toUpperCase();
    if (PROMO_COUPONS[formatted]) {
      setAppliedCoupon(formatted);
      const percent = PROMO_COUPONS[formatted] * 100;
      addToast(`¡Cupón ${formatted} aplicado! Obtienes un ${percent}% de descuento.`, 'dorado');
      return { success: true, message: `Descuento del ${percent}% aplicado.` };
    }
    return { success: false, message: 'El cupón ingresado no es válido o ha expirado.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Cupón de descuento removido.', 'info');
  };

  // Favorites (Wishlist)
  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(productId);
      if (isFav) {
        addToast('Producto removido de favoritos.', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        addToast('¡Producto guardado en tus favoritos!', 'dorado');
        return [...prev, productId];
      }
    });
  };

  const isFavorite = (productId: string) => {
    return favorites.includes(productId);
  };

  const favoriteProducts = useMemo(() => {
    return products.filter((p) => favorites.includes(p.id));
  }, [products, favorites]);

  const moveFavoriteToCart = (product: Product, size: SizeName) => {
    addToCart(product, size, 1);
  };

  // Checkout & Orders
  const createOrder = (checkoutData: {
    address: UserAddress;
    paymentMethod: PaymentMethodType;
    customerNotes?: string;
    cardDetails?: { number: string; holder: string; exp: string; cvv: string };
  }): Order => {
    const orderNum = `GLE-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackCode = `TRACK-${orderNum}-CO`;
    const now = new Date();
    const deliveryDate = new Date();
    deliveryDate.setDate(now.getDate() + 3);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      numero_pedido: orderNum,
      id_usuario: currentUser ? currentUser.id : 'usr-invitado',
      nombre_cliente: checkoutData.address.nombre_contacto || (currentUser ? `${currentUser.nombre} ${currentUser.apellido}` : 'Cliente VIP'),
      email_cliente: currentUser ? currentUser.email : 'cliente@glamur.com',
      telefono_cliente: checkoutData.address.telefono_contacto || (currentUser ? currentUser.telefono : '+57 300 000 0000'),
      direccion_envio: checkoutData.address,
      items: cart.map((item) => ({
        id_producto: item.producto.id,
        nombre_producto: item.producto.nombre,
        imagen_producto: item.producto.imagen_principal,
        nombre_talla: item.talla_seleccionada,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        subtotal: item.subtotal,
      })),
      subtotal: cartSubtotal,
      costo_envio: cartShipping,
      descuento: cartDiscount,
      codigo_descuento: appliedCoupon || undefined,
      total: cartTotal,
      metodo_pago: checkoutData.paymentMethod,
      referencia_pago: `TXN-${checkoutData.paymentMethod.toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}-DEMO`,
      estado_pago: 'completado',
      estado: 'Confirmado',
      codigo_rastreo: trackCode,
      empresa_envio: 'Glamur Express VIP',
      notas_cliente: checkoutData.customerNotes,
      fecha_pedido: now.toISOString(),
      fecha_entrega_estimada: deliveryDate.toISOString().split('T')[0],
      historial_estados: [
        { estado: 'Pendiente', fecha: now.toLocaleString(), nota: 'Pedido generado por el cliente' },
        { estado: 'Confirmado', fecha: now.toLocaleString(), nota: 'Pago demo procesado exitosamente' },
      ],
    };

    // Deduct stock from products
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        const cartItemsForProduct = cart.filter((c) => c.producto.id === p.id);
        if (cartItemsForProduct.length === 0) return p;

        const updatedTallas = p.tallas.map((t) => {
          const match = cartItemsForProduct.find((c) => c.talla_seleccionada === t.talla);
          if (match) {
            return { ...t, stock: Math.max(0, t.stock - match.cantidad) };
          }
          return t;
        });

        const newStockTotal = updatedTallas.reduce((sum, t) => sum + t.stock, 0);
        return { ...p, tallas: updatedTallas, stock_total: newStockTotal };
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    setCurrentOrder(newOrder);
    setTrackingSearchCode(newOrder.numero_pedido);
    clearCart();
    setAppliedCoupon(null);
    addToast(`¡Pedido ${newOrder.numero_pedido} realizado con éxito!`, 'dorado');
    setActiveView('confirmacion_pedido');
    return newOrder;
  };

  const findOrderByTrackingCodeOrNumber = (query: string) => {
    if (!query.trim()) return undefined;
    const clean = query.trim().toUpperCase();
    return orders.find(
      (o) =>
        o.numero_pedido.toUpperCase() === clean ||
        o.codigo_rastreo.toUpperCase() === clean ||
        o.id.toUpperCase() === clean
    );
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId || ord.numero_pedido === orderId) {
          const updatedHistory = [
            ...ord.historial_estados,
            {
              estado: newStatus,
              fecha: new Date().toLocaleString(),
              nota: note || `Estado actualizado a ${newStatus} por administración`,
            },
          ];
          const updated = { ...ord, estado: newStatus, historial_estados: updatedHistory };
          if (currentOrder && currentOrder.id === ord.id) {
            setCurrentOrder(updated);
          }
          return updated;
        }
        return ord;
      })
    );
    addToast(`Estado del pedido actualizado a "${newStatus}".`, 'exito');
  };

  // Reviews
  const getProductReviews = (productId: string) => {
    return reviews.filter((r) => r.id_producto === productId);
  };

  const addReview = (productId: string, rating: number, title: string, comment: string) => {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      id_producto: productId,
      id_usuario: currentUser ? currentUser.id : 'usr-invitado',
      nombre_usuario: currentUser ? `${currentUser.nombre} ${currentUser.apellido}` : 'Cliente Glamur',
      calificacion: rating,
      titulo: title,
      comentario: comment,
      fecha: new Date().toISOString().split('T')[0],
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);

    // Update product stats
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const pReviews = updatedReviews.filter((r) => r.id_producto === productId);
          const avg = pReviews.reduce((sum, r) => sum + r.calificacion, 0) / pReviews.length;
          return {
            ...p,
            calificacion_promedio: Number(avg.toFixed(1)),
            total_resenas: pReviews.length,
          };
        }
        return p;
      })
    );

    addToast('¡Gracias por tu reseña! Ha sido publicada.', 'dorado');
  };

  // Contact
  const sendContactMessage = (data: { nombre: string; email: string; telefono?: string; asunto: string; mensaje: string }) => {
    const newMsg: ContactMessage = {
      id: `msg-${Date.now()}`,
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono,
      asunto: data.asunto,
      mensaje: data.mensaje,
      leido: false,
      respondido: false,
      fecha_envio: new Date().toLocaleString(),
    };

    setContactMessages((prev) => [newMsg, ...prev]);
    addToast('Tu mensaje ha sido enviado. Un asesor VIP te responderá a la brevedad.', 'dorado');
    return true;
  };

  const markContactRead = (id: string) => {
    setContactMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, leido: true } : m))
    );
  };

  const markContactAnswered = (id: string) => {
    setContactMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, respondido: true, leido: true } : m))
    );
    addToast('Mensaje marcado como respondido.', 'exito');
  };

  // Admin Product CRUD
  const adminAddProduct = (newProductData: Omit<Product, 'id' | 'slug' | 'calificacion_promedio' | 'total_resenas' | 'fecha_creacion'>) => {
    const slug = newProductData.nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const catObj = categories.find((c) => c.id === newProductData.id_categoria);

    const newProd: Product = {
      ...newProductData,
      id: `prod-${Date.now()}`,
      slug: `${slug}-${Math.floor(100 + Math.random() * 900)}`,
      nombre_categoria: catObj ? catObj.nombre : 'Colección',
      calificacion_promedio: 5.0,
      total_resenas: 0,
      fecha_creacion: new Date().toISOString().split('T')[0],
    };

    setProducts((prev) => [newProd, ...prev]);
    addToast(`Producto "${newProd.nombre}" creado exitosamente.`, 'exito');
  };

  const adminUpdateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const catObj = updated.id_categoria ? categories.find((c) => c.id === updated.id_categoria) : null;
          return {
            ...p,
            ...updated,
            nombre_categoria: catObj ? catObj.nombre : p.nombre_categoria,
          };
        }
        return p;
      })
    );
    addToast('Producto actualizado correctamente.', 'exito');
  };

  const adminDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addToast('Producto eliminado del catálogo.', 'info');
  };

  // Admin Category CRUD
  const adminAddCategory = (categoryData: Omit<Category, 'id' | 'slug'>) => {
    const slug = categoryData.nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const newCat: Category = {
      ...categoryData,
      id: `cat-${Date.now()}`,
      slug,
    };

    setCategories((prev) => [...prev, newCat]);
    addToast(`Categoría "${newCat.nombre}" creada con éxito.`, 'exito');
  };

  const adminUpdateCategory = (id: string, updated: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
    addToast('Categoría actualizada.', 'exito');
  };

  const adminDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    addToast('Categoría eliminada.', 'info');
  };

  // Admin User status
  const adminToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.estado === 'activo' ? 'inactivo' : 'activo';
          return { ...u, estado: newStatus };
        }
        return u;
      })
    );
    addToast('Estado de usuario actualizado.', 'exito');
  };

  return (
    <StoreContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedProduct,
        openProductDetail,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,

        currentUser,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        updateUserProfile,
        changeUserPassword,

        addresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,

        products,
        categories,
        filters,
        setFilters,
        resetFilters,
        filterByCategory,
        filteredProducts,

        cart,
        addToCart,
        buyNow,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartItemCount,
        cartSubtotal,
        cartDiscount,
        cartShipping,
        cartTotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,

        favorites,
        toggleFavorite,
        isFavorite,
        favoriteProducts,
        moveFavoriteToCart,

        orders,
        currentOrder,
        setCurrentOrder,
        createOrder,
        trackingSearchCode,
        setTrackingSearchCode,
        findOrderByTrackingCodeOrNumber,
        updateOrderStatus,

        reviews,
        getProductReviews,
        addReview,

        contactMessages,
        sendContactMessage,
        markContactRead,
        markContactAnswered,

        adminAddProduct,
        adminUpdateProduct,
        adminDeleteProduct,
        adminAddCategory,
        adminUpdateCategory,
        adminDeleteCategory,
        adminToggleUserStatus,
        adminUsersList: users,

        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

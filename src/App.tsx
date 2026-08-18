import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { HomeView } from './components/HomeView';
import { CatalogView } from './components/CatalogView';
import { ProductDetailView } from './components/ProductDetailView';
import { CheckoutView } from './components/CheckoutView';
import { OrderConfirmationView } from './components/OrderConfirmationView';
import { OrderTrackingView } from './components/OrderTrackingView';
import { ProfileView } from './components/ProfileView';
import { FavoritesView } from './components/FavoritesView';
import { ContactView } from './components/ContactView';
import { AdminView } from './components/AdminView';
import { CheckCircle2, AlertCircle, Sparkles, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeView, toasts, removeToast } = useStore();

  // Scroll to top whenever view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  return (
    <div className="min-h-screen bg-[#080808] text-[#f4f4f4] flex flex-col font-montserrat antialiased selection:bg-[#d4af37] selection:text-[#080808]">
      {/* Top Main Navigation Bar */}
      <Navbar />

      {/* Global Slide-Over Cart Drawer */}
      <CartDrawer />

      {/* Global Authentication Modal */}
      <AuthModal />

      {/* Dynamic View Switcher */}
      <main className="flex-1">
        {activeView === 'inicio' && <HomeView />}
        {activeView === 'catalogo' && <CatalogView />}
        {activeView === 'producto_detalle' && <ProductDetailView />}
        {activeView === 'checkout' && <CheckoutView />}
        {activeView === 'confirmacion_pedido' && <OrderConfirmationView />}
        {activeView === 'seguimiento_pedido' && <OrderTrackingView />}
        {activeView === 'perfil' && <ProfileView />}
        {activeView === 'favoritos' && <FavoritesView />}
        {activeView === 'contacto' && <ContactView />}
        {activeView === 'admin' && <AdminView />}
      </main>

      {/* Luxury Footer */}
      <Footer />

      {/* Global Toast Notifications Stack */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5 duration-300 ${
              toast.tipo === 'dorado'
                ? 'bg-[#181409]/95 border-[#d4af37] text-[#f5d77f] shadow-[#d4af37]/20 backdrop-blur-md'
                : toast.tipo === 'error'
                ? 'bg-[#1a0a0a]/95 border-[#ff4444] text-[#ffaaaa] shadow-[#ff4444]/20 backdrop-blur-md'
                : 'bg-[#141414]/95 border-[#333333] text-[#f4f4f4] backdrop-blur-md'
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.tipo === 'dorado' && <Sparkles className="w-5 h-5 text-[#d4af37] flex-shrink-0" />}
              {toast.tipo === 'error' && <AlertCircle className="w-5 h-5 text-[#ff4444] flex-shrink-0" />}
              {toast.tipo === 'exito' && <CheckCircle2 className="w-5 h-5 text-[#55ff77] flex-shrink-0" />}
              <span className="text-xs font-medium leading-snug">{toast.mensaje}</span>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-[#888888] hover:text-[#ffffff] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

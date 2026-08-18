import React, { useState } from 'react';
import { 
  Crown, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Sparkles,
  Instagram,
  Facebook,
  Twitter,
  Send,
  Lock
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { setActiveView, filterByCategory, addToast } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      addToast('¡Gracias por unirte al Club Glamur VIP! Código enviado: ELEGANCIA10', 'dorado');
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#050505] text-[#dcdcdc] border-t border-[#d4af37]/30 pt-16 pb-12 transition-all">
      {/* Top Value Badges Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#222222]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          
          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-xl bg-[#0e0e0e] border border-[#d4af37]/20">
            <div className="p-3 rounded-full bg-[#181818] border border-[#d4af37]/40 text-[#d4af37]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#f5d77f]">Envío VIP Express</h4>
              <p className="text-xs text-[#888888]">Gratis en compras superiores a $200.000</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-xl bg-[#0e0e0e] border border-[#d4af37]/20">
            <div className="p-3 rounded-full bg-[#181818] border border-[#d4af37]/40 text-[#d4af37]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#f5d77f]">100% Autenticidad</h4>
              <p className="text-xs text-[#888888]">Telas y confección de alta costura</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-xl bg-[#0e0e0e] border border-[#d4af37]/20">
            <div className="p-3 rounded-full bg-[#181818] border border-[#d4af37]/40 text-[#d4af37]">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#f5d77f]">Cambios sin Costo</h4>
              <p className="text-xs text-[#888888]">30 días de garantía total de satisfacción</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-xl bg-[#0e0e0e] border border-[#d4af37]/20">
            <div className="p-3 rounded-full bg-[#181818] border border-[#d4af37]/40 text-[#d4af37]">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#f5d77f]">Pagos Seguros</h4>
              <p className="text-xs text-[#888888]">Transacciones protegidas SSL 256-bit</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Brand story */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => setActiveView('inicio')}
              className="flex items-center gap-3 cursor-pointer inline-flex"
            >
              <div className="w-9 h-9 rounded-full bg-[#d4af37] p-0.5 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#0a0a0a] flex items-center justify-center">
                  <Crown className="w-4 h-4 text-[#d4af37]" />
                </div>
              </div>
              <span className="font-cinzel text-xl font-bold tracking-widest text-[#f5d77f]">
                GLAMUR Y ELEGANCIA
              </span>
            </div>

            <p className="text-xs text-[#a0a0a0] leading-relaxed max-w-sm">
              Inspirados en la sofisticación atemporal, fusionamos alta sastrería con la vanguardia juvenil. 
              Prendas de alta calidad diseñadas con la nobleza del negro y el resplandor eterno del dorado.
            </p>

            <div className="pt-2 space-y-2 text-xs text-[#b8b8b8]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#d4af37]" />
                <span>Boutique Principal: Carrera 11 # 84 - 09, Bogotá, Colombia</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#d4af37]" />
                <span>Línea VIP: +57 300 987 6543 / (601) 745-8900</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#d4af37]" />
                <span>concierge@glamur.com</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-3">
              <a href="#instagram" className="w-8 h-8 rounded-full bg-[#161616] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] hover:bg-[#d4af37] hover:text-[#000000] transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#facebook" className="w-8 h-8 rounded-full bg-[#161616] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] hover:bg-[#d4af37] hover:text-[#000000] transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#twitter" className="w-8 h-8 rounded-full bg-[#161616] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] hover:bg-[#d4af37] hover:text-[#000000] transition-all">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Colecciones */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#f5d77f] uppercase tracking-widest font-cinzel">
              Colecciones
            </h3>
            <ul className="space-y-2 text-xs text-[#a0a0a0]">
              <li>
                <button onClick={() => filterByCategory('mujer')} className="hover:text-[#f5d77f] transition-colors">
                  Moda Mujer
                </button>
              </li>
              <li>
                <button onClick={() => filterByCategory('hombre')} className="hover:text-[#f5d77f] transition-colors">
                  Alta Sastrería Hombre
                </button>
              </li>
              <li>
                <button onClick={() => filterByCategory('ninos')} className="hover:text-[#f5d77f] transition-colors">
                  Línea Infantil & Niños
                </button>
              </li>
              <li>
                <button onClick={() => filterByCategory('zapatos')} className="hover:text-[#f5d77f] transition-colors">
                  Zapatos & Calzado
                </button>
              </li>
              <li>
                <button onClick={() => filterByCategory('accesorios')} className="hover:text-[#f5d77f] transition-colors">
                  Joyería & Accesorios
                </button>
              </li>
              <li>
                <button onClick={() => filterByCategory('ofertas')} className="text-[#d4af37] font-semibold hover:underline">
                  Ofertas Exclusivas
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Enlaces y Servicios */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#f5d77f] uppercase tracking-widest font-cinzel">
              Experiencia VIP
            </h3>
            <ul className="space-y-2 text-xs text-[#a0a0a0]">
              <li>
                <button onClick={() => setActiveView('perfil')} className="hover:text-[#f5d77f] transition-colors">
                  Mi Cuenta & Pedidos
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('favoritos')} className="hover:text-[#f5d77f] transition-colors">
                  Prendas Favoritas
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('contacto')} className="hover:text-[#f5d77f] transition-colors">
                  Asesoría Personalizada & Contacto
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('admin')} className="text-[#f5d77f] hover:underline flex items-center gap-1 font-semibold">
                  <Sparkles className="w-3 h-3 text-[#d4af37]" /> Panel Administrativo
                </button>
              </li>
              <li>
                <span className="text-[#666666]">Guía de Tallas (XS - XL / 4 - 12)</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter Club Glamur */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#f5d77f] uppercase tracking-widest font-cinzel">
              Club Glamur VIP
            </h3>
            <p className="text-xs text-[#888888] leading-relaxed">
              Suscríbete para recibir invitaciones a ventas privadas y lanzamientos de nuevas colecciones.
            </p>
            <form onSubmit={handleNewsletter} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Tu correo electrónico"
                  required
                  className="w-full bg-[#111111] border border-[#d4af37]/40 rounded-lg py-2.5 pl-3 pr-10 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-[#d4af37] text-[#000000] rounded-md hover:bg-[#f5d77f] transition-all"
                  aria-label="Suscribirse"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-[#666666]">
                Recibirás un 10% de descuento inmediato con el código ELEGANCIA10.
              </p>
            </form>
          </div>

        </div>
      </div>

      {/* Bottom Copyright & Security */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#1a1a1a] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#777777]">
        <p>© 2026 Glamur y Elegancia S.A.S. Todos los derechos reservados. Moda & Alta Costura.</p>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-[#d4af37]/80">Hecho con Pasión en Negro y Dorado</span>
          <span className="text-[#333333]">|</span>
          <a href="#terminos" className="hover:text-[#d4af37]">Términos & Condiciones</a>
          <span className="text-[#333333]">|</span>
          <a href="#privacidad" className="hover:text-[#d4af37]">Privacidad</a>
        </div>
      </div>
    </footer>
  );
};

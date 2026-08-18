import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  Crown, 
  Sparkles, 
  MessageSquare, 
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ContactView: React.FC = () => {
  const { addToast } = useStore();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [tipoConsulta, setTipoConsulta] = useState('asesoria');
  const [mensaje, setMensaje] = useState('');
  const [isSent, setIsSent] = useState(false);

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim() || !mensaje.trim()) {
      addToast('Por favor completa los campos obligatorios.', 'error');
      return;
    }

    setIsSent(true);
    addToast('¡Mensaje enviado con éxito! Un asesor VIP se contactará en menos de 2 horas.', 'dorado');
    setTimeout(() => {
      setNombre('');
      setEmail('');
      setTelefono('');
      setMensaje('');
      setIsSent(false);
    }, 2000);
  };

  const faqs = [
    {
      q: '¿Cómo garantizan la autenticidad y los acabados en hilo dorado?',
      a: 'Cada una de nuestras piezas de alta costura es confeccionada artesanalmente utilizando fibras naturales de seda, terciopelo italiano y bordados con filamentos metalizados resistentes a la decoloración. Cada prenda incluye su certificado numerado de autenticidad.',
    },
    {
      q: '¿Cuáles son los tiempos de entrega para envíos VIP nacionales?',
      a: 'Despachamos desde nuestro centro en Bogotá. Para ciudades principales (Bogotá, Medellín, Cali, Barranquilla, Bucaramanga) el tiempo es de 24 a 48 horas hábiles. Para el resto del país, entre 2 y 4 días hábiles con empaque de lujo protegido.',
    },
    {
      q: '¿Puedo solicitar cambios de talla o devoluciones?',
      a: 'Por supuesto. Cuentas con 30 días calendario para solicitar un cambio de talla sin ningún costo de flete adicional. La prenda debe estar sin uso y con sus etiquetas y sello original.',
    },
    {
      q: '¿Ofrecen servicio de confección a medida y asesoría privada?',
      a: 'Sí, disponemos de citas privadas en nuestra boutique de Bogotá o vía videollamada para ajustes de sastrería a medida con nuestros maestros diseñadores.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181409] border border-[#d4af37]/50 text-xs font-bold text-[#f5d77f] uppercase font-cinzel">
          <Crown className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Atención & Asesoría Concierge</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#ffffff] font-cinzel">
          Contáctanos & Visita Nuestra Boutique
        </h1>
        <p className="text-xs sm:text-sm text-[#999999] leading-relaxed">
          Estamos a tu entera disposición para asesorarte en la elección del traje o vestido perfecto para tu próxima gala o evento exclusivo.
        </p>
      </div>

      {/* Grid: Contact Info + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Col: Boutique Details & Map card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0f0f0f] border border-[#d4af37]/40 space-y-6">
            <h3 className="text-base font-bold text-[#f5d77f] uppercase font-cinzel border-b border-[#222222] pb-3">
              Boutique Principal
            </h3>

            <div className="space-y-4 text-xs text-[#cccccc]">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#181818] border border-[#d4af37]/40 text-[#d4af37] flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-[#f4f4f4] block text-sm">Dirección</strong>
                  <span>Carrera 11 # 84 - 09, Zona Rosa / El Retiro, Bogotá, Colombia</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#181818] border border-[#d4af37]/40 text-[#d4af37] flex-shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-[#f4f4f4] block text-sm">Línea VIP & WhatsApp</strong>
                  <span>+57 300 987 6543 / (601) 745-8900</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#181818] border border-[#d4af37]/40 text-[#d4af37] flex-shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-[#f4f4f4] block text-sm">Correo Electrónico</strong>
                  <span>concierge@glamur.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#181818] border border-[#d4af37]/40 text-[#d4af37] flex-shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-[#f4f4f4] block text-sm">Horario de Atención</strong>
                  <p>Lunes a Sábado: 10:00 AM – 8:00 PM</p>
                  <p>Domingos y Festivos: 11:00 AM – 6:00 PM</p>
                </div>
              </div>
            </div>

            {/* Simulated Luxury Location Map */}
            <div className="rounded-2xl overflow-hidden border border-[#2c2c2c] bg-[#141414] p-4 text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs text-[#d4af37] font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Salón de Alta Costura & Showroom Privado</span>
              </div>
              <p className="text-[11px] text-[#777777]">
                Parqueadero VIP con valet parking disponible sobre la Carrera 11.
              </p>
            </div>
          </div>

        </div>

        {/* Right Col: Interactive Contact Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0f0f0f] border border-[#d4af37]/40 space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#f5d77f] uppercase font-cinzel">
                Envíanos un Mensaje
              </h3>
              <p className="text-xs text-[#888888]">
                Déjanos tus datos y un especialista en moda se pondrá en contacto contigo a la mayor brevedad.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#888888] block mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    placeholder="Ej: Sofia Vergara"
                    className="w-full bg-[#141414] border border-[#d4af37]/40 rounded-xl py-2.5 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#888888] block mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="correo@ejemplo.com"
                    className="w-full bg-[#141414] border border-[#d4af37]/40 rounded-xl py-2.5 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#888888] block mb-1">Teléfono / WhatsApp</label>
                  <input
                    type="text"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="+57 310 000 0000"
                    className="w-full bg-[#141414] border border-[#d4af37]/40 rounded-xl py-2.5 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#888888] block mb-1">Tipo de Solicitud</label>
                  <select
                    value={tipoConsulta}
                    onChange={(e) => setTipoConsulta(e.target.value)}
                    className="w-full bg-[#141414] border border-[#d4af37]/40 rounded-xl py-2.5 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="asesoria">Asesoría de Vestuario & Gala</option>
                    <option value="pedido">Consulta de Pedido o Despacho</option>
                    <option value="confeccion">Confección a Medida / Cita</option>
                    <option value="garantia">Garantía o Cambio de Talla</option>
                    <option value="otro">Otra Consulta</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-[#888888] block mb-1">Mensaje o Detalles de tu Evento *</label>
                <textarea
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  rows={4}
                  required
                  placeholder="Escribe aquí tus requerimientos, fecha de tu evento o cualquier pregunta especial..."
                  className="w-full bg-[#141414] border border-[#d4af37]/40 rounded-xl py-2.5 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <button
                type="submit"
                disabled={isSent}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f5d77f] to-[#aa820a] text-[#080808] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#d4af37]/20 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSent ? 'Enviando...' : 'Enviar Mensaje a Concierge'}</span>
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* FAQ Accordion Section */}
      <div className="pt-8 border-t border-[#222222] space-y-6 max-w-4xl mx-auto">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-[#ffffff] font-cinzel">
            Preguntas Frecuentes
          </h2>
          <p className="text-xs text-[#888888]">
            Todo lo que necesitas saber sobre compras, envíos y políticas de alta costura.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-[#0f0f0f] border border-[#242424] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-[#141414] transition-colors"
                >
                  <span className="text-xs sm:text-sm font-semibold text-[#f4f4f4]">
                    {faq.q}
                  </span>
                  <span className="text-[#d4af37] flex-shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 text-xs text-[#aaaaaa] leading-relaxed border-t border-[#1a1a1a]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

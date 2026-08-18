import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  Mail, 
  Lock, 
  ArrowRight, 
  Sparkles
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    openAuthModal,
    login,
    register,
    addToast
  } = useStore();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regNombre, setRegNombre] = useState('');
  const [regApellido, setRegApellido] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regTelefono, setRegTelefono] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(loginEmail, loginPassword);
    if (res.success) {
      setLoginEmail('');
      setLoginPassword('');
    } else {
      addToast(res.message, 'error');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      addToast('Las contraseñas no coinciden.', 'error');
      return;
    }
    if (regPassword.length < 4) {
      addToast('La contraseña debe tener al menos 4 caracteres.', 'error');
      return;
    }

    const res = register({
      nombre: regNombre,
      apellido: regApellido,
      email: regEmail,
      telefono: regTelefono,
      password: regPassword,
    });

    if (res.success) {
      setRegNombre('');
      setRegApellido('');
      setRegEmail('');
      setRegTelefono('');
      setRegPassword('');
      setRegConfirmPassword('');
    } else {
      addToast(res.message, 'error');
    }
  };

  const setDemoAccount = (role: 'admin' | 'cliente') => {
    if (role === 'admin') {
      setLoginEmail('admin@glamur.com');
      setLoginPassword('admin123');
    } else {
      setLoginEmail('daniela@glamur.com');
      setLoginPassword('daniela123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={closeAuthModal}
        className="fixed inset-0 bg-[#000000]/85 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-md bg-[#0e0e0e] border border-[#d4af37]/60 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#d4af37]/20 z-10 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-full text-[#888888] hover:text-[#f5d77f] hover:bg-[#181818] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#d4af37] to-[#f5d77f] p-0.5 mx-auto">
            <div className="w-full h-full rounded-full bg-[#080808] flex items-center justify-center">
              <Crown className="w-6 h-6 text-[#d4af37]" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#ffffff] font-cinzel">
            GLAMUR & ELEGANCIA
          </h2>
          <p className="text-xs text-[#888888]">
            {authModalTab === 'login'
              ? 'Accede a tu cuenta VIP y gestiona tus pedidos'
              : 'Únete a nuestro club exclusivo de alta costura'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-[#161616] border border-[#262626]">
          <button
            onClick={() => openAuthModal('login')}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              authModalTab === 'login'
                ? 'bg-[#d4af37] text-[#080808] shadow-md'
                : 'text-[#888888] hover:text-[#f5d77f]'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => openAuthModal('registro')}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              authModalTab === 'registro'
                ? 'bg-[#d4af37] text-[#080808] shadow-md'
                : 'text-[#888888] hover:text-[#f5d77f]'
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* Form Container */}
        {authModalTab === 'login' ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] text-[#888888] block mb-1">Correo Electrónico</label>
              <div className="relative">
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  required
                  className="w-full bg-[#141414] border border-[#d4af37]/40 rounded-xl py-2.5 pl-10 pr-3 text-xs text-[#f4f4f4] placeholder-[#555555] focus:outline-none focus:border-[#d4af37]"
                />
                <Mail className="w-4 h-4 text-[#d4af37] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-[#888888] block mb-1">Contraseña</label>
              <div className="relative">
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#141414] border border-[#d4af37]/40 rounded-xl py-2.5 pl-10 pr-3 text-xs text-[#f4f4f4] placeholder-[#555555] focus:outline-none focus:border-[#d4af37]"
                />
                <Lock className="w-4 h-4 text-[#d4af37] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f5d77f] to-[#aa820a] text-[#080808] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#d4af37]/20"
            >
              <span>Entrar a mi Cuenta</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Logins Helper */}
            <div className="pt-2 border-t border-[#222222] space-y-2">
              <span className="text-[10px] text-[#777777] uppercase tracking-wider block text-center">
                Acceso Rápido de Prueba:
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => setDemoAccount('cliente')}
                  className="py-1.5 px-2 rounded-lg bg-[#161616] border border-[#333333] text-[#f5d77f] hover:border-[#d4af37] transition-colors text-center"
                >
                  Cliente VIP (Daniela)
                </button>
                <button
                  type="button"
                  onClick={() => setDemoAccount('admin')}
                  className="py-1.5 px-2 rounded-lg bg-[#161616] border border-[#333333] text-[#f5d77f] hover:border-[#d4af37] transition-colors text-center"
                >
                  Administrador (Admin)
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-[#888888] block mb-1">Nombre</label>
                <input
                  type="text"
                  value={regNombre}
                  onChange={(e) => setRegNombre(e.target.value)}
                  placeholder="Tu nombre"
                  required
                  className="w-full bg-[#141414] border border-[#d4af37]/40 rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#888888] block mb-1">Apellido</label>
                <input
                  type="text"
                  value={regApellido}
                  onChange={(e) => setRegApellido(e.target.value)}
                  placeholder="Tu apellido"
                  required
                  className="w-full bg-[#141414] border border-[#d4af37]/40 rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-[#888888] block mb-1">Correo Electrónico</label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                required
                className="w-full bg-[#141414] border border-[#d4af37]/40 rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="text-[11px] text-[#888888] block mb-1">Teléfono</label>
              <input
                type="text"
                value={regTelefono}
                onChange={(e) => setRegTelefono(e.target.value)}
                placeholder="+57 300 000 0000"
                required
                className="w-full bg-[#141414] border border-[#d4af37]/40 rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-[#888888] block mb-1">Contraseña</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Mín 4 caracteres"
                  required
                  className="w-full bg-[#141414] border border-[#d4af37]/40 rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#888888] block mb-1">Confirmar</label>
                <input
                  type="password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Repite contraseña"
                  required
                  className="w-full bg-[#141414] border border-[#d4af37]/40 rounded-xl py-2 px-3 text-xs text-[#f4f4f4] focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f5d77f] to-[#aa820a] text-[#080808] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#d4af37]/20 mt-4"
            >
              <Sparkles className="w-4 h-4" />
              <span>Crear Cuenta VIP</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  Lock, 
  Shield, 
  ArrowRight, 
  CheckCircle2, 
  X,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';

interface AccessFormProps {
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  onRegisterSuccess: (user: UserProfile) => void;
  existingProfiles: UserProfile[];
  initialMode?: 'login' | 'register';
}

export default function AccessForm({ 
  onClose, 
  onLoginSuccess, 
  onRegisterSuccess, 
  existingProfiles,
  initialMode = 'login'
}: AccessFormProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Administrador' | 'Servicios' | 'Ventas' | 'Mensajería' | 'Negocio'>('Servicios');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Password toggles (eye icons)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Feedback states
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate email
    if (!email || !email.includes('@')) {
      setError('Por favor introduce un correo electrónico válido.');
      return;
    }

    // Validate password
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setError('Por favor introduce tu nombre completo.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden.');
        return;
      }

      // Check if email already registered
      const emailExists = existingProfiles.some(
        p => p.email.toLowerCase() === email.toLowerCase()
      );
      if (emailExists) {
        setError('Este correo electrónico ya está registrado.');
        return;
      }

      // Create new profile
      const newProfile: UserProfile = {
        id: `USR-${Math.floor(205 + Math.random() * 800)}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        status: 'Activo',
        lastActive: 'Hace un momento'
      };

      setIsSuccess(true);
      setTimeout(() => {
        onRegisterSuccess(newProfile);
        onClose();
      }, 1500);

    } else {
      // Login validation
      const foundUser = existingProfiles.find(
        p => p.email.toLowerCase() === email.toLowerCase()
      );

      if (foundUser) {
        if (foundUser.status === 'Inactivo') {
          setError('Esta cuenta está inactiva. Contacte al administrador.');
          return;
        }
        
        setIsSuccess(true);
        setTimeout(() => {
          onLoginSuccess(foundUser);
          onClose();
        }, 1200);
      } else {
        // Create dynamic user for testing credentials if they don't exist but want to allow login demo easily
        const fallbackUser: UserProfile = {
          id: `USR-${Math.floor(205 + Math.random() * 800)}`,
          name: email.split('@')[0].replace('.', ' '),
          email: email.trim().toLowerCase(),
          role: 'Servicios',
          status: 'Activo',
          lastActive: 'Hace un momento'
        };
        
        setIsSuccess(true);
        setTimeout(() => {
          onLoginSuccess(fallbackUser);
          onClose();
        }, 1200);
      }
    }
  };

  const fillDemoCredentials = (roleType: 'admin' | 'servicios' | 'ventas') => {
    if (roleType === 'admin') {
      setEmail('felipe.alarcon@homeli.mx');
      setPassword('password123');
    } else if (roleType === 'servicios') {
      setEmail('joseluis@homeli.mx');
      setPassword('password123');
    } else {
      setEmail('valeria.sales@homeli.mx');
      setPassword('password123');
    }
    setMode('login');
    setError(null);
  };

  return (
    <div className="space-y-6" id="auth_form_wrapper">
      {/* Header and Close button */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-100" id="auth_header_block">
        <div className="flex items-center gap-2" id="auth_logo_header">
          <span className="p-1.5 bg-[#c5a85c]/10 rounded-xl text-[#c5a85c]">
            <Sparkles size={18} />
          </span>
          <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">
            {mode === 'login' ? 'Iniciar Sesión en Homeli' : 'Crear Cuenta en Homeli'}
          </h2>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg transition"
          id="auth_close_btn"
          title="Cerrar formulario"
        >
          <X size={16} />
        </button>
      </div>

      {isSuccess ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-12 flex flex-col items-center justify-center text-center space-y-4"
          id="auth_success_animation"
        >
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 border border-emerald-200 shadow-sm animate-bounce">
            <CheckCircle2 size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">
              {mode === 'login' ? '¡Inicio de sesión exitoso!' : '¡Registro de cuenta exitoso!'}
            </h3>
            <p className="text-xs text-slate-500">
              {mode === 'login' 
                ? 'Cargando tu perfil y sincronizando tableros...' 
                : 'Tu perfil ha sido registrado e iniciado sesión de inmediato.'}
            </p>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" id="auth_main_form">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 border border-red-150 rounded-xl text-xs text-red-600 font-medium flex items-center gap-2"
              id="auth_error_alert"
            >
              <span className="text-sm">⚠️</span>
              <span>{error}</span>
            </motion.div>
          )}

          {/* Toggle Tab */}
          <div className="grid grid-cols-2 p-1 bg-slate-50 rounded-xl border border-slate-150/80" id="auth_mode_selector">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`py-1.5 text-xs font-extrabold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              id="tab_select_login"
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`py-1.5 text-xs font-extrabold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              id="tab_select_register"
            >
              Crear Cuenta
            </button>
          </div>

          {/* Registration fields */}
          {mode === 'register' && (
            <div className="space-y-1" id="reg_field_name_group">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Nombre Completo</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <User size={14} />
                </span>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#c5a85c] focus:border-[#c5a85c] transition outline-none"
                  id="reg_input_name"
                />
              </div>
            </div>
          )}

          {/* Email field */}
          <div className="space-y-1" id="field_email_group">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Correo Electrónico</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail size={14} />
              </span>
              <input
                type="email"
                required
                placeholder="usuario@homeli.mx"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#c5a85c] focus:border-[#c5a85c] transition outline-none"
                id="auth_input_email"
              />
            </div>
          </div>

          {/* Role selection only in Register mode */}
          {mode === 'register' && (
            <div className="space-y-1" id="reg_field_role_group">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Rol de Operación / Acceso</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Shield size={14} />
                </span>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#c5a85c] focus:border-[#c5a85c] transition outline-none appearance-none"
                  id="reg_select_role"
                >
                  <option value="Administrador">Administrador (Control total)</option>
                  <option value="Servicios">Servicios (Coordinador / Limpieza)</option>
                  <option value="Ventas">Ventas (Ecommerce / Inventario)</option>
                  <option value="Mensajería">Mensajería (Reparto / Entregas)</option>
                  <option value="Negocio">Socio de Negocio / Patrocinador</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</span>
              </div>
            </div>
          )}

          {/* Password field */}
          <div className="space-y-1" id="field_password_group">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Contraseña</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={14} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#c5a85c] focus:border-[#c5a85c] transition outline-none"
                id="auth_input_password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition p-1 hover:bg-slate-50 rounded-lg"
                title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                id="auth_btn_toggle_pass"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Confirm Password field only in register mode */}
          {mode === 'register' && (
            <div className="space-y-1" id="reg_field_confirm_pass_group">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Confirmar Contraseña</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={14} />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Repite la contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#c5a85c] focus:border-[#c5a85c] transition outline-none"
                  id="reg_input_confirm_pass"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition p-1 hover:bg-slate-50 rounded-lg"
                  title={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  id="reg_btn_toggle_confirm_pass"
                >
                  {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-2.5 bg-[#c5a85c] hover:bg-[#b59549] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
            id="auth_submit_btn"
          >
            <span>{mode === 'login' ? 'Ingresar Ahora' : 'Crear mi Cuenta'}</span>
            <ArrowRight size={13} />
          </button>

          {/* Quick Demo Accounts Helper for testing */}
          {mode === 'login' && (
            <div className="pt-3 border-t border-slate-100" id="auth_demo_accounts_panel">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">Cuentas Demo de Prueba:</span>
              <div className="flex flex-wrap gap-1.5" id="demo_pills_list">
                <button 
                  type="button"
                  onClick={() => fillDemoCredentials('admin')}
                  className="px-2 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-[10px] text-slate-600 font-bold transition"
                  id="btn_demo_admin"
                >
                  👑 Admin
                </button>
                <button 
                  type="button"
                  onClick={() => fillDemoCredentials('servicios')}
                  className="px-2 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg text-[10px] text-slate-600 font-bold transition"
                  id="btn_demo_servicios"
                >
                  🛠️ Servicios
                </button>
                <button 
                  type="button"
                  onClick={() => fillDemoCredentials('ventas')}
                  className="px-2 py-1 bg-slate-100 hover:bg-amber-50 hover:text-amber-600 rounded-lg text-[10px] text-slate-600 font-bold transition"
                  id="btn_demo_ventas"
                >
                  💼 Ventas
                </button>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}

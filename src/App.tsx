/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  initialServices, 
  initialProducts, 
  initialOrders, 
  initialLogs, 
  initialProfiles 
} from './data';
import { 
  ServiceRequest, 
  ProductItem, 
  SalesOrder, 
  SystemLog, 
  UserProfile, 
  ServiceStatus, 
  OrderStatus 
} from './types';
import AdminSection from './components/AdminSection';
import ServiciosSection from './components/ServiciosSection';
import VentasSection from './components/VentasSection';
import { 
  ShieldAlert, 
  Wrench, 
  ShoppingBag, 
  Home, 
  Download, 
  Info, 
  Sparkles, 
  Share2, 
  ArrowLeft,
  Smartphone,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Shared States initialization
  const [services, setServices] = useState<ServiceRequest[]>(initialServices);
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [orders, setOrders] = useState<SalesOrder[]>(initialOrders);
  const [logs, setLogs] = useState<SystemLog[]>(initialLogs);
  const [profiles, setProfiles] = useState<UserProfile[]>(initialProfiles);

  // Navigational & brand States
  const [activeSection, setActiveSection] = useState<'home' | 'admin' | 'servicios' | 'ventas'>('home');
  const [showSplash, setShowSplash] = useState(true);

  // Progressive Web App Installation states
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallInstructions, setShowInstallInstructions] = useState(false);

  // Listen back to window install prompt events
  useEffect(() => {
    const antesDeInstalar = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      console.log('beforeinstallprompt event triggered & captured!');
    };

    window.addEventListener('beforeinstallprompt', antesDeInstalar);

    // Check if running directly in installed app environment
    if (
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', antesDeInstalar);
    };
  }, []);

  // Operation Log System Helper
  const onAddLog = (action: string, severity: 'info' | 'warning' | 'critical' = 'info') => {
    const newLog: SystemLog = {
      id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString(),
      actor: activeSection === 'home' ? 'Sistema' : activeSection === 'admin' ? 'Felipe Admin' : activeSection === 'servicios' ? 'Coordinador Jose' : 'Valeria Ventas',
      role: activeSection === 'home' ? 'Administrador' : activeSection === 'admin' ? 'Administrador' : activeSection === 'servicios' ? 'Servicios' : 'Ventas',
      action,
      severity
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // State Management Handlers
  const handleAddUser = (user: UserProfile) => {
    setProfiles(prev => [...prev, user]);
  };

  const handleClearLogs = () => {
    setLogs([]);
    onAddLog('Bitácora de eventos limpiada por el administrador', 'warning');
  };

  const handleAddService = (service: ServiceRequest) => {
    setServices(prev => [service, ...prev]);
  };

  const handleUpdateServiceStatus = (id: string, status: ServiceStatus) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    onAddLog(`Estado del servicio ${id} modificado a: ${status.toUpperCase()}`, 'info');
  };

  const handleAddProduct = (product: ProductItem) => {
    setProducts(prev => [product, ...prev]);
  };

  const handleUpdateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    onAddLog(`Estado de orden comercial ${id} modificado a: ${status.toUpperCase()}`, 'info');
  };

  // Trigger Native browser PWA install steps
  const triggerPWAInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        onAddLog('Aplicación Homeli instalada localmente con éxito', 'info');
      }
      setDeferredPrompt(null);
    } else {
      // Prompt not active or on iOS, display our high fidelity instructions guide!
      setShowInstallInstructions(true);
    }
  };

  return (
    <div className="min-h-screen bg-natural-bg text-natural-text flex flex-col justify-between" id="master_app_container">
      
      {/* 1. Splash Screen containing the full unclipped Homeli logo */}
      <AnimatePresence>
        {showSplash && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-natural-bg z-50 flex flex-col justify-between items-center p-8 text-center"
            id="splash_screen"
          >
            <div></div> {/* spacer */}

            <div className="space-y-6 max-w-sm flex flex-col items-center">
              {/* Unclipped logo container ensuring full visibility without round/tight clipping */}
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="w-72 bg-white rounded-2xl shadow-md border border-natural-border overflow-hidden"
              >
                <img 
                  src="https://cossma.com.mx/homeli.jpg" 
                  alt="Homeli Logo Natural" 
                  className="w-full h-auto block"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              
              <div className="space-y-2">
                <h1 className="text-4xl font-extrabold font-serif tracking-tight text-natural-dark leading-none">Homeli</h1>
                <p className="text-sm font-semibold text-earth-green tracking-wide uppercase">Tu Hogar Inteligente & Servicios Profesionalizados</p>
                <p className="text-xs text-natural-silt px-2 leading-relaxed">
                  Consola única multi-rol para la optimización de Mantenimiento de Hogares, Ventas E-commerce y Auditoría de Operaciones.
                </p>
              </div>
            </div>

            {/* Splash triggers and installing alerts */}
            <div className="w-full max-w-xs space-y-3">
              <button
                onClick={() => setShowSplash(false)}
                className="w-full py-3 px-6 bg-earth-green hover:bg-earth-green-dark border border-transparent text-white font-bold rounded-2xl transition shadow-lg shadow-earth-green/10 flex items-center justify-center gap-2 text-sm cursor-pointer"
                id="btn_enter_dashboard"
              >
                <span>Acceder al Dashboard</span>
                <span className="font-mono text-[10px] bg-earth-green-dark text-white px-1.5 py-0.5 rounded">v1.2</span>
              </button>

              <button
                onClick={triggerPWAInstall}
                className="w-full py-2.5 px-4 bg-white hover:bg-natural-bg border border-natural-border text-natural-text font-semibold rounded-2xl transition flex items-center justify-center gap-2 text-xs cursor-pointer"
                id="btn_splash_install"
              >
                <Download size={14} className="text-earth-green" />
                Instalar Aplicación (PWA)
              </button>
              
              <p className="text-[10px] text-natural-muted">Compatible con iOS, Android, macOS y Windows</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Core Layout */}
      <div className="flex flex-col flex-1" id="core_layout">
        
        {/* Dynamic Installer Banner */}
        <div className="bg-natural-dark text-natural-bg text-xs py-2 px-4 flex justify-between items-center gap-4 border-b border-natural-border/20" id="top_installer_badge">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative bg-transparent">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-earth-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-earth-green"></span>
            </span>
            <span className="font-medium text-natural-bg/90">
              {isInstalled ? '✓ Homeli está activo en modo aplicación nativa' : 'Homeli está listo para descargarse en tu pantalla de inicio'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {!isInstalled && (
              <button
                onClick={triggerPWAInstall}
                className="bg-earth-green hover:bg-earth-green-dark text-white font-bold px-3 py-1 rounded-lg text-[11px] transition shadow flex items-center gap-1.5 active:scale-95 cursor-pointer"
                id="btn_top_bar_install"
              >
                <Download size={12} />
                <span>Instalar Homeli</span>
              </button>
            )}
            {isInstalled && (
              <span className="text-[10px] bg-earth-green-light/20 text-earth-green font-bold px-2 py-0.5 rounded-full border border-earth-green/30">
                PWA Instalada
              </span>
            )}
            <button
              onClick={() => setShowInstallInstructions(true)}
              className="text-natural-bg/50 hover:text-white transition leading-none p-1 cursor-pointer"
              title="Manual de instalación rápida"
            >
              <Info size={14} />
            </button>
          </div>
        </div>

        {/* Master Top Header Navigation Bar */}
        <header className="bg-white border-b border-natural-border py-3.5 px-6 flex justify-between items-center shadow-sm sticky top-0 z-40" id="header_navbar">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveSection('home')}>
            {/* Standard Rectangular Logo Brand Area without restrictive circular frame encapsulation */}
            <div className="w-16 bg-white shrink-0" id="navbar_brand_logo">
              <img 
                src="https://cossma.com.mx/homeli.jpg" 
                alt="Homeli Logo Banner" 
                className="w-full h-auto object-contain block"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h2 className="text-base font-extrabold font-serif tracking-tight text-natural-dark leading-none">Homeli</h2>
              <p className="text-[10px] font-bold text-earth-green leading-none mt-1 uppercase tracking-widest">Dashboard Multi-Rol</p>
            </div>
          </div>

          {/* Navigational shortcuts when active section is loaded */}
          <div className="flex items-center gap-2">
            {activeSection !== 'home' && (
              <button
                onClick={() => setActiveSection('home')}
                className="px-3.5 py-1.5 text-xs text-natural-text hover:text-natural-dark hover:bg-natural-bg border border-natural-border rounded-xl transition font-bold flex items-center gap-1.5 cursor-pointer"
                id="btn_nav_back_home"
              >
                <Home size={14} />
                <span>Selector Roles</span>
              </button>
            )}

            <button
              onClick={() => setShowSplash(true)}
              className="p-1 px-2.5 hover:bg-natural-bg text-xs font-semibold text-natural-muted hover:text-natural-dark transition rounded-lg cursor-pointer"
              id="btn_show_splash_launcher"
            >
              Ver Iniciador
            </button>
            
            {/* Shortcuts directly in header */}
            <div className="hidden sm:flex rounded-lg bg-natural-bg p-0.5 border border-natural-border" id="navbar_shortcuts">
              <button 
                onClick={() => setActiveSection('admin')}
                className={`px-3 py-1 text-[11px] font-bold rounded-md transition cursor-pointer ${activeSection === 'admin' ? 'bg-earth-copper text-white' : 'text-natural-muted hover:text-natural-dark'}`}
              >
                Admin
              </button>
              <button 
                onClick={() => setActiveSection('servicios')}
                className={`px-3 py-1 text-[11px] font-bold rounded-md transition cursor-pointer ${activeSection === 'servicios' ? 'bg-earth-green text-white' : 'text-natural-muted hover:text-natural-dark'}`}
              >
                Servicios
              </button>
              <button 
                onClick={() => setActiveSection('ventas')}
                className={`px-3 py-1 text-[11px] font-bold rounded-md transition cursor-pointer ${activeSection === 'ventas' ? 'bg-earth-slate text-white' : 'text-natural-muted hover:text-natural-dark'}`}
              >
                Ventas
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Page Views Body */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto" id="main_layout_body">
          <AnimatePresence mode="wait">
            {activeSection === 'home' ? (
              <motion.div
                key="home_entry_selection"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-12 py-6"
                id="home_content"
              >
                {/* Brand Greetings Area */}
                <div className="text-center space-y-3 max-w-xl mx-auto">
                  <span className="px-3 py-1 bg-earth-green-light border border-earth-green/20 rounded-full text-earth-green-dark text-xs font-bold tracking-widest uppercase inline-block">
                    CONSOLA INTEGRADA DE NEGOCIOS
                  </span>
                  <h2 className="text-4xl font-extrabold font-serif tracking-tight text-natural-dark">
                    Bienvenido de vuelta a Homeli
                  </h2>
                  <p className="text-sm text-natural-silt leading-relaxed font-sans">
                    Navega a través de los diversos entornos operativos seleccionando tu rol de acceso. Modifica parámetros, monitorea solicitudes en ruta o despacha órdenes e-commerce.
                  </p>
                </div>

                {/* The 3 requested entries: Icon and Name exactly */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto" id="three_roles_access_grid">
                  {/* Category 1: Admin */}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setActiveSection('admin');
                      onAddLog('Acceso autorizado a Panel de Administración', 'info');
                    }}
                    className="bg-white p-7 rounded-2xl border border-natural-border hover:border-earth-copper shadow-sm cursor-pointer transition flex flex-col justify-between h-64 text-left relative group overflow-hidden"
                    id="access_entry_admin"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-earth-copper/5 rounded-full -mr-6 -mt-6 group-hover:scale-125 transition duration-500" />
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-earth-copper-light text-earth-copper rounded-xl inline-block group-hover:bg-earth-copper group-hover:text-white transition duration-300">
                        <ShieldAlert size={26} />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold font-serif text-natural-dark tracking-tight flex items-center gap-1.5">
                          Administrador
                        </h4>
                        <p className="text-xs text-natural-silt mt-1.5 leading-relaxed">
                          Control total. Supervisión de bitácoras de seguridad, administración de personal, toggles del sistema y analíticas financieras consolidadas.
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-earth-copper flex items-center gap-1 group-hover:translate-x-1 transition mt-4 pt-3 border-t border-natural-border/50">
                      Entrar como Administrador ➔
                    </span>
                  </motion.div>

                  {/* Category 2: Servicios */}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setActiveSection('servicios');
                      onAddLog('Acceso autorizado a Panel de Operaciones de Servicios', 'info');
                    }}
                    className="bg-white p-7 rounded-2xl border border-natural-border hover:border-earth-green shadow-sm cursor-pointer transition flex flex-col justify-between h-64 text-left relative group overflow-hidden"
                    id="access_entry_servicios"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-earth-green/5 rounded-full -mr-6 -mt-6 group-hover:scale-125 transition duration-500" />

                    <div className="space-y-4">
                      <div className="p-4 bg-earth-green-light text-earth-green-dark rounded-xl inline-block group-hover:bg-earth-green group-hover:text-white transition duration-300">
                        <Wrench size={26} />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold font-serif text-natural-dark tracking-tight flex items-center gap-1.5">
                          Servicios
                        </h4>
                        <p className="text-xs text-natural-silt mt-1.5 leading-relaxed">
                          Coordinador de especialistas técnicos. Agenda nuevas órdenes de limpieza o fontanería, modifica estados en ruta y asigna técnicos oficiales.
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-earth-green-dark flex items-center gap-1 group-hover:translate-x-1 transition mt-4 pt-3 border-t border-natural-border/50">
                      Entrar a Servicios ➔
                    </span>
                  </motion.div>

                  {/* Category 3: Ventas Ecommerce */}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setActiveSection('ventas');
                      onAddLog('Acceso autorizado a Consola de E-commerce y Ventas', 'info');
                    }}
                    className="bg-white p-7 rounded-2xl border border-natural-border hover:border-earth-slate shadow-sm cursor-pointer transition flex flex-col justify-between h-64 text-left relative group overflow-hidden"
                    id="access_entry_ventas"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-earth-slate/5 rounded-full -mr-6 -mt-6 group-hover:scale-125 transition duration-500" />

                    <div className="space-y-4">
                      <div className="p-4 bg-earth-slate-light text-earth-slate rounded-xl inline-block group-hover:bg-earth-slate group-hover:text-white transition duration-300">
                        <ShoppingBag size={26} />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold font-serif text-natural-dark tracking-tight flex items-center gap-1.5">
                          Ventas Ecommerce
                        </h4>
                        <p className="text-xs text-natural-silt mt-1.5 leading-relaxed">
                          Consola comercial. Gestiona stock y disponibilidad de productos premium de domótica del hogar, despacha órdenes de compras de clientes y suma productos.
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-earth-slate flex items-center gap-1 group-hover:translate-x-1 transition mt-4 pt-3 border-t border-natural-border/50">
                      Entrar a Consola Comercial ➔
                    </span>
                  </motion.div>
                </div>

                {/* Additional PWA Banner near the bottom */}
                <div className="max-w-4xl mx-auto bg-gradient-to-br from-earth-green-dark via-earth-green to-natural-dark rounded-3xl p-8 text-white relative overflow-hidden shadow-lg" id="bottom_pwa_banner">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-12 -translate-y-12 animate-none" />
                  
                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-3 text-left">
                      <div className="inline-flex gap-1.5 items-center bg-white/10 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border border-white/20">
                        <Sparkles size={11} />
                        Apto para Dispositivos Android & iOS
                      </div>
                      <h3 className="text-3xl font-bold font-serif leading-tight">Homeli en tu teléfono</h3>
                      <p className="text-xs text-white/80 leading-relaxed max-w-sm">
                        Instala esta app en tu pantalla de inicio para recibir un acceso directo de baja latencia con funcionalidad offline, velocidad fluida y experiencia nativa.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-start md:justify-end">
                      <button
                        onClick={triggerPWAInstall}
                        className="py-3 px-6 bg-white hover:bg-natural-bg text-natural-dark font-bold rounded-2xl transition shadow-md text-xs flex items-center justify-center gap-2 cursor-pointer"
                        id="btn_bottom_pwa_install"
                      >
                        <Download size={15} className="text-earth-green" />
                        Instalar Aplicación Ahora
                      </button>

                      <button
                        onClick={() => setShowInstallInstructions(true)}
                        className="py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-2xl transition text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        id="btn_bottom_pwa_manual"
                      >
                        Ver Guía Práctica
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="sub_section_viewer"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                id="interactive_section_body"
              >
                {/* Back Link Breadcrumb under Active Section */}
                <div className="flex justify-between items-center mb-6" id="dashboard_breadcrumb">
                  <div className="flex gap-2 items-center text-xs text-slate-500 font-semibold">
                    <button 
                      onClick={() => setActiveSection('home')} 
                      className="hover:text-indigo-600 flex items-center gap-1 transition"
                      id="breadcrumb_home_btn"
                    >
                      <span>Homeli</span>
                    </button>
                    <span>/</span>
                    <span className="text-slate-800 capitalize font-bold font-mono">
                      {activeSection === 'admin' ? 'Administrador' : activeSection === 'servicios' ? 'Servicios' : 'Ventas Ecommerce'}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveSection('home')}
                      className="px-3 py-1.5 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl transition flex items-center gap-1"
                      id="btn_quick_return"
                    >
                      <ArrowLeft size={13} />
                      Regresar al Inicio
                    </button>
                  </div>
                </div>

                {/* Sub Panel Router */}
                {activeSection === 'admin' && (
                  <AdminSection 
                    services={services}
                    products={products}
                    orders={orders}
                    logs={logs}
                    profiles={profiles}
                    onAddUser={handleAddUser}
                    onAddLog={onAddLog}
                    onClearLogs={handleClearLogs}
                  />
                )}

                {activeSection === 'servicios' && (
                  <ServiciosSection 
                    services={services}
                    onAddService={handleAddService}
                    onUpdateServiceStatus={handleUpdateServiceStatus}
                    onAddLog={onAddLog}
                  />
                )}

                {activeSection === 'ventas' && (
                  <VentasSection 
                    products={products}
                    orders={orders}
                    onAddProduct={handleAddProduct}
                    onUpdateOrderStatus={handleUpdateOrderStatus}
                    onAddLog={onAddLog}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Footer Area */}
      <footer className="bg-white border-t border-slate-100 py-6 px-6 mt-12 text-center text-xs text-slate-400" id="footer_area">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Homeli Inc. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-indigo-600 transition font-medium">Condiciones</a>
            <a href="#" className="hover:text-indigo-600 transition font-medium">Privacidad</a>
            <a href="#" className="hover:text-indigo-600 transition font-medium">Soporte Express</a>
          </div>
        </div>
      </footer>

      {/* Dynamic PWA installation modal for IOS and manual steps */}
      <AnimatePresence>
        {showInstallInstructions && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-150 p-6 max-w-lg w-full shadow-2xl space-y-6 text-left relative"
              id="pwa_instructions_modal"
            >
              <button 
                onClick={() => setShowInstallInstructions(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold transition text-sm p-1 hover:bg-slate-50 rounded-lg"
              >
                ✕
              </button>

              <div className="space-y-2">
                <span className="px-2.5 py-0.5 bg-indigo-50 rounded text-indigo-600 font-bold text-[10px] uppercase tracking-wider">
                  Guía de Instalación Rápida
                </span>
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <Smartphone size={20} className="text-indigo-600" />
                  Instalar Homeli en tus dispositivos
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Homeli está configurado como PWA (Progressive Web App). Puedes instalarlo directamente en iOS (Safari), Android (Chrome) o Computadora como si fuera nativo. Sin tiendas externas.
                </p>
              </div>

              {/* Instructions split */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Apple IOS panel */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                      <span>📱</span>
                      <span>Dispositivos de Apple (iOS)</span>
                    </p>
                    <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside pl-1 leading-relaxed">
                      <li>Abre esta applet en el navegador <strong className="text-slate-800">Safari</strong>.</li>
                      <li>Presiona el botón de <strong className="text-slate-800">Compartir</strong> (<Share2 size={11} className="inline inline-block" />) en la barra inferior.</li>
                      <li>Desliza y selecciona la opción de <strong className="text-slate-800">"Agregar a inicio"</strong> o "Añadir a pantalla de inicio".</li>
                    </ol>
                  </div>
                  <p className="text-[10px] text-slate-400 italic mt-3">Soporta iPhone e iPad</p>
                </div>

                {/* Android / PC panel */}
                <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-50/70 flex flex-col justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-extrabold text-indigo-900 flex items-center gap-1">
                      <span>🤖</span>
                      <span>Android / Chrome en PC </span>
                    </p>
                    <ol className="text-xs text-indigo-950/80 space-y-2 list-decimal list-inside pl-1 leading-relaxed">
                      <li>Puedes presionar el botón de <span className="font-bold">descarga directa</span> que activamos en este panel.</li>
                      <li>O haz clic en los <strong className="text-indigo-900">tres puntos (⋮)</strong> en el extremo derecho superior de Chrome.</li>
                      <li>Selecciona la opción <strong className="text-indigo-900">"Instalar aplicación..."</strong>.</li>
                    </ol>
                  </div>

                  {deferredPrompt && (
                    <button
                      onClick={() => {
                        setShowInstallInstructions(false);
                        triggerPWAInstall();
                      }}
                      className="w-full mt-4 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl transition text-xs text-center flex items-center justify-center gap-1.5"
                    >
                      <Download size={13} />
                      <span>Instalar automáticamente</span>
                    </button>
                  )}
                  {!deferredPrompt && (
                    <p className="text-[10px] text-indigo-600 italic mt-3 font-semibold">Listo para navegadores estándar</p>
                  )}
                </div>
              </div>

              {/* Logo natural unencapsulated representation as splash example */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-16 shrink-0 bg-white shadow rounded p-0.5" id="installation_logo_demo">
                  <img src="https://cossma.com.mx/homeli.jpg" alt="Icon PWA" className="w-full h-auto block" referrerPolicy="no-referrer" />
                </div>
                <div className="space-y-1">
                  <h6 className="text-xs font-bold text-slate-800">Visualización de Ícono y Splash en iOS/Android</h6>
                  <p className="text-[10px] text-slate-450 leading-relaxed">
                    El logotipo se despliega completo y original en su proporción nativa tanto en la pantalla de inicio como en el splash screen (pantalla de arranque).
                  </p>
                </div>
              </div>

              {/* Close footer button */}
              <div className="pt-2 text-right">
                <button
                  onClick={() => setShowInstallInstructions(false)}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-850 text-white font-bold rounded-xl text-xs transition"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

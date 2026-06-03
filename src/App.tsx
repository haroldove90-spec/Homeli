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
  Laptop,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Shared States initialization with localStorage persistence
  const [services, setServices] = useState<ServiceRequest[]>(() => {
    try {
      const persisted = localStorage.getItem('homeli_services');
      return persisted ? JSON.parse(persisted) : initialServices;
    } catch {
      return initialServices;
    }
  });

  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const persisted = localStorage.getItem('homeli_products');
      return persisted ? JSON.parse(persisted) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  const [orders, setOrders] = useState<SalesOrder[]>(() => {
    try {
      const persisted = localStorage.getItem('homeli_orders');
      return persisted ? JSON.parse(persisted) : initialOrders;
    } catch {
      return initialOrders;
    }
  });

  const [logs, setLogs] = useState<SystemLog[]>(() => {
    try {
      const persisted = localStorage.getItem('homeli_logs');
      return persisted ? JSON.parse(persisted) : initialLogs;
    } catch {
      return initialLogs;
    }
  });

  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    try {
      const persisted = localStorage.getItem('homeli_profiles');
      return persisted ? JSON.parse(persisted) : initialProfiles;
    } catch {
      return initialProfiles;
    }
  });

  // Navigational & brand States with localStorage persistence
  const [activeSection, setActiveSection] = useState<'home' | 'admin' | 'servicios' | 'ventas'>(() => {
    try {
      const persisted = localStorage.getItem('homeli_active_section');
      return (persisted as 'home' | 'admin' | 'servicios' | 'ventas') || 'home';
    } catch {
      return 'home';
    }
  });

  const [showSplash, setShowSplash] = useState(false);

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('homeli_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('homeli_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('homeli_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('homeli_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('homeli_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('homeli_active_section', activeSection);
  }, [activeSection]);

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
    onAddLog(`Producto agregado al inventario: ${product.name} en ${product.category}`, 'info');
  };

  const handleUpdateProduct = (updated: ProductItem) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    onAddLog(`Producto actualizado en inventario: ${updated.name}`, 'info');
  };

  const handleDeleteProduct = (id: string) => {
    const p = products.find(prod => prod.id === id);
    const pName = p ? p.name : id;
    setProducts(prev => prev.filter(prod => prod.id !== id));
    onAddLog(`Producto eliminado del inventario: ${pName}`, 'warning');
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

  // Clear all persisted data/cache in localStorage and reload the application
  const handleClearCache = () => {
    localStorage.removeItem('homeli_services');
    localStorage.removeItem('homeli_products');
    localStorage.removeItem('homeli_orders');
    localStorage.removeItem('homeli_logs');
    localStorage.removeItem('homeli_profiles');
    localStorage.removeItem('homeli_active_section');
    
    // Perform hard reload to ensure all static files and memory is completely cleansed
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-natural-bg text-natural-text flex flex-col justify-between" id="master_app_container">
      
      {/* Main Core Layout */}
      <div className="flex flex-col flex-1" id="core_layout">

        {/* Master Top Header Navigation Bar - Shown only inside internal roles views except Ventas */}
        {activeSection !== 'home' && activeSection !== 'ventas' && (
          <header className="bg-white border-b border-natural-border py-2 px-5 flex justify-between items-center shadow-sm sticky top-0 z-40" id="header_navbar">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveSection('home')}>
              {/* Unencapsulated Real Logo */}
              <img 
                src="https://cossma.com.mx/homeli.jpg" 
                alt="Homeli Logo Banner" 
                className="h-14 w-auto object-contain block transition-all"
                referrerPolicy="no-referrer"
              />
              <div>
                <h2 className="text-base font-bold font-serif tracking-tight text-natural-dark leading-none">Homeli</h2>
              </div>
            </div>

            {/* Navigational shortcuts when active section is loaded */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSection('home')}
                className="px-3 py-1.5 text-xs text-natural-text hover:text-natural-dark hover:bg-natural-bg border border-natural-border rounded-xl transition font-bold flex items-center gap-1.5 cursor-pointer"
                id="btn_nav_back_home"
              >
                <Home size={13} />
                <span>Selector Roles</span>
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
        )}

        {/* Dynamic Page Views Body */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto" id="main_layout_body">
          <AnimatePresence mode="wait">
            {activeSection === 'home' ? (
              <motion.div
                key="home_entry_selection"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-10 py-8 flex flex-col items-center justify-center min-h-[70vh]"
                id="home_content"
              >
                {/* Minimalist Centered Logo - Real logo fully unencapsulated for absolute visibility */}
                <div className="flex flex-col items-center justify-center mb-6" id="minimalist_home_brand">
                  <img 
                    src="https://cossma.com.mx/homeli.jpg" 
                    alt="Homeli Logo" 
                    className="w-64 sm:w-80 h-auto object-contain block transition-all duration-300 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* The 3 requested entries: Icon in an elegant solid golden block, label exactly underneath */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 max-w-md w-full px-4 justify-items-center" id="three_roles_access_grid">
                  {/* Category 1: Admin */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setActiveSection('admin');
                      onAddLog('Acceso autorizado a Panel de Administración', 'info');
                    }}
                    className="flex flex-col items-center gap-2 cursor-pointer group"
                    id="access_entry_admin"
                  >
                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#c5a85c] rounded-2xl flex items-center justify-center text-white shadow-md group-hover:bg-[#b59549] transition-all duration-200">
                      <ShieldAlert size={32} />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-natural-dark select-none mt-1 group-hover:text-[#c5a85c] transition-colors">Admin</span>
                  </motion.div>

                  {/* Category 2: Servicios */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setActiveSection('servicios');
                      onAddLog('Acceso autorizado a Panel de Operaciones de Servicios', 'info');
                    }}
                    className="flex flex-col items-center gap-2 cursor-pointer group"
                    id="access_entry_servicios"
                  >
                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#c5a85c] rounded-2xl flex items-center justify-center text-white shadow-md group-hover:bg-[#b59549] transition-all duration-200">
                      <Wrench size={32} />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-natural-dark select-none mt-1 group-hover:text-[#c5a85c] transition-colors">Servicios</span>
                  </motion.div>

                  {/* Category 3: Ventas (col-span-2 on mobile, centered; standard on desktop/tablet) */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setActiveSection('ventas');
                      onAddLog('Acceso autorizado a Consola de E-commerce y Ventas', 'info');
                    }}
                    className="col-span-2 sm:col-span-1 justify-self-center flex flex-col items-center gap-2 cursor-pointer group"
                    id="access_entry_ventas"
                  >
                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#c5a85c] rounded-2xl flex items-center justify-center text-white shadow-md group-hover:bg-[#b59549] transition-all duration-200">
                      <ShoppingBag size={32} />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-natural-dark select-none mt-1 group-hover:text-[#c5a85c] transition-colors">Ventas</span>
                  </motion.div>
                </div>

                {/* Minimalist action buttons: PWA Installation and Clear Cache */}
                <div className="pt-8 w-full flex flex-col sm:flex-row justify-center items-center gap-4" id="minimalist_pwa_installer_container">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      boxShadow: [
                        "0 4px 6px -1px rgba(197, 168, 92, 0.2), 0 2px 4px -1px rgba(197, 168, 92, 0.1)",
                        "0 10px 20px -3px rgba(197, 168, 92, 0.45), 0 4px 8px -2px rgba(197, 168, 92, 0.25)",
                        "0 4px 6px -1px rgba(197, 168, 92, 0.2), 0 2px 4px -1px rgba(197, 168, 92, 0.1)"
                      ]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.0,
                      ease: "easeInOut"
                    }}
                    onClick={triggerPWAInstall}
                    className="py-3 px-8 bg-[#c5a85c] hover:bg-[#b59549] text-white font-extrabold rounded-xl transition-all duration-300 text-xs flex items-center justify-center gap-2 cursor-pointer border border-[#c19a45]/20 shadow-md transform active:scale-95 uppercase tracking-wider w-full sm:w-auto"
                    id="btn_home_llamativo_install"
                  >
                    <Download size={15} />
                    <span>Instalar App</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClearCache}
                    className="py-3 px-8 bg-white hover:bg-slate-50 text-slate-700 font-extrabold rounded-xl transition-all duration-300 text-xs flex items-center justify-center gap-2 cursor-pointer border border-slate-200 shadow-sm transform active:scale-95 uppercase tracking-wider w-full sm:w-auto"
                    id="btn_home_clear_cache"
                  >
                    <RefreshCw size={14} className="text-[#c5a85c]" />
                    <span>Borrar Caché</span>
                  </motion.button>
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
                {activeSection !== 'ventas' && (
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
                )}

                {/* Sub Panel Router - Dynamically rendered based on active section */}
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
                    onAddProduct={handleAddProduct}
                    onUpdateProduct={handleUpdateProduct}
                    onDeleteProduct={handleDeleteProduct}
                  />
                )}

                {activeSection === 'servicios' && (
                  <div className="min-h-[50vh] bg-white rounded-2xl border border-natural-border/30 shadow-sm flex items-center justify-center p-8" id="servicios_blank_placeholder">
                    <span className="text-sm font-bold text-natural-muted uppercase tracking-wider">Módulo Servicios en Blanco</span>
                  </div>
                )}

                {activeSection === 'ventas' && (
                  <VentasSection 
                    products={products}
                    orders={orders}
                    onAddProduct={handleAddProduct}
                    onUpdateOrderStatus={handleUpdateOrderStatus}
                    onAddLog={onAddLog}
                    onAddOrder={(order) => setOrders(prev => [order, ...prev])}
                    onNavigateToHome={() => setActiveSection('home')}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Footer Area - Minimalist Empty Spacer for Mobile Padding */}
      <div className="py-4" id="footer_area"></div>

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

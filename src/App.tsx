/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  isSupabaseConfigured,
  fetchBusinessesFromSupabase,
  fetchServicesFromSupabase,
  fetchProductsFromSupabase,
  fetchOrdersFromSupabase,
  fetchAuditLogsFromSupabase,
  fetchProfilesFromSupabase,
  saveProfileToSupabase,
  saveBusinessToSupabase,
  deleteBusinessFromSupabase,
  saveServiceToSupabase,
  saveProductToSupabase,
  deleteProductFromSupabase,
  saveOrderToSupabase,
  saveAuditLogToSupabase
} from './supabase';
import { 
  initialServices, 
  initialProducts, 
  initialOrders, 
  initialLogs, 
  initialProfiles,
  initialCouriers
} from './data';
import { 
  ServiceRequest, 
  ProductItem, 
  SalesOrder, 
  SystemLog, 
  UserProfile, 
  ServiceStatus, 
  OrderStatus,
  CourierProfile,
  DeliveryStatus,
  AppNotification,
  BusinessRegistration
} from './types';
import AdminSection from './components/AdminSection';
import ServiciosSection from './components/ServiciosSection';
import VentasSection from './components/VentasSection';
import MensajeriaSection from './components/MensajeriaSection';
import { NegociosSection } from './components/NegociosSection';
import LandingPageSection from './components/LandingPageSection';
import AccessForm from './components/AccessForm';
import { safeStorage } from './utils/storage';
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
  RefreshCw,
  Menu,
  Bike,
  Calendar,
  Bell,
  BellRing,
  Trash2,
  Check,
  Building
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // User Authentication States with localStorage persistence (Moved to the top for state initialization dependencies)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const persisted = safeStorage.getItem('homeli_current_user');
      return persisted ? JSON.parse(persisted) : null;
    } catch {
      return null;
    }
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [showGuestModules, setShowGuestModules] = useState(false);

  // Shared States initialization with localStorage persistence
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const persisted = safeStorage.getItem('homeli_notifications');
      if (persisted) return JSON.parse(persisted);
    } catch {}
    return [
      {
        id: 'NOT-1',
        title: '🌟 Sistema Inicializado',
        message: 'Bienvenido al ecosistema Homeli de Gestión Unificada y Logística.',
        timestamp: new Date().toISOString(),
        role: 'Todos',
        read: false,
        type: 'sistema'
      },
      {
        id: 'NOT-2',
        title: '📈 Reporte de E-Commerce',
        message: 'Hay nuevos pedidos listos para asignación en el módulo de entregas.',
        timestamp: new Date().toISOString(),
        role: 'Administrador',
        read: false,
        type: 'compra'
      },
      {
        id: 'NOT-3',
        title: '🚴 Repartidor Carlos Ramos',
        message: 'El repartidor Carlos Ramos está activo y listo para entregas rápidas.',
        timestamp: new Date().toISOString(),
        role: 'Mensajería',
        read: false,
        type: 'registro'
      }
    ];
  });

  const [activePopup, setActivePopup] = useState<AppNotification | null>(null);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

  // Helper to add notifications dynamically with interactive alerts
  const handleAddNotification = (
    title: string,
    message: string,
    role: AppNotification['role'],
    type: AppNotification['type'] = 'sistema',
    targetId?: string
  ) => {
    const newNotif: AppNotification = {
      id: `NOT-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      message,
      timestamp: new Date().toISOString(),
      role,
      read: false,
      targetId,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
    setActivePopup(newNotif); // Triggers real-time popup overlay!
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleClearNotifications = (role?: AppNotification['role']) => {
    if (role) {
      setNotifications(prev => prev.filter(n => n.role !== role));
    } else {
      setNotifications([]);
    }
  };

  const [services, setServices] = useState<ServiceRequest[]>(() => {
    try {
      const persisted = safeStorage.getItem('homeli_services');
      return persisted ? JSON.parse(persisted) : initialServices;
    } catch {
      return initialServices;
    }
  });

  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const persisted = safeStorage.getItem('homeli_products');
      const parsed = persisted ? JSON.parse(persisted) : initialProducts;
      const list = Array.isArray(parsed) 
        ? parsed.filter((p: ProductItem) => p.category === 'Productos de limpieza' || p.category === 'Zapatos' || p.category === 'Servicios')
        : initialProducts.filter((p: ProductItem) => p.category === 'Productos de limpieza' || p.category === 'Zapatos' || p.category === 'Servicios');
      
      // Merge with initialProducts to restore latest fields like name, description, imageUrl, glbUrl, and usdzUrl for static catalog items
      return list.map((p: ProductItem) => {
        const match = initialProducts.find(init => init.id === p.id || (p.sku && init.sku === p.sku));
        if (match) {
          return {
            ...p,
            name: match.name,
            description: match.description,
            imageUrl: match.imageUrl,
            glbUrl: match.glbUrl,
            usdzUrl: match.usdzUrl,
            price: match.price !== undefined ? match.price : p.price,
          };
        }
        return p;
      });
    } catch {
      return initialProducts.filter((p: ProductItem) => p.category === 'Productos de limpieza' || p.category === 'Zapatos' || p.category === 'Servicios');
    }
  });

  const [orders, setOrders] = useState<SalesOrder[]>(() => {
    try {
      const persisted = safeStorage.getItem('homeli_orders');
      return persisted ? JSON.parse(persisted) : initialOrders;
    } catch {
      return initialOrders;
    }
  });

  const [logs, setLogs] = useState<SystemLog[]>(() => {
    try {
      const persisted = safeStorage.getItem('homeli_logs');
      return persisted ? JSON.parse(persisted) : initialLogs;
    } catch {
      return initialLogs;
    }
  });

  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    try {
      const persisted = safeStorage.getItem('homeli_profiles');
      return persisted ? JSON.parse(persisted) : initialProfiles;
    } catch {
      return initialProfiles;
    }
  });

  const [couriers, setCouriers] = useState<CourierProfile[]>(() => {
    try {
      const persisted = safeStorage.getItem('homeli_couriers');
      return persisted ? JSON.parse(persisted) : initialCouriers;
    } catch {
      return initialCouriers;
    }
  });

  const [businesses, setBusinesses] = useState<BusinessRegistration[]>(() => {
    try {
      const persisted = safeStorage.getItem('homeli_businesses');
      if (persisted) return JSON.parse(persisted);
    } catch {}
    return [
      {
        id: 'BIZ-001',
        name: 'Brillo Impecable de México',
        logo: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=150&auto=format&fit=crop&q=60',
        address: 'Av. Insurgentes Sur 1450, Col. Del Valle, Benito Juárez, CDMX',
        mapLink: 'https://maps.app.goo.gl/XbazWxXmhjRtB4sc9',
        telephones: '55-5678-1234',
        whatsapp: '55-9876-5432',
        ownerName: 'Ing. Alejandro Rosales',
        giro: 'Servicios de Limpieza Residencial e Industrial',
        status: 'Activo',
        services: [
          { name: 'Limpieza Express Residencial', price: 450, description: 'Limpieza rápida de habitaciones principales, sacudido, barrido y trapeado.' },
          { name: 'Sanitizado Químico Premium', price: 850, description: 'Desinfección por termonebulización de áreas comunes, certificado oficial.' },
          { name: 'Lavado Mecánico de Alfombras', price: 1200, description: 'Inyección profunda de agentes quitamanchas en tapetes y sillones.' }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'BIZ-002',
        name: 'Limpiezas Express CDMX',
        logo: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=150&auto=format&fit=crop&q=60',
        address: 'Paseo de la Reforma 250, Col. Juárez, Cuauhtémoc, CDMX',
        mapLink: 'https://maps.app.goo.gl/XbazWxXmhjRtB4sc9',
        telephones: '55-4321-8765',
        whatsapp: '55-1234-5678',
        ownerName: 'Lic. Clara Salazar',
        giro: 'Limpieza Especializada y Desinfección',
        status: 'Activo',
        services: [
          { name: 'Limpieza Profunda de Cocina', price: 900, description: 'Desengrase a detalle de estufas, campanas, azulejos y encimeras.' },
          { name: 'Sanitizado de Salas y Muebles', price: 1100, description: 'Remoción de ácaros y lavado por succión de sillones de tela o piel.' }
        ],
        createdAt: new Date().toISOString()
      }
    ];
  });

  // Navigational & brand States with localStorage persistence and URL tracking
  const [activeSection, setActiveSection] = useState<'home' | 'admin' | 'servicios' | 'ventas' | 'mensajeria' | 'negocios' | 'landing'>(() => {
    try {
      const urlParams = new URL(window.location.href);
      const sectionParam = urlParams.searchParams.get('section') || urlParams.searchParams.get('rol');
      const hashParam = urlParams.hash.replace('#', '').toLowerCase();

      // Check if deep link requests 'landing' first
      if (sectionParam === 'landing' || hashParam === 'landing') {
        return 'landing';
      }

      // Check for deep link QR parameters first to route instantly
      if (urlParams.searchParams.get('ar_product')) {
        return 'ventas';
      }

      const persisted = safeStorage.getItem('homeli_active_section');
      if (persisted && ['home', 'admin', 'servicios', 'ventas', 'mensajeria', 'negocios', 'landing'].includes(persisted)) {
        const persistedUser = safeStorage.getItem('homeli_current_user');
        if (!persistedUser && persisted !== 'landing' && persisted !== 'home') {
          return 'home';
        }
        return persisted as any;
      }

      if (sectionParam && ['home', 'admin', 'servicios', 'ventas', 'mensajeria', 'negocios', 'landing'].includes(sectionParam)) {
        const persistedUser = safeStorage.getItem('homeli_current_user');
        if (!persistedUser && sectionParam !== 'landing' && sectionParam !== 'home') {
          return 'home';
        }
        return sectionParam as any;
      }

      if (hashParam && ['home', 'admin', 'servicios', 'ventas', 'mensajeria', 'negocios', 'landing'].includes(hashParam)) {
        const persistedUser = safeStorage.getItem('homeli_current_user');
        if (!persistedUser && hashParam !== 'landing' && hashParam !== 'home') {
          return 'home';
        }
        return hashParam as any;
      }

      return 'home';
    } catch {
      return 'home';
    }
  });

  const [showSplash, setShowSplash] = useState(false);

  // States to control active admin module via header hamburger dropdown with localStorage persistence
  const [adminActiveTab, setAdminActiveTab] = useState<'metrics' | 'ecommerce' | 'entrega_agenda' | 'entrega_mensajeros' | 'servicios_control' | 'negocios_control'>(() => {
    try {
      const persisted = safeStorage.getItem('homeli_admin_active_tab');
      return (persisted as any) || 'metrics';
    } catch {
      return 'metrics';
    }
  });
  const [showAdminHamburgerDropdown, setShowAdminHamburgerDropdown] = useState(false);

  // Custom Banner States for Homeli Boutique Hero with localStorage Persistence
  const [bannerBg, setBannerBg] = useState<string>(() => {
    return safeStorage.getItem('homeli_banner_bg') || '';
  });
  const [bannerTitle, setBannerTitle] = useState<string>(() => {
    return safeStorage.getItem('homeli_banner_title') || 'Catálogo Exclusivo Homeli';
  });
  const [bannerTag, setBannerTag] = useState<string>(() => {
    return safeStorage.getItem('homeli_banner_tag') || 'BOUTIQUE';
  });
  const [bannerDesc, setBannerDesc] = useState<string>(() => {
    return safeStorage.getItem('homeli_banner_desc') || 'Descubre nuestras dos exclusivas divisiones diseñadas meticulosamente para brindar confort personal y sanidad impecable en tu hogar.';
  });
  const [bannerOverlayCol, setBannerOverlayCol] = useState<string>(() => {
    return safeStorage.getItem('homeli_banner_overlay_col') || '#0f172a';
  });
  const [bannerOverlayOpacity, setBannerOverlayOpacity] = useState<number>(() => {
    const raw = safeStorage.getItem('homeli_banner_overlay_opacity');
    return raw ? Number(raw) : 60;
  });

  // Sync state changes to localStorage
  useEffect(() => {
    safeStorage.setItem('homeli_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    safeStorage.setItem('homeli_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    safeStorage.setItem('homeli_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    safeStorage.setItem('homeli_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    safeStorage.setItem('homeli_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    safeStorage.setItem('homeli_couriers', JSON.stringify(couriers));
  }, [couriers]);

  useEffect(() => {
    safeStorage.setItem('homeli_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    safeStorage.setItem('homeli_active_section', activeSection);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('section', activeSection);
      window.history.replaceState({}, '', url.toString());
    } catch (e) {
      console.warn("Failed to update URL on section change", e);
    }
  }, [activeSection]);

  useEffect(() => {
    safeStorage.setItem('homeli_businesses', JSON.stringify(businesses));
  }, [businesses]);

  const handleRegisterBusiness = (newBiz: BusinessRegistration) => {
    setBusinesses(prev => [newBiz, ...prev]);
    if (isSupabaseConfigured) {
      saveBusinessToSupabase(newBiz);
    }
  };

  const handleUpdateBusiness = (updatedBiz: BusinessRegistration) => {
    setBusinesses(prev => prev.map(b => b.id === updatedBiz.id ? updatedBiz : b));
    if (isSupabaseConfigured) {
      saveBusinessToSupabase(updatedBiz);
    }
  };

  const handleDeleteBusiness = (id: string) => {
    setBusinesses(prev => prev.filter(b => b.id !== id));
    if (isSupabaseConfigured) {
      deleteBusinessFromSupabase(id);
    }
  };

  useEffect(() => {
    safeStorage.setItem('homeli_admin_active_tab', adminActiveTab);
  }, [adminActiveTab]);

  useEffect(() => {
    safeStorage.setItem('homeli_banner_bg', bannerBg);
  }, [bannerBg]);

  useEffect(() => {
    safeStorage.setItem('homeli_banner_title', bannerTitle);
  }, [bannerTitle]);

  useEffect(() => {
    safeStorage.setItem('homeli_banner_tag', bannerTag);
  }, [bannerTag]);

  useEffect(() => {
    safeStorage.setItem('homeli_banner_desc', bannerDesc);
  }, [bannerDesc]);

  useEffect(() => {
    safeStorage.setItem('homeli_banner_overlay_col', bannerOverlayCol);
  }, [bannerOverlayCol]);

  useEffect(() => {
    safeStorage.setItem('homeli_banner_overlay_opacity', String(bannerOverlayOpacity));
  }, [bannerOverlayOpacity]);

  // Progressive Web App Installation states
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallInstructions, setShowInstallInstructions] = useState(false);

  useEffect(() => {
    if (currentUser) {
      safeStorage.setItem('homeli_current_user', JSON.stringify(currentUser));
    } else {
      safeStorage.removeItem('homeli_current_user');
    }
  }, [currentUser]);

  // Navigation guard to ensure only registered users can access panels (landing page and AR QR deep links are public)
  useEffect(() => {
    let hasArProduct = false;
    try {
      hasArProduct = new URL(window.location.href).searchParams.has('ar_product');
    } catch (e) {
      console.warn("Failed to read search params in nav guard", e);
    }
    if (activeSection !== 'home' && activeSection !== 'landing' && !hasArProduct && !currentUser) {
      setActiveSection('home');
      setShowAuthModal(true);
      handleAddNotification(
        '🔒 Acceso Restringido',
        'Debes iniciar sesión o registrar tu cuenta para poder ingresar a los paneles de gestión.',
        'Todos',
        'sistema'
      );
    }
  }, [activeSection, currentUser]);

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

  // Sync and load initial workspace data from Supabase if connected
  useEffect(() => {
    if (isSupabaseConfigured) {
      const initLoad = async () => {
        try {
          const loadedBiz = await fetchBusinessesFromSupabase();
          if (loadedBiz) setBusinesses(loadedBiz);

          const loadedSrv = await fetchServicesFromSupabase();
          if (loadedSrv) setServices(loadedSrv);

          const loadedProd = await fetchProductsFromSupabase();
          if (loadedProd) {
            const mergedProd = loadedProd.map((p: ProductItem) => {
              const match = initialProducts.find(init => init.id === p.id || (p.sku && init.sku === p.sku));
              if (match) {
                return {
                  ...p,
                  name: match.name,
                  description: match.description,
                  imageUrl: match.imageUrl,
                  glbUrl: p.glbUrl || match.glbUrl,
                  usdzUrl: p.usdzUrl || match.usdzUrl,
                  price: match.price !== undefined ? match.price : p.price,
                };
              }
              return p;
            });

            // Preserve initial products (e.g. SHO-001) if they do not exist in the Supabase database yet
            const missingInitial = initialProducts.filter(
              init => !loadedProd.some((p: ProductItem) => p.id === init.id || (p.sku && p.sku === init.sku))
            );

            setProducts([...mergedProd, ...missingInitial]);
          }

          const loadedOrders = await fetchOrdersFromSupabase();
          if (loadedOrders) setOrders(loadedOrders);

          const loadedLogs = await fetchAuditLogsFromSupabase();
          if (loadedLogs) setLogs(loadedLogs);

          const loadedProfiles = await fetchProfilesFromSupabase();
          if (loadedProfiles && loadedProfiles.length > 0) setProfiles(loadedProfiles);

          onAddLog('Sincronización Cloud exitosa: Datos cargados desde Supabase en vivo', 'info');
        } catch (e) {
          console.error("Supabase load failed:", e);
        }
      };
      initLoad();
    }
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
    if (isSupabaseConfigured) {
      saveAuditLogToSupabase(newLog);
    }
  };

  // State Management Handlers
  const handleAddUser = (user: UserProfile) => {
    setProfiles(prev => [...prev, user]);
    if (isSupabaseConfigured) {
      saveProfileToSupabase(user);
    }
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    const newLog: SystemLog = {
      id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString(),
      actor: user.name,
      role: user.role,
      action: `Inicio de sesión exitoso como ${user.role}`,
      severity: 'info'
    };
    setLogs(prev => [newLog, ...prev]);
    if (isSupabaseConfigured) {
      saveAuditLogToSupabase(newLog);
    }
    
    // Set active section matching their role automatically
    if (user.role === 'Administrador') {
      setActiveSection('admin');
    } else if (user.role === 'Servicios') {
      setActiveSection('servicios');
    } else if (user.role === 'Ventas') {
      setActiveSection('ventas');
    } else if (user.role === 'Mensajería') {
      setActiveSection('mensajeria');
    } else if (user.role === 'Negocio') {
      setActiveSection('negocios');
    }
    
    handleAddNotification(
      '🔑 Acceso Concedido',
      `¡Bienvenido de vuelta, ${user.name}! Iniciaste sesión como ${user.role}.`,
      user.role,
      'sistema'
    );
  };

  const handleRegisterSuccess = (user: UserProfile) => {
    handleAddUser(user);
    setCurrentUser(user);
    
    const newLog: SystemLog = {
      id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString(),
      actor: user.name,
      role: user.role,
      action: `Nuevo usuario registrado e inicio de sesión automático: ${user.name} (${user.role})`,
      severity: 'info'
    };
    setLogs(prev => [newLog, ...prev]);
    if (isSupabaseConfigured) {
      saveAuditLogToSupabase(newLog);
    }

    // Direct routing
    if (user.role === 'Administrador') {
      setActiveSection('admin');
    } else if (user.role === 'Servicios') {
      setActiveSection('servicios');
    } else if (user.role === 'Ventas') {
      setActiveSection('ventas');
    } else if (user.role === 'Mensajería') {
      setActiveSection('mensajeria');
    } else if (user.role === 'Negocio') {
      setActiveSection('negocios');
    }

    handleAddNotification(
      '🌟 Nueva Cuenta Creada',
      `¡Felicidades, ${user.name}! Tu cuenta de ${user.role} se ha registrado exitosamente.`,
      user.role,
      'registro'
    );
  };

  const handleLogout = () => {
    if (currentUser) {
      const uName = currentUser.name;
      const uRole = currentUser.role;
      setCurrentUser(null);
      
      const newLog: SystemLog = {
        id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
        timestamp: new Date().toISOString(),
        actor: uName,
        role: uRole,
        action: `Cierre de sesión seguro realizado`,
        severity: 'info'
      };
      setLogs(prev => [newLog, ...prev]);
      if (isSupabaseConfigured) {
        saveAuditLogToSupabase(newLog);
      }
      
      setActiveSection('home');
      handleAddNotification(
        '🔒 Sesión Cerrada',
        `Has cerrado sesión de manera segura. ¡Hasta pronto, ${uName}!`,
        'Todos',
        'sistema'
      );
    }
  };

  const handleClearLogs = () => {
    setLogs([]);
    onAddLog('Bitácora de eventos limpiada por el administrador', 'warning');
  };

  const handleAddService = (service: ServiceRequest) => {
    setServices(prev => [service, ...prev]);
    if (isSupabaseConfigured) {
      saveServiceToSupabase(service);
    }
    handleAddNotification(
      'Nuevo Servicio de Limpieza',
      `El cliente ${service.clientName} ha solicitado: ${service.serviceType}. Costo: $${service.price} MXN.`,
      'Administrador',
      'sistema',
      service.id
    );
    handleAddNotification(
      'Nueva Tarea de Limpieza',
      `Se agendó la limpieza de ${service.serviceType} para ${service.clientName}. Dirección: ${service.address}.`,
      'Servicios',
      'sistema',
      service.id
    );
  };

  const handleUpdateServiceStatus = (id: string, status: ServiceStatus) => {
    setServices(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, status } : s);
      const service = updated.find(s => s.id === id);
      if (service && isSupabaseConfigured) {
        saveServiceToSupabase(service);
      }
      return updated;
    });
    onAddLog(`Estado del servicio ${id} modificado a: ${status.toUpperCase()}`, 'info');

    // Retrieve service metadata from current state for rich notification context
    const currentService = services.find(s => s.id === id);
    if (currentService) {
      const statusLabels = {
        programado: 'Programado',
        en_progreso: 'En Ruta',
        completado: 'Completado',
        cancelado: 'Cancelado'
      };
      const label = statusLabels[status] || status;
      
      // Alert the Cliente!
      handleAddNotification(
        `Servicio ${label}`,
        `Tu solicitud de limpieza para [${currentService.serviceType}] se encuentra ahora: ${label.toUpperCase()}.`,
        'Cliente',
        status === 'completado' ? 'entrega' : 'sistema',
        id
      );
      
      // Alert the Administrador!
      handleAddNotification(
        `Servicio Actualizado (${id})`,
        `El especialista cambió la orden del cliente ${currentService.clientName} a: ${label.toUpperCase()}.`,
        'Administrador',
        status === 'completado' ? 'entrega' : 'sistema',
        id
      );
    }
  };

  const handleAddProduct = (product: ProductItem) => {
    setProducts(prev => [product, ...prev]);
    if (isSupabaseConfigured) {
      saveProductToSupabase(product);
    }
    onAddLog(`Producto agregado al inventario: ${product.name} en ${product.category}`, 'info');
  };

  const handleUpdateProduct = (updated: ProductItem) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    if (isSupabaseConfigured) {
      saveProductToSupabase(updated);
    }
    onAddLog(`Producto actualizado en inventario: ${updated.name}`, 'info');
  };

  const handleDeleteProduct = (id: string) => {
    const p = products.find(prod => prod.id === id);
    const pName = p ? p.name : id;
    setProducts(prev => prev.filter(prod => prod.id !== id));
    if (isSupabaseConfigured) {
      deleteProductFromSupabase(id);
    }
    onAddLog(`Producto eliminado del inventario: ${pName}`, 'warning');
  };

  const handleUpdateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => {
      const updated = prev.map(o => o.id === id ? { ...o, status } : o);
      const order = updated.find(o => o.id === id);
      if (order && isSupabaseConfigured) {
        saveOrderToSupabase(order);
      }
      return updated;
    });
    onAddLog(`Estado de orden comercial ${id} modificado a: ${status.toUpperCase()}`, 'info');
  };

  const handleUpdateCourier = (updated: CourierProfile) => {
    setCouriers(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const handleUpdateOrderDelivery = (id: string, deliveryStatus: DeliveryStatus, courierId?: string) => {
    let affectedOrder: SalesOrder | undefined;
    setOrders(prev => {
      const updated = prev.map(o => {
        if (o.id === id) {
          const u = { ...o, deliveryStatus };
          if (courierId !== undefined) {
            u.deliveryCourierId = courierId;
          }
          // Link with SalesOrder standard order status
          if (deliveryStatus === 'delivered') {
            u.status = 'entregado';
          } else if (['accepted', 'collected', 'in_transit', 'with_customer'].includes(deliveryStatus)) {
            u.status = 'enviado';
          }
          affectedOrder = u;
          return u;
        }
        return o;
      });
      if (affectedOrder && isSupabaseConfigured) {
        saveOrderToSupabase(affectedOrder);
      }
      return updated;
    });

    // Trigger Notifications & logs based on the transition!
    setTimeout(() => {
      if (affectedOrder) {
        const targetCourier = couriers.find(c => c.id === (courierId || affectedOrder?.deliveryCourierId));
        const name = targetCourier ? targetCourier.name : 'Mensajero Homeli';
        
        switch (deliveryStatus) {
          case 'assigned':
            handleAddNotification(
              '🚴 Pedido Listo en Despacho',
              `El pedido ${id} ha sido asignado al repartidor ${name}. Esperando aceptación.`,
              'Mensajería',
              'asignacion',
              id
            );
            break;
          case 'launched':
            handleAddNotification(
              '🚀 Pedido en Bolsa Pública',
              `El pedido ${id} se liberó y está disponible para que cualquier mensajero lo acepte.`,
              'Mensajería',
              'asignacion',
              id
            );
            break;
          case 'accepted':
            handleAddNotification(
              '👍 Entrega Aceptada',
              `El repartidor ${name} ha ACEPTADO entregar el pedido ${id}. Procediendo a recolectar productos.`,
              'Administrador',
              'mensajeria',
              id
            );
            break;
          case 'collected':
            handleAddNotification(
              '🛍️ Productos Recolectados',
              `El repartidor ${name} recolectó con éxito los productos de la orden ${id} en almacén.`,
              'Administrador',
              'mensajeria',
              id
            );
            break;
          case 'in_transit':
            handleAddNotification(
              '🚀 Pedido en Camino',
              `¡Buenas noticias! Tu pedido ${id} está en camino de entrega a las manos de ${affectedOrder?.customerName}.`,
              'Cliente',
              'mensajeria',
              id
            );
            break;
          case 'with_customer':
            handleAddNotification(
              '📍 Mensajero en Domicilio',
              `El repartidor ${name} se encuentra en el domicilio de ${affectedOrder?.customerName} listo para efectuar la entrega de ${id}.`,
              'Cliente',
              'mensajeria',
              id
            );
            break;
          case 'delivered':
            // Trigger BOTH Admin and Client confirmations!
            handleAddNotification(
              '🎉 ¡Pedido Entregado con Éxito!',
              `¡Felicidades! Se ha confirmado la entrega del pedido ${id} por el mensajero ${name}. El cliente recibió y firmó.`,
              'Administrador',
              'entrega',
              id
            );
            handleAddNotification(
              '📦 Confirmación de Entrega',
              `¡Tu pedido ${id} ha sido entregado exitosamente por nuestro repartidor ${name}! Gracias por elegir nuestra marca.`,
              'Cliente',
              'entrega',
              id
            );
            // Increment courier metrics in our parent state safely
            if (targetCourier) {
              setCouriers(prev => prev.map(c => c.id === targetCourier.id ? {
                ...c,
                completedDeliveries: (c.completedDeliveries || 0) + 1,
                earnings: (c.earnings || 0) + 120
              } : c));
            }
            break;
        }
      }
    }, 100);
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
    safeStorage.removeItem('homeli_services');
    safeStorage.removeItem('homeli_products');
    safeStorage.removeItem('homeli_orders');
    safeStorage.removeItem('homeli_logs');
    safeStorage.removeItem('homeli_profiles');
    safeStorage.removeItem('homeli_couriers');
    safeStorage.removeItem('homeli_businesses');
    safeStorage.removeItem('homeli_my_business_id');
    safeStorage.removeItem('homeli_notifications');
    safeStorage.removeItem('homeli_admin_active_tab');
    safeStorage.removeItem('homeli_active_section');
    safeStorage.removeItem('homeli_banner_bg');
    safeStorage.removeItem('homeli_banner_title');
    safeStorage.removeItem('homeli_banner_tag');
    safeStorage.removeItem('homeli_banner_desc');
    safeStorage.removeItem('homeli_banner_overlay_col');
    safeStorage.removeItem('homeli_banner_overlay_opacity');
    
    // Perform hard reload to ensure all static files and memory is completely cleansed
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-natural-bg text-natural-text flex flex-col justify-between" id="master_app_container">
      
      {/* Main Core Layout */}
      <div className="flex flex-col flex-1" id="core_layout">

        {/* Master Top Header Navigation Bar */}
        {activeSection !== 'home' && activeSection !== 'ventas' && (
          <header className="glass-nav border-b border-slate-200/80 py-2.5 px-4 sm:px-6 flex justify-between items-center shadow-xs sticky top-0 z-40" id="header_navbar">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveSection('home')}>
              <img 
                src="https://cossma.com.mx/homeli.jpg" 
                alt="Homeli Logo Banner" 
                className="h-10 sm:h-12 w-auto object-contain block transition-all hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="hidden xs:block">
                <h2 className="text-base font-bold font-serif tracking-tight text-slate-900 leading-none">Homeli</h2>
                <span className="text-[10px] text-[#c5a85c] font-black uppercase tracking-wider">SuperApp</span>
              </div>
            </div>

            {/* Navigational shortcuts when active section is loaded */}
            <div className="flex items-center gap-2">
              {activeSection === 'admin' ? (
                <div className="relative" id="admin_hamburger_menu_wrapper">
                  <button
                    onClick={() => setShowAdminHamburgerDropdown(prev => !prev)}
                    className="p-2 sm:px-3.5 sm:py-2 text-slate-800 hover:bg-slate-50 border border-slate-200 bg-white rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer font-black text-xs"
                    id="admin_hamburger_btn"
                  >
                    <Menu size={18} className="text-[#c5a85c]" />
                    <span className="hidden sm:inline font-sans text-xs font-black uppercase text-slate-600 tracking-wider">Menú del Sistema</span>
                  </button>

                  <AnimatePresence>
                    {showAdminHamburgerDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-3 space-y-1.5 text-left"
                        id="admin_hamburger_nav_dropdown"
                      >
                        <div className="px-3 py-1.5 text-xs uppercase tracking-wider font-black text-slate-500 border-b border-slate-100 mb-1">
                          🛠️ Administración
                        </div>

                        <button
                          onClick={() => {
                            setAdminActiveTab('metrics');
                            setShowAdminHamburgerDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                            adminActiveTab === 'metrics'
                              ? 'bg-[#c5a85c]/10 text-[#a38439]'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-base">📈</span>
                            <span>Métricas del Negocio</span>
                          </span>
                          {adminActiveTab === 'metrics' && <span className="w-2 h-2 rounded-full bg-[#c5a85c]" />}
                        </button>

                        <button
                          onClick={() => {
                            setAdminActiveTab('ecommerce');
                            setShowAdminHamburgerDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                            adminActiveTab === 'ecommerce'
                              ? 'bg-[#c5a85c]/10 text-[#a38439]'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-base">🛍️</span>
                            <span>Catálogo de E-Commerce</span>
                          </span>
                          {adminActiveTab === 'ecommerce' && <span className="w-2 h-2 rounded-full bg-[#c5a85c]" />}
                        </button>

                        <button
                          onClick={() => {
                            setAdminActiveTab('entrega_agenda');
                            setShowAdminHamburgerDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                            adminActiveTab === 'entrega_agenda'
                              ? 'bg-[#c5a85c]/10 text-[#a38439]'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-base">📅</span>
                            <span>Entregas y Agenda</span>
                          </span>
                          {adminActiveTab === 'entrega_agenda' && <span className="w-2 h-2 rounded-full bg-[#c5a85c]" />}
                        </button>

                        <button
                          onClick={() => {
                            setAdminActiveTab('entrega_mensajeros');
                            setShowAdminHamburgerDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                            adminActiveTab === 'entrega_mensajeros'
                              ? 'bg-[#c5a85c]/10 text-[#a38439]'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-base">👥</span>
                            <span>Gestión de Mensajeros</span>
                          </span>
                          {adminActiveTab === 'entrega_mensajeros' && <span className="w-2 h-2 rounded-full bg-[#c5a85c]" />}
                        </button>

                        <button
                          onClick={() => {
                            setAdminActiveTab('servicios_control');
                            setShowAdminHamburgerDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                            adminActiveTab === 'servicios_control'
                              ? 'bg-[#c5a85c]/10 text-[#a38439]'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-base">✨</span>
                            <span>Control de Servicios</span>
                          </span>
                          {adminActiveTab === 'servicios_control' && <span className="w-2 h-2 rounded-full bg-[#c5a85c]" />}
                        </button>

                        <button
                          onClick={() => {
                            setAdminActiveTab('negocios_control');
                            setShowAdminHamburgerDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                            adminActiveTab === 'negocios_control'
                              ? 'bg-[#c5a85c]/10 text-[#a38439]'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-base">🏢</span>
                            <span>Gestión de Negocios</span>
                          </span>
                          {adminActiveTab === 'negocios_control' && <span className="w-2 h-2 rounded-full bg-[#c5a85c]" />}
                        </button>

                        <div className="border-t border-slate-100 my-1 pt-1.5">
                          <button
                            onClick={() => {
                              setActiveSection('home');
                              setShowAdminHamburgerDropdown(false);
                            }}
                            className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition flex items-center gap-2 cursor-pointer"
                          >
                            <Home size={15} />
                            <span>Selector de Roles (Inicio)</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setActiveSection('home')}
                    className="px-3 py-1.5 text-xs text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    id="btn_nav_back_home"
                  >
                    <Home size={14} className="text-[#c5a85c]" />
                    <span className="hidden sm:inline">Selector Roles</span>
                  </button>
                  
                  {/* Desktop Shortcuts in Header */}
                  <div className="hidden lg:flex rounded-xl bg-slate-100/80 p-1 border border-slate-200/80 gap-1" id="navbar_shortcuts">
                    <button 
                      onClick={() => setActiveSection('landing')}
                      className={`px-3 py-1 text-[11px] font-bold rounded-lg transition cursor-pointer ${activeSection === 'landing' ? 'bg-[#c5a85c] text-white' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      ⭐ Landing
                    </button>
                    <button 
                      onClick={() => setActiveSection('admin')}
                      className={`px-3 py-1 text-[11px] font-bold rounded-lg transition cursor-pointer ${activeSection === 'admin' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      Admin
                    </button>
                    <button 
                      onClick={() => setActiveSection('servicios')}
                      className={`px-3 py-1 text-[11px] font-bold rounded-lg transition cursor-pointer ${activeSection === 'servicios' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      Servicios
                    </button>
                    <button 
                      onClick={() => setActiveSection('ventas')}
                      className={`px-3 py-1 text-[11px] font-bold rounded-lg transition cursor-pointer ${activeSection === 'ventas' ? 'bg-indigo-700 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      Ventas
                    </button>
                    <button 
                      onClick={() => setActiveSection('mensajeria')}
                      className={`px-3 py-1 text-[11px] font-bold rounded-lg transition cursor-pointer ${activeSection === 'mensajeria' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      Mensajería
                    </button>
                    <button 
                      onClick={() => setActiveSection('negocios')}
                      className={`px-3 py-1 text-[11px] font-bold rounded-lg transition cursor-pointer ${activeSection === 'negocios' ? 'bg-[#c5a85c] text-white' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      Negocios
                    </button>
                  </div>
                </>
              )}

              {/* User Session Pill or Iniciar Sesión Button */}
              {currentUser ? (
                <div className="flex items-center gap-2 border border-slate-200/90 bg-white rounded-xl px-2.5 py-1.5 shadow-2xs" id="user_session_pill">
                  <div className="w-6 h-6 bg-[#c5a85c] text-white rounded-lg flex items-center justify-center text-xs font-black select-none shadow-2xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-[10px] font-black text-slate-800 leading-none">{currentUser.name}</p>
                    <p className="text-[8px] font-bold text-slate-500 leading-none mt-0.5">{currentUser.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition"
                    title="Cerrar sesión"
                    id="header_logout_btn"
                  >
                    <span className="text-xs">🚪</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-3.5 py-1.5 bg-[#c5a85c] hover:bg-[#b59549] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  id="header_login_btn"
                >
                  <span>Acceder</span>
                </button>
              )}

              {/* Universal Bell Notification Button inside Master Header */}
              <button
                onClick={() => setIsNotificationPanelOpen(true)}
                className="relative p-2.5 hover:bg-slate-50 border border-slate-200 bg-white rounded-xl shadow-2xs transition cursor-pointer text-slate-700 hover:text-[#c5a85c] focus:outline-none"
                id="master_header_bell_btn"
                title={`${notifications.filter(n => !n.read).length} Notificaciones sin leer`}
              >
                <Bell size={18} className={notifications.filter(n => !n.read).length > 0 ? "text-[#c5a85c]" : "text-slate-600"} />
                
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white font-extrabold text-[9px] rounded-full flex items-center justify-center animate-pulse border-2 border-white">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>

            </div>
          </header>
        )}

        {/* Dynamic Page Views Body */}
        <main className={activeSection === 'mensajeria' ? 'flex-1 w-full bg-[#f8fafc]' : 'flex-1 p-3 sm:p-6 lg:p-8 max-w-[1650px] w-full mx-auto'} id="main_layout_body">
          <AnimatePresence mode="wait">
            {activeSection === 'home' ? (
              <motion.div
                key="home_entry_selection"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex flex-col items-center justify-between min-h-[82vh] py-6 px-4 space-y-8 bg-gradient-to-b from-[#eef0fc] via-[#f4f6fe] to-[#e7eafc] rounded-3xl border border-slate-200/80 shadow-xs relative overflow-hidden"
                id="home_content"
              >
                {/* Subtle Ambient Background Light Glows */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#c5a85c]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Top Spacer or User Welcome Tag */}
                <div className="w-full max-w-sm flex justify-center z-10">
                  {currentUser ? (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3 px-4 w-full text-center shadow-xs flex items-center justify-between gap-2"
                      id="home_welcome_box"
                    >
                      <div className="flex items-center gap-2 text-left min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                        <div className="truncate">
                          <p className="text-[11px] font-extrabold text-slate-800 truncate">
                            {currentUser.name}
                          </p>
                          <span className="text-[9px] text-[#a38439] font-bold uppercase tracking-wider block">
                            {currentUser.role}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            if (currentUser.role === 'Administrador') setActiveSection('admin');
                            else if (currentUser.role === 'Servicios') setActiveSection('servicios');
                            else if (currentUser.role === 'Ventas') setActiveSection('ventas');
                            else if (currentUser.role === 'Mensajería') setActiveSection('mensajeria');
                            else if (currentUser.role === 'Negocio') setActiveSection('negocios');
                          }}
                          className="px-3 py-1.5 bg-[#c5a85c] hover:bg-[#b59549] text-white text-[10px] font-extrabold rounded-xl transition shadow-xs cursor-pointer"
                          id="btn_home_goto_dashboard"
                        >
                          Ir a Panel
                        </button>
                        <button
                          onClick={handleLogout}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-red-50 text-red-600 border border-slate-200 text-[10px] font-extrabold rounded-xl transition cursor-pointer"
                          id="btn_home_logout"
                        >
                          Salir
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Homeli • Servicios de Estilo de Vida
                    </span>
                  )}
                </div>

                {/* Hero Centered Brand Logo - Identical to Image */}
                <div className="flex flex-col items-center justify-center text-center space-y-2 z-10 my-auto py-6" id="minimalist_home_brand">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="p-4 sm:p-6 bg-white/80 backdrop-blur-md border border-slate-200/90 rounded-3xl shadow-sm inline-block transform hover:scale-105 transition-transform"
                  >
                    <img 
                      src="https://cossma.com.mx/homeli.jpg" 
                      alt="Homeli - Servicios de Estilo de Vida" 
                      className="w-56 sm:w-80 h-auto object-contain block max-h-[220px] sm:max-h-[280px]"
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                </div>

                {/* 3 Main Action Buttons - Matching Reference Image */}
                <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center space-y-3 z-10 pt-2" id="home_auth_cta_panel">
                  {/* Button 1: Iniciar sesión (Navy Blue Pill) */}
                  <button
                    onClick={() => {
                      setAuthModalMode('login');
                      setShowAuthModal(true);
                    }}
                    className="w-full py-3.5 sm:py-4 px-6 bg-[#0c1838] hover:bg-[#152243] active:scale-[0.98] text-white font-black text-sm sm:text-base rounded-2xl shadow-md transition-all duration-200 cursor-pointer tracking-wide flex items-center justify-center gap-2 border border-slate-800"
                    id="btn_home_iniciar_sesion"
                  >
                    <span>Iniciar sesión</span>
                  </button>

                  {/* Button 2: Crear cuenta (White with Gold Border & Text) */}
                  <button
                    onClick={() => {
                      setAuthModalMode('register');
                      setShowAuthModal(true);
                    }}
                    className="w-full py-3.5 sm:py-4 px-6 bg-white hover:bg-amber-50/50 active:scale-[0.98] text-[#a38439] font-black text-sm sm:text-base rounded-2xl border-2 border-[#d0b06b]/70 hover:border-[#c5a85c] shadow-xs transition-all duration-200 cursor-pointer tracking-wide flex items-center justify-center gap-2"
                    id="btn_home_crear_cuenta"
                  >
                    <span>Crear cuenta</span>
                  </button>

                  {/* Button 3: Saltar por ahora (Text Link) */}
                  <button
                    onClick={() => {
                      setShowGuestModules(prev => !prev);
                      const el = document.getElementById('three_roles_access_grid');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="pt-2 text-xs sm:text-sm font-extrabold text-[#0c1838] hover:text-[#c5a85c] transition cursor-pointer hover:underline tracking-wide"
                    id="btn_home_saltar_ahora"
                  >
                    {showGuestModules ? 'Ocultar accesos directos ↑' : 'Saltar por ahora'}
                  </button>
                </div>

                {/* Secondary Modules Grid (Shown on demand or below) */}
                <AnimatePresence>
                  {(showGuestModules || currentUser) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="w-full pt-8 border-t border-slate-200/80 space-y-6 z-10"
                    >
                      <div className="text-center space-y-1">
                        <span className="px-3 py-1 bg-[#c5a85c]/10 text-[#a38439] rounded-full text-[10px] font-black uppercase tracking-widest inline-block border border-[#c5a85c]/20">
                          Panel de Módulos Unificados
                        </span>
                        <h2 className="text-sm font-bold text-slate-800">
                          Selecciona un rol o módulo para ingresar directamente
                        </h2>
                      </div>

                      {/* Interactive 6 Modules Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-5xl w-full mx-auto px-2" id="three_roles_access_grid">
                        {/* Category 1: Admin */}
                        <motion.div
                          whileHover={{ y: -3, scale: 1.02 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => {
                            if (!currentUser) {
                              setAuthModalMode('login');
                              setShowAuthModal(true);
                              handleAddNotification(
                                '🔒 Acceso Restringido',
                                'Debes iniciar sesión para poder ingresar al Panel de Administración.',
                                'Todos',
                                'sistema'
                              );
                              return;
                            }
                            setActiveSection('admin');
                            onAddLog('Acceso autorizado a Panel de Administración', 'info');
                          }}
                          className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-col items-center text-center gap-2 cursor-pointer shadow-2xs hover:shadow-md hover:border-[#c5a85c]/60 transition-all duration-200 group relative overflow-hidden"
                          id="access_entry_admin"
                        >
                          <div className="w-12 h-12 bg-[#c5a85c] rounded-2xl flex items-center justify-center text-white shadow-xs group-hover:bg-[#b59549] transition-all">
                            <ShieldAlert size={22} />
                          </div>
                          <div>
                            <span className="text-xs font-extrabold text-slate-900 block group-hover:text-[#c5a85c] transition-colors">Admin</span>
                            <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">Control Master</span>
                          </div>
                        </motion.div>

                        {/* Category 2: Servicios */}
                        <motion.div
                          whileHover={{ y: -3, scale: 1.02 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => {
                            if (!currentUser) {
                              setAuthModalMode('login');
                              setShowAuthModal(true);
                              handleAddNotification(
                                '🔒 Acceso Restringido',
                                'Debes iniciar sesión para poder ingresar al Panel de Servicios.',
                                'Todos',
                                'sistema'
                              );
                              return;
                            }
                            setActiveSection('servicios');
                            onAddLog('Acceso autorizado a Panel de Operaciones de Servicios', 'info');
                          }}
                          className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-col items-center text-center gap-2 cursor-pointer shadow-2xs hover:shadow-md hover:border-emerald-600/60 transition-all duration-200 group relative overflow-hidden"
                          id="access_entry_servicios"
                        >
                          <div className="w-12 h-12 bg-emerald-700 rounded-2xl flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-800 transition-all">
                            <Wrench size={22} />
                          </div>
                          <div>
                            <span className="text-xs font-extrabold text-slate-900 block group-hover:text-emerald-700 transition-colors">Servicios</span>
                            <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">Limpieza & Citas</span>
                          </div>
                        </motion.div>

                        {/* Category 3: Ventas */}
                        <motion.div
                          whileHover={{ y: -3, scale: 1.02 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => {
                            if (!currentUser) {
                              setAuthModalMode('login');
                              setShowAuthModal(true);
                              handleAddNotification(
                                '🔒 Acceso Restringido',
                                'Debes iniciar sesión para poder ingresar al Panel de Ventas.',
                                'Todos',
                                'sistema'
                              );
                              return;
                            }
                            setActiveSection('ventas');
                            onAddLog('Acceso autorizado a Consola de E-commerce y Ventas', 'info');
                          }}
                          className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-col items-center text-center gap-2 cursor-pointer shadow-2xs hover:shadow-md hover:border-indigo-600/60 transition-all duration-200 group relative overflow-hidden"
                          id="access_entry_ventas"
                        >
                          <div className="w-12 h-12 bg-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-800 transition-all">
                            <ShoppingBag size={22} />
                          </div>
                          <div>
                            <span className="text-xs font-extrabold text-slate-900 block group-hover:text-indigo-700 transition-colors">Ventas</span>
                            <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">E-Commerce & RA</span>
                          </div>
                        </motion.div>

                        {/* Category 4: Mensajería */}
                        <motion.div
                          whileHover={{ y: -3, scale: 1.02 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => {
                            if (!currentUser) {
                              setAuthModalMode('login');
                              setShowAuthModal(true);
                              handleAddNotification(
                                '🔒 Acceso Restringido',
                                'Debes iniciar sesión para poder ingresar al Panel de Mensajería.',
                                'Todos',
                                'sistema'
                              );
                              return;
                            }
                            setActiveSection('mensajeria');
                            onAddLog('Acceso autorizado a Consola de Reparto y Mensajería', 'info');
                          }}
                          className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-col items-center text-center gap-2 cursor-pointer shadow-2xs hover:shadow-md hover:border-amber-600/60 transition-all duration-200 group relative overflow-hidden"
                          id="access_entry_mensajeria"
                        >
                          <div className="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center text-white shadow-xs group-hover:bg-amber-700 transition-all">
                            <Bike size={22} />
                          </div>
                          <div>
                            <span className="text-xs font-extrabold text-slate-900 block group-hover:text-amber-600 transition-colors">Mensajería</span>
                            <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">Repartos & Entregas</span>
                          </div>
                        </motion.div>

                        {/* Category 5: Negocios */}
                        <motion.div
                          whileHover={{ y: -3, scale: 1.02 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => {
                            if (!currentUser) {
                              setAuthModalMode('login');
                              setShowAuthModal(true);
                              handleAddNotification(
                                '🔒 Acceso Restringido',
                                'Debes iniciar sesión para poder ingresar al Panel de Negocios.',
                                'Todos',
                                'sistema'
                              );
                              return;
                            }
                            setActiveSection('negocios');
                            onAddLog('Acceso autorizado a Panel de Negocios y Patrocinadores', 'info');
                          }}
                          className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-col items-center text-center gap-2 cursor-pointer shadow-2xs hover:shadow-md hover:border-slate-700/60 transition-all duration-200 group relative overflow-hidden"
                          id="access_entry_negocios"
                        >
                          <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-white shadow-xs group-hover:bg-slate-900 transition-all">
                            <Building size={22} />
                          </div>
                          <div>
                            <span className="text-xs font-extrabold text-slate-900 block group-hover:text-slate-800 transition-colors">Negocios</span>
                            <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">Socios Comerciales</span>
                          </div>
                        </motion.div>

                        {/* Category 6: Landing Page */}
                        <motion.div
                          whileHover={{ y: -3, scale: 1.02 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => {
                            setActiveSection('landing');
                            onAddLog('Acceso a Landing Page de captación pública', 'info');
                          }}
                          className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-col items-center text-center gap-2 cursor-pointer shadow-2xs hover:shadow-md hover:border-emerald-500/60 transition-all duration-200 group relative overflow-hidden"
                          id="access_entry_landing"
                        >
                          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-700 transition-all relative">
                            <Sparkles size={22} className="animate-pulse" />
                            <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase">PÚB</span>
                          </div>
                          <div>
                            <span className="text-xs font-extrabold text-slate-900 block group-hover:text-emerald-600 transition-colors">Landing</span>
                            <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">Sitio Público</span>
                          </div>
                        </motion.div>
                      </div>

                      {/* Utility Action Buttons: PWA Installation and Clear Cache */}
                      <div className="pt-2 w-full flex flex-col sm:flex-row justify-center items-center gap-2.5" id="minimalist_pwa_installer_container">
                        <button
                          onClick={triggerPWAInstall}
                          className="py-2 px-5 bg-[#c5a85c] hover:bg-[#b59549] text-white font-extrabold rounded-xl transition text-[11px] flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs uppercase tracking-wider w-full sm:w-auto"
                          id="btn_home_llamativo_install"
                        >
                          <Download size={14} />
                          <span>Instalar Aplicación</span>
                        </button>

                        <button
                          onClick={handleClearCache}
                          className="py-2 px-5 bg-white hover:bg-slate-50 text-slate-700 font-extrabold rounded-xl transition text-[11px] flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 shadow-2xs uppercase tracking-wider w-full sm:w-auto"
                          id="btn_home_clear_cache"
                        >
                          <RefreshCw size={13} className="text-[#c5a85c]" />
                          <span>Borrar Caché</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
                        {activeSection === 'admin' ? 'Administrador' : activeSection === 'servicios' ? 'Servicios' : activeSection === 'mensajeria' ? 'Mensajería' : activeSection === 'negocios' ? 'Socios Negocios' : activeSection === 'landing' ? 'Página Principal' : 'Ventas Ecommerce'}
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
                    couriers={couriers}
                    businesses={businesses}
                    onUpdateBusiness={handleUpdateBusiness}
                    onDeleteBusiness={handleDeleteBusiness}
                    onAddUser={handleAddUser}
                    onAddLog={onAddLog}
                    onClearLogs={handleClearLogs}
                    onAddProduct={handleAddProduct}
                    onUpdateProduct={handleUpdateProduct}
                    onDeleteProduct={handleDeleteProduct}
                    onUpdateCourier={handleUpdateCourier}
                    onUpdateOrderDelivery={handleUpdateOrderDelivery}
                    bannerBg={bannerBg}
                    bannerTitle={bannerTitle}
                    bannerTag={bannerTag}
                    bannerDesc={bannerDesc}
                    bannerOverlayCol={bannerOverlayCol}
                    bannerOverlayOpacity={bannerOverlayOpacity}
                    onUpdateBannerSettings={(bg: string, title: string, tag: string, desc: string, overlayCol: string, overlayOpacity: number) => {
                      setBannerBg(bg);
                      setBannerTitle(title);
                      setBannerTag(tag);
                      setBannerDesc(desc);
                      setBannerOverlayCol(overlayCol);
                      setBannerOverlayOpacity(overlayOpacity);
                    }}
                    activeTab={adminActiveTab}
                    onChangeTab={setAdminActiveTab}
                    onUpdateServiceStatus={handleUpdateServiceStatus}
                  />
                )}

                {activeSection === 'mensajeria' && (
                  <MensajeriaSection 
                    orders={orders}
                    couriers={couriers}
                    onAddCourier={(newCourier) => setCouriers(prev => [newCourier, ...prev])}
                    onUpdateCourier={handleUpdateCourier}
                    onUpdateOrderStatus={(id, deliveryStatus) => handleUpdateOrderDelivery(id, deliveryStatus)}
                    onAddLog={onAddLog}
                    onNavigateToHome={() => setActiveSection('home')}
                    notifications={notifications}
                    onOpenNotifications={() => setIsNotificationPanelOpen(true)}
                  />
                )}

                {activeSection === 'servicios' && (
                  <ServiciosSection 
                    services={services}
                    onAddService={handleAddService}
                    onUpdateServiceStatus={handleUpdateServiceStatus}
                    onAddLog={onAddLog}
                    products={products}
                    businesses={businesses}
                  />
                )}

                {activeSection === 'negocios' && (
                  <NegociosSection 
                    businesses={businesses}
                    onRegisterBusiness={handleRegisterBusiness}
                    onUpdateBusiness={handleUpdateBusiness}
                    onDeleteBusiness={handleDeleteBusiness}
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
                    onAddOrder={(order) => {
                      setOrders(prev => [order, ...prev]);
                      if (isSupabaseConfigured) {
                        saveOrderToSupabase(order);
                      }
                      handleAddNotification(
                        '🛒 Nuevo Pedido Recibido',
                        `¡Pedido ${order.id} registrado por $${order.total.toLocaleString()} MXN! Listo para ser gestionado y asignado en administración.`,
                        'Administrador',
                        'compra',
                        order.id
                      );
                    }}
                    onNavigateToHome={() => setActiveSection('home')}
                    bannerBg={bannerBg}
                    bannerTitle={bannerTitle}
                    bannerTag={bannerTag}
                    bannerDesc={bannerDesc}
                    bannerOverlayCol={bannerOverlayCol}
                    bannerOverlayOpacity={bannerOverlayOpacity}
                    notifications={notifications}
                    onOpenNotifications={() => setIsNotificationPanelOpen(true)}
                  />
                )}

                {activeSection === 'landing' && (
                  <LandingPageSection 
                    products={products}
                    services={services}
                    businesses={businesses}
                    currentUser={currentUser}
                    onAddService={handleAddService}
                    onAddLog={onAddLog}
                    bannerBg={bannerBg}
                    bannerTitle={bannerTitle}
                    bannerTag={bannerTag}
                    bannerDesc={bannerDesc}
                    bannerOverlayCol={bannerOverlayCol}
                    bannerOverlayOpacity={bannerOverlayOpacity}
                    onUpdateBannerSettings={(bg: string, title: string, tag: string, desc: string, overlayCol: string, overlayOpacity: number) => {
                      setBannerBg(bg);
                      setBannerTitle(title);
                      setBannerTag(tag);
                      setBannerDesc(desc);
                      setBannerOverlayCol(overlayCol);
                      setBannerOverlayOpacity(overlayOpacity);
                    }}
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

      {/* Dynamic Slide-Over Notification Drawer (Campanita Panel) */}
      <AnimatePresence>
        {isNotificationPanelOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden" id="notification_drawer_overlay">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsNotificationPanelOpen(false)} />

            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full border-l border-slate-200"
                id="notification_drawer_content"
              >
                {/* Drawer Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#c5a85c] flex items-center justify-center text-white shadow-sm">
                      <BellRing size={20} className="animate-swing" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 leading-snug">Centro de Notificaciones</h3>
                      <p className="text-xs text-[#c5a85c] font-black uppercase tracking-wider mt-0.5 animate-pulse">Sincronización en Directo</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsNotificationPanelOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition text-base outline-none font-bold"
                  >
                    ✕
                  </button>
                </div>

                {/* Notifications Actions */}
                <div className="p-4 bg-slate-105 bg-slate-100/50 border-b border-slate-150 flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-600 font-bold">
                    {notifications.filter(n => !n.read).length} No leídos
                  </span>
                  <button
                    onClick={() => handleClearNotifications()}
                    className="text-xs font-black text-red-600 hover:text-red-700 uppercase tracking-widest flex items-center gap-1 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition"
                  >
                    <Trash2 size={13} />
                    <span>Limpiar Todo</span>
                  </button>
                </div>

                {/* Notifications List Body */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#f8fafc]">
                  {notifications.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-2xl">
                        📭
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-slate-700">Sin notificaciones</p>
                        <p className="text-xs text-slate-500 max-w-[240px] mt-1.5">
                          Todos los flujos cliente-admin-mensajero en tiempo real se desplegarán aquí de forma inmediata.
                        </p>
                      </div>
                    </div>
                  ) : (
                    notifications.map(notif => {
                      let typeLabel = "Sistema";
                      let typeColor = "bg-slate-100 text-slate-800 border-slate-200";
                      let emoji = "🔔";

                      switch (notif.type) {
                        case 'compra':
                          typeLabel = "Venta";
                          typeColor = "bg-green-50 text-green-700 border-green-200";
                          emoji = "🛍️";
                          break;
                        case 'asignacion':
                          typeLabel = "Admin / Asignación";
                          typeColor = "bg-yellow-50 text-yellow-700 border-yellow-200";
                          emoji = "📋";
                          break;
                        case 'mensajeria':
                          typeLabel = "Mensajería Status";
                          typeColor = "bg-blue-50 text-blue-700 border-blue-200";
                          emoji = "🚴";
                          break;
                        case 'registro':
                          typeLabel = "Registro Nuevo";
                          typeColor = "bg-purple-50 text-purple-700 border-purple-200";
                          emoji = "👤";
                          break;
                        case 'entrega':
                          typeLabel = "Entrega Exitosa";
                          typeColor = "bg-emerald-50 text-emerald-800 border-emerald-200";
                          emoji = "✅";
                          break;
                      }

                      return (
                        <div
                          key={notif.id}
                          className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                            notif.read ? 'bg-white border-slate-100 opacity-80' : 'bg-white border-[#c5a85c]/35 shadow-sm ring-1 ring-[#c5a85c]/10'
                          }`}
                          id={`notification_card_${notif.id}`}
                        >
                          <div className="flex gap-3">
                            <div className="text-xl pt-0.5 shrink-0 select-none">
                              {emoji}
                            </div>
                            <div className="space-y-1 w-full min-w-0 text-left">
                              <div className="flex items-center justify-between gap-1.5 flex-wrap">
                                <span className={`text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md border ${typeColor}`}>
                                  {typeLabel}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </span>
                              </div>

                              <h4 className="text-sm font-black text-slate-800 leading-snug">{notif.title}</h4>
                              <p className="text-xs text-slate-600 leading-relaxed break-words pt-1">{notif.message}</p>
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                            <div className="text-[10px] text-slate-500 font-mono">
                              Destino: <strong className="text-slate-700 uppercase text-[10px]">{notif.role}</strong>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0 animate-fadeIn">
                              {!notif.read && (
                                <button
                                  onClick={() => handleMarkNotificationAsRead(notif.id)}
                                  className="p-1 px-2.5 bg-[#c5a85c]/15 hover:bg-[#c5a85c]/25 text-[#a38439] hover:text-[#8e702c] rounded-lg transition text-[10px] font-black uppercase tracking-wider"
                                >
                                  Leído
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteNotification(notif.id)}
                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 rounded-lg transition"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Drawer Footer help */}
                <div className="p-5 border-t border-slate-150 bg-slate-50 text-center">
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                     Flujo Homeli sincronizado. Las órdenes creadas en <strong>Ventas</strong> actualizan inmediatamente a <strong>Admin</strong> y <strong>Mensajería</strong>.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Central Notification Intercepting Big Popup window overlay */}
      <AnimatePresence>
        {activePopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 h-full w-full" id="central_notification_popup_overlay">
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" onClick={() => setActivePopup(null)} />

            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-3xl border-4 border-[#c5a85c] p-6 shadow-2xl text-left space-y-6 overflow-hidden z-50"
              id="central_notification_popup_modal"
            >
              <div className="absolute top-0 right-0 h-2 bg-[#c5a85c] animate-pulse w-full" />
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#c19a45] to-[#ebd39d] flex items-center justify-center text-white shrink-0 text-2xl shadow-md">
                  {activePopup.type === 'compra' ? '🛒' : activePopup.type === 'asignacion' ? '📋' : activePopup.type === 'mensajeria' ? '🚴' : activePopup.type === 'registro' ? '👤' : activePopup.type === 'entrega' ? '✨' : '🔔'}
                </div>

                <div className="space-y-1 w-full min-w-0">
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded font-black text-[9px] uppercase tracking-wider block w-max leading-none">
                     Notificación en Tiempo Real
                  </span>
                  <h3 className="text-base sm:text-lg font-serif font-black text-slate-900 leading-snug">
                    {activePopup.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono leading-none pt-1">
                    {new Date(activePopup.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl text-left">
                <p className="text-xs sm:text-sm text-slate-700 font-bold leading-relaxed">
                  {activePopup.message}
                </p>
              </div>

              {/* Roles Involved Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs border-y border-slate-100 py-3.5 text-left">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-widest">Rol Sincronizado</span>
                  <strong className="text-[#a38439] uppercase text-xs">{activePopup.role}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-widest">Canal</span>
                  <strong className="text-slate-700 uppercase text-xs">{activePopup.type || 'Sistema'}</strong>
                </div>
              </div>

              {/* Popup Action Buttons */}
              <div className="flex gap-2 pt-1 font-bold">
                <button
                  onClick={() => {
                    handleMarkNotificationAsRead(activePopup.id);
                    setActivePopup(null);
                  }}
                  className="flex-1 py-3 bg-[#c5a85c] hover:bg-[#b59549] text-white rounded-xl transition duration-150 text-xs text-center uppercase tracking-wider font-extrabold shadow-sm hover:shadow-md cursor-pointer border border-[#c19a45]/20"
                >
                  Confirmar y Cerrar
                </button>
                <button
                  onClick={() => {
                    handleMarkNotificationAsRead(activePopup.id);
                    setActivePopup(null);
                    setIsNotificationPanelOpen(true);
                  }}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition duration-150 text-xs text-center uppercase tracking-wider font-extrabold cursor-pointer border border-slate-200 font-black"
                >
                  Ver Todo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Access / Registration Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="auth_form_modal_overlay">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-150 p-6 max-w-md w-full shadow-2xl relative"
              id="auth_form_modal"
            >
              <AccessForm 
                onClose={() => setShowAuthModal(false)}
                onLoginSuccess={handleLoginSuccess}
                onRegisterSuccess={handleRegisterSuccess}
                existingProfiles={profiles}
                initialMode={authModalMode}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

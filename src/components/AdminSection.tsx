/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ServiceRequest, ServiceStatus, ProductItem, SalesOrder, SystemLog, UserProfile, CourierProfile, DeliveryStatus } from '../types';
import { 
  Users, 
  Terminal, 
  Settings, 
  ShieldAlert, 
  Radio, 
  DollarSign, 
  ShoppingBag, 
  Sparkles, 
  Plus, 
  ToggleLeft, 
  ToggleRight,
  UserPlus,
  RefreshCw,
  Search,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  X,
  Package,
  Layers,
  ArrowUpRight,
  PlusCircle,
  Layers3,
  Award,
  ChevronRight,
  Calendar,
  UserCheck,
  FileText,
  Check,
  Bike
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminSectionProps {
  services: ServiceRequest[];
  products: ProductItem[];
  orders: SalesOrder[];
  logs: SystemLog[];
  profiles: UserProfile[];
  couriers: CourierProfile[];
  onAddUser: (user: UserProfile) => void;
  onAddLog: (action: string, severity: 'info' | 'warning' | 'critical') => void;
  onClearLogs: () => void;
  onAddProduct: (product: ProductItem) => void;
  onUpdateProduct: (product: ProductItem) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateCourier?: (courier: CourierProfile) => void;
  onUpdateOrderDelivery?: (orderId: string, status: DeliveryStatus, courierId?: string) => void;
  bannerBg?: string;
  bannerTitle?: string;
  bannerTag?: string;
  bannerDesc?: string;
  bannerOverlayCol?: string;
  bannerOverlayOpacity?: number;
  onUpdateBannerSettings?: (bg: string, title: string, tag: string, desc: string, overlayCol: string, overlayOpacity: number) => void;
  activeTab?: 'metrics' | 'ecommerce' | 'entrega_agenda' | 'entrega_mensajeros' | 'servicios_control';
  onChangeTab?: (tab: 'metrics' | 'ecommerce' | 'entrega_agenda' | 'entrega_mensajeros' | 'servicios_control') => void;
  onUpdateServiceStatus?: (id: string, status: ServiceStatus) => void;
}

export default function AdminSection({
  services,
  products,
  orders,
  logs,
  profiles,
  couriers,
  onAddUser,
  onAddLog,
  onClearLogs,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateCourier,
  onUpdateOrderDelivery,
  bannerBg = '',
  bannerTitle = 'Catálogo Exclusivo Atelier',
  bannerTag = 'ATELIER BOUTIQUE',
  bannerDesc = 'Descubre nuestras dos exclusivas divisiones diseñadas meticulosamente para brindar confort personal y sanidad impecable en tu hogar.',
  bannerOverlayCol = '#0f172a',
  bannerOverlayOpacity = 60,
  onUpdateBannerSettings,
  activeTab: propActiveTab,
  onChangeTab: propOnChangeTab,
  onUpdateServiceStatus
}: AdminSectionProps) {
  // Sync state to handle parent changes in real time
  const [localBannerBg, setLocalBannerBg] = useState(bannerBg);
  const [localBannerTitle, setLocalBannerTitle] = useState(bannerTitle);
  const [localBannerTag, setLocalBannerTag] = useState(bannerTag);
  const [localBannerDesc, setLocalBannerDesc] = useState(bannerDesc);
  const [localBannerOverlayCol, setLocalBannerOverlayCol] = useState(bannerOverlayCol);
  const [localBannerOverlayOpacity, setLocalBannerOverlayOpacity] = useState(bannerOverlayOpacity);

  // States for services control tab
  const [adminServiceSearch, setAdminServiceSearch] = useState('');
  const [adminServiceStatusFilter, setAdminServiceStatusFilter] = useState<'todos' | ServiceStatus>('todos');
  const [adminServicePriorityFilter, setAdminServicePriorityFilter] = useState<'todos' | 'Baja' | 'Media' | 'Alta'>('todos');
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    setLocalBannerBg(bannerBg);
    if ((bannerBg || '').startsWith('data:')) {
      setBannerImageUploadType('upload');
    } else if (bannerBg) {
      setBannerImageUploadType('url');
    }
  }, [bannerBg]);

  useEffect(() => {
    setLocalBannerTitle(bannerTitle);
  }, [bannerTitle]);

  useEffect(() => {
    setLocalBannerTag(bannerTag);
  }, [bannerTag]);

  useEffect(() => {
    setLocalBannerDesc(bannerDesc);
  }, [bannerDesc]);

  useEffect(() => {
    setLocalBannerOverlayCol(bannerOverlayCol);
  }, [bannerOverlayCol]);

  useEffect(() => {
    setLocalBannerOverlayOpacity(bannerOverlayOpacity);
  }, [bannerOverlayOpacity]);

  // Navigation tabs: 'metrics' | 'ecommerce' | 'entrega_agenda' | 'entrega_mensajeros' | 'servicios_control'
  const [localActiveTab, setLocalActiveTab] = useState<'metrics' | 'ecommerce' | 'entrega_agenda' | 'entrega_mensajeros' | 'servicios_control'>('metrics');
  const activeTab = propActiveTab || localActiveTab;
  const setActiveTab = propOnChangeTab || setLocalActiveTab;

  // Local Config Settings
  const [config, setConfig] = useState({
    underMaintenance: false,
    allowGuestBooking: true,
    autoAssignStaff: true,
    promoBannerActive: true,
  });

  // User addition form state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'Administrador' | 'Servicios' | 'Ventas'>('Servicios');

  // Logs search filter
  const [logFilter, setLogFilter] = useState('');

  // E-commerce catalogue state filters
  const [productSearch, setProductSearch] = useState('');
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState<'todos' | 'Productos de limpieza' | 'Zapatos' | 'Servicios'>('todos');

  // Product modal controllers
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Form states for creating/editing product
  const [pId, setPId] = useState('');
  const [pName, setPName] = useState('');
  const [pSku, setPSku] = useState('');
  const [pPrice, setPPrice] = useState(0);
  const [pStock, setPStock] = useState(0);
  const [pCategory, setPCategory] = useState<'Productos de limpieza' | 'Zapatos' | 'Servicios'>('Productos de limpieza');
  const [pDesc, setPDesc] = useState('');
  const [pImgUrl, setPImgUrl] = useState('');
  const [pSalesCount, setPSalesCount] = useState(0);
  const [pActive, setPActive] = useState(true);

  // Selector for uploading files vs writing link
  const [prodImageUploadType, setProdImageUploadType] = useState<'url' | 'upload'>('url');
  const [bannerImageUploadType, setBannerImageUploadType] = useState<'url' | 'upload'>('url');

  // Delivery logistics and courier admin states
  const [selectedAgendaDay, setSelectedAgendaDay] = useState<string>('all');
  const [deliverySearch, setDeliverySearch] = useState('');
  const [selectedCourierAdmin, setSelectedCourierAdmin] = useState<CourierProfile | null>(null);
  const [editPlate, setEditPlate] = useState('');
  const [editPhone, setEditPhone] = useState('');

  const handleSaveBannerSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateBannerSettings) {
      onUpdateBannerSettings(
        localBannerBg.trim(),
        localBannerTitle.trim(),
        localBannerTag.trim(),
        localBannerDesc.trim(),
        localBannerOverlayCol,
        localBannerOverlayOpacity
      );
      onAddLog('Se actualizaron las configuraciones del banner oficial Atelier Boutique', 'info');
      showToast('¡Configuración del Banner Atelier guardada con éxito!', 'success');
    }
  };

  // Visual Notification Toast States
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'danger' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'danger' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Compute stats based on store products vs services
  const ecomOrdersCount = orders.filter(o => o.status !== 'cancelado').length;
  const ecomRevenue = orders
    .filter(o => o.status !== 'cancelado')
    .reduce((acc, curr) => acc + curr.total, 0);

  const servicesCount = services.filter(s => s.status === 'completado').length;
  const servicesRevenue = services
    .filter(s => s.status === 'completado')
    .reduce((acc, s) => acc + s.price, 0);

  const totalRevenue = ecomRevenue + servicesRevenue;
  
  const pendingServicesCount = services.filter(s => s.status === 'programado' || s.status === 'en_progreso').length;
  const processingOrdersCount = orders.filter(o => o.status === 'procesando').length;

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const newUser: UserProfile = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: 'Activo',
      lastActive: 'Justo ahora'
    };

    onAddUser(newUser);
    onAddLog(`Usuario creado: ${newUser.name} (${newUser.role})`, 'info');
    showToast(`Usuario ${newUser.name} creado con éxito`, 'success');

    // Reset Form
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('Servicios');
    setShowAddUserModal(false);
  };

  const toggleConfig = (key: keyof typeof config, label: string) => {
    const nextVal = !config[key];
    setConfig(prev => ({ ...prev, [key]: nextVal }));
    onAddLog(`Configuración cambiada: ${label} a ${nextVal ? 'ACTIVADO' : 'DESACTIVADO'}`, 'warning');
    showToast(`Parámetro modificado: ${label}`, 'info');
  };

  // Filter logs safely
  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(logFilter.toLowerCase()) ||
    log.actor.toLowerCase().includes(logFilter.toLowerCase()) ||
    log.role.toLowerCase().includes(logFilter.toLowerCase())
  );

  // Filter products catalog
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      product.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
      product.description.toLowerCase().includes(productSearch.toLowerCase());
    
    const matchesCategory = catalogCategoryFilter === 'todos' || product.category === catalogCategoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // SKU self generator helper
  const handleGenerateSku = () => {
    const prefix = pCategory === 'Zapatos' ? 'HML-ZAP' : pCategory === 'Servicios' ? 'HML-SRV' : 'HML-LIM';
    const randomNum = Math.floor(10 + Math.random() * 90);
    setPSku(`${prefix}-${randomNum}`);
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setPId(`PROD-${Math.floor(100 + Math.random() * 900)}`);
    setPName('');
    setPSku('HML-NEW-99');
    setPPrice(299);
    setPStock(45);
    setPCategory('Productos de limpieza');
    setPDesc('');
    setPImgUrl('');
    setPSalesCount(0);
    setPActive(true);
    setProdImageUploadType('url');
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (prod: ProductItem) => {
    setEditingProduct(prod);
    setPId(prod.id);
    setPName(prod.name);
    setPSku(prod.sku);
    setPPrice(prod.price);
    setPStock(prod.stock);
    setPCategory(prod.category === 'Zapatos' ? 'Zapatos' : prod.category === 'Servicios' ? 'Servicios' : 'Productos de limpieza');
    setPDesc(prod.description);
    setPImgUrl(prod.imageUrl || '');
    setPSalesCount(prod.salesCount || 0);
    setPActive(prod.active !== false);
    setProdImageUploadType((prod.imageUrl || '').startsWith('data:') ? 'upload' : 'url');
    setShowProductModal(true);
  };

  const handleSubmitProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName.trim() || !pSku.trim()) {
      showToast('Por favor completa los campos de nombre y SKU', 'danger');
      return;
    }

    const imgFallback = pImgUrl.trim() || (pCategory === 'Zapatos' 
      ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsPlV5u1UOTpXsbHztz8RAntDJ8LeRMTVFaQ&s'
      : pCategory === 'Servicios'
      ? 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&auto=format&fit=crop&q=60'
      : 'https://ecotropa.mx/cdn/shop/products/BRL_0524fa1b-f52c-48c0-b5d8-5b9713eca802_700x.jpg?v=1667955081');

    const formattedProduct: ProductItem = {
      id: pId,
      name: pName,
      sku: pSku,
      category: pCategory,
      price: Number(pPrice) || 0,
      stock: Number(pStock) || 0,
      salesCount: pSalesCount,
      description: pDesc,
      imageUrl: imgFallback,
      active: pActive
    };

    if (editingProduct) {
      onUpdateProduct(formattedProduct);
      showToast(`Producto "${pName}" actualizado con éxito`, 'success');
    } else {
      onAddProduct(formattedProduct);
      showToast(`Producto "${pName}" registrado en el catálogo`, 'success');
    }
    setShowProductModal(false);
  };

  const handleDeleteProductClick = (id: string, name: string) => {
    if (confirm(`¿Estás seguro de que deseas dar de baja el producto "${name}"? Se sincronizará en tiempo real con la tienda.`)) {
      onDeleteProduct(id);
      showToast(`Producto "${name}" eliminado del catálogo`, 'success');
    }
  };

  // Identify top sellers in online store
  const topSellersList = [...products]
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 4);

  const highestSales = topSellersList.length > 0 ? topSellersList[0].salesCount : 1;

  // Identify inventory shortage warning products
  const stockShortages = products.filter(p => (p.category === 'Productos de limpieza' || p.category === 'Zapatos') && p.stock < 15);

  return (
    <div className="space-y-6 text-left" id="admin_console_container">
      
      {/* Brand Header & Notification toast overlay */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] font-mono font-black text-[#c5a85c] uppercase tracking-wider">Atelier Logístico</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-800">Centro de Control de Negocio</h2>
          <p className="text-xs text-slate-500 mt-1">Supervisa estadísticas comerciales de despacho, administra e-commerce y configura parámetros estratégicos de marca.</p>
        </div>

        {/* Simple Label indicating we are in catalog dashboard */}
        <div className="px-4 py-2 bg-amber-50 rounded-xl border border-[#c5a85c]/30 text-[#a38439] text-sm font-bold flex items-center gap-1.5 shadow-xs">
          🛍️ Gestión de Catálogo y Marca
        </div>
      </div>

      {/* Persistent Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-xl flex items-center gap-3 border ${
              notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
              notification.type === 'danger' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-slate-905 bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
            <span className="text-xs font-bold font-sans">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-700 ml-2">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Overview Cards - Updated dynamically for store metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="admin_kpi_grid">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm" id="kpi_card_revenue">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Ingreso Comercial Global</p>
              <h3 className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-slate-900 pt-1">
                ${totalRevenue.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
              </h3>
              <div className="flex items-center gap-1.5 pt-1 text-[11px] font-bold text-slate-500">
                <span className="text-emerald-500">🏷️ ${ecomRevenue.toLocaleString('es-MX')}</span>
                <span>E-comm</span>
              </div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700">
              <DollarSign size={18} />
            </div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm" id="kpi_card_services">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Servicios Pendientes</p>
              <h3 className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-slate-900 pt-1">
                {pendingServicesCount}
              </h3>
              <p className="text-[11px] text-amber-500 font-bold pt-1">🔧 {servicesCount} Completados (${servicesRevenue.toLocaleString()})</p>
            </div>
            <div className="p-3 bg-[#c5a85c]/10 border border-[#c19a45]/20 rounded-xl text-[#c19a45]">
              <Sparkles size={18} />
            </div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm" id="kpi_card_orders">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Pedidos E-commerce</p>
              <h3 className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-slate-900 pt-1">
                {ecomOrdersCount} pedidos
              </h3>
              <p className="text-[11px] text-teal-600 font-bold pt-1">📦 {processingOrdersCount} listos para empaquetado</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700">
              <ShoppingBag size={18} />
            </div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm" id="kpi_card_users">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Artículos de Catálogo</p>
              <h3 className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-slate-900 pt-1">
                {products.filter(p => p.category === 'Productos de limpieza' || p.category === 'Zapatos').length} items
              </h3>
              <p className="text-[11px] text-indigo-600 font-semibold pt-1">🏭 Stock físico: {products.filter(p => p.category === 'Productos de limpieza' || p.category === 'Zapatos').reduce((sum, p) => sum + p.stock, 0)} unidades</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700">
              <Package size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* ================================== TAB 1: METRICAS E-COMMERCE & GENERAL ================================== */}
      {activeTab === 'metrics' && (
        <motion.div
          key="metrics_tab"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Left Column (2/3 width on large): Interactive Charts and Sales History */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Interactive SVG Chart representation */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <div>
                  <h4 className="font-serif font-black text-slate-800 text-sm uppercase tracking-wider">Histórico de Ventas y Tendencia E-commerce</h4>
                  <p className="text-[11px] text-slate-400">Representación de crecimiento en las últimas 6 semanas comerciales.</p>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold">
                  <span className="flex items-center gap-1 text-[#c5a85c]"><span className="w-2 h-2 rounded-full bg-[#c5a85c]" /> E-commerce</span>
                  <span className="flex items-center gap-1 text-slate-400"><span className="w-2 h-2 rounded-full bg-slate-300" /> Promedio</span>
                </div>
              </div>

              {/* Styled SVG Area Chart */}
              <div className="w-full aspect-[22/9] min-h-[220px] bg-slate-50/50 rounded-xl border border-slate-100/60 p-4 flex flex-col justify-between relative overflow-hidden">
                <svg viewBox="0 0 600 200" className="w-full h-full">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#c5a85c" stopOpacity="0.25"/>
                      <stop offset="100%" stopColor="#c5a85c" stopOpacity="0.0"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="30" y1="30" x2="570" y2="30" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
                  <line x1="30" y1="80" x2="570" y2="80" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
                  <line x1="30" y1="130" x2="570" y2="130" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
                  <line x1="30" y1="170" x2="570" y2="170" stroke="#e2e8f0" strokeWidth="1" />

                  {/* Area Shadow under the path */}
                  <path 
                    d="M 30 170 L 100 120 L 190 140 L 280 80 L 370 100 L 460 40 L 550 60 L 550 170 Z" 
                    fill="url(#chartGrad)" 
                  />

                  {/* Main Line Plot */}
                  <path 
                    d="M 30 170 Q 100 120 190 140 T 280 80 T 370 100 T 460 40 T 550 60" 
                    fill="none" 
                    stroke="#c5a85c" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                  />

                  {/* Scatter Data Dots */}
                  <circle cx="100" cy="120" r="5" fill="#fff" stroke="#c5a85c" strokeWidth="2.5" className="cursor-pointer hover:r-7 transition-all" />
                  <circle cx="190" cy="140" r="5" fill="#fff" stroke="#c5a85c" strokeWidth="2.5" />
                  <circle cx="280" cy="80" r="5" fill="#c19a45" stroke="#fff" strokeWidth="2" />
                  <circle cx="370" cy="100" r="5" fill="#fff" stroke="#c5a85c" strokeWidth="2.5" />
                  <circle cx="460" cy="40" r="5" fill="#c19a45" stroke="#fff" strokeWidth="2px" />
                  <circle cx="550" cy="60" r="5" fill="#fff" stroke="#c5a85c" strokeWidth="2.5" />

                  {/* Text labels */}
                  <text x="100" y="190" className="text-[10px] font-semibold text-slate-400 font-sans" textAnchor="middle">Sem 1</text>
                  <text x="190" y="190" className="text-[10px] font-semibold text-slate-400 font-sans" textAnchor="middle">Sem 2</text>
                  <text x="280" y="190" className="text-[10px] font-semibold text-slate-400 font-sans" textAnchor="middle">Sem 3</text>
                  <text x="370" y="190" className="text-[10px] font-semibold text-slate-400 font-sans" textAnchor="middle">Sem 4</text>
                  <text x="460" y="190" className="text-[10px] font-semibold text-slate-400 font-sans" textAnchor="middle">Sem 5</text>
                  <text x="550" y="190" className="text-[10px] font-semibold text-slate-400 font-sans" textAnchor="middle">Sem 6 (Hoy)</text>

                  {/* Chart values */}
                  <text x="25" y="34" className="text-[9px] font-semibold text-slate-350 text-right font-mono" textAnchor="end">$15K</text>
                  <text x="25" y="84" className="text-[9px] font-semibold text-slate-350 text-right font-mono" textAnchor="end">$10K</text>
                  <text x="25" y="134" className="text-[9px] font-semibold text-slate-350 text-right font-mono" textAnchor="end">$5K</text>
                  <text x="25" y="174" className="text-[9px] font-semibold text-slate-350 text-right font-mono" textAnchor="end">$0</text>
                </svg>
              </div>
            </div>

            {/* Orders summary table */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <div>
                  <h4 className="font-serif font-black text-slate-800 text-sm uppercase tracking-wider">Últimos Pedidos Recibidos</h4>
                  <p className="text-[11px] text-slate-400">Pedidos activos en la tienda oficial e-commerce.</p>
                </div>
                <button 
                  onClick={() => setActiveTab('ecommerce')}
                  className="text-xs font-black text-[#c5a85c] hover:underline flex items-center gap-1"
                >
                  Ver todos <ChevronRight size={14} />
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {orders.slice(0, 4).map(o => (
                  <div key={o.id} className="py-3 flex justify-between items-center gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-800">{o.customerName}</span>
                        <span className="text-[9px] font-mono font-bold text-slate-450 bg-slate-100 px-1.5 py-0.5 rounded-sm">{o.id}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-normal line-clamp-1">{o.productNames.join(', ')}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="text-xs font-mono font-black text-slate-900">${o.total} MXN</span>
                      <span className={`block text-[9px] font-bold uppercase ${
                        o.status === 'entregado' ? 'text-green-600' :
                        o.status === 'enviado' ? 'text-blue-600' :
                        o.status === 'procesando' ? 'text-amber-600' : 'text-slate-400'
                      }`}>
                        ● {o.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (1/3 width on large): Top Sellers and Stock Alerts */}
          <div className="space-y-6">
            
            {/* Top Sellers Panel */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <div>
                <h4 className="font-serif font-black text-slate-800 text-sm uppercase tracking-wider">Productos Más Vendidos</h4>
                <p className="text-[11px] text-slate-400">Índice de popularidad basado en compras totales.</p>
              </div>

              <div className="space-y-4">
                {topSellersList.map((p, index) => {
                  const widthPercent = Math.max(12, Math.min(100, (p.salesCount / highestSales) * 100));
                  return (
                    <div key={p.id} className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                        <span className="truncate max-w-[150px]">{index + 1}. {p.name}</span>
                        <span className="font-mono text-slate-500 font-extrabold">{p.salesCount} pz vendidas</span>
                      </div>
                      
                      {/* Custom Horizontal Progress Bar */}
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            p.category === 'Zapatos' ? 'bg-[#c5a85c]' : p.category === 'Servicios' ? 'bg-indigo-600' : 'bg-emerald-600'
                          }`}
                          style={{ width: `${widthPercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[9px] text-slate-400">
                        <span>Categoría: {p.category}</span>
                        <span className="font-mono">Ingreso: ${(p.salesCount * p.price).toLocaleString()} MXN</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stock Shortage Warning Panel */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-rose-600">
                <ShieldAlert size={18} />
                <h4 className="font-serif font-black text-slate-800 text-sm uppercase tracking-wider">Alertas de Reabastecimiento</h4>
              </div>
              <p className="text-[11px] text-slate-400">Inventarios críticos con menos de 15 unidades disponibles en almacén central.</p>

              <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
                {stockShortages.length === 0 ? (
                  <div className="text-center py-4 bg-slate-50 rounded-xl text-xs text-green-700 font-bold border border-green-100">
                    ✓ Sin roturas de stock crítica.
                  </div>
                ) : (
                  stockShortages.map(p => (
                    <div key={p.id} className="p-2 bg-amber-50/50 hover:bg-rose-50/30 border border-amber-100 rounded-xl flex justify-between items-center gap-3 transition">
                      <div className="truncate">
                        <h6 className="text-xs font-bold text-slate-700 truncate">{p.name}</h6>
                        <span className="text-[9px] text-slate-400 font-mono uppercase">{p.sku} | {p.category}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-black rounded-lg font-mono">
                          {p.stock} pz
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ================================== TAB 2: ACTIVE PRODUCT DATABASE (VIEW, ADD, EDIT, DELETE) ================================== */}
      {activeTab === 'ecommerce' && (
        <div className="space-y-6 animate-fade-in" id="admin_ecommerce_tab_wrapper">
          
          {/* ================================== ATELIER BANNER CUSTOMIZER ================================== */}
          <motion.div
            key="banner_customizer_card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4"
            id="admin_banner_customizer_container"
          >
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-serif font-black text-slate-800 text-lg sm:text-2xl">Personalización de Cabecera E-commerce</h3>
              <p className="text-sm text-slate-500">Modifica en tiempo real los textos, colores y la imagen de fondo de la tarjeta Atelier Boutique de la tienda.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form Input fields */}
              <form onSubmit={handleSaveBannerSettings} className="space-y-4 text-left">
                <div className="space-y-2">
                  <div className="flex justify-between items-center pb-0.5">
                    <label className="block text-xs font-black uppercase text-slate-500 tracking-wider">Imagen de Fondo del Banner</label>
                    <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setBannerImageUploadType('url')}
                        className={`px-3 py-1 rounded text-xs font-black tracking-wider transition cursor-pointer ${bannerImageUploadType === 'url' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        Enlace (URL)
                      </button>
                      <button
                        type="button"
                        onClick={() => setBannerImageUploadType('upload')}
                        className={`px-3 py-1 rounded text-xs font-black tracking-wider transition cursor-pointer ${bannerImageUploadType === 'upload' ? 'bg-white text-[#c5a85c] shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        Subir Archivo 📤
                      </button>
                    </div>
                  </div>

                  {bannerImageUploadType === 'url' ? (
                    <input
                      type="text"
                      value={localBannerBg.startsWith('data:') ? '' : localBannerBg}
                      onChange={(e) => setLocalBannerBg(e.target.value)}
                      placeholder="https://ejemplo.com/diseno-atelier.webp"
                      className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#c5a85c] text-slate-800 font-mono"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (typeof reader.result === 'string') {
                                  setLocalBannerBg(reader.result);
                                  showToast('¡Imagen de cabecera cargada con éxito!', 'success');
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="w-full text-sm text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-[#c5a85c]/10 file:text-[#a38439] hover:file:bg-[#c5a85c]/20 file:cursor-pointer cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-slate-500 mt-0.5">
                    {bannerImageUploadType === 'url' 
                      ? 'Escribe la URL directa de la imagen de fondo. Deja vacío para usar el color de overlay sólido.' 
                      : 'Carga un archivo PNG, JPG o WEBP directo desde tu dispositivo para almacenarlo localmente.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-500 tracking-wider mb-1">Subtítulo / Etiqueta (Overline)</label>
                    <input
                      type="text"
                      value={localBannerTag}
                      onChange={(e) => setLocalBannerTag(e.target.value)}
                      placeholder="ATELIER BOUTIQUE"
                      maxLength={40}
                      className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#c5a85c] text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-500 tracking-wider mb-1">Título de la Tarjeta</label>
                    <input
                      type="text"
                      value={localBannerTitle}
                      onChange={(e) => setLocalBannerTitle(e.target.value)}
                      placeholder="Catálogo Exclusivo Atelier"
                      maxLength={60}
                      className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#c5a85c] text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-500 tracking-wider mb-1">Color de Overlay (Filtro tinto)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={localBannerOverlayCol.startsWith('#') && localBannerOverlayCol.length === 7 ? localBannerOverlayCol : '#0f172a'}
                        onChange={(e) => setLocalBannerOverlayCol(e.target.value)}
                        className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer bg-transparent shrink-0"
                      />
                      <input
                        type="text"
                        value={localBannerOverlayCol}
                        onChange={(e) => setLocalBannerOverlayCol(e.target.value)}
                        placeholder="#0f172a"
                        maxLength={20}
                        className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#c5a85c] text-slate-800 font-mono"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-500 tracking-wider mb-1">Opacidad del Overlay ({localBannerOverlayOpacity}%)</label>
                    <div className="flex items-center gap-2 py-1">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={localBannerOverlayOpacity}
                        onChange={(e) => setLocalBannerOverlayOpacity(Number(e.target.value))}
                        className="w-full accent-[#c5a85c] cursor-pointer"
                      />
                      <span className="text-sm font-mono font-bold text-slate-650 w-10 text-right shrink-0">{localBannerOverlayOpacity}%</span>
                    </div>
                  </div>
                </div>

                {/* Pre-sets palette quick select */}
                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 tracking-wider mb-1">Paletas de Marca Recomendadas</label>
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    {[
                      { name: 'Noche', hex: '#0f172a', opacity: 70 },
                      { name: 'Pure Noir', hex: '#000000', opacity: 60 },
                      { name: 'Oro Atelier', hex: '#634d1a', opacity: 50 },
                      { name: 'Esmeralda', hex: '#064e3b', opacity: 65 },
                      { name: 'Vino Imperial', hex: '#4c0519', opacity: 60 }
                    ].map(preset => (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => {
                          setLocalBannerOverlayCol(preset.hex);
                          setLocalBannerOverlayOpacity(preset.opacity);
                        }}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-[#c5a85c] rounded-xl text-xs font-bold text-slate-650 hover:text-slate-900 transition cursor-pointer flex items-center gap-1.5"
                      >
                        <span className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-xs" style={{ backgroundColor: preset.hex }} />
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 tracking-wider mb-1">Descripción de la Tarjeta</label>
                  <textarea
                    value={localBannerDesc}
                    onChange={(e) => setLocalBannerDesc(e.target.value)}
                    placeholder="Escribe los detalles o promociones..."
                    rows={3}
                    maxLength={300}
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#c5a85c] text-slate-800 leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    className="px-5 py-3 bg-gradient-to-r from-slate-900 to-[#c5a85c] text-white font-black text-sm rounded-xl hover:opacity-95 cursor-pointer shadow-md transition"
                  >
                    Guardar Configuración de Banner
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLocalBannerBg('');
                      setLocalBannerTitle('Catálogo Exclusivo Atelier');
                      setLocalBannerTag('ATELIER BOUTIQUE');
                      setLocalBannerDesc('Descubre nuestras dos exclusivas divisiones diseñadas meticulosamente para brindar confort personal y sanidad impecable en tu hogar.');
                      setLocalBannerOverlayCol('#0f172a');
                      setLocalBannerOverlayOpacity(60);
                    }}
                    className="px-4 py-2.5 text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                  >
                    Restaurar Original
                  </button>
                </div>
              </form>

              {/* Right: Mockup Live client preview */}
              <div className="flex flex-col justify-center space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-left">Vista Previa Previsualizada</span>
                
                {/* Simulated e-commerce banner */}
                <div 
                  className="rounded-2xl p-6 text-white relative overflow-hidden min-h-[180px] flex flex-col justify-center text-left bg-cover bg-center transition-all duration-300"
                  style={{
                    backgroundImage: localBannerBg ? `url(${localBannerBg})` : 'none',
                    backgroundColor: localBannerBg ? 'transparent' : localBannerOverlayCol
                  }}
                >
                  {/* Customizable Background Tint / Color Overlay */}
                  <div 
                    className="absolute inset-0 transition-all duration-300 pointer-events-none"
                    style={{
                      background: `linear-gradient(to right, ${localBannerOverlayCol}, ${localBannerOverlayCol}e6, ${localBannerOverlayCol}a0, rgba(0,0,0,0))`,
                      opacity: localBannerBg ? (localBannerOverlayOpacity / 100) : 1
                    }}
                  />
                  {/* Default elegant space gradient fallback if no photo and default slate overlay is active */}
                  {!localBannerBg && localBannerOverlayCol === '#0f172a' && (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-indigo-950 pointer-events-none" />
                  )}
                  <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial from-[#c5a85c]/15 to-transparent pointer-events-none" />
                  
                  <div className="relative z-10 space-y-1.5 max-w-sm">
                    {localBannerTag && (
                      <span className="px-2 py-0.5 bg-[#c5a85c]/25 border border-[#c19a45]/30 rounded-full text-[8px] font-black tracking-widest uppercase inline-block text-[#ebd7a7]">
                        {localBannerTag}
                      </span>
                    )}
                    <h2 className="text-sm sm:text-base font-serif font-black tracking-tight text-white leading-tight">
                      {localBannerTitle || 'Catálogo Exclusivo Atelier'}
                    </h2>
                    <p className="text-[9px] text-slate-300 leading-relaxed font-semibold">
                      {localBannerDesc || 'Descubre nuestras dos exclusivas divisiones...'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            key="ecommerce_tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6"
          >
            {/* List Toolbar controllers */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="font-serif font-black text-slate-800 text-lg sm:text-2xl">Catálogo Maestro de Artículos</h3>
                <p className="text-sm sm:text-base text-slate-500 mt-1">Cualquier cambio guardado se reflejará en tiempo real y modificará el stock, fotos y precios de la tienda en línea.</p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="px-5 py-3 bg-gradient-to-r from-slate-900 to-indigo-950 text-white font-black text-sm rounded-xl flex items-center gap-2 shadow-sm hover:opacity-95 cursor-pointer"
              >
                <PlusCircle size={16} />
                Agregar Producto E-commerce
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {/* Category Filter Chips */}
              <div className="flex flex-wrap gap-2 self-start animate-fade-in">
                {(['todos', 'Productos de limpieza', 'Zapatos', 'Servicios'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCatalogCategoryFilter(cat)}
                    className={`px-4 py-2 text-sm font-black rounded-xl transition cursor-pointer border ${
                      catalogCategoryFilter === cat 
                        ? 'bg-[#c5a85c]/10 text-[#c5a85c] border-[#c19a45]/40 shadow-xs' 
                        : 'bg-white border-slate-200 text-slate-655 hover:text-slate-900'
                    }`}
                  >
                    {cat === 'todos' ? '🌐 Todos los Productos' : cat === 'Zapatos' ? '👠 Zapatos' : cat === 'Servicios' ? '✨ Servicios de Limpieza' : '🧴 Limpieza'}
                  </button>
                ))}
              </div>

              {/* Search Input bar */}
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Buscar por nombre o SKU..."
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-slate-205 rounded-xl focus:outline-none focus:border-[#c5a85c] text-slate-800"
                />
                <Search size={16} className="absolute left-3 top-3 text-slate-400" />
              </div>
            </div>

            {/* Interactive Products Table Grid */}
            <div className="overflow-x-auto border border-slate-150 rounded-2xl shadow-xs">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-105 text-xs font-black uppercase tracking-wider text-slate-500">
                    <th className="p-4">Artículo</th>
                    <th className="p-4">SKU / ID</th>
                    <th className="p-4 text-center">Categoría / Estado</th>
                    <th className="p-4 text-right">Inversión</th>
                    <th className="p-4 text-center">Stock Almacén</th>
                    <th className="p-4 text-center">Ventas</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 font-sans">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400 bg-slate-50/55 text-base">
                        <Package size={30} className="mx-auto mb-3 opacity-50" />
                        No se encontraron productos registrados que cumplan este filtro.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition">
                        {/* Product details thumbnail */}
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shrink-0 flex items-center justify-center shadow-xs">
                              <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <div>
                              <h5 className="font-serif font-black text-slate-800 leading-snug text-base hover:text-[#c5a85c] transition-colors">{p.name}</h5>
                              <span className="text-xs text-slate-500 font-medium leading-normal line-clamp-1 max-w-[200px] sm:max-w-xs">{p.description}</span>
                            </div>
                          </div>
                        </td>

                        {/* SKU / ID columns */}
                        <td className="p-4 font-mono font-bold text-slate-600 uppercase text-xs sm:text-sm">{p.sku || p.id}</td>

                        {/* Category Badge columns */}
                        <td className="p-4 text-center">
                          <div className="flex flex-col items-center gap-1.5">
                            <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider ${
                              p.category === 'Zapatos' ? 'bg-[#c5a85c]/10 text-[#a38439]' : p.category === 'Servicios' ? 'bg-indigo-50 text-indigo-800' : 'bg-emerald-50 text-emerald-800'
                            }`}>
                              {p.category}
                            </span>
                            <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${
                              p.active !== false 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                : 'bg-rose-50 text-rose-600 border border-rose-250'
                            }`}>
                              {p.active !== false ? '● Activo' : '● Pausado'}
                            </span>
                          </div>
                        </td>

                        {/* Price columns */}
                        <td className="p-4 text-right font-mono font-black text-slate-800 text-sm sm:text-base">${p.price} MXN</td>

                        {/* Stock levels columns */}
                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 font-mono font-extrabold rounded-lg text-sm ${
                            p.stock <= 0 ? 'bg-red-50 text-red-600 border border-red-200 shadow-3xs' :
                            p.stock < 15 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-700 border border-slate-205'
                          }`}>
                            {p.stock} un
                          </span>
                        </td>

                        {/* Sales items columns */}
                        <td className="p-4 text-center font-mono font-extrabold text-slate-650 text-sm sm:text-base">{p.salesCount || 0}</td>

                        {/* Interactive Edit / Delete actions */}
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2 shrink-0 flex-wrap">
                            <button
                              onClick={() => {
                                onUpdateProduct({ ...p, active: p.active === false });
                                showToast(`Producto "${p.name}" ${p.active === false ? 'activado' : 'desactivado'} con éxito`, 'success');
                              }}
                              className={`px-3 py-2 rounded-xl text-xs font-bold shadow-xs transition cursor-pointer flex items-center gap-1 border ${
                                p.active !== false
                                  ? 'bg-amber-50 border-amber-250 text-amber-700 hover:bg-amber-100'
                                  : 'bg-emerald-50 border-emerald-250 text-emerald-700 hover:bg-emerald-100'
                              }`}
                              title={p.active !== false ? 'Desactivar de la tienda' : 'Activar en la tienda'}
                            >
                              {p.active !== false ? '⏸️ Desactivar' : '▶️ Activar'}
                            </button>
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              className="p-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-750 hover:text-slate-900 hover:bg-slate-100/80 text-xs font-bold transition cursor-pointer shadow-3xs"
                              title="Editar propiedades de producto"
                            >
                              ✏️ Editar
                            </button>
                            <button
                              onClick={() => handleDeleteProductClick(p.id, p.name)}
                              className="p-2 px-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-100 text-xs font-bold transition cursor-pointer shadow-3xs"
                              title="Dar de baja de la tienda"
                            >
                              🗑️ Baja
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      )}

      {/* ================================== TAB 3: CONTROL OPERATIVO & BITACORA LOGS (DESACTIVADO) ================================== */}
      {(activeTab as string) === 'operational' && (
        <motion.div
          key="operational_tab"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Controls & Personnel list Column */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Global parameters configs */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm" id="settings_panel">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                <Settings className="text-slate-400" size={18} />
                <h4 className="font-serif font-black text-slate-800 text-sm uppercase tracking-wider">Parámetros Globales</h4>
              </div>

              <div className="space-y-4 font-sans text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase text-slate-800 tracking-wider">Modo de Mantenimiento</p>
                    <p className="text-[11px] text-slate-400 leading-normal font-medium">Suspende el e-commerce temporalmente</p>
                  </div>
                  <button 
                    onClick={() => toggleConfig('underMaintenance', 'Modo Mantenimiento')}
                    className="text-slate-400 hover:text-slate-800 transition cursor-pointer"
                  >
                    {config.underMaintenance ? (
                      <ToggleRight className="text-[#c5a85c] animate-pulse" size={32} />
                    ) : (
                      <ToggleLeft size={32} />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase text-slate-800 tracking-wider">Permitir Reservaciones</p>
                    <p className="text-[11px] text-slate-400 leading-normal font-medium">Clientes pueden calendarizar servicios</p>
                  </div>
                  <button 
                    onClick={() => toggleConfig('allowGuestBooking', 'Permitir Reservaciones')}
                    className="text-slate-400 hover:text-slate-800 transition cursor-pointer font-bold"
                  >
                    {config.allowGuestBooking ? (
                      <ToggleRight className="text-[#c5a85c]" size={32} />
                    ) : (
                      <ToggleLeft size={32} />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase text-slate-800 tracking-wider">Asignación Automática</p>
                    <p className="text-[11px] text-slate-400 leading-normal font-medium">Distribución automática de técnicos</p>
                  </div>
                  <button 
                    onClick={() => toggleConfig('autoAssignStaff', 'Asignación Automática')}
                    className="text-slate-400 hover:text-slate-800 transition cursor-pointer"
                  >
                    {config.autoAssignStaff ? (
                      <ToggleRight className="text-[#c5a85c]" size={32} />
                    ) : (
                      <ToggleLeft size={32} />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase text-slate-800 tracking-wider">Promociones Activas</p>
                    <p className="text-[11px] text-slate-400 leading-normal font-medium">Banner de despachos y ofertas activo</p>
                  </div>
                  <button 
                    onClick={() => toggleConfig('promoBannerActive', 'Banner de Descuento')}
                    className="text-slate-400 hover:text-slate-800 transition cursor-pointer"
                  >
                    {config.promoBannerActive ? (
                      <ToggleRight className="text-[#c5a85c]" size={32} />
                    ) : (
                      <ToggleLeft size={32} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Personnel list panel */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm" id="personnel_panel">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Users className="text-slate-400" size={18} />
                  <h4 className="font-serif font-black text-slate-800 text-sm uppercase tracking-wider">Miembros del Equipo</h4>
                </div>
                <button 
                  onClick={() => setShowAddUserModal(true)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-202 text-slate-700 hover:bg-slate-100 rounded-lg transition text-xs font-black flex items-center gap-1 cursor-pointer"
                >
                  <UserPlus size={13} />
                  <span>Nuevo</span>
                </button>
              </div>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {profiles.map(p => (
                  <div key={p.id} className="flex justify-between items-center p-2 rounded-xl hover:bg-slate-50 transition border border-dashed border-transparent hover:border-slate-150">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center leading-none ${
                        p.role === 'Administrador' ? 'bg-[#c5a85c]/10 text-[#c5a85c]' :
                        p.role === 'Servicios' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-850 leading-none mb-1">{p.name}</p>
                        <p className="text-[9px] text-slate-400 font-mono">{p.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-1.5 py-0.5 text-[8px] font-black rounded ${
                        p.role === 'Administrador' ? 'bg-[#c5a85c]/10 text-[#c5a85c]' :
                        p.role === 'Servicios' ? 'bg-blue-50 text-blue-700' :
                        'bg-emerald-50 text-emerald-700'
                      }`}>
                        {p.role.toUpperCase()}
                      </span>
                      <p className="text-[9px] text-slate-350 mt-0.5 font-mono">{p.lastActive}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: Audit Logs bitacora */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full justify-between" id="logs_panel">
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-left">
                  <Terminal className="text-slate-400" size={18} />
                  <div>
                    <h4 className="font-serif font-black text-slate-800 text-sm uppercase tracking-wider">Bitácora de Sucesos</h4>
                    <p className="text-[11px] text-slate-400">Auditoría en tiempo real y flujo de actividades del sistema.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <input
                      type="text"
                      value={logFilter}
                      onChange={(e) => setLogFilter(e.target.value)}
                      placeholder="Filtrar bitácora..."
                      className="w-full sm:w-44 pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#c5a85c]"
                    />
                    <Search size={12} className="absolute left-3 top-2.5 text-slate-400" />
                  </div>
                  <button
                    onClick={onClearLogs}
                    className="px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 border border-rose-100 rounded-lg transition font-bold cursor-pointer"
                  >
                    Vaciar
                  </button>
                </div>
              </div>

              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 font-mono text-[11px]">
                <AnimatePresence initial={false}>
                  {filteredLogs.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <Radio size={24} className="mx-auto mb-2 text-slate-450 animate-pulse" />
                      Sin registros de auditoría en la consulta.
                    </div>
                  ) : (
                    filteredLogs.map(log => (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className={`p-3 rounded-xl border flex flex-col sm:flex-row justify-between gap-2 text-left ${
                          log.severity === 'critical' ? 'bg-rose-50 border-rose-100 text-rose-800' :
                          log.severity === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-800' :
                          'bg-slate-50/70 border-slate-105 text-slate-700'
                        }`}
                      >
                        <div className="flex gap-2 items-start leading-normal">
                          <span className={`px-1 rounded text-[8px] font-black uppercase shrink-0 ${
                            log.severity === 'critical' ? 'bg-rose-200 text-rose-800' :
                            log.severity === 'warning' ? 'bg-amber-150 text-amber-800' :
                            'bg-slate-200 text-slate-700'
                          }`}>
                            {log.severity}
                          </span>
                          <div>
                            <p className="font-bold text-slate-800">{log.action}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              Actor: <span className="font-black text-slate-600">{log.actor}</span> | Rol: <span className="font-bold text-slate-500">{log.role}</span>
                            </p>
                          </div>
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono whitespace-nowrap self-end sm:self-start">
                          {new Date(log.timestamp).toLocaleTimeString('es-MX')}
                        </span>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle size={13} />
                Sincronización de Catálogo Sólida
              </span>
              <span>Servidor Local Homeli Base</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* ================================== TAB 3: ENTREGAS Y AGENDA ================================== */}
      {activeTab === 'entrega_agenda' && (
        <motion.div
          key="agenda_tab"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
          id="admin_deliveries_agenda_wrapper"
        >
          {/* Header Description card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shadow-xs">
            <div>
              <p className="text-[10px] font-mono font-black text-[#c5a85c] uppercase tracking-wider">Logística de Despacho</p>
              <h3 className="text-lg font-serif font-black text-slate-800">Planificador & Agenda de Envíos</h3>
              <p className="text-xs text-slate-500 mt-1">Supervisa y agenda los envíos de e-commerce. Asigna un pedido a un chofer específico o lánzalo a la bolsa pública de reparto.</p>
            </div>
            
            {/* Quick stats mini badges */}
            <div className="flex gap-2">
              <span className="px-3 py-1.5 bg-yellow-50 text-amber-800 text-[11px] font-black rounded-lg border border-yellow-200">
                📦 {orders.filter(o => o.deliveryStatus === 'launched').length} Lanzados
              </span>
              <span className="px-3 py-1.5 bg-indigo-50 text-indigo-800 text-[11px] font-black rounded-lg border border-indigo-200">
                🛵 {orders.filter(o => ['accepted', 'collected', 'in_transit', 'with_customer'].includes(o.deliveryStatus || '')).length} En ruta
              </span>
            </div>
          </div>

          {/* SINC-AGENDA: VISUAL 7-DAY CALENDAR GRID */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 shadow-xs">
            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
              <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">📅 Agenda de Envíos Programados (Sincronizado)</h4>
              <span className="text-[10px] text-slate-400 font-bold">Filtra por día de entrega</span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {/* Option: Todos */}
              <button
                onClick={() => setSelectedAgendaDay('all')}
                className={`p-3 rounded-2xl border text-center transition flex flex-col justify-between items-center cursor-pointer ${
                  selectedAgendaDay === 'all' 
                    ? 'border-[#c5a85c] bg-amber-50/20 text-[#a38439] font-black' 
                    : 'border-slate-150 bg-white text-slate-650 font-bold hover:bg-slate-50'
                }`}
              >
                <span className="text-xs">Todos</span>
                <span className="text-lg pt-1 font-black">📅</span>
                <span className="text-[9px] mt-1 bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-black">
                  {orders.length}
                </span>
              </button>

              {/* 7 Days calendar render */}
              {[
                { dateStr: '2026-06-04', dayName: 'Jue', dayNum: '04', fullLabel: 'Hoy Jueves 4' },
                { dateStr: '2026-06-05', dayName: 'Vie', dayNum: '05', fullLabel: 'Mañana Viernes 5' },
                { dateStr: '2026-06-06', dayName: 'Sáb', dayNum: '06', fullLabel: 'Sábado 6' },
                { dateStr: '2026-06-07', dayName: 'Dom', dayNum: '07', fullLabel: 'Domingo 7' },
                { dateStr: '2026-06-08', dayName: 'Lun', dayNum: '08', fullLabel: 'Lunes 8' },
                { dateStr: '2026-06-09', dayName: 'Mar', dayNum: '09', fullLabel: 'Martes 9' },
                { dateStr: '2026-06-10', dayName: 'Mié', dayNum: '10', fullLabel: 'Miércoles 10' },
              ].map((day) => {
                // Count orders for this scheduled day
                // Match order dynamic dateStr with deliveryDate
                const orderCount = orders.filter(o => o.deliveryDate === day.dateStr).length;

                return (
                  <button
                    key={day.dateStr}
                    onClick={() => setSelectedAgendaDay(day.dateStr)}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col justify-between items-center cursor-pointer ${
                      selectedAgendaDay === day.dateStr 
                        ? 'border-[#c5a85c] bg-amber-50/20 text-[#a38439] font-black' 
                        : 'border-slate-150 bg-white text-slate-650 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold text-slate-400">{day.dayName}</span>
                    <span className="text-base pt-0.5 font-bold text-slate-850">{day.dayNum}</span>
                    <span className={`text-[8px] mt-1.5 px-1 py-0.5 rounded font-black ${
                      orderCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {orderCount} envíos
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIVE DISPATCH LIST TABLE */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-50 pb-3">
              <div>
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Despacho de Pedidos Activos</h4>
                <p className="text-xs text-slate-400 font-semibold pt-0.5">
                  Mostrando envíos para: <strong className="text-slate-700">{selectedAgendaDay === 'all' ? 'Historial Completo' : `Día: ${selectedAgendaDay}`}</strong>
                </p>
              </div>

              {/* Search filter input */}
              <div className="relative w-full sm:w-64">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search size={14} />
                </span>
                <input
                  type="text"
                  placeholder="Buscar por cliente u orden..."
                  value={deliverySearch}
                  onChange={e => setDeliverySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            {/* Render table or cards */}
            {orders.filter(o => {
              const matchedSearch = o.customerName.toLowerCase().includes(deliverySearch.toLowerCase()) || o.id.toLowerCase().includes(deliverySearch.toLowerCase());
              const matchedDay = selectedAgendaDay === 'all' || o.deliveryDate === selectedAgendaDay;
              return matchedSearch && matchedDay;
            }).length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl text-slate-450 text-xs">
                <p className="font-bold text-slate-600">Ningún pedido programado para esta selección.</p>
                <p className="text-[11px] text-slate-400 pt-1">
                  Cambia de día o crea una nueva compra en el Checkout asignando una fecha especial.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orders
                  .filter(o => {
                    const matchedSearch = o.customerName.toLowerCase().includes(deliverySearch.toLowerCase()) || o.id.toLowerCase().includes(deliverySearch.toLowerCase());
                    const matchedDay = selectedAgendaDay === 'all' || o.deliveryDate === selectedAgendaDay;
                    return matchedSearch && matchedDay;
                  })
                  .map((order) => {
                    // Find assigned courier if any
                    const assignedCourier = couriers.find(c => c.id === order.deliveryCourierId);

                    return (
                      <div 
                        key={order.id} 
                        className={`p-4 rounded-2xl border transition hover:shadow-xs space-y-4 bg-white ${
                          order.deliveryStatus === 'delivered' ? 'border-green-100 bg-green-50/5' : 
                          order.deliveryStatus === 'launched' ? 'border-amber-200 bg-amber-50/5 animate-pulse' :
                          'border-slate-200'
                        }`}
                      >
                        {/* Title Row */}
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 font-mono">ID: {order.id}</span>
                            <h5 className="text-sm font-extrabold text-slate-800 pt-0.5">{order.customerName}</h5>
                            <p className="text-[10px] text-slate-400 font-medium">Llegada: {order.deliveryDate ? `Programado (${order.deliveryDate})` : 'Día siguiente (Sincronizado)'}</p>
                          </div>

                          <div className="text-right">
                            <span className={`px-2 py-0.5 rounded text-[9.5px] font-black uppercase tracking-wide inline-block ${
                              order.deliveryStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.deliveryStatus === 'launched' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                              order.deliveryCourierId ? 'bg-indigo-100 text-indigo-900 border border-indigo-250' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {order.deliveryStatus === 'delivered' ? '✓ Entregado' :
                               order.deliveryStatus === 'launched' ? '🌎 Público' :
                               order.deliveryCourierId ? 'Asignado' : 'Sin Despegar'}
                            </span>
                            <p className="text-[10px] font-black text-[#c5a85c] pt-1">${order.total.toLocaleString()} MXN</p>
                          </div>
                        </div>

                        {/* Order Items description */}
                        <div className="p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-650 flex flex-col gap-1 font-semibold">
                          <p className="text-[9px] font-black uppercase text-slate-400">Canasta de Compra</p>
                          <p className="truncate text-slate-700">{order.productNames.join(', ')}</p>
                        </div>

                        {/* Assignment Details */}
                        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2 text-xs">
                          <div className="flex justify-between items-center leading-none">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase">Vehículo & Repartidor</span>
                            <span className="text-[10px] text-[#c5a85c] font-black">
                              {order.deliveryStatus ? order.deliveryStatus.toUpperCase() : 'NO DESPACHADO'}
                            </span>
                          </div>

                          {assignedCourier ? (
                            <div className="flex items-center gap-2 pt-1">
                              <img 
                                src={assignedCourier.photoUrl} 
                                alt={assignedCourier.name} 
                                className="w-8 h-8 rounded-full object-cover border border-slate-200"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <p className="font-extrabold text-slate-805 leading-none">{assignedCourier.name}</p>
                                <p className="text-[9.5px] text-slate-405 font-mono capitalize mt-1">Cel: {assignedCourier.phone}</p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-500 italic pt-1">Ningún repartidor se ha hecho cargo de esta entrega.</p>
                          )}
                        </div>

                        {/* Logistics Actions (Asignar, Lanzar, Overrule) */}
                        <div className="space-y-2 pt-1 border-t border-slate-100">
                          
                          {/* 1. ASSIGN Dropdown selection */}
                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase block tracking-wider">Asignar Repartidor Específico</label>
                            
                            <select
                              value={order.deliveryCourierId || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val && onUpdateOrderDelivery) {
                                  onUpdateOrderDelivery(order.id, 'assigned', val);
                                  onAddLog(`Se asignó manualmente el pedido ${order.id} al repartidor ${couriers.find(c => c.id === val)?.name}`, 'info');
                                  showToast('Repartidor asignado correctamente', 'success');
                                }
                              }}
                              className="w-full text-xs font-bold p-2 border border-slate-200 rounded-lg outline-none bg-white text-slate-808"
                            >
                              <option value="">-- Seleccionar de la flotilla autorizada --</option>
                              {couriers.filter(c => c.status === 'active').map(c => (
                                <option key={c.id} value={c.id}>{c.name} ({c.vehicle.toUpperCase()})</option>
                              ))}
                            </select>
                          </div>

                          {/* 2. LAUNCH / LANZAR Button & OVERRULES */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                if (onUpdateOrderDelivery) {
                                  onUpdateOrderDelivery(order.id, 'launched', '');
                                  onAddLog(`Se liberó el pedido ${order.id} para reparto público`, 'warning');
                                  showToast('¡Pedido lanzado a la bolsa pública de reparto éxitosamente!', 'info');
                                }
                              }}
                              className="flex-1 py-1.5 border border-[#c19a45]/30 hover:bg-[#c5a85c]/10 text-[#a38439] text-[10px] font-black uppercase rounded-lg transition text-center cursor-pointer shadow-2xs"
                            >
                              🚀 Lanzar Pedido al Aire
                            </button>

                            {/* Overrule Step changer dropdown */}
                            <select
                              value={order.deliveryStatus || ''}
                              onChange={(e) => {
                                const statusVal = e.target.value as any;
                                if (statusVal && onUpdateOrderDelivery) {
                                  onUpdateOrderDelivery(order.id, statusVal, order.deliveryCourierId);
                                  showToast(`Estatus modificado manualmente: ${statusVal}`, 'info');
                                }
                              }}
                              className="w-24 text-[10px] uppercase font-black bg-slate-50 border border-slate-200 text-slate-650 px-2 rounded-lg outline-none cursor-pointer"
                            >
                              <option value="">Estatus...</option>
                              <option value="launched">launched</option>
                              <option value="accepted">accepted</option>
                              <option value="collected">collected</option>
                              <option value="in_transit">in_transit</option>
                              <option value="with_customer">with_customer</option>
                              <option value="delivered">delivered</option>
                            </select>
                          </div>

                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ================================== TAB 4: GESTION DE MENSAJEROS ================================== */}
      {activeTab === 'entrega_mensajeros' && (
        <motion.div
          key="couriers_management_tab"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          id="admin_couriers_wrapper"
        >
          {/* LEFT AREA: REPARTIDORES LIST (2/3 width on desktop) */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-50 pb-3">
              <div>
                <h3 className="text-base font-serif font-black text-slate-800">Flotilla de Reparto Atelier</h3>
                <p className="text-xs text-slate-500 mt-1">Supervisa solicitudes, valida expedientes con identificaciones, edita placas o teléfonos, y autoriza choferes.</p>
              </div>

              <div className="text-right">
                <span className="px-2.5 py-1 bg-amber-50 text-[#a38439] rounded-lg font-black text-xs border border-[#c5a85c]/30">
                  👥 Flota: {couriers.length} choferes
                </span>
              </div>
            </div>

            {/* Couriers Grid rendering */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {couriers.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCourierAdmin(c);
                    setEditPlate(c.vehiclePlate || '');
                    setEditPhone(c.phone || '');
                  }}
                  className={`w-full p-4 rounded-2xl border text-left flex justify-between items-start transition cursor-pointer hover:bg-slate-50 ${
                    selectedCourierAdmin?.id === c.id ? 'border-[#c5a85c] bg-[#c5a85c]/5 shadow-xs' : 'border-slate-150 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img 
                        src={c.photoUrl} 
                        alt={c.name} 
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <span className={`absolute bottom-[-2px] right-[-2px] w-3 h-3 border-2 border-white rounded-full ${
                        c.status === 'active' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'
                      }`} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800 leading-tight">{c.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono capitalize pt-0.5">{c.vehicle} • {c.vehiclePlate || 'BICI'}</p>
                      <p className="text-[9px] text-slate-400 font-bold mt-1">⭐ {c.rating} • {c.completedDeliveries} entregas</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase ${
                      c.status === 'active' ? 'bg-green-50 text-green-700' :
                      c.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {c.status === 'active' ? '✓ Activo' :
                       c.status === 'pending' ? 'En Revisión' : 'Bloqueado'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT AREA: COURIER ANALYSER & DOCUMENT INSPECT DESK */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs text-left">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-serif font-black text-slate-900 flex items-center gap-1.5">
                <UserCheck size={16} className="text-[#c5a85c]" />
                Expediente de Conductor
              </h3>
            </div>

            {!selectedCourierAdmin ? (
              <div className="p-8 text-center text-slate-400 font-bold border border-dashed border-slate-150 rounded-2xl">
                <span>Selecciona un repartidor a la izquierda para inspeccionar sus documentos oficiales (INE, Licencia) y autorizarlo.</span>
              </div>
            ) : (
              <div className="space-y-4" id="courier_doc_analyser_card">
                
                {/* Visual mini card */}
                <div className="flex items-center gap-3">
                  <img 
                    src={selectedCourierAdmin.photoUrl} 
                    alt={selectedCourierAdmin.name} 
                    className="w-12 h-12 rounded-full object-cover border border-slate-100 shadow-2xs"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-sm font-black text-slate-800 leading-none">{selectedCourierAdmin.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-1 pt-0.5 capitalize">Flotilla: {selectedCourierAdmin.vehicle}</p>
                  </div>
                </div>

                {/* EDIT FIELDS FORM */}
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
                  <p className="text-[9.5px] font-black uppercase text-slate-400 border-b border-slate-100 pb-1">✏️ Actualizar Datos Vehiculares</p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 block uppercase">Placas</label>
                      <input 
                        type="text" 
                        value={editPlate}
                        onChange={e => setEditPlate(e.target.value.toUpperCase())}
                        placeholder="MX-433-AA"
                        className="w-full px-2 py-1.5 text-xs font-bold border border-slate-200 rounded-lg outline-none bg-white text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 block uppercase">Teléfono</label>
                      <input 
                        type="text" 
                        value={editPhone}
                        onChange={e => setEditPhone(e.target.value)}
                        placeholder="55-3211-9233"
                        className="w-full px-2 py-1.5 text-xs font-bold border border-slate-200 rounded-lg outline-none bg-white text-slate-800"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (onUpdateCourier) {
                        const updated = {
                          ...selectedCourierAdmin,
                          vehiclePlate: editPlate.trim() || undefined,
                          phone: editPhone.trim()
                        };
                        onUpdateCourier(updated);
                        setSelectedCourierAdmin(updated);
                        onAddLog(`Se modificaron teléfonos/placas de mensajero ${selectedCourierAdmin.name} manualmente`, 'warning');
                        showToast('Datos de chofer guardados con éxito', 'success');
                      }
                    }}
                    className="w-full py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-black uppercase rounded-lg transition cursor-pointer"
                  >
                    Guardar Cambios de Chofer
                  </button>
                </div>

                {/* DOCUMENT VIEWER INSPECTOR CARD */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase text-slate-400 leading-none pb-1 font-sans">📁 Análisis de Documentos INE y Licencia</p>
                  
                  {/* DOCUMENT 1: INE MOCKUP */}
                  <div className="p-3 border border-slate-200 rounded-xl space-y-2 bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden" id="mexican_ine_mockup">
                    <div className="flex justify-between items-center text-[10px] font-black border-b border-slate-200 pb-1.5 text-indigo-900 leading-none">
                      <span className="flex items-center gap-1">🆔 IDENTIFICACIÓN / INE MOCKUP</span>
                      <span className="text-xs">🛡️</span>
                    </div>

                    <div className="flex gap-2 text-[9px] font-mono text-slate-600 leading-normal">
                      <div className="w-14 h-16 bg-slate-200 border border-slate-350 rounded flex items-center justify-center text-xs shrink-0 select-none font-bold">
                        👤 FOTO
                      </div>
                      <div className="space-y-0.5">
                        <p><strong className="text-slate-800">NOMBRE:</strong> {selectedCourierAdmin.name.toUpperCase()}</p>
                        <p><strong className="text-slate-700">DOMICILIO:</strong> AV. CENTRAL 430, CDMX</p>
                        <p className="truncate w-36"><strong className="text-slate-705">INE DOC:</strong> {selectedCourierAdmin.documents.ine}</p>
                      </div>
                    </div>
                  </div>

                  {/* DOCUMENT 2: LICENCIA MOCKUP */}
                  <div className="p-3 border border-slate-200 rounded-xl space-y-2 bg-gradient-to-br from-slate-50 to-slate-100 text-xs text-slate-600" id="mexican_licencia_mockup">
                    <div className="flex justify-between items-center text-[10px] font-black border-b border-slate-150 pb-1 text-emerald-900 font-mono leading-none">
                      <span>🪪 LICENCIA DE CONDUCIR</span>
                      <span>✓ VERIFICADA</span>
                    </div>

                    <div className="text-[9.5px] leading-relaxed font-mono space-y-1 text-slate-600">
                      <p><strong className="text-slate-800 uppercase font-bold">TIPO:</strong> Chofer Particular Clase A</p>
                      <p><strong className="text-slate-800 uppercase font-bold">LIC-NUM:</strong> LN-{selectedCourierAdmin.id.replace('MSJ-', 'MX842')}</p>
                      <p className="truncate w-44"><strong className="text-slate-800 uppercase font-bold">ARCHIVO:</strong> {selectedCourierAdmin.documents.license}</p>
                    </div>
                  </div>
                </div>

                {/* APPROVE / REJECT AUTHORIZATION TRIGGER BUTTONS */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex gap-2">
                    {selectedCourierAdmin.status !== 'active' ? (
                      <button
                        onClick={() => {
                          if (onUpdateCourier) {
                            const updated = { ...selectedCourierAdmin, status: 'active' as const };
                            onUpdateCourier(updated);
                            setSelectedCourierAdmin(updated);
                            onAddLog(`El administrador felipe autorizó al mensajero ${selectedCourierAdmin.name} como REPARTIDOR OFICIAL`, 'info');
                            showToast(`¡Conductor ${selectedCourierAdmin.name} AUTORIZADO! Ahora puede recibir despachos`, 'success');
                          }
                        }}
                        className="flex-1 py-2.5 bg-[#c5a85c] hover:bg-[#b59549] text-white text-xs font-black uppercase tracking-wider rounded-lg transition text-center cursor-pointer shadow-xs"
                      >
                        ✓ Autorizar Repartidor
                      </button>
                    ) : (
                      <div className="flex-1 py-2 bg-green-50 text-green-800 text-xs font-black rounded-lg uppercase tracking-wider text-center flex items-center justify-center gap-1">
                        <span>✓ Repartidor Autorizado</span>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        if (confirm(`¿Estás seguro de declinar la solicitud de ${selectedCourierAdmin.name}? No podrá ingresar al dashboard de entregas.`)) {
                          if (onUpdateCourier) {
                            const updated = { ...selectedCourierAdmin, status: 'rejected' as const };
                            onUpdateCourier(updated);
                            setSelectedCourierAdmin(updated);
                            onAddLog(`Se declinó la solicitud del mensajero ${selectedCourierAdmin.name}`, 'warning');
                            showToast('Solicitud rechazada', 'danger');
                          }
                        }
                      }}
                      className="py-2.5 px-3 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-lg transition cursor-pointer"
                    >
                      Declinar
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ================================== TAB 5: CONTROL DE SERVICIOS Y SOLICITUDES DE LIMPIEZA ================================== */}
      {activeTab === 'servicios_control' && (
        <motion.div
          key="servicios_control_tab"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 text-left"
          id="admin_servicios_control_wrapper"
        >
          {/* Service Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Total Solicitudes</p>
              <h4 className="text-xl font-bold text-slate-900 font-serif mt-1">{services.length}</h4>
            </div>
            <div className="bg-sky-50/50 p-4 rounded-xl border border-sky-100">
              <p className="text-[9px] font-black uppercase text-sky-600 tracking-wider">Programadas</p>
              <h4 className="text-xl font-bold text-sky-700 font-serif mt-1">
                {services.filter(s => s.status === 'programado').length}
              </h4>
            </div>
            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
              <p className="text-[9px] font-black uppercase text-amber-600 tracking-wider">En Ruta/Progreso</p>
              <h4 className="text-xl font-bold text-amber-700 font-serif mt-1">
                {services.filter(s => s.status === 'en_progreso').length}
              </h4>
            </div>
            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
              <p className="text-[9px] font-black uppercase text-emerald-600 tracking-wider">Completadas</p>
              <h4 className="text-xl font-bold text-emerald-700 font-serif mt-1">
                {services.filter(s => s.status === 'completado').length}
              </h4>
            </div>
            <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100">
              <p className="text-[9px] font-black uppercase text-rose-600 tracking-wider">Canceladas</p>
              <h4 className="text-xl font-bold text-rose-700 font-serif mt-1">
                {services.filter(s => s.status === 'cancelado').length}
              </h4>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT AREA: SOLICITUDES DE LIMPIEZA RECIBIDAS (2/3 width on large) */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-lg font-serif font-black text-slate-800">Solicitudes de Limpieza Recibidas</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Consulta la lista de solicitudes enviadas por clientes y cambia su estado de operación en tiempo real.</p>
                </div>
              </div>

              {/* Filters Panel inside Services requests */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Filtrar por Especialidad / Cliente</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={adminServiceSearch}
                      onChange={(e) => setAdminServiceSearch(e.target.value)}
                      placeholder="Nombre, correo o ID..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#c5a85c]"
                    />
                    <Search size={12} className="absolute left-2.5 top-2.5 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Filtrar por Estado</label>
                  <select
                    value={adminServiceStatusFilter}
                    onChange={(e) => setAdminServiceStatusFilter(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-bold bg-white text-slate-800 cursor-pointer"
                  >
                    <option value="todos">🌐 Todos los Estados</option>
                    <option value="programado">📅 Programado</option>
                    <option value="en_progreso">🚚 En Ruta</option>
                    <option value="completado">✅ Completado</option>
                    <option value="cancelado">❌ Cancelado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Prioridad</label>
                  <select
                    value={adminServicePriorityFilter}
                    onChange={(e) => setAdminServicePriorityFilter(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-bold bg-white text-slate-800 cursor-pointer"
                  >
                    <option value="todos">🌐 Todas las Prioridades</option>
                    <option value="Baja">🔵 Baja</option>
                    <option value="Media">🟡 Media</option>
                    <option value="Alta">🔴 Alta</option>
                  </select>
                </div>
              </div>

              {/* Solicitudes list */}
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                {services.filter(req => {
                  const mSearch = req.clientName.toLowerCase().includes(adminServiceSearch.toLowerCase()) ||
                    req.clientEmail.toLowerCase().includes(adminServiceSearch.toLowerCase()) ||
                    req.id.toLowerCase().includes(adminServiceSearch.toLowerCase()) ||
                    req.serviceType.toLowerCase().includes(adminServiceSearch.toLowerCase());
                  const mStatus = adminServiceStatusFilter === 'todos' || req.status === adminServiceStatusFilter;
                  const mPriority = adminServicePriorityFilter === 'todos' || req.priority === adminServicePriorityFilter;
                  return mSearch && mStatus && mPriority;
                }).length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl">
                    <span className="text-xl">🤷‍♂️</span>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">No se encontraron solicitudes con los filtros aplicados</p>
                  </div>
                ) : (
                  services.filter(req => {
                    const mSearch = req.clientName.toLowerCase().includes(adminServiceSearch.toLowerCase()) ||
                      req.clientEmail.toLowerCase().includes(adminServiceSearch.toLowerCase()) ||
                      req.id.toLowerCase().includes(adminServiceSearch.toLowerCase()) ||
                      req.serviceType.toLowerCase().includes(adminServiceSearch.toLowerCase());
                    const mStatus = adminServiceStatusFilter === 'todos' || req.status === adminServiceStatusFilter;
                    const mPriority = adminServicePriorityFilter === 'todos' || req.priority === adminServicePriorityFilter;
                    return mSearch && mStatus && mPriority;
                  }).map(req => (
                    <div 
                      key={req.id}
                      className="p-4 border border-slate-200 rounded-2xl bg-white hover:border-slate-300 transition-all space-y-3 shadow-xs"
                    >
                      <div className="flex flex-wrap justify-between items-start gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase text-slate-450 tracking-wider font-mono bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                              {req.id}
                            </span>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border ${
                              req.priority === 'Alta' ? 'bg-red-50 text-red-700 border-red-100' :
                              req.priority === 'Media' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                              'bg-blue-50 text-blue-700 border-blue-100'
                            }`}>
                              Prioridad {req.priority}
                            </span>
                          </div>
                          <h4 className="font-serif font-black text-slate-800 text-sm sm:text-base mt-2">
                            {req.clientName}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium">
                            📩 {req.clientEmail} • 📅 {new Date(req.date).toLocaleDateString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <span className="text-sm sm:text-base font-black text-slate-900 block font-mono">
                            ${req.price} MXN
                          </span>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg mt-1 inline-block border ${
                            req.status === 'programado' ? 'bg-sky-50 text-sky-700 border-sky-100' :
                            req.status === 'en_progreso' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            req.status === 'completado' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            'bg-rose-50 text-rose-700 border-rose-100'
                          }`}>
                            {req.status === 'programado' ? 'PROG.' : req.status === 'en_progreso' ? 'EN RUTA' : req.status === 'completado' ? 'COMPLETADO' : 'CANCELADO'}
                          </span>
                        </div>
                      </div>

                      {/* Details specs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div>
                          <p className="font-black text-slate-450 uppercase text-[9px] mb-0.5">Surtido de Servicios Solicitados</p>
                          <span className="font-bold text-slate-850 text-purple-700">{req.serviceType}</span>
                        </div>
                        <div>
                          <p className="font-black text-slate-450 uppercase text-[9px] mb-0.5">Dirección de Limpieza</p>
                          <span className="font-bold text-slate-700">{req.address}</span>
                        </div>
                      </div>

                      {req.notes && (
                        <div>
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-0.5">Instrucciones Especiales</p>
                          <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed font-mono">
                            "{req.notes}"
                          </p>
                        </div>
                      )}

                      {/* Display image with referring policy */}
                      {req.uploadedPhoto && (
                        <div>
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Foto Adjuntada (Evidencia/Antes)</p>
                          <div 
                            className="relative group w-36 h-24 rounded-xl overflow-hidden border border-slate-200 cursor-pointer shadow-xs" 
                            onClick={() => setSelectedPreviewImage(req.uploadedPhoto || null)}
                          >
                            <img 
                              src={req.uploadedPhoto} 
                              alt="Evidencia del servicio" 
                              className="w-full h-full object-cover transition duration-300 group-hover:scale-110" 
                              referrerPolicy="no-referrer" 
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[10px] font-black">
                              🔍 AMPLIAR FOTO
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action operators */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-100">
                        {/* Assign staff */}
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-black uppercase text-slate-450">Técnico Asignado:</label>
                          <input 
                            type="text" 
                            defaultValue={req.assignedStaff || 'Por Asignar (Coordinador)'} 
                            placeholder="Escribir técnico..."
                            onBlur={(e) => {
                              req.assignedStaff = e.target.value;
                              onAddLog(`Personal asignado a solicitud ${req.id}: ${e.target.value}`, 'info');
                              showToast(`Asignación guardada para ${req.id}`, 'info');
                            }}
                            className="px-2.5 py-1 text-xs font-bold border border-slate-250 bg-white rounded-lg focus:border-[#c5a85c] text-slate-800 w-44"
                          />
                        </div>

                        {/* Status dropdown */}
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-black uppercase text-slate-450">Actualizar Estado:</label>
                          <select
                            value={req.status}
                            onChange={(e) => {
                              const newSt = e.target.value as ServiceStatus;
                              onUpdateServiceStatus?.(req.id, newSt);
                            }}
                            className="px-2.5 py-1 text-xs font-bold border border-slate-250 bg-white text-slate-800 rounded-lg focus:outline-none cursor-pointer"
                          >
                            <option value="programado">📅 Programado</option>
                            <option value="en_progreso">🚚 En Ruta</option>
                            <option value="completado">✅ Completado (Entregado)</option>
                            <option value="cancelado">❌ Cancelado</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* RIGHT AREA: CATALOGO MAESTRO DE SERVICIOS */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-sm flex flex-col">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between items-start gap-2">
                <div>
                  <h3 className="text-lg font-serif font-black text-slate-800 flex items-center gap-1.5">
                    <Sparkles size={18} className="text-[#c5a85c]" />
                    Catálogo de Servicios
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Controla las opciones que el cliente puede agendar.</p>
                </div>
                
                <button
                  onClick={() => {
                    handleOpenAddProduct();
                    setPCategory('Servicios');
                  }}
                  className="px-3.5 py-2 bg-gradient-to-r from-slate-900 to-indigo-950 text-white font-black text-xs rounded-xl flex items-center gap-1.5 hover:opacity-95 cursor-pointer shadow-xs"
                >
                  <PlusCircle size={13} />
                  Añadir Servicio
                </button>
              </div>

              {/* List of services in master table catalog */}
              <div className="space-y-3 overflow-y-auto max-h-[64vh] pr-1 flex-1">
                {products.filter(p => p.category === 'Servicios').length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs font-bold">
                    No hay servicios registrados en esta categoría.
                  </div>
                ) : (
                  products.filter(p => p.category === 'Servicios').map(prod => (
                    <div 
                      key={prod.id} 
                      className={`p-3.5 rounded-2xl border transition-all space-y-2 ${
                        prod.active !== false 
                          ? 'bg-neutral-bg/60 border-slate-200 hover:border-slate-350' 
                          : 'bg-slate-50 border-slate-150/80 opacity-75'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-black font-mono text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded-md">
                              {prod.sku}
                            </span>
                            {prod.active !== false ? (
                              <span className="px-1.5 py-0.2 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[8px] font-black rounded-lg">
                                ACTIVO
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.2 bg-rose-50 border border-rose-100 text-rose-600 text-[8px] font-black rounded-lg">
                                INACTIVO
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm mt-1.5">{prod.name}</h4>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">{prod.description}</p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs sm:text-sm font-black text-slate-900 block font-mono">
                            ${prod.price} MXN
                          </span>
                        </div>
                      </div>

                      {/* Operators */}
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                        {/* Toggle active button */}
                        <button
                          onClick={() => {
                            onUpdateProduct({
                              ...prod,
                              active: prod.active === false ? true : false
                            });
                            onAddLog(`Estado del servicio "${prod.name}" cambiado desde el gestor de servicios`, 'info');
                            showToast(`Servicio "${prod.name}" ${prod.active === false ? 'Activado' : 'De-activado'}`, 'success');
                          }}
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg border transition cursor-pointer ${
                            prod.active !== false 
                              ? 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100' 
                              : 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'
                          }`}
                        >
                          {prod.active !== false ? '🚫 Desactivar' : '⚡ Activar'}
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="p-1 px-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-650 hover:text-slate-905 transition text-[10px] font-bold rounded-lg cursor-pointer"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleDeleteProductClick(prod.id, prod.name)}
                            className="p-1 px-2 bg-red-50 hover:bg-red-100 border border-red-150 text-red-650 transition text-[10px] font-bold rounded-lg cursor-pointer"
                            title="Eliminar de forma permanente"
                          >
                            🗑️ Borrar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </motion.div>
      )}

      {/* Modal para previsualización de imagen ampliada */}
      <AnimatePresence>
        {selectedPreviewImage && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-50 flex items-center justify-center p-4" onClick={() => setSelectedPreviewImage(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden p-2 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedPreviewImage(null)}
                className="absolute top-4 right-4 bg-slate-900/80 hover:bg-slate-950 text-white rounded-full p-2 z-10 transition cursor-pointer"
              >
                <X size={18} />
              </button>
              <img src={selectedPreviewImage} alt="Previsualización Ampliada" className="w-full h-auto max-h-[85vh] object-contain rounded-xl" referrerPolicy="no-referrer" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showProductModal && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 text-left relative overflow-hidden"
              id="admin_product_form_modal"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <span className="px-3 py-1 bg-[#c5a85c]/10 text-[#c5a85c] rounded-lg text-xs font-black uppercase tracking-wider">
                    {editingProduct ? 'Modificando Ficha de Artículo' : 'Nuevo Registro de Tienda'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-black text-slate-850 mt-1">
                    {editingProduct ? `Editar: ${editingProduct.name}` : 'Registrar Producto del E-commerce'}
                  </h3>
                </div>
                <button 
                  onClick={() => setShowProductModal(false)}
                  className="p-1.5 px-3 hover:bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-750 text-sm font-black rounded-lg cursor-pointer transition"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitProductForm} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-500 tracking-wider mb-1">Nombre Comercial del Producto</label>
                    <input
                      type="text"
                      required
                      value={pName}
                      onChange={(e) => setPName(e.target.value)}
                      placeholder="Ej. Tenis Deportivos Pro-Run"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm sm:text-base font-bold text-slate-805 bg-slate-50 focus:border-[#c5a85c] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-slate-500 tracking-wider mb-1">Categoría del E-commerce / Servicios</label>
                    <select
                      value={pCategory}
                      onChange={(e) => {
                        const val = e.target.value as 'Productos de limpieza' | 'Zapatos' | 'Servicios';
                        setPCategory(val);
                      }}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm sm:text-base font-bold bg-white text-slate-805 bg-slate-50 focus:border-[#c5a85c] focus:outline-none"
                    >
                      <option value="Productos de limpieza">🧴 Productos de limpieza</option>
                      <option value="Zapatos">👠 Zapatos (Calzado)</option>
                      <option value="Servicios">✨ Servicios de Limpieza (Sincronizado)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-500 tracking-wider mb-1">SKU Oficial</label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        required
                        value={pSku}
                        onChange={(e) => setPSku(e.target.value)}
                        placeholder="HML-SKU"
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-805 bg-slate-50 focus:border-[#c5a85c] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleGenerateSku}
                        className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-650 border border-slate-205 text-xs font-black rounded-xl transition cursor-pointer"
                        title="Auto-generar código"
                      >
                        ⚡ Generar
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-slate-500 tracking-wider mb-1">Precio Unitario ($ MXN)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={pPrice === 0 ? '' : pPrice}
                      onChange={(e) => setPPrice(Math.round(Number(e.target.value)))}
                      placeholder="Precio..."
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-mono font-black text-slate-805 bg-slate-50 focus:border-[#c5a85c] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-slate-500 tracking-wider mb-1">Stock Almacén Inicial</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={pStock === 0 ? '' : pStock}
                      onChange={(e) => setPStock(Math.round(Number(e.target.value)))}
                      placeholder="Unidades..."
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-mono font-black text-slate-805 bg-slate-50 focus:border-[#c5a85c] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Product Image Option Selection with URL and Upload methods */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center pb-1">
                    <label className="block text-xs font-black uppercase text-slate-500 tracking-wider">Foto Ilustrativa del Producto</label>
                    <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setProdImageUploadType('url')}
                        className={`px-3 py-1 rounded text-xs font-black tracking-wider transition cursor-pointer ${prodImageUploadType === 'url' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        Enlace (URL)
                      </button>
                      <button
                        type="button"
                        onClick={() => setProdImageUploadType('upload')}
                        className={`px-3 py-1 rounded text-xs font-black tracking-wider transition cursor-pointer ${prodImageUploadType === 'upload' ? 'bg-white text-[#c5a85c] shadow-xs' : 'text-slate-500 hover:text-slate-805'}`}
                      >
                        Subir Archivo 📤
                      </button>
                    </div>
                  </div>

                  {prodImageUploadType === 'url' ? (
                    <input
                      type="text"
                      value={pImgUrl.startsWith('data:') ? '' : pImgUrl}
                      onChange={(e) => setPImgUrl(e.target.value)}
                      placeholder="https://ejemplo.com/foto-producto.jpg (Dejar vacío para predeterminada)"
                      className="w-full px-3.5 py-2.5 border border-slate-205 rounded-xl text-sm font-mono text-slate-700 bg-slate-50 focus:border-[#c5a85c] focus:outline-none"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (typeof reader.result === 'string') {
                                  setPImgUrl(reader.result);
                                  showToast('¡Imagen local cargada con éxito!', 'success');
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="w-full text-sm text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-[#c5a85c]/10 file:text-[#a38439] hover:file:bg-[#c5a85c]/20 file:cursor-pointer cursor-pointer"
                        />
                      </div>
                      {pImgUrl.startsWith('data:') && (
                        <div className="w-12 h-12 rounded-xl border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center bg-slate-50 shadow-xs">
                          <img src={pImgUrl} alt="Vista previa del artículo" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  )}
                  <span className="text-xs text-slate-500 block mt-1">
                    {prodImageUploadType === 'url' 
                      ? 'Inserta un enlace web directo. Si lo dejas vacío, usaremos una imagen genérica alusiva.' 
                      : 'Carga un archivo PNG, JPG o WEBP directo desde tu dispositivo para almacenarlo localmente.'}
                  </span>
                </div>

                {/* Active/Inactive Status Switch */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="space-y-0.5">
                    <span className="text-sm font-black text-slate-805 block">Estatus de Disponibilidad</span>
                    <span className="text-xs text-slate-500 block leading-normal">Determina si este producto estará visible/activo para la venta en el e-commerce.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPActive(!pActive)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${pActive ? 'bg-[#c5a85c]' : 'bg-slate-300'}`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${pActive ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 tracking-wider mb-1">Descripción Comercial de Ficha Técnica</label>
                  <textarea
                    required
                    value={pDesc}
                    onChange={(e) => setPDesc(e.target.value)}
                    rows={3}
                    placeholder="Describe los beneficios ecológicos, materiales, tallas, o atributos de alto impacto del producto..."
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-slate-50 focus:border-[#c5a85c] focus:outline-none leading-normal"
                  />
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="flex-1 py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-black transition cursor-pointer"
                  >
                    Salir sin Guardar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl text-sm font-black transition shadow-md hover:scale-[1.01] cursor-pointer"
                  >
                    {editingProduct ? '✓ Guardar Modificaciones' : '✓ Registrar y Publicar Artículo'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================================== MODAL: NUEVO COLABORADOR ================================== */}
      <AnimatePresence>
        {showAddUserModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-6 text-left"
              id="add_user_modal"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="text-base font-serif font-black text-slate-900 flex items-center gap-2">
                  <UserPlus size={18} className="text-[#c5a85c]" />
                  Registrar Colaborador Oficial
                </h3>
                <button 
                  onClick={() => setShowAddUserModal(false)}
                  className="text-slate-400 hover:text-slate-700 text-xs font-black cursor-pointer bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-450 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Ej. Roberto Martínez"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-slate-50 text-slate-800 focus:outline-none"
                    id="new_user_name_input"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-450 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="ejemplo@homeli.mx"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-slate-50 text-slate-800 focus:outline-none"
                    id="new_user_email_input"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-450 mb-1">Rol Operativo</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs font-bold bg-slate-50 text-slate-800 focus:outline-none"
                    id="new_user_role_select"
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Servicios">Servicios (Operador)</option>
                    <option value="Ventas">Ventas Ecommerce (Vendedor)</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="flex-1 py-2 px-4 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl text-xs font-black transition cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl text-xs font-black transition shadow-md cursor-pointer"
                  >
                    Registrar Colaborador
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

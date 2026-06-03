/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ServiceRequest, ProductItem, SalesOrder, SystemLog, UserProfile } from '../types';
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
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminSectionProps {
  services: ServiceRequest[];
  products: ProductItem[];
  orders: SalesOrder[];
  logs: SystemLog[];
  profiles: UserProfile[];
  onAddUser: (user: UserProfile) => void;
  onAddLog: (action: string, severity: 'info' | 'warning' | 'critical') => void;
  onClearLogs: () => void;
  onAddProduct: (product: ProductItem) => void;
  onUpdateProduct: (product: ProductItem) => void;
  onDeleteProduct: (id: string) => void;
  bannerBg?: string;
  bannerTitle?: string;
  bannerTag?: string;
  bannerDesc?: string;
  bannerOverlayCol?: string;
  bannerOverlayOpacity?: number;
  onUpdateBannerSettings?: (bg: string, title: string, tag: string, desc: string, overlayCol: string, overlayOpacity: number) => void;
  activeTab?: 'metrics' | 'ecommerce';
  onChangeTab?: (tab: 'metrics' | 'ecommerce') => void;
}

export default function AdminSection({
  services,
  products,
  orders,
  logs,
  profiles,
  onAddUser,
  onAddLog,
  onClearLogs,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  bannerBg = '',
  bannerTitle = 'Catálogo Exclusivo Atelier',
  bannerTag = 'ATELIER BOUTIQUE',
  bannerDesc = 'Descubre nuestras dos exclusivas divisiones diseñadas meticulosamente para brindar confort personal y sanidad impecable en tu hogar.',
  bannerOverlayCol = '#0f172a',
  bannerOverlayOpacity = 60,
  onUpdateBannerSettings,
  activeTab: propActiveTab,
  onChangeTab: propOnChangeTab
}: AdminSectionProps) {
  // Sync state to handle parent changes in real time
  const [localBannerBg, setLocalBannerBg] = useState(bannerBg);
  const [localBannerTitle, setLocalBannerTitle] = useState(bannerTitle);
  const [localBannerTag, setLocalBannerTag] = useState(bannerTag);
  const [localBannerDesc, setLocalBannerDesc] = useState(bannerDesc);
  const [localBannerOverlayCol, setLocalBannerOverlayCol] = useState(bannerOverlayCol);
  const [localBannerOverlayOpacity, setLocalBannerOverlayOpacity] = useState(bannerOverlayOpacity);

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

  // Navigation tabs: 'metrics' | 'ecommerce' (with 'operational' deactivated as per request)
  const [localActiveTab, setLocalActiveTab] = useState<'metrics' | 'ecommerce'>('metrics');
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
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState<'todos' | 'Productos de limpieza' | 'Zapatos'>('todos');

  // Product modal controllers
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Form states for creating/editing product
  const [pId, setPId] = useState('');
  const [pName, setPName] = useState('');
  const [pSku, setPSku] = useState('');
  const [pPrice, setPPrice] = useState(0);
  const [pStock, setPStock] = useState(0);
  const [pCategory, setPCategory] = useState<'Productos de limpieza' | 'Zapatos'>('Productos de limpieza');
  const [pDesc, setPDesc] = useState('');
  const [pImgUrl, setPImgUrl] = useState('');
  const [pSalesCount, setPSalesCount] = useState(0);
  const [pActive, setPActive] = useState(true);

  // Selector for uploading files vs writing link
  const [prodImageUploadType, setProdImageUploadType] = useState<'url' | 'upload'>('url');
  const [bannerImageUploadType, setBannerImageUploadType] = useState<'url' | 'upload'>('url');

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
    const prefix = pCategory === 'Zapatos' ? 'HML-ZAP' : 'HML-LIM';
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
    setPCategory(prod.category === 'Zapatos' ? 'Zapatos' : 'Productos de limpieza');
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

        {/* Global Action Selector Tabs */}
        <div className="flex gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200/50 self-stretch sm:self-auto justify-center">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-4 py-2 text-xs font-black rounded-xl transition cursor-pointer ${activeTab === 'metrics' ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
          >
            📈 Métricas
          </button>
          <button
            onClick={() => setActiveTab('ecommerce')}
            className={`px-4 py-2 text-xs font-black rounded-xl transition cursor-pointer ${activeTab === 'ecommerce' ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
          >
            🛍️ Admin E-Commerce
          </button>
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
                            p.category === 'Zapatos' ? 'bg-[#c5a85c]' : 'bg-emerald-600'
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
              <h3 className="font-serif font-black text-slate-800 text-[15px] sm:text-lg">Personalización de Cabecera E-commerce</h3>
              <p className="text-xs text-slate-400">Modifica en tiempo real los textos, colores y la imagen de fondo de la tarjeta Atelier Boutique de la tienda.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form Input fields */}
              <form onSubmit={handleSaveBannerSettings} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center pb-0.5">
                    <label className="block text-[10px] font-black uppercase text-slate-450">Imagen de Fondo del Banner</label>
                    <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setBannerImageUploadType('url')}
                        className={`px-2 py-0.5 rounded text-[8px] font-black tracking-wider transition cursor-pointer ${bannerImageUploadType === 'url' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        Enlace (URL)
                      </button>
                      <button
                        type="button"
                        onClick={() => setBannerImageUploadType('upload')}
                        className={`px-2 py-0.5 rounded text-[8px] font-black tracking-wider transition cursor-pointer ${bannerImageUploadType === 'upload' ? 'bg-white text-[#c5a85c] shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
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
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#c5a85c] text-slate-800 font-mono"
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
                          className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-xl file:border-0 file:text-[9px] file:font-black file:bg-[#c5a85c]/10 file:text-[#a38439] hover:file:bg-[#c5a85c]/20 file:cursor-pointer cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                  <p className="text-[9px] text-slate-400 mt-0.5">
                    {bannerImageUploadType === 'url' 
                      ? 'Escribe la URL directa de la imagen de fondo. Deja vacío para usar el color de overlay sólido.' 
                      : 'Carga un archivo PNG, JPG o WEBP directo desde tu dispositivo para almacenarlo localmente.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-450 mb-1">Subtítulo / Etiqueta (Overline)</label>
                    <input
                      type="text"
                      value={localBannerTag}
                      onChange={(e) => setLocalBannerTag(e.target.value)}
                      placeholder="ATELIER BOUTIQUE"
                      maxLength={40}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#c5a85c] text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-450 mb-1">Título de la Tarjeta</label>
                    <input
                      type="text"
                      value={localBannerTitle}
                      onChange={(e) => setLocalBannerTitle(e.target.value)}
                      placeholder="Catálogo Exclusivo Atelier"
                      maxLength={60}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#c5a85c] text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-450 mb-1">Color de Overlay (Filtro tinto)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={localBannerOverlayCol.startsWith('#') && localBannerOverlayCol.length === 7 ? localBannerOverlayCol : '#0f172a'}
                        onChange={(e) => setLocalBannerOverlayCol(e.target.value)}
                        className="w-10 h-8 rounded-lg border border-slate-200 cursor-pointer bg-transparent shrink-0"
                      />
                      <input
                        type="text"
                        value={localBannerOverlayCol}
                        onChange={(e) => setLocalBannerOverlayCol(e.target.value)}
                        placeholder="#0f172a"
                        maxLength={20}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#c5a85c] text-slate-800 font-mono"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-450 mb-1">Opacidad del Overlay ({localBannerOverlayOpacity}%)</label>
                    <div className="flex items-center gap-2 py-1">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={localBannerOverlayOpacity}
                        onChange={(e) => setLocalBannerOverlayOpacity(Number(e.target.value))}
                        className="w-full accent-[#c5a85c] cursor-pointer"
                      />
                      <span className="text-xs font-mono font-bold text-slate-600 w-8 text-right shrink-0">{localBannerOverlayOpacity}%</span>
                    </div>
                  </div>
                </div>

                {/* Pre-sets palette quick select */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-450 mb-1">Paletas de Marca Recomendadas</label>
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
                        className="px-2 py-1 bg-slate-50 border border-slate-200 hover:border-[#c5a85c] rounded-xl text-[9px] font-bold text-slate-650 hover:text-slate-900 transition cursor-pointer flex items-center gap-1.5"
                      >
                        <span className="w-2.5 h-2.5 rounded-full border border-slate-300" style={{ backgroundColor: preset.hex }} />
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-450 mb-1">Descripción de la Tarjeta</label>
                  <textarea
                    value={localBannerDesc}
                    onChange={(e) => setLocalBannerDesc(e.target.value)}
                    placeholder="Escribe los detalles o promociones..."
                    rows={3}
                    maxLength={300}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#c5a85c] text-slate-800 leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-gradient-to-r from-slate-900 to-[#c5a85c] text-white font-black text-xs rounded-xl hover:opacity-95 cursor-pointer shadow-sm transition"
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
                    className="px-3 py-2 text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
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
                <h3 className="font-serif font-black text-slate-800 text-[15px] sm:text-lg">Catálogo Maestro de Artículos</h3>
                <p className="text-xs text-slate-400">Cualquier cambio guardado se reflejará en tiempo real y modificará el stock, fotos y precios de la tienda en línea.</p>
              </div>

            <button
              onClick={handleOpenAddProduct}
              className="px-4 py-2.5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white font-black text-xs rounded-xl flex items-center gap-2 shadow-sm hover:opacity-95 cursor-pointer"
            >
              <PlusCircle size={15} />
              Agregar Producto E-commerce
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            {/* Category Filter Chips */}
            <div className="flex gap-2 self-start">
              {(['todos', 'Productos de limpieza', 'Zapatos'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setCatalogCategoryFilter(cat)}
                  className={`px-3 py-1.5 text-xs font-black rounded-xl transition cursor-pointer border ${
                    catalogCategoryFilter === cat 
                      ? 'bg-[#c5a85c]/10 text-[#c5a85c] border-[#c19a45]/40' 
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {cat === 'todos' ? '🌐 Todos los Productos' : cat === 'Zapatos' ? '👠 Zapatos' : '🧴 Limpieza'}
                </button>
              ))}
            </div>

            {/* Search Input bar */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Buscar por nombre o SKU..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#c5a85c] text-slate-800"
              />
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            </div>
          </div>

          {/* Interactive Products Table Grid */}
          <div className="overflow-x-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-105 text-[11px] font-black uppercase text-slate-450">
                  <th className="p-4">Artículo</th>
                  <th className="p-4">SKU / ID</th>
                  <th className="p-4 text-center">Categoría</th>
                  <th className="p-4 text-right">Inversión</th>
                  <th className="p-4 text-center">Stock Almacén</th>
                  <th className="p-4 text-center">Ventas</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400 bg-slate-50/50">
                      <Package size={24} className="mx-auto mb-2 opacity-50" />
                      No se encontraron productos registrados que cumplan este filtro.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition">
                      {/* Product details thumbnail */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-50 border border-slate-105 shrink-0 flex items-center justify-center">
                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <h5 className="font-serif font-black text-slate-800 leading-tight text-sm hover:text-[#c5a85c] transition-colors">{p.name}</h5>
                            <span className="text-[10px] text-slate-400 font-medium leading-normal line-clamp-1 max-w-[200px] sm:max-w-xs">{p.description}</span>
                          </div>
                        </div>
                      </td>

                      {/* SKU / ID columns */}
                      <td className="p-4 font-mono font-bold text-slate-500 uppercase">{p.sku || p.id}</td>

                      {/* Category Badge columns */}
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                            p.category === 'Zapatos' ? 'bg-[#c5a85c]/10 text-[#c5a85c]' : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {p.category}
                          </span>
                          <span className={`inline-block px-1.5 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider ${
                            p.active !== false 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-rose-55 text-rose-600 border border-rose-200 bg-rose-50'
                          }`}>
                            {p.active !== false ? '● Activo' : '● Pausado'}
                          </span>
                        </div>
                      </td>

                      {/* Price columns */}
                      <td className="p-4 text-right font-mono font-black text-slate-800">${p.price} MXN</td>

                      {/* Stock levels columns */}
                      <td className="p-4 text-center">
                        <span className={`px-2 py-0.5 font-mono font-extrabold rounded-lg ${
                          p.stock <= 0 ? 'bg-red-50 text-red-600 border border-red-200' :
                          p.stock < 15 ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-700'
                        }`}>
                          {p.stock} un
                        </span>
                      </td>

                      {/* Sales items columns */}
                      <td className="p-4 text-center font-mono font-extrabold text-slate-650">{p.salesCount || 0}</td>

                      {/* Interactive Edit / Delete actions */}
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1.5 shrink-0 flex-wrap">
                          <button
                            onClick={() => {
                              onUpdateProduct({ ...p, active: p.active === false });
                              showToast(`Producto "${p.name}" ${p.active === false ? 'activado' : 'desactivado'} con éxito`, 'success');
                            }}
                            className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition cursor-pointer flex items-center gap-1 border ${
                              p.active !== false
                                ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                                : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                            }`}
                            title={p.active !== false ? 'Desactivar de la tienda' : 'Activar en la tienda'}
                          >
                            {p.active !== false ? '⏸️ Desactivar' : '▶️ Activar'}
                          </button>
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-1.5 px-2.5 bg-slate-50 border border-slate-205 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 text-[10px] font-bold transition cursor-pointer"
                            title="Editar propiedades de producto"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleDeleteProductClick(p.id, p.name)}
                            className="p-1.5 px-2 bg-rose-50 border border-rose-105 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-100 text-[10px] font-bold transition cursor-pointer"
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

            <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle size={11} />
                Sincronización de Catálogo Sólida
              </span>
              <span>Servidor Local Homeli Base</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* ================================== MODAL: AGREGAR O EDITAR PRODUCTO EN EL CATALOGO (E-commerce Manager) ================================== */}
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
                  <span className="px-2 py-0.5 bg-[#c5a85c]/10 text-[#c5a85c] rounded text-[10px] font-black uppercase tracking-wider">
                    {editingProduct ? 'Modificando Ficha de Artículo' : 'Nuevo Registro de Tienda'}
                  </span>
                  <h3 className="text-lg sm:text-xl font-serif font-black text-slate-805 mt-1">
                    {editingProduct ? `Editar: ${editingProduct.name}` : 'Registrar Producto del E-commerce'}
                  </h3>
                </div>
                <button 
                  onClick={() => setShowProductModal(false)}
                  className="p-1 px-2 hover:bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-700 text-xs font-black rounded-lg cursor-pointer transition"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitProductForm} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-black uppercase text-slate-450 mb-1">Nombre Comercial del Producto</label>
                    <input
                      type="text"
                      required
                      value={pName}
                      onChange={(e) => setPName(e.target.value)}
                      placeholder="Ej. Tenis Deportivos Pro-Run"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 bg-slate-50 focus:border-[#c5a85c] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-slate-455 mb-1">Categoría del E-commerce</label>
                    <select
                      value={pCategory}
                      onChange={(e) => {
                        const val = e.target.value as 'Productos de limpieza' | 'Zapatos';
                        setPCategory(val);
                      }}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold bg-white text-slate-800 bg-slate-50 focus:border-[#c5a85c] focus:outline-none"
                    >
                      <option value="Productos de limpieza">🧴 Productos de limpieza</option>
                      <option value="Zapatos">👠 Zapatos (Calzado)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-black uppercase text-slate-450 mb-1">SKU Oficial</label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        required
                        value={pSku}
                        onChange={(e) => setPSku(e.target.value)}
                        placeholder="HML-SKU"
                        className="w-full px-2 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 bg-slate-50 focus:border-[#c5a85c] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleGenerateSku}
                        className="px-2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-650 border border-slate-205 text-[10px] font-black rounded-xl transition cursor-pointer"
                        title="Auto-generar código"
                      >
                        ⚡ Generar
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-slate-450 mb-1">Precio Unitario ($ MXN)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={pPrice === 0 ? '' : pPrice}
                      onChange={(e) => setPPrice(Math.round(Number(e.target.value)))}
                      placeholder="Precio..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-black text-slate-800 bg-slate-50 focus:border-[#c5a85c] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-slate-450 mb-1">Stock Almacén Inicial</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={pStock === 0 ? '' : pStock}
                      onChange={(e) => setPStock(Math.round(Number(e.target.value)))}
                      placeholder="Unidades..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-black text-slate-800 bg-slate-50 focus:border-[#c5a85c] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Product Image Option Selection with URL and Upload methods */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center pb-1">
                    <label className="block text-[11px] font-black uppercase text-slate-450">Foto Ilustrativa del Producto</label>
                    <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setProdImageUploadType('url')}
                        className={`px-2 py-0.5 rounded text-[9px] font-black tracking-wider transition cursor-pointer ${prodImageUploadType === 'url' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        Enlace (URL)
                      </button>
                      <button
                        type="button"
                        onClick={() => setProdImageUploadType('upload')}
                        className={`px-2 py-0.5 rounded text-[9px] font-black tracking-wider transition cursor-pointer ${prodImageUploadType === 'upload' ? 'bg-white text-[#c5a85c] shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
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
                      className="w-full px-3 py-2 border border-slate-205 rounded-xl text-[11px] font-mono text-slate-650 bg-slate-50 focus:border-[#c5a85c] focus:outline-none"
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
                          className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-[#c5a85c]/10 file:text-[#a38439] hover:file:bg-[#c5a85c]/20 file:cursor-pointer cursor-pointer"
                        />
                      </div>
                      {pImgUrl.startsWith('data:') && (
                        <div className="w-10 h-10 rounded-lg border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center bg-slate-50">
                          <img src={pImgUrl} alt="Vista previa del artículo" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  )}
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {prodImageUploadType === 'url' 
                      ? 'Inserta un enlace web directo. Si lo dejas vacío, usaremos una imagen genérica alusiva.' 
                      : 'Carga un archivo PNG, JPG o WEBP directo desde tu dispositivo para almacenarlo localmente.'}
                  </span>
                </div>

                {/* Active/Inactive Status Switch */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="space-y-px">
                    <span className="text-xs font-black text-slate-800 block">Estatus de Disponibilidad</span>
                    <span className="text-[10px] text-slate-400 block leading-normal">Determina si este producto estará visible/activo para la venta en el e-commerce.</span>
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
                  <label className="block text-[11px] font-black uppercase text-slate-450 mb-1">Descripción Comercial de Ficha Técnica</label>
                  <textarea
                    required
                    value={pDesc}
                    onChange={(e) => setPDesc(e.target.value)}
                    rows={3}
                    placeholder="Describe los beneficios ecológicos, materiales, tallas, o atributos de alto impacto del producto..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 bg-slate-50 focus:border-[#c5a85c] focus:outline-none leading-normal"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-black transition cursor-pointer"
                  >
                    Salir sin Guardar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl text-xs font-black transition shadow-md hover:scale-[1.01] cursor-pointer"
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

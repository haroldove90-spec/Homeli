/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ProductItem, SalesOrder, OrderStatus } from '../types';
import { 
  Package, 
  ShoppingBag, 
  Plus, 
  TrendingUp, 
  AlertTriangle, 
  ChevronRight, 
  Layers, 
  Tag, 
  Truck, 
  Check, 
  Search,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VentasSectionProps {
  products: ProductItem[];
  orders: SalesOrder[];
  onAddProduct: (product: ProductItem) => void;
  onUpdateOrderStatus: (id: string, status: OrderStatus) => void;
  onAddLog: (action: string, severity: 'info' | 'warning' | 'critical') => void;
}

export default function VentasSection({
  products,
  orders,
  onAddProduct,
  onUpdateOrderStatus,
  onAddLog
}: VentasSectionProps) {
  // Modal toggles & search tabs
  const [activeTab, setActiveTab] = useState<'orders' | 'catalog'>('orders');
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // New Product form fields
  const [pName, setPName] = useState('');
  const [pPrice, setPPrice] = useState('');
  const [pStock, setPStock] = useState('');
  const [pCategory, setPCategory] = useState<'Limpieza' | 'Ferretería' | 'Seguridad' | 'Hogar' | 'Herramientas'>('Limpieza');
  const [pDesc, setPDesc] = useState('');

  // Search parameters
  const [productQuery, setProductQuery] = useState('');
  const [orderQuery, setOrderQuery] = useState('');

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName.trim() || !pPrice.trim() || !pStock.trim()) return;

    // Standard Unsplash matching URLs according to categories
    const categoryImages = {
      'Limpieza': 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      'Ferretería': 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      'Seguridad': 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      'Hogar': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      'Herramientas': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    };

    const newProduct: ProductItem = {
      id: `PROD-${Math.floor(100 + Math.random() * 900)}`,
      name: pName,
      sku: `HML-${pCategory.substring(0,3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
      category: pCategory,
      price: parseFloat(pPrice) || 299,
      stock: parseInt(pStock) || 10,
      salesCount: 0,
      description: pDesc.trim() || 'No se ingresó descripción.',
      imageUrl: categoryImages[pCategory]
    };

    onAddProduct(newProduct);
    onAddLog(`Nuevo producto agregado al catálogo de ventas: ${newProduct.name} - SKU: ${newProduct.sku}`, 'info');

    // Reset fields
    setPName('');
    setPPrice('');
    setPStock('');
    setPCategory('Limpieza');
    setPDesc('');
    setShowAddProductModal(false);
  };

  const getOrderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'procesando':
        return 'bg-earth-copper-light text-earth-copper border-earth-copper/20';
      case 'enviado':
        return 'bg-earth-slate/10 text-earth-slate border-earth-slate/20';
      case 'entregado':
        return 'bg-earth-green-light text-earth-green-dark border-earth-green/20';
      case 'cancelado':
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  const getOrderStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'procesando': return 'Procesando';
      case 'enviado': return 'Enviado';
      case 'entregado': return 'Entregado';
      case 'cancelado': return 'Cancelado';
    }
  };

  // Filter criteria
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(productQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(productQuery.toLowerCase())
  );

  const filteredOrders = orders.filter(o => 
    o.customerName.toLowerCase().includes(orderQuery.toLowerCase()) ||
    o.id.toLowerCase().includes(orderQuery.toLowerCase()) ||
    o.productNames.some(item => item.toLowerCase().includes(orderQuery.toLowerCase()))
  );

  const totalSalesRevenue = orders
    .filter(o => o.status === 'entregado')
    .reduce((acc, curr) => acc + curr.total, 0);

  const lowStockProductsCount = products.filter(p => p.stock < 15).length;

  return (
    <div className="space-y-6" id="sales_section_wrapper">
      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="sales_stats_grid">
        <div className="bg-white p-5 rounded-xl border border-natural-border shadow-sm flex items-center justify-between animate-none" id="sales_revenue_card">
          <div className="text-left">
            <p className="text-xs font-bold text-natural-muted uppercase tracking-widest">Ingreso E-Commerce Neto</p>
            <h3 className="text-2xl font-bold font-serif text-natural-dark mt-2">
              ${totalSalesRevenue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-natural-silt mt-1">Pedidos con estatus "Entregado"</p>
          </div>
          <div className="p-3.5 bg-earth-green-light text-earth-green rounded-xl">
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-natural-border shadow-sm flex items-center justify-between" id="sales_orders_card">
          <div className="text-left">
            <p className="text-xs font-bold text-natural-muted uppercase tracking-widest">Pedidos Procesados</p>
            <h3 className="text-2xl font-bold font-serif text-natural-dark mt-2">
              {orders.length} pedidos
            </h3>
            <p className="text-xs text-earth-copper font-bold mt-1">
              {orders.filter(o => o.status === 'procesando').length} pendientes de envío
            </p>
          </div>
          <div className="p-3.5 bg-earth-copper-light text-earth-copper rounded-xl">
            <ShoppingBag size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-natural-border shadow-sm flex items-center justify-between" id="sales_stock_warning_card">
          <div className="text-left">
            <p className="text-xs font-bold text-natural-muted uppercase tracking-widest">Alerta de Inventario</p>
            <h3 className="text-2xl font-bold font-serif text-natural-dark mt-2">
              {lowStockProductsCount} productos
            </h3>
            <p className={`text-xs mt-1 font-bold ${lowStockProductsCount > 0 ? 'text-earth-copper' : 'text-earth-green-dark'}`}>
              {lowStockProductsCount > 0 ? 'Requiere reabastecimiento pronto' : 'Todos los niveles en regla'}
            </p>
          </div>
          <div className={`p-3.5 rounded-xl ${lowStockProductsCount > 0 ? 'bg-earth-copper/10 text-earth-copper animate-pulse' : 'bg-natural-bg text-natural-silt'}`}>
            <AlertTriangle size={20} />
          </div>
        </div>
      </div>

      {/* Primary Tab Navigation & Category search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-natural-border shadow-sm" id="sales_nav_panel">
        <div className="flex rounded-lg bg-natural-bg p-0.5 border border-natural-border" id="sales_tabs_buttons">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition cursor-pointer ${activeTab === 'orders' ? 'bg-white shadow-sm text-natural-dark font-extrabold' : 'text-natural-silt hover:text-natural-dark'}`}
          >
            Órdenes de Compra ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition cursor-pointer ${activeTab === 'catalog' ? 'bg-white shadow-sm text-natural-dark font-extrabold' : 'text-natural-silt hover:text-natural-dark'}`}
          >
            Catálogo de Productos ({products.length})
          </button>
        </div>

        {/* Dynamic Context Actions */}
        <div className="flex gap-2 w-full sm:w-auto items-center" id="sales_context_actions">
          {activeTab === 'orders' ? (
            <div className="relative w-full sm:w-60">
              <input
                type="text"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="Buscar orden o cliente..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-natural-bg border border-natural-border rounded-lg focus:outline-none focus:border-earth-green focus:bg-white text-natural-dark font-bold"
                id="search_orders_input"
              />
              <Search size={13} className="absolute left-3 top-2.5 text-natural-muted" />
            </div>
          ) : (
            <>
              <div className="relative w-full sm:w-52">
                <input
                  type="text"
                  value={productQuery}
                  onChange={(e) => setProductQuery(e.target.value)}
                  placeholder="Buscar en catálogo..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-natural-bg border border-natural-border rounded-lg focus:outline-none focus:border-earth-green focus:bg-white text-natural-dark font-bold"
                  id="search_catalog_input"
                />
                <Search size={13} className="absolute left-3 top-2.5 text-natural-muted" />
              </div>

              <button
                onClick={() => setShowAddProductModal(true)}
                className="px-3.5 py-1.5 bg-earth-green hover:bg-earth-green-dark text-white rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 transition cursor-pointer shadow-sm"
                id="btn_add_product_trigger"
              >
                <Plus size={15} />
                Agregar Producto
              </button>
            </>
          )}
        </div>
      </div>

      {/* Lists views */}
      <div id="sales_lists_content">
        <AnimatePresence mode="wait">
          {activeTab === 'orders' ? (
            <motion.div
              key="orders_tab_view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-2xl border border-natural-border shadow-sm overflow-hidden"
              id="orders_list_wrapper"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse" id="orders_table">
                  <thead>
                    <tr className="bg-natural-bg/55 text-[11px] font-bold uppercase text-natural-muted tracking-wider border-b border-natural-border">
                      <th className="py-3 px-5">ID Orden</th>
                      <th className="py-3 px-5">Cliente</th>
                      <th className="py-3 px-5">Fecha de Compra</th>
                      <th className="py-3 px-5">Productos Solicitados</th>
                      <th className="py-3 px-5 text-right">Total</th>
                      <th className="py-3 px-5">Estatus</th>
                      <th className="py-3 px-5 text-center">Acciones Logísticas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-natural-border text-xs text-natural-text">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-natural-muted">
                          Ninguna orden comercial coincide con los filtros.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map(order => (
                        <tr key={order.id} className="hover:bg-natural-bg/40 transition">
                          <td className="py-3.5 px-5 font-mono font-bold text-natural-dark">
                            {order.id}
                          </td>
                          <td className="py-3.5 px-5">
                            <p className="font-bold text-natural-dark">{order.customerName}</p>
                            <p className="text-[10px] text-natural-muted font-mono">{order.customerEmail}</p>
                          </td>
                          <td className="py-3.5 px-5 text-natural-muted font-medium">
                            {new Date(order.date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-3.5 px-5 max-w-[200px]">
                            <p className="font-semibold text-natural-dark truncate" title={order.productNames.join(', ')}>
                              {order.productNames.join(', ')}
                            </p>
                            <p className="text-[10px] text-earth-copper font-bold">{order.itemsCount} {order.itemsCount === 1 ? 'artículo' : 'artículos'}</p>
                          </td>
                          <td className="py-3.5 px-5 text-right font-extrabold text-natural-dark">
                            ${order.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3.5 px-5">
                            <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${getOrderStatusBadge(order.status)}`}>
                              {getOrderStatusText(order.status)}
                            </span>
                          </td>
                          <td className="py-3.5 px-5">
                            <div className="flex gap-1 justify-center">
                              {order.status === 'procesando' && (
                                <button
                                  onClick={() => {
                                    onUpdateOrderStatus(order.id, 'enviado');
                                    onAddLog(`Logística: Pedido ${order.id} enviado a paquetería`, 'info');
                                  }}
                                  className="px-2.5 py-1 bg-earth-slate-light hover:bg-earth-slate/20 text-earth-slate font-bold rounded-lg text-[10px] flex items-center gap-1 transition border border-earth-slate/10 cursor-pointer"
                                  title="Marcar como Enviado"
                                >
                                  <Truck size={12} />
                                  <span>Despachar</span>
                                </button>
                              )}
                              {order.status === 'enviado' && (
                                <button
                                  onClick={() => {
                                    onUpdateOrderStatus(order.id, 'entregado');
                                    onAddLog(`Logística: Pedido ${order.id} marcado como entregado al cliente`, 'info');
                                  }}
                                  className="px-2.5 py-1 bg-earth-green-light hover:bg-earth-green/20 text-earth-green-dark font-bold rounded-lg text-[10px] flex items-center gap-1 transition border border-earth-green/10 cursor-pointer"
                                  title="Marcar como Entregado"
                                >
                                  <Check size={12} />
                                  <span>Entregado</span>
                                </button>
                              )}
                              {order.status === 'entregado' && (
                                <span className="text-[10px] text-earth-green font-bold flex items-center gap-0.5" id={`success_${order.id}`}>
                                  <CheckCircle size={12} /> Completado
                                </span>
                              )}
                              {order.status === 'cancelado' && (
                                <span className="text-[10px] text-rose-500 font-bold" id={`cancelled_${order.id}`}>
                                  Cancelado
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="catalog_tab_view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              id="catalog_grid_wrapper"
            >
              {filteredProducts.length === 0 ? (
                <div className="col-span-1 sm:col-span-2 lg:col-span-4 py-16 text-center text-natural-muted bg-white border border-natural-border rounded-2xl">
                  Ningún artículo coincide con tu búsqueda de catálogo.
                </div>
              ) : (
                filteredProducts.map(product => (
                  <div key={product.id} className="bg-white border border-natural-border shadow-sm rounded-2xl overflow-hidden flex flex-col justify-between hover:border-earth-green/60 transition duration-250 group p-4 text-left">
                    <div>
                      {/* Product display without encapsulation */}
                      {product.imageUrl ? (
                        <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-natural-bg border border-natural-border/20">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-350"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ) : (
                        <div className="w-full aspect-[4/3] rounded-xl bg-natural-bg border border-natural-border mb-3 flex items-center justify-center text-natural-muted">
                          <Package size={32} />
                        </div>
                      )}

                      <div className="flex justify-between items-start gap-1 mb-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider font-mono text-earth-copper bg-earth-copper-light px-1.5 py-0.5 rounded border border-earth-copper/10">
                          {product.category}
                        </span>
                        <span className="text-[10px] text-natural-muted font-mono font-medium">{product.sku}</span>
                      </div>

                      <h4 className="font-bold font-serif text-natural-dark text-sm group-hover:text-earth-green transition leading-tight mb-1.5">
                        {product.name}
                      </h4>

                      <p className="text-xs text-natural-muted line-clamp-2 leading-relaxed mb-3">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-natural-border flex items-center justify-between">
                      <div>
                        <p className="text-[9px] text-natural-muted uppercase tracking-widest leading-none font-bold">Precio venta</p>
                        <p className="text-[15px] font-extrabold text-natural-dark font-serif">${product.price} MXN</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-natural-muted uppercase tracking-widest leading-none font-bold">Unidades Stock</p>
                        <span className={`inline-block text-xs font-bold mt-1 ${product.stock < 15 ? 'text-rose-600 font-extrabold' : 'text-natural-silt font-bold'}`}>
                          {product.stock} pz
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddProductModal && (
          <div className="fixed inset-0 bg-natural-dark/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-natural-border p-6 max-w-md w-full shadow-2xl space-y-6 text-left"
              id="add_product_modal"
            >
              <div className="flex justify-between items-center pb-3 border-b border-natural-border">
                <h3 className="text-lg font-bold font-serif text-natural-dark flex items-center gap-2">
                  <Package size={20} className="text-earth-green" />
                  Agregar Artículo al Almacén
                </h3>
                <button 
                  onClick={() => setShowAddProductModal(false)}
                  className="text-natural-muted hover:text-natural-dark text-sm font-bold cursor-pointer transition"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-natural-muted uppercase tracking-wider mb-1.5">Nombre Comercial del Producto</label>
                  <input
                    type="text"
                    required
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    placeholder="Ej. Limpiador Orgánico Cítrico 1L"
                    className="w-full px-3 py-2 border border-natural-border rounded-xl focus:outline-none focus:border-earth-green text-sm bg-natural-bg text-natural-dark"
                    id="new_pname"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-natural-muted uppercase tracking-wider mb-1.5">Categoría</label>
                    <select
                      value={pCategory}
                      onChange={(e) => setPCategory(e.target.value as any)}
                      className="w-full px-2.5 py-2 border border-natural-border rounded-xl bg-white focus:outline-none focus:border-earth-green text-sm bg-natural-bg text-natural-dark"
                      id="new_pcategory"
                    >
                      <option value="Limpieza">Limpieza</option>
                      <option value="Ferretería">Ferretería</option>
                      <option value="Seguridad">Seguridad (Domótica)</option>
                      <option value="Hogar">Hogar</option>
                      <option value="Herramientas">Herramientas</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-natural-muted uppercase tracking-wider mb-1.5">Almacén (pz)</label>
                    <input
                      type="number"
                      required
                      value={pStock}
                      onChange={(e) => setPStock(e.target.value)}
                      placeholder="15"
                      className="w-full px-2.5 py-2 border border-natural-border rounded-xl focus:outline-none focus:border-earth-green text-sm font-bold bg-natural-bg text-natural-dark font-mono"
                      id="new_pstock"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-natural-muted uppercase tracking-wider mb-1.5">Costo Unitario ($ MXN)</label>
                  <input
                    type="number"
                    required
                    value={pPrice}
                    onChange={(e) => setPPrice(e.target.value)}
                    placeholder="350"
                    className="w-full px-3 py-2 border border-natural-border rounded-xl focus:outline-none focus:border-earth-green text-sm font-extrabold bg-natural-bg text-natural-dark font-mono"
                    id="new_pprice"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-natural-muted uppercase tracking-wider mb-1.5">Descripción de Ventas</label>
                  <textarea
                    value={pDesc}
                    onChange={(e) => setPDesc(e.target.value)}
                    placeholder="Describe los materiales, capacidades o ventajas técnicas..."
                    className="w-full px-3 py-2 border border-natural-border rounded-xl focus:outline-none focus:border-earth-green text-sm bg-natural-bg text-natural-dark text-left"
                    rows={3}
                    id="new_pdesc"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="flex-1 py-2 px-4 bg-natural-bg hover:bg-natural-border/50 text-natural-silt rounded-xl text-sm font-bold transition cursor-pointer"
                  >
                    Salir
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-earth-green hover:bg-earth-green-dark text-white rounded-xl text-sm font-bold transition shadow-md cursor-pointer"
                  >
                    Dar de alta
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

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ProductItem, SalesOrder, OrderStatus } from '../types';
import { 
  Package, 
  ShoppingBag, 
  Plus, 
  TrendingUp, 
  AlertTriangle, 
  ChevronRight, 
  Truck, 
  Check, 
  Search,
  CheckCircle,
  Clock,
  X,
  ShoppingCart,
  Trash2,
  MapPin,
  Phone,
  CreditCard,
  User,
  Heart,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VentasSectionProps {
  products: ProductItem[];
  orders: SalesOrder[];
  onAddProduct: (product: ProductItem) => void;
  onUpdateOrderStatus: (id: string, status: OrderStatus) => void;
  onAddLog: (action: string, severity: 'info' | 'warning' | 'critical') => void;
  onAddOrder?: (order: SalesOrder) => void;
}

// Exact 12 requested products with provided image URLs
const STATIC_STORE_PRODUCTS: ProductItem[] = [
  // Zapatos Category (6 items)
  {
    id: 'SHO-001',
    name: 'Tenis Deportivos Urbanos Pro',
    sku: 'HML-ZAP-01',
    category: 'Zapatos',
    price: 899,
    stock: 24,
    salesCount: 15,
    description: 'Calzado ergonómico transpirable con suela de amortiguación reforzada, ideal para caminar o actividades deportivas cotidianas.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsPlV5u1UOTpXsbHztz8RAntDJ8LeRMTVFaQ&s'
  },
  {
    id: 'SHO-002',
    name: 'Tacones Elegantes de Dama Premium',
    sku: 'HML-ZAP-02',
    category: 'Zapatos',
    price: 1249,
    stock: 12,
    salesCount: 8,
    description: 'Zapatos de tacón alto de diseño estilizado con plantilla acolchada especial que garantiza comodidad sin perder la elegancia corporativa.',
    imageUrl: 'https://http2.mlstatic.com/D_NQ_NP_892119-MLM107536539708_032026-O-zapatos-de-tacon-para-dama.webp'
  },
  {
    id: 'SHO-003',
    name: 'Mocasines Oxford en Piel Noble',
    sku: 'HML-ZAP-03',
    category: 'Zapatos',
    price: 950,
    stock: 18,
    salesCount: 12,
    description: 'Mocasines casuales confeccionados en piel de gran calidad con costuras reforzadas a mano y soporte anatómico interno.',
    imageUrl: 'https://i5.walmartimages.com/asr/a7f7be61-d437-47e6-9055-38bbf88221a5.3ffac1d7b8ab258d67177a5f64909dd1.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF'
  },
  {
    id: 'SHO-004',
    name: 'Botas de Trabajo Robustas Protect',
    sku: 'HML-ZAP-04',
    category: 'Zapatos',
    price: 1499,
    stock: 15,
    salesCount: 6,
    description: 'Botas industriales de alta resistencia con puntera protectora reforzada e impermeabilidad garantizada para todo tipo de terreno.',
    imageUrl: 'https://i5.walmartimages.com/asr/27da81b6-9b11-40f3-8676-e79c776d1cac.b9d1842f0abc1b5ef370ebf33851477e.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF'
  },
  {
    id: 'SHO-005',
    name: 'Zapatillas Casuales de Lona Retro',
    sku: 'HML-ZAP-05',
    category: 'Zapatos',
    price: 599,
    stock: 45,
    salesCount: 34,
    description: 'Clásicos tenis de lona transpirable con suela vulcanizada de alta durabilidad para un estilo fresco y un andar ultraligero.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuZfJOXBwKruDyOvaXo11a4qhIEnjr-6K-gw&s'
  },
  {
    id: 'SHO-006',
    name: 'Mocasines Modernos Soft-Fit Flex',
    sku: 'HML-ZAP-06',
    category: 'Zapatos',
    price: 799,
    stock: 22,
    salesCount: 19,
    description: 'Zapatos cómodos de vestir con diseño elástico de fácil calzado, ideales para jornadas extensas de pie.',
    imageUrl: 'https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/0f0fa935ea6bcae5e5f6a25f5f87cf7c.jpg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp'
  },

  // Productos de limpieza Category (6 items)
  {
    id: 'CLN-001',
    name: 'Detergente Líquido Persil Profesional 5L',
    sku: 'HML-LIM-01',
    category: 'Productos de limpieza',
    price: 289,
    stock: 35,
    salesCount: 52,
    description: 'Detergente premium alemán súper concentrado para lavado profundo que protege la intensidad del color y remueve manchas desde la primera lavada.',
    imageUrl: 'https://www.jadyquimica.com/wp-content/uploads/2023/08/Detergente-liquido-persil-color-pina-de-5-1-600x600.jpg'
  },
  {
    id: 'CLN-002',
    name: 'Suavizante de Telas Concentrado Care',
    sku: 'HML-LIM-02',
    category: 'Productos de limpieza',
    price: 125,
    stock: 40,
    salesCount: 41,
    description: 'Suavizante intensivo que reduce la estática, facilita el planchado y deja una fragancia de larga duración sumamente fresca.',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/51cqPQUFOHL._AC_UL375_SR375,375_.jpg'
  },
  {
    id: 'CLN-003',
    name: 'Windex Limpiador de Vidrios y Cristales original',
    sku: 'HML-LIM-03',
    category: 'Productos de limpieza',
    price: 89,
    stock: 55,
    salesCount: 78,
    description: 'Limpiador de ventanas con fórmula de brillo reluciente sin dejar rayas ni residuos empañados en vidrios, espejos o vitrinas.',
    imageUrl: 'https://www.bodegamesones.mx/cdn/shop/files/WINDEXVIDRIOSfrente1353322795Bn.jpg?v=1766439822'
  },
  {
    id: 'CLN-004',
    name: 'Axion Lavatrastes Líquido Limón',
    sku: 'HML-LIM-04',
    category: 'Productos de limpieza',
    price: 45,
    stock: 90,
    salesCount: 120,
    description: 'Arrancagrasa poderoso con extracto natural de limón que elimina los malos olores y desinfecta profundamente la vajilla.',
    imageUrl: 'https://www.desechablesmonterrey.com/wp-content/uploads/2014/02/Axion.jpg'
  },
  {
    id: 'CLN-005',
    name: 'Cloro Desinfectante Multiusos Premium',
    sku: 'HML-LIM-05',
    category: 'Productos de limpieza',
    price: 65,
    stock: 48,
    salesCount: 65,
    description: 'Agente desinfectante concentrado para eliminar el 99.9% de gérmenes domésticos en pisos, baños y áreas comunes.',
    imageUrl: 'https://ecotropa.mx/cdn/shop/products/BRL_0524fa1b-f52c-48c0-b5d8-5b9713eca802_700x.jpg?v=1667955081'
  },
  {
    id: 'CLN-006',
    name: 'Fabuloso Multiusos Frescura Lavanda 2L',
    sku: 'HML-LIM-06',
    category: 'Productos de limpieza',
    price: 55,
    stock: 60,
    salesCount: 95,
    description: 'Limpiador líquido aromatizante universal de pisos que neutraliza olores desagradables y brinda un aroma relajante de lavanda.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuB_85xkc8sC17WUP9lqDuIEY-KbX-tOJHqg&s'
  }
];

export default function VentasSection({
  products,
  orders,
  onAddProduct,
  onUpdateOrderStatus,
  onAddLog,
  onAddOrder
}: VentasSectionProps) {
  // Roles console navigation view modes: 'shop', 'cart_orders', 'manager'
  const [activeViewMode, setActiveViewMode] = useState<'shop' | 'cart_orders' | 'manager'>('shop');
  
  // Dynamic Catalog list containing products
  const [storeCatalog, setStoreCatalog] = useState<ProductItem[]>([]);
  
  // Shopping Cart client State
  const [cart, setCart] = useState<{ product: ProductItem; quantity: number }[]>([]);
  
  // Personal User Orders History State (Fallback inside session)
  const [sessionOrders, setSessionOrders] = useState<SalesOrder[]>([]);

  // Category Filtering inside Storefront
  const [selectedCategory, setSelectedCategory] = useState<'todos' | 'Zapatos' | 'Productos de limpieza'>('todos');
  
  // Form checkout fields (Cash on delivery)
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [checkoutNotes, setCheckoutNotes] = useState('');
  const [isOrderOrdered, setIsOrderOrdered] = useState(false);
  const [latestOrderId, setLatestOrderId] = useState('');

  // Manager Search states
  const [productQuery, setProductQuery] = useState('');
  const [orderQuery, setOrderQuery] = useState('');
  
  // Manager Modal states
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [pName, setPName] = useState('');
  const [pPrice, setPPrice] = useState('');
  const [pStock, setPStock] = useState('');
  const [pCategory, setPCategory] = useState<string>('Productos de limpieza');
  const [pDesc, setPDesc] = useState('');
  const [pImgUrl, setPImgUrl] = useState('');

  // Sincronizar catálogo: productos globales + productos estáticos estipulados
  useEffect(() => {
    const mergedList = [...STATIC_STORE_PRODUCTS];
    products.forEach(p => {
      // Evitar duplicados por nombre o ID
      if (!mergedList.some(item => item.id === p.id || item.name.toLowerCase() === p.name.toLowerCase())) {
        // Normalizar categorías entrantes útiles
        let cat = p.category;
        if (cat === 'Limpieza' || cat === 'Limpieza Integral') {
          cat = 'Productos de limpieza';
        }
        mergedList.push({ ...p, category: cat });
      }
    });
    setStoreCatalog(mergedList);
  }, [products]);

  // Carrito handlers
  const addToCart = (product: ProductItem) => {
    // Validar si cuenta con stock
    if (product.stock <= 0) {
      alert('Este artículo se encuentra agotado temporalmente.');
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert(`Límite de stock alcanzado (${product.stock} pz disponibles)`);
          return prev;
        }
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    onAddLog(`Cliente añadió al carrito de compras: ${product.name}`, 'info');
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      const item = prev.find(i => i.product.id === productId);
      if (!item) return prev;
      
      const newQty = item.quantity + delta;
      if (newQty <= 0) {
        return prev.filter(i => i.product.id !== productId);
      }
      
      // Proteger stock límite
      if (newQty > item.product.stock) {
        alert(`Lo sentimos, solo disponemos de ${item.product.stock} unidades de este producto.`);
        return prev;
      }
      
      return prev.map(i => i.product.id === productId ? { ...i, quantity: newQty } : i);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  // Checkout Pago contra entrega handle
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!checkoutName.trim() || !checkoutPhone.trim() || !checkoutAddress.trim()) {
      alert('Por favor complete todos los datos de contacto y entrega obligatorios.');
      return;
    }

    const randomID = `ORD-${Math.floor(8000 + Math.random() * 1999)}`;
    const totalAmount = cart.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0);
    
    const newSalesOrder: SalesOrder = {
      id: randomID,
      customerName: checkoutName,
      customerEmail: `${checkoutName.toLowerCase().replace(/\s+/g, '')}@homelipedido.mx`,
      date: new Date().toISOString(),
      total: totalAmount,
      status: 'procesando',
      itemsCount: cart.reduce((acc, i) => acc + i.quantity, 0),
      productNames: cart.map(i => `${i.product.name} (x${i.quantity})`)
    };

    // Agregar orden globalmente si la función de App.tsx existe
    if (onAddOrder) {
      onAddOrder(newSalesOrder);
    }
    
    // Almacenar en compras de la sesión
    setSessionOrders(prev => [newSalesOrder, ...prev]);

    // Reducir stock simulado en catálogo
    setStoreCatalog(prev => prev.map(p => {
      const cartItem = cart.find(ci => ci.product.id === p.id);
      if (cartItem) {
        return {
          ...p,
          stock: Math.max(0, p.stock - cartItem.quantity),
          salesCount: p.salesCount + cartItem.quantity
        };
      }
      return p;
    }));

    onAddLog(`¡Nueva compra e-commerce registrada! ID: ${newSalesOrder.id} - Pago Contra Entrega por ${checkoutName} por un total de $${totalAmount}`, 'info');

    // Desplegar confirmación exitosa
    setLatestOrderId(randomID);
    setIsOrderOrdered(true);
    setCart([]);
    setCheckoutName('');
    setCheckoutPhone('');
    setCheckoutAddress('');
    setCheckoutNotes('');
  };

  // Crear producto manager
  const handleManagerCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName.trim() || !pPrice.trim() || !pStock.trim()) {
      alert('Por favor complete los campos obligatorios del alta de producto.');
      return;
    }

    const resolvedImg = pImgUrl.trim() || 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&auto=format&fit=crop&q=60';
    const newPrd: ProductItem = {
      id: `PROD-${Math.floor(300 + Math.random() * 699)}`,
      name: pName,
      sku: `HML-${pCategory.substring(0,3).toUpperCase()}-${Math.floor(100 + Math.random() * 899)}`,
      category: pCategory,
      price: parseFloat(pPrice) || 199,
      stock: parseInt(pStock) || 12,
      salesCount: 0,
      description: pDesc.trim() || 'No se ingresó descripción.',
      imageUrl: resolvedImg
    };

    onAddProduct(newPrd);
    onAddLog(`Línea almacén: Registró exitosamente ${newPrd.name} en categoría ${newPrd.category}`, 'info');

    // Resetear
    setPName('');
    setPPrice('');
    setPStock('');
    setPDesc('');
    setPImgUrl('');
    setShowAddProductModal(false);
  };

  // Totales
  const cartItemsCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const cartTotalAmount = cart.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0);

  // Filtrado de productos de tienda
  const storeFilteredProducts = storeCatalog.filter(p => {
    if (selectedCategory === 'todos') return true;
    return p.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  // Filtrado manager
  const managerFilteredProducts = storeCatalog.filter(p => 
    p.name.toLowerCase().includes(productQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(productQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(productQuery.toLowerCase())
  );

  const managerFilteredOrders = orders.filter(o => 
    o.customerName.toLowerCase().includes(orderQuery.toLowerCase()) ||
    o.id.toLowerCase().includes(orderQuery.toLowerCase()) ||
    o.productNames.some(p => p.toLowerCase().includes(orderQuery.toLowerCase()))
  );

  const totalManagerSalesRevenue = orders
    .filter(o => o.status === 'entregado')
    .reduce((acc, curr) => acc + curr.total, 0);

  const lowStockProductsCount = storeCatalog.filter(p => p.stock < 10).length;

  return (
    <div className="space-y-6" id="online_retail_root">
      
      {/* Dynamic Store Header Nav Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-natural-border pb-4 w-full" id="retail_view_tabs">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#c5a85c] text-white rounded-lg shadow-sm">
            <ShoppingBag size={20} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-natural-dark tracking-tight font-serif leading-none">Homeli E-Commerce</h3>
            <span className="text-[10px] text-natural-muted font-bold font-mono">TIENDA PREMIUM MULTI-CATEGORÍAS</span>
          </div>
        </div>

        <div className="flex rounded-xl bg-natural-bg p-1 border border-natural-border shadow-sm flex-wrap" id="nav_commerce_modes">
          <button
            onClick={() => {
              setActiveViewMode('shop');
              setIsOrderOrdered(false);
            }}
            className={`px-4 py-2 text-xs font-extrabold rounded-lg transition cursor-pointer flex items-center gap-2 ${activeViewMode === 'shop' ? 'bg-white text-[#c5a85c] shadow-sm font-black' : 'text-natural-silt hover:text-natural-dark'}`}
          >
            <span>🏪 Tienda de Compras</span>
          </button>
          
          <button
            onClick={() => {
              setActiveViewMode('cart_orders');
              setIsOrderOrdered(false);
            }}
            className={`px-4 py-2 text-xs font-extrabold rounded-lg transition cursor-pointer flex items-center gap-2 relative ${activeViewMode === 'cart_orders' ? 'bg-white text-[#c5a85c] shadow-sm font-black' : 'text-natural-silt hover:text-natural-dark'}`}
          >
            <span>🛒 Mi Carrito y Compras</span>
            {cartItemsCount > 0 && (
              <span className="bg-[#c5a85c] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center absolute -top-1.5 -right-1 animate-bounce">
                {cartItemsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveViewMode('manager');
              setIsOrderOrdered(false);
            }}
            className={`px-4 py-2 text-xs font-extrabold rounded-lg transition cursor-pointer flex items-center gap-2 ${activeViewMode === 'manager' ? 'bg-white text-[#c5a85c] shadow-sm font-black' : 'text-natural-silt hover:text-natural-dark'}`}
          >
            <span>⚙️ Panel Logístico / Despacho</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* VIEW 1: SHOPPING STOREFRONT */}
        {activeViewMode === 'shop' && (
          <motion.div
            key="shop_mode_view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6 text-left"
            id="storefront_container"
          >
            {/* Elegant Welcome Hero Banner */}
            <div className="bg-gradient-to-r from-[#c5a85c] via-[#b59549] to-[#ebd7a7] rounded-2xl p-6 text-white shadow-sm relative overflow-hidden" id="store_hero_banner">
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-12 -translate-y-12 shrink-0 pointer-events-none" />
              <div className="relative z-10 max-w-xl space-y-2">
                <span className="px-2.5 py-0.5 bg-white/15 border border-white/25 rounded-full text-[9px] font-black tracking-widest uppercase inline-block">
                  Calidad Garantizada Homeli
                </span>
                <h4 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight leading-tight">Adquiere lo mejor para tu hogar</h4>
                <p className="text-xs text-white/90 leading-relaxed font-medium">
                  Explora calzado premium importado y los mejores insumos químicos profesionales para el mantenimiento impecable de tus espacios domésticos. Todo desde una sola cuenta.
                </p>
              </div>
            </div>

            {/* Category Filter bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-natural-border shadow-sm" id="store_filter_bar">
              <div className="flex items-center gap-2 max-w-full overflow-x-auto" id="store_subtabs">
                <span className="text-xs font-black text-natural-muted uppercase flex items-center gap-1 shrink-0 px-1 font-mono">
                  <Filter size={13} /> Filtrar:
                </span>
                <button
                  onClick={() => setSelectedCategory('todos')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${selectedCategory === 'todos' ? 'bg-[#c5a85c] text-white font-extrabold' : 'bg-natural-bg text-natural-silt hover:bg-natural-border/40'}`}
                >
                  Todos los Productos
                </button>
                <button
                  onClick={() => setSelectedCategory('Zapatos')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${selectedCategory === 'Zapatos' ? 'bg-[#c5a85c] text-white font-extrabold' : 'bg-natural-bg text-natural-silt hover:bg-natural-border/40'}`}
                >
                  👠 Calzado / Zapatos
                </button>
                <button
                  onClick={() => setSelectedCategory('Productos de limpieza')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${selectedCategory === 'Productos de limpieza' ? 'bg-[#c5a85c] text-white font-extrabold' : 'bg-natural-bg text-natural-silt hover:bg-natural-border/40'}`}
                >
                  🧴 Artículos de Limpieza
                </button>
              </div>

              <div className="text-xs font-bold text-natural-silt" id="catalog_counter">
                Mostrando <span className="text-natural-dark font-black font-mono">{storeFilteredProducts.length}</span> productos
              </div>
            </div>

            {/* THE RESPONSIVE PRODUCTS GRID: 6 columns fullscreen, 4 columns tablet, 2 columns mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-6 gap-4" id="storefront_products_grid">
              {storeFilteredProducts.map(product => {
                const alreadyInCartCount = cart.find(i => i.product.id === product.id)?.quantity || 0;
                return (
                  <div 
                    key={product.id} 
                    className="bg-white border border-natural-border hover:border-[#c5a85c]/40 hover:shadow-md shadow-sm rounded-2xl overflow-hidden flex flex-col justify-between transition duration-200 group p-3 text-left relative"
                    id={`store_card_${product.id}`}
                  >
                    {/* Badge indicando stock bajo o categoría */}
                    <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                      <span className="text-[8px] font-black uppercase tracking-wider font-mono text-[#c5a85c] bg-white border border-[#c19a45]/20 px-1.5 py-0.5 rounded-md shadow-sm">
                        {product.category === 'Zapatos' ? '👠 Zapatos' : '🧴 Limpieza'}
                      </span>
                      {product.stock <= 0 ? (
                        <span className="text-[8px] font-black uppercase tracking-wider bg-red-100 text-red-600 border border-red-200 px-1.5 py-0.5 rounded-md">
                          Agotado
                        </span>
                      ) : product.stock < 10 ? (
                        <span className="text-[8px] font-black uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-200 px-1.5 py-0.5 rounded-md">
                          Pocas piezas
                        </span>
                      ) : null}
                    </div>

                    {/* Product Image Area */}
                    <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-50 border border-natural-border/20 mb-3 relative group-hover:opacity-95 transition-opacity">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-natural-muted">
                          <Package size={28} />
                        </div>
                      )}
                    </div>

                    {/* Metadata & Title */}
                    <div className="space-y-1 flex-1 flex flex-col justify-between">
                      <div>
                        <h5 className="font-extrabold font-serif text-natural-dark text-xs sm:text-sm line-clamp-1 group-hover:text-[#c5a85c] transition-colors leading-tight mb-1" title={product.name}>
                          {product.name}
                        </h5>
                        <p className="text-[10px] sm:text-xs text-natural-muted line-clamp-2 leading-relaxed mb-3">
                          {product.description}
                        </p>
                      </div>

                      {/* Pricing, Stock status and Add Button */}
                      <div className="pt-2 border-t border-natural-border/60">
                        <div className="flex items-baseline justify-between mb-2">
                          <div>
                            <span className="text-[8px] uppercase tracking-widest text-natural-muted font-black leading-none block">Precio unitario</span>
                            <span className="text-sm font-black text-natural-dark font-mono">${product.price} MXN</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[8px] uppercase tracking-widest text-natural-muted font-bold leading-none block">Disponibles</span>
                            <span className="text-[10px] font-bold text-natural-silt font-mono">{product.stock} un</span>
                          </div>
                        </div>

                        <button
                          onClick={() => addToCart(product)}
                          disabled={product.stock <= 0}
                          className={`w-full py-2 px-3 text-xs rounded-xl font-bold transition flex items-center justify-center gap-1 shadow-sm cursor-pointer ${product.stock <= 0 ? 'bg-natural-border text-natural-muted cursor-not-allowed border border-natural-border/20' : 'bg-white hover:bg-[#c5a85c] hover:text-white border border-[#c19a45]/40 text-[#c5a85c] hover:shadow-md'}`}
                          id={`btn_store_add_${product.id}`}
                        >
                          <Plus size={12} className="shrink-0" />
                          <span>Pagar</span>
                          {alreadyInCartCount > 0 && (
                            <span className="ml-1 bg-[#c5a85c] group-hover:bg-white group-hover:text-[#c5a85c] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center font-mono shadow-sm">
                              {alreadyInCartCount}
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* VIEW 2: CART AND USER ORDERS HISTORY */}
        {activeViewMode === 'cart_orders' && (
          <motion.div
            key="cart_orders_view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left"
            id="shopping_cart_panel"
          >
            {/* Left side: Shopping Cart List (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-sm space-y-4" id="cart_items_wrapper">
                <div className="flex items-center justify-between border-b border-natural-border pb-3">
                  <h4 className="text-base font-extrabold text-natural-dark font-serif flex items-center gap-2">
                    <ShoppingCart size={18} className="text-[#c5a85c]" />
                    <span>Mi Carrito de Compras</span>
                  </h4>
                  <span className="text-xs font-black text-[#c5a85c] font-mono uppercase bg-[#c5a85c]/10 px-2.5 py-1 rounded-full">
                    {cartItemsCount} artículos
                  </span>
                </div>

                {isOrderOrdered && (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl space-y-3 relative text-center"
                    id="order_success_notice"
                  >
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto shadow-sm">
                      <Check size={26} className="animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-emerald-800 font-extrabold font-serif text-base">¡Pedido Registrado con Éxito!</h4>
                      <p className="text-xs text-emerald-700 font-medium">
                        Tu folio es <span className="font-mono font-extrabold text-natural-dark bg-white border border-emerald-200 px-2.5 py-1 rounded-md">{latestOrderId}</span>.
                      </p>
                      <p className="text-[11px] text-natural-silt leading-relaxed mt-2">
                        El estatus inicial es <b>"Procesando"</b>. El despacho se asignó a logística nacional y realizarás el abono correspondiente en efectivo en la modalidad <b>Pago Contra Entrega</b> una vez que arribe a tu ubicación.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsOrderOrdered(false)}
                      className="mt-2 py-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] uppercase rounded-lg shadow-sm cursor-pointer shrink-0"
                    >
                      Seguir Comprando
                    </button>
                  </motion.div>
                )}

                {cart.length === 0 ? (
                  <div className="py-12 text-center space-y-4" id="empty_cart_view">
                    <div className="p-4 bg-natural-bg text-natural-muted rounded-full inline-block">
                      <ShoppingCart size={32} />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-natural-dark">Tu carrito se encuentra vacío</p>
                      <p className="text-xs text-natural-muted mt-1">Busca productos en el catálogo de Zapatos y Limpieza para agregarlos.</p>
                    </div>
                    <button
                      onClick={() => setActiveViewMode('shop')}
                      className="py-2.5 px-5 bg-[#c5a85c] hover:bg-[#b59549] text-white font-extrabold text-xs rounded-xl shadow-sm cursor-pointer transition uppercase"
                    >
                      Añadir productos ahora
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4" id="cart_items_list">
                    <div className="divide-y divide-natural-border">
                      {cart.map(item => (
                        <div key={item.product.id} className="py-3 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap" id={`cart_item_${item.product.id}`}>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-slate-50 border border-natural-border/30 rounded-lg overflow-hidden shrink-0">
                              <img
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div>
                              <h5 className="font-extrabold text-natural-dark text-xs sm:text-sm leading-tight line-clamp-1">{item.product.name}</h5>
                              <p className="text-[10px] text-natural-muted font-mono">{item.product.sku}</p>
                              <p className="text-xs font-black text-[#c5a85c] font-mono mt-0.5">${item.product.price} MXN</p>
                            </div>
                          </div>

                          {/* Controls */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center bg-natural-bg border border-natural-border rounded-lg overflow-hidden shrink-0">
                              <button
                                onClick={() => updateQuantity(item.product.id, -1)}
                                className="px-2 py-1 text-natural-silt hover:text-natural-dark hover:bg-natural-border font-bold text-xs"
                                title="Descontar un producto"
                              >
                                -
                              </button>
                              <span className="px-3 text-xs font-extrabold text-natural-dark font-mono bg-white">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.id, 1)}
                                className="px-2 py-1 text-natural-silt hover:text-natural-dark hover:bg-natural-border font-bold text-xs"
                                title="Agregar un producto"
                              >
                                +
                              </button>
                            </div>

                            <span className="text-xs font-extrabold text-natural-dark font-mono text-right min-w-[70px]">
                              ${(item.product.price * item.quantity).toLocaleString()} MXN
                            </span>

                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-red-500 hover:text-red-700 transition p-1 hover:bg-red-50 rounded"
                              title="Remover de mi carrito"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Cart Settle Total Summary */}
                    <div className="bg-natural-bg/75 rounded-xl p-4 space-y-2 border border-natural-border">
                      <div className="flex justify-between text-xs text-natural-silt font-bold">
                        <span>Subtotal de Compra:</span>
                        <span className="font-mono text-natural-dark">${cartTotalAmount.toLocaleString()} MXN</span>
                      </div>
                      <div className="flex justify-between text-xs text-natural-silt font-bold border-b border-natural-border/30 pb-2">
                        <span>Costo de Envío Nacional:</span>
                        <span className="text-emerald-700 font-extrabold uppercase font-mono">Gratis (Pago contra entrega)</span>
                      </div>
                      <div className="flex justify-between text-sm text-natural-dark font-black pt-1">
                        <span>Total Neto a Liquidar:</span>
                        <span className="font-mono text-lg text-[#c5a85c]">${cartTotalAmount.toLocaleString()} MXN</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Checkout Payment Form Area */}
              {cart.length > 0 && (
                <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-sm space-y-4" id="checkout_form_container">
                  <div className="border-b border-natural-border pb-3 flex items-center justify-between">
                    <h4 className="text-base font-extrabold text-natural-dark font-serif flex items-center gap-1.5 animate-none">
                      <CreditCard size={18} className="text-[#c5a85c]" />
                      <span>Formulario Pago Contra Entrega</span>
                    </h4>
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-black uppercase rounded-md tracking-wider flex items-center gap-1 shrink-0">
                      🚚 Efectivo al recibir
                    </span>
                  </div>

                  <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-natural-muted uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <User size={12} /> Nombre Completo del Destinatario *
                        </label>
                        <input
                          type="text"
                          required
                          value={checkoutName}
                          onChange={(e) => setCheckoutName(e.target.value)}
                          placeholder="Ej. Valeria del Valle"
                          className="w-full px-3.5 py-2.5 border border-natural-border rounded-xl focus:outline-none focus:border-[#c5a85c] text-xs bg-natural-bg font-extrabold text-natural-dark font-sans placeholder-natural-muted"
                          id="checkout_name_input"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-natural-muted uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <Phone size={12} /> Número Telefónico de Contacto *
                        </label>
                        <input
                          type="tel"
                          required
                          value={checkoutPhone}
                          onChange={(e) => setCheckoutPhone(e.target.value)}
                          placeholder="Ej. +52 55 1234 5678"
                          className="w-full px-3.5 py-2.5 border border-natural-border rounded-xl focus:outline-none focus:border-[#c5a85c] text-xs bg-natural-bg font-bold text-natural-dark font-mono placeholder-natural-muted"
                          id="checkout_phone_input"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-natural-muted uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <MapPin size={12} /> Dirección de Entrega Completa *
                      </label>
                      <input
                        type="text"
                        required
                        value={checkoutAddress}
                        onChange={(e) => setCheckoutAddress(e.target.value)}
                        placeholder="Calle, Número, Colonia, Municipio, Estado, CP"
                        className="w-full px-3.5 py-2.5 border border-natural-border rounded-xl focus:outline-none focus:border-[#c5a85c] text-xs bg-natural-bg font-medium text-natural-dark font-sans placeholder-natural-muted"
                        id="checkout_address_input"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-natural-muted uppercase tracking-wider mb-1.5">
                        Instrucciones o Notas de Entrega (Opcional)
                      </label>
                      <textarea
                        value={checkoutNotes}
                        onChange={(e) => setCheckoutNotes(e.target.value)}
                        placeholder="Ej. Portón café de 2 plantas, tocar el intercom 4, llamar antes de llegar..."
                        className="w-full px-3.5 py-2.5 border border-natural-border rounded-xl focus:outline-none focus:border-[#c5a85c] text-xs bg-natural-bg text-natural-dark text-left font-sans placeholder-natural-muted"
                        rows={2}
                        id="checkout_notes_input"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3 px-6 bg-[#c5a85c] hover:bg-[#b59549] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition duration-300 shadow-md transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                        id="btn_confirm_checkout"
                      >
                        <CheckCircle size={15} />
                        <span>Confirmar Compra (Pago Contra Entrega)</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Right side: User Orders History Log (lg:col-span-5) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-sm space-y-4" id="user_purchases_wrapper">
                <div className="border-b border-natural-border pb-3 flex items-center justify-between">
                  <h4 className="text-base font-extrabold text-natural-dark font-serif flex items-center gap-2">
                    <CheckCircle size={18} className="text-[#c5a85c]" />
                    <span>Mis Compras / Pedidos Realizados</span>
                  </h4>
                  <span className="text-[10px] bg-natural-bg border border-natural-border/60 text-natural-silt font-mono font-bold px-2 py-0.5 rounded-md">
                    Historial Real (Sesión)
                  </span>
                </div>

                {sessionOrders.length === 0 ? (
                  <div className="py-16 text-center text-natural-muted" id="empty_purchases_log">
                    <Clock size={28} className="mx-auto mb-2 text-natural-muted/60" />
                    <p className="text-xs font-bold text-natural-dark">No has completado compras en esta sesión</p>
                    <p className="text-[10px] text-natural-muted mt-1">Los pedidos que completes usando el formulario de check-out con pago contra entrega aparecerán aquí en tiempo real.</p>
                  </div>
                ) : (
                  <div className="space-y-4" id="session_purchases_list">
                    {sessionOrders.map(order => (
                      <div 
                        key={order.id} 
                        className="p-4 bg-slate-50/70 border border-natural-border rounded-xl space-y-3 hover:border-[#c5a85c]/35 transition text-xs"
                      >
                        <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-natural-border/45">
                          <div>
                            <span className="text-[8px] uppercase tracking-widest text-natural-muted leading-none font-bold">Folio Pedido</span>
                            <span className="text-xs font-black text-natural-dark font-mono block mt-0.5">{order.id}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[8px] uppercase tracking-widest text-[#c5a85c] leading-none font-black block">Monto Total</span>
                            <span className="text-xs font-extrabold text-natural-dark font-mono block mt-0.5" id={`price_sum_${order.id}`}>${order.total.toLocaleString()} MXN</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[9px] uppercase tracking-wider text-natural-muted font-bold block">Artículos Solicitados:</span>
                          <ul className="list-disc pl-4 space-y-0.5 text-natural-dark font-medium font-mono text-[11px]">
                            {order.productNames.map((pn, i) => (
                              <li key={i}>{pn}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-natural-border/50">
                          <div className="flex items-center gap-1 text-natural-silt font-medium font-mono text-[10px]">
                            <Clock size={11} />
                            <span>{new Date(order.date).toLocaleDateString('es-MX', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] text-[#c5a85c] font-black uppercase bg-[#c5a85c]/10 border border-[#c5a85c]/25 px-2 py-0.5 rounded-full">
                              Procesando
                            </span>
                            <span className="text-[9px] text-emerald-800 font-extrabold uppercase bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              Contra Entrega
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW 3: DISPATCH CONTROL CENTER & CATALOG SETTINGS */}
        {activeViewMode === 'manager' && (
          <motion.div
            key="manager_mode_view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6 text-left"
            id="dispatch_operations_container"
          >
            {/* KPI Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-sans" id="sales_stats_grid">
              
              <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-sm flex items-center justify-between" id="sales_revenue_card">
                <div>
                  <p className="text-[10px] font-black text-[#c5a85c] uppercase tracking-widest leading-none font-mono">Ventas Entregadas (MXN)</p>
                  <h3 className="text-2xl font-black text-natural-dark mt-2 font-mono">
                    ${totalManagerSalesRevenue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </h3>
                  <p className="text-[10px] text-natural-muted mt-1">Suma acumulada de pedidos cobrados</p>
                </div>
                <div className="p-3 bg-emerald-50 text-[#c5a85c] rounded-xl border border-emerald-100">
                  <TrendingUp size={22} />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-sm flex items-center justify-between" id="sales_orders_card">
                <div>
                  <p className="text-[10px] font-black text-[#c5a85c] uppercase tracking-widest leading-none font-mono">Total Pedidos Homeli</p>
                  <h3 className="text-2xl font-black text-natural-dark mt-2 font-mono">
                    {orders.length} órdenes
                  </h3>
                  <p className="text-[10px] text-[#c5a85c] font-bold mt-1">
                    {orders.filter(o => o.status === 'procesando').length} pendientes de envío
                  </p>
                </div>
                <div className="p-3 bg-amber-50 text-amber-700 rounded-xl border border-amber-100">
                  <ShoppingBag size={22} />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-sm flex items-center justify-between" id="sales_stock_warning_card">
                <div>
                  <p className="text-[10px] font-black text-[#c5a85c] uppercase tracking-widest leading-none font-mono">Módulos Inventario Crítico</p>
                  <h3 className="text-2xl font-black text-natural-dark mt-2 font-mono">
                    {lowStockProductsCount} productos
                  </h3>
                  <p className={`text-[10px] mt-1 font-bold ${lowStockProductsCount > 0 ? 'text-red-500 font-extrabold' : 'text-emerald-700'}`}>
                    {lowStockProductsCount > 0 ? 'Requieren surtido urgente' : 'Niveles de mercancía en orden'}
                  </p>
                </div>
                <div className={`p-3 rounded-xl border ${lowStockProductsCount > 0 ? 'bg-red-50 text-red-500 border-red-100 animate-pulse' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                  <AlertTriangle size={22} />
                </div>
              </div>
            </div>

            {/* Sub navigation inside logistics & catalog */}
            <div className="bg-white p-4 rounded-xl border border-natural-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4" id="logistics_action_toolbar">
              <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto" id="logistics_tabs">
                <span className="text-[11px] font-black text-natural-muted uppercase font-mono bg-natural-bg py-1 px-2.5 rounded-md">LOGÍSTICA INTERNA</span>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto" id="manage_view_search_controls">
                <Search size={14} className="text-natural-muted hidden sm:inline" />
                <input
                  type="text"
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  placeholder="Filtrar pedidos o clientes..."
                  className="px-3 py-1.5 text-xs bg-natural-bg border border-natural-border rounded-lg text-natural-dark focus:outline-none focus:border-[#c5a85c] font-bold shrink-0 min-w-[200px]"
                  id="logistic_order_search"
                />

                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="px-4 py-2 bg-[#c5a85c] hover:bg-[#b59549] text-white rounded-lg text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-sm flex items-center gap-1 shrink-0"
                  id="btn_trigger_add_product"
                >
                  <Plus size={14} />
                  <span>Nuevo Catálogo</span>
                </button>
              </div>
            </div>

            {/* Logistical Orders list table */}
            <div className="bg-white rounded-2xl border border-natural-border shadow-sm overflow-hidden" id="logistic_table_wrapper">
              <div className="p-4 bg-slate-50/60 border-b border-natural-border">
                <h5 className="font-extrabold text-natural-dark text-xs sm:text-sm font-serif">Despacho de Órdenes de E-Commerce</h5>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse" id="orders_dashboard_table">
                  <thead>
                    <tr className="bg-natural-bg text-[10px] font-bold uppercase text-natural-muted tracking-wider border-b border-natural-border font-mono">
                      <th className="py-3 px-5">Código Orden</th>
                      <th className="py-3 px-5">Comprador</th>
                      <th className="py-3 px-5">Fecha</th>
                      <th className="py-3 px-5">Ítems Solicitados</th>
                      <th className="py-3 px-5 text-right">Monto</th>
                      <th className="py-3 px-5">Estatus</th>
                      <th className="py-3 px-5 text-center">Acciones Logísticas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-natural-border text-xs text-natural-text font-mono">
                    {managerFilteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-natural-muted font-sans font-medium">
                          No se han detectado órdenes de compra registradas en el sistema.
                        </td>
                      </tr>
                    ) : (
                      managerFilteredOrders.map(order => (
                        <tr key={order.id} className="hover:bg-natural-bg/40 transition">
                          <td className="py-3.5 px-5 font-bold text-natural-dark">
                            {order.id}
                          </td>
                          <td className="py-3.5 px-5 font-sans">
                            <p className="font-extrabold text-natural-dark">{order.customerName}</p>
                            <p className="text-[10px] text-natural-muted font-mono">{order.customerEmail}</p>
                          </td>
                          <td className="py-3.5 px-5 text-natural-muted font-bold">
                            {new Date(order.date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-3.5 px-5 max-w-[200px] font-sans">
                            <p className="font-bold text-natural-dark truncate" title={order.productNames.join(', ')}>
                              {order.productNames.join(', ')}
                            </p>
                            <p className="text-[10px] text-amber-700 font-extrabold">{order.itemsCount} piezas</p>
                          </td>
                          <td className="py-3.5 px-5 text-right font-black text-natural-dark">
                            ${order.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3.5 px-5 font-sans">
                            <span className={`inline-block px-2.5 py-0.5 text-[10px] font-extrabold rounded-full border ${
                              order.status === 'procesando' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              order.status === 'enviado' ? 'bg-indigo-50 text-indigo-700 border-indigo-250' :
                              order.status === 'entregado' ? 'bg-green-50 text-green-700 border-green-200' :
                              'bg-rose-50 text-rose-700 border-rose-200'
                            }`}>
                              {order.status === 'procesando' ? 'Procesando' :
                               order.status === 'enviado' ? 'En ruta' :
                               order.status === 'entregado' ? 'Entregado' : 'Cancelado'}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 font-sans">
                            <div className="flex gap-1 justify-center">
                              {order.status === 'procesando' && (
                                <button
                                  onClick={() => {
                                    onUpdateOrderStatus(order.id, 'enviado');
                                    onAddLog(`Logística: Orden E-Commerce ${order.id} despachada - En ruta de reparto nacional`, 'info');
                                  }}
                                  className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-extrabold rounded-lg text-[10px] flex items-center gap-1 transition border border-amber-200 cursor-pointer"
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
                                    onAddLog(`Logística: Orden E-Commerce ${order.id} entregada y cobrada con éxito`, 'info');
                                  }}
                                  className="px-3 py-1 bg-green-50 hover:bg-green-100 text-green-800 font-extrabold rounded-lg text-[10px] flex items-center gap-1 transition border border-green-200 cursor-pointer"
                                  title="Marcar como Entregado"
                                >
                                  <Check size={12} />
                                  <span>Registrar pago</span>
                                </button>
                              )}
                              {order.status === 'entregado' && (
                                <span className="text-[10px] text-green-700 font-black flex items-center gap-0.5">
                                  <CheckCircle size={12} /> Liquidado
                                </span>
                              )}
                              {order.status === 'cancelado' && (
                                <span className="text-[10px] text-red-500 font-bold">
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
            </div>

            {/* Master Catalog List Administration table */}
            <div className="bg-white rounded-2xl border border-natural-border shadow-sm overflow-hidden" id="logistic_catalog_wrapper">
              <div className="p-4 bg-slate-50/60 border-b border-natural-border flex justify-between items-center">
                <h5 className="font-extrabold text-natural-dark text-xs sm:text-sm font-serif">Alineación de Catálogo e Inventario</h5>
                <div className="relative">
                  <input
                    type="text"
                    value={productQuery}
                    onChange={(e) => setProductQuery(e.target.value)}
                    placeholder="Filtrar catálogo..."
                    className="pl-7 pr-3 py-1 bg-white border border-natural-border rounded-lg text-[11px] text-natural-dark font-medium"
                  />
                  <Search size={11} className="absolute left-2.5 top-2 text-natural-muted" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 p-4" id="inventory_admin_grid">
                {managerFilteredProducts.map(p => (
                  <div key={p.id} className="p-3 bg-slate-50 border border-natural-border rounded-xl space-y-2 flex flex-col justify-between" id={`invent_card_${p.id}`}>
                    <div className="flex gap-2 items-start">
                      <div className="w-10 h-10 bg-white border rounded overflow-hidden shrink-0">
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="min-w-0">
                        <h6 className="font-bold text-natural-dark text-xs truncate leading-tight">{p.name}</h6>
                        <span className="text-[9px] uppercase tracking-wider text-natural-muted font-mono leading-none block mt-0.5">{p.sku}</span>
                      </div>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-natural-border/60 text-[10px] grid grid-cols-3 gap-1 text-center font-mono">
                      <div>
                        <span className="text-natural-muted block text-[8px] uppercase">Precio</span>
                        <span className="font-bold text-natural-dark">${p.price}</span>
                      </div>
                      <div>
                        <span className="text-natural-muted block text-[8px] uppercase">Stock</span>
                        <span className={`font-bold ${p.stock < 10 ? 'text-red-500 font-black' : 'text-natural-dark'}`}>{p.stock} pz</span>
                      </div>
                      <div>
                        <span className="text-natural-muted block text-[8px] uppercase">Vendido</span>
                        <span className="font-bold text-emerald-800">+{p.salesCount}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Product Modal (In manager view) */}
      <AnimatePresence>
        {showAddProductModal && (
          <div className="fixed inset-0 bg-natural-dark/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-natural-border p-6 max-w-md w-full shadow-2xl space-y-6 text-left"
              id="add_new_catalog_modal"
            >
              <div className="flex justify-between items-center pb-3 border-b border-natural-border">
                <h3 className="text-base font-extrabold font-serif text-natural-dark flex items-center gap-2">
                  <Package size={18} className="text-[#c5a85c]" />
                  <span>Dar de alta nuevo producto</span>
                </h3>
                <button 
                  onClick={() => setShowAddProductModal(false)}
                  className="text-natural-muted hover:text-natural-dark text-sm font-bold cursor-pointer transition"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleManagerCreateProduct} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-natural-muted uppercase tracking-wider mb-1.5">Nombre comercial *</label>
                  <input
                    type="text"
                    required
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    placeholder="Ej. Tenis Deportivos Pro-Flex"
                    className="w-full px-3 py-2 border border-natural-border rounded-xl uppercase text-xs text-natural-dark font-extrabold focus:outline-none focus:border-[#c5a85c]"
                    id="m_pname"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-natural-muted uppercase tracking-wider mb-1.5">Categoría de Tienda</label>
                    <select
                      value={pCategory}
                      onChange={(e) => setPCategory(e.target.value as any)}
                      className="w-full px-2 py-1.5 border border-natural-border rounded-xl text-xs bg-white text-natural-dark focus:outline-none focus:border-[#c5a85c]"
                      id="m_pcategory"
                    >
                      <option value="Productos de limpieza">Productos de limpieza</option>
                      <option value="Zapatos">Zapatos (Calzado)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[#c5a85c] uppercase tracking-wider mb-1.5">Stock de almacén *</label>
                    <input
                      type="number"
                      required
                      value={pStock}
                      onChange={(e) => setPStock(e.target.value)}
                      placeholder="12"
                      className="w-full px-3 py-1.5 border border-natural-border rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-[#c5a85c]"
                      id="m_pstock"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-natural-muted uppercase tracking-wider mb-1.5">Precio de Venta ($ MXN) *</label>
                    <input
                      type="number"
                      required
                      value={pPrice}
                      onChange={(e) => setPPrice(e.target.value)}
                      placeholder="899"
                      className="w-full px-3 py-1.5 border border-natural-border rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-[#c5a85c]"
                      id="m_pprice"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-natural-muted uppercase tracking-wider mb-1.5">URL de Imagen (Opcional)</label>
                    <input
                      type="url"
                      value={pImgUrl}
                      onChange={(e) => setPImgUrl(e.target.value)}
                      placeholder="https://ejemplo.com/foto.jpg"
                      className="w-full px-3 py-1.5 border border-natural-border rounded-xl text-xs text-natural-dark focus:outline-none focus:border-[#c5a85c]"
                      id="m_pimgurl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-natural-muted uppercase tracking-wider mb-1.5">Descripción de Venta (Opcional)</label>
                  <textarea
                    value={pDesc}
                    onChange={(e) => setPDesc(e.target.value)}
                    placeholder="Detalles sobre materiales, componentes o tallas..."
                    className="w-full px-3 py-2 border border-natural-border rounded-xl text-xs text-natural-dark text-left focus:outline-none focus:border-[#c5a85c]"
                    rows={2}
                    id="m_pdesc"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="flex-1 py-2 px-3 bg-natural-bg hover:bg-natural-border/60 text-natural-silt text-xs font-extrabold rounded-xl transition"
                  >
                    Cerrar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-3 bg-[#c5a85c] hover:bg-[#b59549] text-white text-xs font-extrabold rounded-xl transition shadow-sm"
                  >
                    Crear Artículo
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

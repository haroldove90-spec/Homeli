/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ProductItem, SalesOrder, OrderStatus, AppNotification } from '../types';
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
  Filter,
  ChevronDown,
  LogOut,
  Sliders,
  Sparkles,
  RefreshCw,
  Home,
  Bell,
  BellRing,
  Camera,
  QrCode,
  Maximize2,
  Play,
  Pause,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VentasSectionProps {
  products: ProductItem[];
  orders: SalesOrder[];
  onAddProduct: (product: ProductItem) => void;
  onUpdateOrderStatus: (id: string, status: OrderStatus) => void;
  onAddLog: (action: string, severity: 'info' | 'warning' | 'critical') => void;
  onAddOrder?: (order: SalesOrder) => void;
  onNavigateToHome?: () => void;
  bannerBg?: string;
  bannerTitle?: string;
  bannerTag?: string;
  bannerDesc?: string;
  bannerOverlayCol?: string;
  bannerOverlayOpacity?: number;
  notifications?: AppNotification[];
  onOpenNotifications?: () => void;
}

// Exact 12 products with corresponding category classification
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
    name: 'Windex Limpiador de Vidrios original',
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
  onAddOrder,
  onNavigateToHome,
  bannerBg = '',
  bannerTitle = 'Catálogo Exclusivo Homeli',
  bannerTag = 'BOUTIQUE',
  bannerDesc = 'Descubre nuestras dos exclusivas divisiones diseñadas meticulosamente para brindar confort personal y sanidad impecable en tu hogar.',
  bannerOverlayCol = '#0f172a',
  bannerOverlayOpacity = 60,
  notifications = [],
  onOpenNotifications
}: VentasSectionProps) {
  // Views inside e-commerce: 'shop', 'cart_orders', 'manager'
  const [activeViewMode, setActiveViewMode] = useState<'shop' | 'cart_orders' | 'manager'>(() => {
    try {
      const persisted = localStorage.getItem('homeli_ventas_active_view_mode');
      return (persisted as 'shop' | 'cart_orders' | 'manager') || 'shop';
    } catch {
      return 'shop';
    }
  });

  useEffect(() => {
    localStorage.setItem('homeli_ventas_active_view_mode', activeViewMode);
  }, [activeViewMode]);
  
  // Catalog containing products
  const [storeCatalog, setStoreCatalog] = useState<ProductItem[]>([]);
  
  // Shopping Cart state
  const [cart, setCart] = useState<{ product: ProductItem; quantity: number }[]>([]);
  
  // Category selected filtering: 'todos' | 'Zapatos' | 'Productos de limpieza'
  const [selectedCategory, setSelectedCategory] = useState<'todos' | 'Zapatos' | 'Productos de limpieza'>('todos');
  
  // Custom user profile data (modifiable)
  const [userProfile, setUserProfile] = useState({
    name: 'Valeria Fuentes',
    phone: '55-3211-9080',
    address: 'Av. Paseo de la Reforma 450, Piso 12, Juárez, 06600 Ciudad de México, CDMX',
    roleLabel: 'Cliente Premium',
    city: 'CDMX',
    email: 'valeria@homeli.mx'
  });

  // State controls
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  // Temporary forms for checkout
  const [checkoutName, setCheckoutName] = useState(userProfile.name);
  const [checkoutPhone, setCheckoutPhone] = useState(userProfile.phone);
  const [checkoutAddress, setCheckoutAddress] = useState(userProfile.address);
  const [checkoutNotes, setCheckoutNotes] = useState('');
  
  // Product Detail & Registration module States
  const [selectedProductDetails, setSelectedProductDetails] = useState<any>(null);
  const [detailsQuantity, setDetailsQuantity] = useState(1);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  const [isOrderOrdered, setIsOrderOrdered] = useState(false);
  const [latestOrderId, setLatestOrderId] = useState('');

  // 360° and AR logic states
  const [arMediaMode, setArMediaMode] = useState<'photo' | 'rotate360' | 'ar_camera'>('photo');
  const [rotateAngle, setRotateAngle] = useState(180); // Center angle
  const [rotatePitch, setRotatePitch] = useState(5);  // Slight realistic pitch angle
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [arScale, setArScale] = useState(1.1);
  const [arPosition, setArPosition] = useState({ x: 0, y: 0 });
  const [isDraggingProduct, setIsDraggingProduct] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [arStream, setArStream] = useState<MediaStream | null>(null);
  const [isArCameraActive, setIsArCameraActive] = useState(false);
  const [showQrCodeOverlay, setShowQrCodeOverlay] = useState(false);
  const [simulatedArPhoto, setSimulatedArPhoto] = useState<string | null>(null);
  const arVideoRef = useRef<HTMLVideoElement | null>(null);

  // Surface detection & realistic lighting simulation states
  const [arLightMode, setArLightMode] = useState<'natural' | 'warm' | 'sunset' | 'fluorescent'>('natural');
  const [isPlacedOnFloor, setIsPlacedOnFloor] = useState(false);
  const [isScanningSurface, setIsScanningSurface] = useState(false);
  const [arBlendMultiply, setArBlendMultiply] = useState(false);

  // Trigger surface scan simulation when customer enters AR mode
  useEffect(() => {
    if (arMediaMode === 'ar_camera') {
      setIsScanningSurface(true);
      setIsPlacedOnFloor(false);
      const timer = setTimeout(() => {
        setIsScanningSurface(false);
      }, 2500); // 2.5 seconds of high fidelity SLAM environment mapping
      return () => clearTimeout(timer);
    }
  }, [arMediaMode]);

  // Auto-rotate 360° effect
  useEffect(() => {
    let intervalId: any;
    if (isAutoRotate && arMediaMode === 'rotate360') {
      intervalId = setInterval(() => {
        setRotateAngle(prev => (prev + 2) % 360);
      }, 30);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAutoRotate, arMediaMode]);

  // Webcam stream toggle helper
  const startArWebcam = async () => {
    try {
      if (arStream) {
        stopArWebcam();
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: 640, height: 480 } 
      });
      setArStream(mediaStream);
      setIsArCameraActive(true);
    } catch (err) {
      console.warn("Camera fallback will be used because access was denied or unavailable:", err);
      setIsArCameraActive(true); // Let them use simulated room picture fallback beautifully!
    }
  };

  const stopArWebcam = () => {
    if (arStream) {
      arStream.getTracks().forEach(track => track.stop());
      setArStream(null);
    }
    setIsArCameraActive(false);
  };

  // Keep webcam element connected
  useEffect(() => {
    if (isArCameraActive && arVideoRef.current && arStream) {
      arVideoRef.current.srcObject = arStream;
      arVideoRef.current.play().catch(err => console.error("AR Video stream play failed:", err));
    }
  }, [isArCameraActive, arStream]);

  // Cleanup camera stream
  useEffect(() => {
    return () => {
      if (arStream) {
        arStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [arStream]);

  // Webcam management based on active media mode
  useEffect(() => {
    if (arMediaMode === 'ar_camera') {
      startArWebcam();
    } else {
      stopArWebcam();
    }
  }, [arMediaMode]);

  // Reset all 360 & AR parameters on product switch with deep link support
  useEffect(() => {
    if (selectedProductDetails) {
      // Check if this was loaded via QR deep link to preserve and trigger the 360/AR view immediately!
      const urlParams = new URL(window.location.href);
      const isQrDeep = urlParams.searchParams.get('ar_product') === selectedProductDetails.id;

      if (isQrDeep) {
        setArMediaMode('ar_camera'); // Spark joy immediately with floor AR camera simulation!
        setIsAutoRotate(false);
      } else {
        setArMediaMode('photo');
        setIsAutoRotate(false);
      }
      setRotateAngle(180);
      setRotatePitch(5);
      setArScale(1.0); // Reset to 100% scale for realistic size fitting by default
      setArPosition({ x: 0, y: 0 });
      setSimulatedArPhoto(null);
      setIsPlacedOnFloor(false);
      setArLightMode('natural');
      setArBlendMultiply(false);
    } else {
      stopArWebcam();
    }
  }, [selectedProductDetails]);

  // Auto-detect deep-linked product from QR scan on mount
  useEffect(() => {
    try {
      const urlParams = new URL(window.location.href);
      const deepProdId = urlParams.searchParams.get('ar_product');
      if (deepProdId) {
        // Find in full dynamic products or fallback static store catalog
        const found = products.find(p => p.id === deepProdId) || STATIC_STORE_PRODUCTS.find(p => p.id === deepProdId);
        if (found) {
          setSelectedProductDetails(found);
          // Auto-start in 360 interactive rotation for immediate user engagement!
          setArMediaMode('rotate360');
          onAddLog(`AR E-Commerce: Producto ${found.name} cargado vía QR Móvil exitosamente`, 'info');
        }
      }
    } catch (e) {
      console.error("Deep link parse failed", e);
    }
  }, [products]);

  // Manager state variables
  const [productQuery, setProductQuery] = useState('');
  const [orderQuery, setOrderQuery] = useState('');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  
  // New product inputs
  const [pName, setPName] = useState('');
  const [pPrice, setPPrice] = useState('');
  const [pStock, setPStock] = useState('');
  const [pCategory, setPCategory] = useState<string>('Productos de limpieza');
  const [pDesc, setPDesc] = useState('');
  const [pImgUrl, setPImgUrl] = useState('');

  // Sync catalog updates (Filter out inactive or zero-stock products for the storefront)
  useEffect(() => {
    const relevant = products.filter(p => {
      const matchCategory = p.category === 'Productos de limpieza' || p.category === 'Zapatos';
      const isAvailable = p.active !== false && p.stock > 0;
      return matchCategory && isAvailable;
    });
    setStoreCatalog(relevant);
  }, [products]);

  // Sync profile fields initially
  useEffect(() => {
    setCheckoutName(userProfile.name);
    setCheckoutPhone(userProfile.phone);
    setCheckoutAddress(userProfile.address);
  }, [userProfile]);

  // Cart operations
  const addToCart = (product: ProductItem) => {
    if (product.stock <= 0) {
      alert('Este artículo se encuentra temporalmente agotado.');
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert(`Lo sentimos, el límite de stock disponible es de ${product.stock} unidades.`);
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

    onAddLog(`Cliente añadió al carrito: ${product.name}`, 'info');
    setIsCartDrawerOpen(true); // Auto-open floating cart drawer on add
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      const item = prev.find(i => i.product.id === productId);
      if (!item) return prev;
      
      const newQty = item.quantity + delta;
      if (newQty <= 0) {
        return prev.filter(i => i.product.id !== productId);
      }
      
      if (newQty > item.product.stock) {
        alert(`Disponibilidad limitada a ${item.product.stock} pz.`);
        return prev;
      }
      
      return prev.map(i => i.product.id === productId ? { ...i, quantity: newQty } : i);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  // Submit order handler
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!checkoutName.trim() || !checkoutPhone.trim() || !checkoutAddress.trim()) {
      alert('Por favor, ingresa los datos esenciales para la entrega.');
      return;
    }

    const randomID = `ORD-${Math.floor(8000 + Math.random() * 1999)}`;
    const totalAmount = cart.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0);
    
    const newSalesOrder: SalesOrder = {
      id: randomID,
      customerName: checkoutName,
      customerEmail: userProfile.email,
      date: new Date().toISOString(),
      total: totalAmount,
      status: 'procesando',
      itemsCount: cart.reduce((acc, i) => acc + i.quantity, 0),
      productNames: cart.map(i => `${i.product.name} (x${i.quantity})`)
    };

    if (onAddOrder) {
      onAddOrder(newSalesOrder);
    }

    // Deduct simulated stock
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

    onAddLog(`E-Commerce: ¡Nuevo pedido liquidable registrado! ID: ${newSalesOrder.id} - Monto: $${totalAmount} MXN`, 'info');

    setLatestOrderId(randomID);
    setIsOrderOrdered(true);
    setCart([]);
    setCheckoutNotes('');
  };

  // Create products in Admin View
  const handleManagerCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName.trim() || !pPrice.trim() || !pStock.trim()) {
      alert('Por favor complete los campos obligatorios del alta de producto.');
      return;
    }

    const resolvedImg = pImgUrl.trim() || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400';
    const newPrd: ProductItem = {
      id: `PROD-${Math.floor(300 + Math.random() * 699)}`,
      name: pName,
      sku: `HML-${pCategory.substring(0,3).toUpperCase()}-${Math.floor(100 + Math.random() * 899)}`,
      category: pCategory,
      price: parseFloat(pPrice) || 199,
      stock: parseInt(pStock) || 12,
      salesCount: 0,
      description: pDesc.trim() || 'Impecable artículo seleccionado y garantizado por estándares de Homeli.',
      imageUrl: resolvedImg
    };

    onAddProduct(newPrd);
    onAddLog(`Almacén: Añadido producto de catálogo ${newPrd.name} (${newPrd.category})`, 'info');

    setPName('');
    setPPrice('');
    setPStock('');
    setPDesc('');
    setPImgUrl('');
    setShowAddProductModal(false);
  };

  // Reset shopping notification banner
  const closeConfirmationState = () => {
    setIsOrderOrdered(false);
    setLatestOrderId('');
  };

  // Filter Catalog lists
  const shoeCatalogItems = storeCatalog.filter(p => p.category === 'Zapatos');
  const cleaningCatalogItems = storeCatalog.filter(p => p.category === 'Productos de limpieza');

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

  const cartItemsCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const cartTotalAmount = cart.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans" id="premium_shop_dashboard">
      
      {/* ================= HEADER GENERAL DE LA TIENDA ================= */}
      <header className="bg-white border-b border-slate-200/85 sticky top-0 z-40 shadow-xs px-4 sm:px-8 py-3.5 flex items-center justify-between" id="boutique_header">
        {/* Left column: Brand Identifier (Quita Homeli E-Commerce y TIENDA PREMIUM MULTI-CATEGORÍA) */}
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => { setActiveViewMode('shop'); setSelectedCategory('todos'); }} id="brand_home_box">
          <img 
            src="https://cossma.com.mx/homeli.jpg" 
            alt="Homeli Logo" 
            className="h-16 sm:h-20 w-auto object-contain block transition-all"
            referrerPolicy="no-referrer"
          />
          <div>
            <h1 className="text-base sm:text-xl font-serif font-black tracking-tight text-slate-900 leading-none">
              Homeli
            </h1>
            <p className="text-[10px] text-slate-400 font-bold font-sans tracking-wide uppercase mt-1">Cuidado & Estilo Sostenible</p>
          </div>
        </div>

        {/* Middle column: Menu Bar showing User Modules & Categories (Barra de Menú Sus Módulos) */}
        <nav className="hidden md:flex items-center gap-2.5 bg-slate-100 p-1 rounded-xl border border-slate-200/60" id="header_navbar_menu_bar">
          <button
            onClick={() => {
              setActiveViewMode('shop');
              setSelectedCategory('Zapatos');
              setIsOrderOrdered(false);
            }}
            className={`px-5 py-2.5 rounded-lg text-sm font-black transition flex items-center gap-1.5 cursor-pointer ${activeViewMode === 'shop' && selectedCategory === 'Zapatos' ? 'bg-white text-[#c19a45] shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <span>👠 Calzado Premium</span>
          </button>
          
          <button
            onClick={() => {
              setActiveViewMode('shop');
              setSelectedCategory('Productos de limpieza');
              setIsOrderOrdered(false);
            }}
            className={`px-5 py-2.5 rounded-lg text-sm font-black transition flex items-center gap-1.5 cursor-pointer ${activeViewMode === 'shop' && selectedCategory === 'Productos de limpieza' ? 'bg-white text-[#c19a45] shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <span>🧴 Limpieza Avanzada</span>
          </button>

          <button
            onClick={() => {
              setActiveViewMode('cart_orders');
              setIsOrderOrdered(false);
            }}
            className={`px-5 py-2.5 rounded-lg text-sm font-black transition flex items-center gap-1.5 cursor-pointer ${activeViewMode === 'cart_orders' ? 'bg-white text-[#c19a45] shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <span>📦 Mis Compras</span>
          </button>
        </nav>

        {/* Right column: Notification Bell + User profile Avatar Dropdown */}
        <div className="flex items-center gap-3" id="right_header_controls">
          
          {/* Campanita de Notificaciones para Cliente */}
          <button
            onClick={() => {
              if (onOpenNotifications) {
                onOpenNotifications();
              }
            }}
            className="relative p-2.5 hover:bg-slate-50 border border-slate-250 bg-white rounded-xl shadow-xs transition cursor-pointer text-slate-750 hover:text-[#c5a85c] focus:outline-none"
            id="client_header_bell_btn"
            title={`${notifications ? notifications.filter(n => !n.read && (n.role === 'Cliente' || n.role === 'Todos')).length : 0} Notificaciones`}
          >
            <Bell size={18} className={notifications && notifications.filter(n => !n.read && (n.role === 'Cliente' || n.role === 'Todos')).length > 0 ? "text-[#c5a85c]" : "text-slate-600"} />
            
            {notifications && notifications.filter(n => !n.read && (n.role === 'Cliente' || n.role === 'Todos')).length > 0 && (
              <span className="absolute -top-1 -right-1 w-5.5 h-5.5 bg-red-500 text-white font-extrabold text-[9px] rounded-full flex items-center justify-center animate-pulse border border-white">
                {notifications.filter(n => !n.read && (n.role === 'Cliente' || n.role === 'Todos')).length}
              </span>
            )}
          </button>

          <div className="relative" id="user_dropdown_container">
          <button
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="flex items-center gap-3 px-4 py-2 border-2 border-[#c5a85c] hover:border-[#b59549] rounded-xl bg-[#c5a85c]/5 hover:bg-[#c5a85c]/10 shadow-sm transition duration-150 text-left cursor-pointer"
            id="user_header_trigger_btn"
          >
            {/* Highly Visible Real User Icon instead of just initials */}
            <div className="w-8 h-8 rounded-lg bg-[#c19a45] text-white flex items-center justify-center font-bold text-xs shadow-inner shrink-0">
              <User size={18} className="stroke-[2.5]" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs sm:text-sm font-black leading-none text-slate-900">{userProfile.name}</p>
              <span className="text-[10px] text-slate-500 font-bold block mt-1">{userProfile.roleLabel}</span>
            </div>
            <ChevronDown size={14} className="text-[#c19a45] transition-transform duration-200" />
          </button>

          {/* User Menu Dropdown Panel */}
          <AnimatePresence>
            {isUserDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsUserDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2.5 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 py-2.5 text-left"
                  id="user_profile_dropdown"
                >
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#ebd7a7] text-[#c19a45] flex items-center justify-center font-bold text-sm">
                      {userProfile.name.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 leading-none">{userProfile.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[150px]">{userProfile.email}</p>
                    </div>
                  </div>

                  {/* Nav links (helpful on mobile too!) */}
                  <div className="p-1 space-y-0.5 border-b border-slate-100">
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        setIsProfileModalOpen(true);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-xs font-bold text-slate-700 hover:text-slate-900 rounded-xl transition flex items-center gap-2.5"
                    >
                      <User size={14} className="text-[#c19a45]" />
                      <span>👤 Mi Perfil de Usuario</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        setIsCartDrawerOpen(true);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-xs font-bold text-slate-700 hover:text-slate-900 rounded-xl transition flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2.5">
                        <ShoppingCart size={14} className="text-[#c19a45]" />
                        <span>🛒 Carrito de Compras</span>
                      </span>
                      {cartItemsCount > 0 && (
                        <span className="bg-[#c5a85c] text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold font-mono">
                          {cartItemsCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        setActiveViewMode('cart_orders');
                        setIsOrderOrdered(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-xs font-bold text-slate-700 hover:text-slate-900 rounded-xl transition flex items-center gap-2.5"
                    >
                      <ShoppingBag size={14} className="text-[#c19a45]" />
                      <span>📦 Mis Compras Recientes</span>
                    </button>
                    
                    {/* Mobile visible options for navigation */}
                    <div className="block md:hidden border-t border-slate-50 pt-1 space-y-0.5">
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          setActiveViewMode('shop');
                          setSelectedCategory('Zapatos');
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-xs font-bold text-slate-600 rounded-xl transition flex items-center gap-2"
                      >
                        Shoes: Calzado Premium
                      </button>
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          setActiveViewMode('shop');
                          setSelectedCategory('Productos de limpieza');
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-xs font-bold text-slate-600 rounded-xl transition flex items-center gap-2"
                      >
                        Limpieza: Fórmulas Hogar
                      </button>
                    </div>
                  </div>

                  {/* Return to selector of channels */}
                  <div className="p-1">
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        if (onNavigateToHome) {
                          onAddLog('Salió del e-commerce premium regresando a selector de canales', 'info');
                          onNavigateToHome();
                        }
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-red-50 text-xs font-extrabold text-red-600 rounded-xl transition flex items-center gap-2.5"
                    >
                      <LogOut size={14} />
                      <span>🏛️ Cambiar de Rol</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>

      {/* Hero Banner for Category awareness when browsing */}
      {activeViewMode === 'shop' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6" id="ecommerce_hero_banner_container">
          <div 
            className="rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-md bg-cover bg-center transition-all duration-300"
            style={{
              backgroundImage: bannerBg ? `url(${bannerBg})` : 'none',
              backgroundColor: bannerBg ? 'transparent' : bannerOverlayCol
            }}
          >
            {/* Customizable Background Tint / Color Overlay */}
            <div 
              className="absolute inset-0 transition-all duration-300 pointer-events-none"
              style={{
                background: `linear-gradient(to right, ${bannerOverlayCol}, ${bannerOverlayCol}e6, ${bannerOverlayCol}a0, rgba(0,0,0,0))`,
                opacity: bannerBg ? (bannerOverlayOpacity / 100) : 1
              }}
            />
            {/* Default elegant space gradient fallback if no photo and default slate overlay is active */}
            {!bannerBg && bannerOverlayCol === '#0f172a' && (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-indigo-950 pointer-events-none" />
            )}
            <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial from-[#c5a85c]/15 to-transparent pointer-events-none" />
            <div className="relative z-10 max-w-xl space-y-2 text-left">
              <span className="px-2.5 py-0.5 bg-[#c5a85c]/25 border border-[#c19a45]/30 rounded-full text-[9px] font-black tracking-widest uppercase inline-block text-[#ebd7a7]">
                {bannerTag || 'BOUTIQUE'}
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-white leading-tight">
                {selectedCategory === 'Zapatos' ? '👠 Colección Calzado de Alta Costura' : 
                 selectedCategory === 'Productos de limpieza' ? '🧴 Línea de Limpieza de Estándar Profesional' :
                 (bannerTitle || 'Catálogo Exclusivo Homeli')}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {selectedCategory === 'Zapatos' ? 'Selección ergonómica transpirable confeccionada con pieles selectas e ingeniería de soporte de alto impacto.' : 
                 selectedCategory === 'Productos de limpieza' ? 'Agentes concentrados biodegradables libres de químicos nocivos que protegen tu salud familiar.' :
                 (bannerDesc || 'Descubre nuestras dos exclusivas divisiones diseñadas meticulosamente para brindar confort personal y sanidad impecable en tu hogar.')}
              </p>

              {/* Improved dynamic shortcut pills to switch categories */}
              <div className="flex gap-2 pt-2.5">
                <button
                  onClick={() => setSelectedCategory('todos')}
                  className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition ${selectedCategory === 'todos' ? 'bg-[#c5a85c] text-white' : 'bg-white/10 text-slate-300 hover:bg-white/25'}`}
                >
                  Ver Ambos
                </button>
                <button
                  onClick={() => setSelectedCategory('Zapatos')}
                  className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition ${selectedCategory === 'Zapatos' ? 'bg-[#c5a85c] text-white' : 'bg-white/10 text-slate-300 hover:bg-white/25'}`}
                >
                  👠 Calzado
                </button>
                <button
                  onClick={() => setSelectedCategory('Productos de limpieza')}
                  className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition ${selectedCategory === 'Productos de limpieza' ? 'bg-[#c5a85c] text-white' : 'bg-white/10 text-slate-300 hover:bg-white/25'}`}
                >
                  🧴 Limpieza
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Body content according to View Mode */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        <AnimatePresence mode="wait">
          
          {/* ================= VIEW 1: SHOPPING STOREFRONT (SEPARATED SECTIONS) ================= */}
          {activeViewMode === 'shop' && (
            <motion.div
              key="storefront_main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {/* SECTION A: ZAPATOS - Only shown if selectedCategory is 'todos' or 'Zapatos' */}
              {(selectedCategory === 'todos' || selectedCategory === 'Zapatos') && (
                <div className="space-y-4 text-left" id="section_zapatos_catalog">
                  <div className="flex items-center justify-between border-b border-rose-200/50 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">👠</span>
                      <div>
                        <h3 className="text-md sm:text-lg font-serif font-black text-slate-900 tracking-tight">Colección de Calzado de Diseñador</h3>
                        <p className="text-[10px] sm:text-xs text-rose-700/80 font-bold uppercase tracking-wider font-sans">Boutique & Ergonomía Exclusiva</p>
                      </div>
                    </div>
                    <span className="text-xs bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full font-bold font-mono">
                      {shoeCatalogItems.length} Modelos
                    </span>
                  </div>

                  {shoeCatalogItems.length === 0 ? (
                    <div className="p-8 bg-white border border-slate-200 rounded-xl text-center text-slate-400">
                      No hay calzado disponible en este momento.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                      {shoeCatalogItems.map(product => {
                        const inCart = cart.find(i => i.product.id === product.id)?.quantity || 0;
                        return (
                          <div 
                            key={product.id}
                            className="bg-white border border-slate-200 hover:border-[#c5a85c] hover:shadow-lg rounded-2xl p-3 flex flex-col justify-between transition-all duration-300 group"
                          >
                            <div 
                              className="cursor-pointer space-y-2 flex-1 flex flex-col justify-between"
                              onClick={() => { setSelectedProductDetails(product); setDetailsQuantity(1); }}
                              title="Haz clic para ver la sección detallada de este producto"
                            >
                              <div className="relative">
                                <span className="absolute top-1 left-1.5 z-10 text-[8px] font-bold bg-[#c5a85c] text-white px-1.5 py-0.5 rounded-md uppercase">
                                  Calzado
                                </span>
                                {product.stock <= 0 ? (
                                  <span className="absolute top-1 right-1.5 z-10 text-[8px] font-black bg-red-100 text-red-600 px-1.5 py-0.5 border border-red-200 rounded-md">
                                    Agotado
                                  </span>
                                ) : product.stock < 10 ? (
                                  <span className="absolute top-1 right-1.5 z-10 text-[8px] font-black bg-amber-50 text-amber-700 px-1.5 py-0.5 border border-amber-200 rounded-md">
                                    Pocas pz
                                  </span>
                                ) : null}

                                <div className="w-full aspect-square bg-[#f9f5f0] border border-slate-100 rounded-xl overflow-hidden mb-3">
                                  <img 
                                    src={product.imageUrl} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1.5 flex-1 flex flex-col justify-between text-left">
                                <div>
                                  <h4 className="font-serif font-black text-slate-800 text-sm leading-tight line-clamp-1 group-hover:text-[#c5a85c] transition-colors">
                                    {product.name}
                                  </h4>
                                  <p className="text-xs text-slate-400 leading-normal line-clamp-2 mt-0.5">
                                    {product.description}
                                  </p>
                                </div>

                                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-1 items-center mb-2">
                                  <div>
                                    <span className="text-[8px] text-slate-400 font-bold block uppercase">Inversión</span>
                                    <span className="text-sm font-black text-slate-900 font-mono">${product.price} MXN</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[8px] text-slate-400 font-bold block uppercase">Stock</span>
                                    <span className="text-xs font-semibold text-slate-755 font-mono">{product.stock} un</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => addToCart(product)}
                              disabled={product.stock <= 0}
                              className={`w-full py-2 px-2 rounded-xl text-[11px] font-extrabold transition-all duration-250 flex items-center justify-center gap-1 cursor-pointer shadow-xs ${product.stock <= 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200' : 'bg-[#c5a85c]/10 text-[#c5a85c] border border-[#c19a45]/30 hover:bg-[#c5a85c] hover:text-white hover:border-[#c5a85c]'}`}
                            >
                              <Plus size={11} />
                              <span>Añadir</span>
                              {inCart > 0 && (
                                <span className="bg-[#c5a85c] group-hover:bg-white group-hover:text-[#c5a85c] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-mono ml-0.5">
                                  {inCart}
                                </span>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* SECTION B: PRODUCTOS DE LIMPIEZA - Only shown if selectedCategory is 'todos' or 'Productos de limpieza' */}
              {(selectedCategory === 'todos' || selectedCategory === 'Productos de limpieza') && (
                <div className="space-y-4 text-left" id="section_limpieza_catalog">
                  <div className="flex items-center justify-between border-b border-emerald-200/50 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🧴</span>
                      <div>
                        <h3 className="text-md sm:text-lg font-serif font-black text-slate-900 tracking-tight">Insumos Químicos y Limpieza Profesional</h3>
                        <p className="text-[10px] sm:text-xs text-emerald-700/80 font-bold uppercase tracking-wider font-sans">Lavado Profundo & Cuidado Familiar</p>
                      </div>
                    </div>
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-bold font-mono">
                      {cleaningCatalogItems.length} Soluciones
                    </span>
                  </div>

                  {cleaningCatalogItems.length === 0 ? (
                    <div className="p-8 bg-white border border-slate-200 rounded-xl text-center text-slate-400">
                      No hay artículos de limpieza disponibles en este momento.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                      {cleaningCatalogItems.map(product => {
                        const inCart = cart.find(i => i.product.id === product.id)?.quantity || 0;
                        return (
                          <div 
                            key={product.id}
                            className="bg-white border border-slate-200 hover:border-emerald-600 hover:shadow-lg rounded-2xl p-3 flex flex-col justify-between transition-all duration-300 group"
                          >
                            <div 
                              className="cursor-pointer space-y-2 flex-1 flex flex-col justify-between"
                              onClick={() => { setSelectedProductDetails(product); setDetailsQuantity(1); }}
                              title="Haz clic para ver la sección detallada de este producto"
                            >
                              <div className="relative">
                                <span className="absolute top-1 left-1.5 z-10 text-[8px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded-md uppercase">
                                  Limpieza
                                </span>
                                {product.stock <= 0 ? (
                                  <span className="absolute top-1 right-1.5 z-10 text-[8px] font-black bg-red-100 text-red-600 px-1.5 py-0.5 border border-red-200 rounded-md">
                                    Agotado
                                  </span>
                                ) : product.stock < 10 ? (
                                  <span className="absolute top-1 right-1.5 z-10 text-[8px] font-black bg-amber-50 text-amber-700 px-1.5 py-0.5 border border-amber-200 rounded-md">
                                    Pocas pz
                                  </span>
                                ) : null}

                                <div className="w-full aspect-square bg-[#f0f9f6] border border-slate-100 rounded-xl overflow-hidden mb-3">
                                  <img 
                                    src={product.imageUrl} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1.5 flex-1 flex flex-col justify-between text-left">
                                <div>
                                  <h4 className="font-serif font-black text-slate-800 text-sm leading-tight line-clamp-1 group-hover:text-emerald-700 transition-colors">
                                    {product.name}
                                  </h4>
                                  <p className="text-xs text-slate-400 leading-normal line-clamp-2 mt-0.5">
                                    {product.description}
                                  </p>
                                </div>

                                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-1 items-center mb-2">
                                  <div>
                                    <span className="text-[8px] text-slate-400 font-bold block uppercase">Inversión</span>
                                    <span className="text-sm font-black text-slate-900 font-mono">${product.price} MXN</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[8px] text-slate-400 font-bold block uppercase">Stock</span>
                                    <span className="text-xs font-semibold text-slate-755 font-mono">{product.stock} un</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => addToCart(product)}
                              disabled={product.stock <= 0}
                              className={`w-full py-2 px-2 rounded-xl text-[11px] font-extrabold transition-all duration-250 flex items-center justify-center gap-1 cursor-pointer shadow-xs ${product.stock <= 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-300/60 hover:bg-emerald-600 hover:text-white hover:border-emerald-600'}`}
                            >
                              <Plus size={11} />
                              <span>Añadir</span>
                              {inCart > 0 && (
                                <span className="bg-emerald-600 group-hover:bg-white group-hover:text-emerald-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-mono ml-0.5">
                                  {inCart}
                                </span>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* ================= VIEW 2: CART AND USER ORDERS HISTORY ================= */}
          {activeViewMode === 'cart_orders' && (
            <motion.div
              key="cart_orders_view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left"
              id="shopping_cart_panel"
            >
              {/* Left Column: List of recent purchases (User Module Compras) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                  <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                    <h3 className="text-base font-serif font-black text-slate-900 flex items-center gap-2">
                      <ShoppingBag size={18} className="text-[#c5a85c]" />
                      <span>Mis Pedidos y Compras Recientes</span>
                    </h3>
                    <span className="text-xs font-mono font-bold bg-[#c5a85c]/10 text-[#c5a85c] px-2.5 py-1 rounded-full uppercase">
                      Valeria Fuentes
                    </span>
                  </div>

                  {orders.filter(o => o.customerEmail === userProfile.email).length === 0 ? (
                    <div className="text-center py-12 text-slate-400 space-y-2">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                        <ShoppingBag size={22} />
                      </div>
                      <p className="text-xs font-bold font-sans">No cuentas con compras registradas aún.</p>
                      <button
                        onClick={() => setActiveViewMode('shop')}
                        className="text-xs text-[#c19a45] font-black underline"
                      >
                        Ir a explorar la tienda
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders
                        .filter(o => o.customerEmail === userProfile.email)
                        .map(order => (
                          <div 
                            key={order.id} 
                            className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-3 shadow-2xs hover:bg-slate-50/85 transition"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[10px] font-black text-slate-400 uppercase font-mono">ID de Compra</span>
                                <p className="text-xs font-black text-slate-900 font-mono">{order.id}</p>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] font-black text-slate-400 uppercase font-mono block">Estatus Actual</span>
                                <span className={`inline-block px-2.5 py-0.5 text-[9px] font-black rounded-lg uppercase border ${
                                  order.status === 'procesando' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                  order.status === 'enviado' ? 'bg-indigo-50 text-indigo-700 border-indigo-250' :
                                  order.status === 'entregado' ? 'bg-green-50 text-green-700 border-green-200' :
                                  'bg-rose-50 text-rose-700 border-rose-200'
                                }`}>
                                  {order.status === 'procesando' ? 'Procesando' :
                                   order.status === 'enviado' ? 'En reparto' :
                                   order.status === 'entregado' ? 'Entregado' : 'Cancelado'}
                                </span>
                              </div>
                            </div>

                            <div className="border-t border-b border-slate-200/40 py-2">
                              <span className="text-[9px] font-black text-slate-400 uppercase font-mono">Detalles del Pedido:</span>
                              <div className="space-y-1 mt-1 text-slate-700 text-xs font-bold font-sans">
                                {order.productNames.map((p, index) => (
                                  <div key={index} className="flex justify-between">
                                    <span>• {p}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="flex justify-between items-center pt-1.5">
                              <div>
                                <span className="text-[9px] font-bold text-slate-400 block font-mono">FECHA</span>
                                <span className="text-[10px] font-extrabold text-slate-600 font-mono">
                                  {new Date(order.date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-[9px] font-bold text-slate-400 block font-mono">TOTAL A PAGAR</span>
                                <span className="text-sm font-black text-slate-900 font-mono">${order.total} MXN</span>
                              </div>
                            </div>

                            {/* Delivery timeline tracker */}
                            <div className="mt-3 bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between text-center max-w-lg mx-auto">
                              <div className="flex-1 flex flex-col items-center">
                                <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px] font-black">✓</div>
                                <span className="text-[9px] font-black text-slate-600 mt-1 uppercase">Procesada</span>
                              </div>
                              <div className="w-12 h-0.5 bg-slate-200 relative">
                                <div className={`absolute inset-0 bg-green-500 ${order.status !== 'procesando' ? 'w-full' : 'w-0'}`} />
                              </div>
                              <div className="flex-1 flex flex-col items-center">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${order.status === 'enviado' || order.status === 'entregado' ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                  {order.status === 'enviado' || order.status === 'entregado' ? '✓' : '2'}
                                </div>
                                <span className="text-[9px] font-black text-slate-500 mt-1 uppercase">En Reparto</span>
                              </div>
                              <div className="w-12 h-0.5 bg-slate-200 relative">
                                <div className={`absolute inset-0 bg-green-500 ${order.status === 'entregado' ? 'w-full' : 'w-0'}`} />
                              </div>
                              <div className="flex-1 flex flex-col items-center">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${order.status === 'entregado' ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                  {order.status === 'entregado' ? '✓' : '3'}
                                </div>
                                <span className="text-[9px] font-black text-slate-500 mt-1 uppercase">Liquidada</span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Checkout Info & Active Registration Module (Formulario de Registro) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
                  <div>
                    <h4 className="text-sm sm:text-base font-serif font-black text-[#c5a85c] uppercase tracking-wider">Módulo de Registro / Cuenta de Cliente</h4>
                    <p className="text-xs text-slate-400 mt-1">Completa o actualiza tus credenciales del Cliente Oficial para activar el despacho directo y tus beneficios de la marca.</p>
                  </div>
                  
                  {/* Registry Input Fields */}
                  <div className="space-y-4 font-sans text-left">
                    <div>
                      <label className="block text-[11px] font-black uppercase text-slate-400 mb-1 tracking-wider">Nombre Completo del Titular</label>
                      <input
                        type="text"
                        value={userProfile.name}
                        onChange={(e) => {
                          const newName = e.target.value;
                          setUserProfile(prev => ({ ...prev, name: newName }));
                          setCheckoutName(newName);
                        }}
                        placeholder="Nombre Completo..."
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:border-[#c5a85c] focus:outline-none bg-slate-50 hover:bg-slate-100/50"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase text-slate-400 mb-1 tracking-wider">Correo Electrónico de Cuenta</label>
                      <input
                        type="email"
                        value={userProfile.email}
                        onChange={(e) => {
                          const newEmail = e.target.value;
                          setUserProfile(prev => ({ ...prev, email: newEmail }));
                        }}
                        placeholder="email@ejemplo.com"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:border-[#c5a85c] focus:outline-none bg-slate-50"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-black uppercase text-slate-400 mb-1 tracking-wider">Celular de Contacto</label>
                        <input
                          type="tel"
                          value={userProfile.phone}
                          onChange={(e) => {
                            const newPhone = e.target.value;
                            setUserProfile(prev => ({ ...prev, phone: newPhone }));
                            setCheckoutPhone(newPhone);
                          }}
                          placeholder="55-XXXX-XXXX"
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:border-[#c5a85c] focus:outline-none bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black uppercase text-slate-400 mb-1 tracking-wider">Ciudad Residencia</label>
                        <input
                          type="text"
                          value={userProfile.city}
                          onChange={(e) => {
                            const newCity = e.target.value;
                            setUserProfile(prev => ({ ...prev, city: newCity }));
                          }}
                          placeholder="Ciudad..."
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:border-[#c5a85c] focus:outline-none bg-slate-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase text-slate-400 mb-1 tracking-wider">Dirección de Destino Predeterminada</label>
                      <textarea
                        value={userProfile.address}
                        onChange={(e) => {
                          const newAddr = e.target.value;
                          setUserProfile(prev => ({ ...prev, address: newAddr }));
                          setCheckoutAddress(newAddr);
                        }}
                        rows={2}
                        placeholder="Dirección completa de entrega..."
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:border-[#c5a85c] focus:outline-none bg-slate-50 leading-normal"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setRegistrationSuccess(true);
                        onAddLog(`Registro: Datos de inscripción actualizados para ${userProfile.name}`, 'info');
                        setTimeout(() => setRegistrationSuccess(false), 5000);
                      }}
                      className="w-full py-2.5 bg-gradient-to-r from-[#c19a45] to-[#ebd7a7] text-white text-xs sm:text-sm font-black rounded-xl shadow-xs transition hover:opacity-90 cursor-pointer"
                    >
                      ✓ Guardar y Registrar Datos de Cliente
                    </button>

                    {registrationSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-xs font-bold text-center"
                      >
                        ¡Registro de Cliente actualizado y guardado correctamente! Se ha sincronizado con tu formulario de compra.
                      </motion.div>
                    )}
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-xl space-y-1.5 text-left">
                    <span className="text-[9px] font-black text-[#c5a85c] uppercase tracking-widest block font-mono">Garantías Boutique</span>
                    <h5 className="text-slate-800 font-extrabold text-xs">Entregas en Menos de 48 Horas con Seguro Comercial</h5>
                    <p className="text-[11px] text-slate-500 leading-normal font-medium">Todos tus tenis premium o fórmulas de alta limpieza están cubiertos con reembolsos o cambio de tallas gratuitos dentro de los primeros 15 días.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= VIEW 3: OPERATIONS & ADMINISTRATIVO ================= */}
          {activeViewMode === 'manager' && (
            <motion.div
              key="manager_logistics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 text-left"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-lg font-serif font-black text-slate-900">Panel de Control de Almacén y Pedidos Comerciales</h3>
                  <p className="text-xs text-slate-400 mt-1">Módulo logístico de despacho nacional para la actualización manual de existencias y control de ventas.</p>
                </div>
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="px-4 py-2 bg-[#c5a85c] hover:bg-[#b59549] text-white text-xs font-extrabold rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Nuevo Item</span>
                </button>
              </div>

              {/* Table of Orders */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider font-mono">Control de Despacho Logístico</h4>
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      value={orderQuery}
                      onChange={(e) => setOrderQuery(e.target.value)}
                      placeholder="Buscar pedido por ID o cliente..."
                      className="w-full pl-7 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium"
                    />
                    <Search size={12} className="absolute left-2.5 top-2.5 text-slate-400" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase text-slate-400 font-mono">
                        <th className="py-3 px-5">Pedido</th>
                        <th className="py-3 px-5">Cliente</th>
                        <th className="py-3 px-5">Fecha</th>
                        <th className="py-3 px-5">Mercadería</th>
                        <th className="py-3 px-5 text-right">Cobro</th>
                        <th className="py-3 px-5">Estatus</th>
                        <th className="py-3 px-5 text-center">Gestión Logística</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-mono">
                      {managerFilteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-12 text-slate-400 font-sans">
                            No se encontraron pedidos de compra en el sistema.
                          </td>
                        </tr>
                      ) : (
                        managerFilteredOrders.map(order => (
                          <tr key={order.id} className="hover:bg-slate-50/50 transition">
                            <td className="py-3.5 px-5 font-black text-slate-800">{order.id}</td>
                            <td className="py-3.5 px-5 font-sans">
                              <p className="font-black text-slate-800 leading-tight">{order.customerName}</p>
                              <p className="text-[10px] text-slate-400 leading-none mt-0.5">{order.customerEmail}</p>
                            </td>
                            <td className="py-3.5 px-5 text-slate-400">
                              {new Date(order.date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="py-3.5 px-5 max-w-[220px] font-sans truncate" title={order.productNames.join(', ')}>
                              <p className="font-extrabold text-[#c5a85c] leading-tight">{order.productNames.join(', ')}</p>
                              <span className="text-[9px] text-slate-400">{order.itemsCount} piezas en total</span>
                            </td>
                            <td className="py-3.5 px-5 text-right font-black text-slate-800">${order.total}</td>
                            <td className="py-3.5 px-5">
                              <span className={`inline-block px-2.5 py-0.5 text-[9px] font-black rounded-lg uppercase border ${
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
                            <td className="py-3.5 px-5 text-center font-sans">
                              <div className="flex gap-1 justify-center">
                                {order.status === 'procesando' && (
                                  <button
                                    onClick={() => {
                                      onUpdateOrderStatus(order.id, 'enviado');
                                      onAddLog(`Logística: Orden de venta ${order.id} despachada y en reparto`, 'info');
                                    }}
                                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-extrabold rounded-lg text-[10px] border border-amber-200 cursor-pointer flex items-center gap-1 transition"
                                  >
                                    <Truck size={10} />
                                    <span>Despachar</span>
                                  </button>
                                )}
                                {order.status === 'enviado' && (
                                  <button
                                    onClick={() => {
                                      onUpdateOrderStatus(order.id, 'entregado');
                                      onAddLog(`Logística: Orden de venta ${order.id} cobrada y liquidada con éxito`, 'info');
                                    }}
                                    className="px-2.5 py-1 bg-green-50 hover:bg-green-100 text-green-800 font-extrabold rounded-lg text-[10px] border border-green-200 cursor-pointer flex items-center gap-1 transition"
                                  >
                                    <Check size={10} />
                                    <span>Registrar Pago</span>
                                  </button>
                                )}
                                {order.status === 'entregado' && (
                                  <span className="text-[10px] text-green-600 font-black flex items-center gap-0.5 justify-center">
                                    <CheckCircle size={10} /> Concluido
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

              {/* Grid of Catalog Stock Adjustment */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider font-mono">Existencias y Catálogo Físico</h4>
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      value={productQuery}
                      onChange={(e) => setProductQuery(e.target.value)}
                      placeholder="Filtrar por nombre o SKU..."
                      className="w-full pl-7 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                    />
                    <Search size={12} className="absolute left-2.5 top-2.5 text-slate-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {managerFilteredProducts.map(p => (
                    <div key={p.id} className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl space-y-3 flex flex-col justify-between">
                      <div className="flex gap-2 items-start">
                        <div className="w-10 h-10 bg-white border border-slate-100 rounded-lg overflow-hidden shrink-0">
                          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-extrabold text-slate-800 text-xs truncate leading-tight">{p.name}</h5>
                          <span className="text-[9px] font-mono text-slate-400 block tracking-wider mt-0.5">{p.sku}</span>
                        </div>
                      </div>

                      <div className="bg-white p-2 rounded-lg border border-slate-200/40 text-[10px] grid grid-cols-3 gap-1 text-center font-mono leading-tight">
                        <div>
                          <span className="text-slate-400 text-[8px] uppercase block">Precio</span>
                          <span className="font-black text-slate-800">${p.price}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[8px] uppercase block">Stock</span>
                          <span className={`font-black ${p.stock < 10 ? 'text-red-600' : 'text-slate-700'}`}>{p.stock} pz</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[8px] uppercase block">Vendido</span>
                          <span className="font-black text-emerald-700">+{p.salesCount}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* ================= CARRITO DE COMPRAS FLOTANTE CON NOTIFICACIÓN ================= */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2" id="floating_cart_bubble_area">
        <AnimatePresence>
          {cartItemsCount > 0 && !isCartDrawerOpen && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 10 }}
              className="bg-slate-900 border border-slate-850 px-3 py-1.5 rounded-xl shadow-lg text-white text-[10px] font-bold flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span>Tienes e-items por comprar</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCartDrawerOpen(true)}
          className="relative bg-gradient-to-r from-[#c19a45] to-[#ebd7a7] text-white p-4 rounded-full shadow-2xl transition-all cursor-pointer flex items-center justify-center border border-[#c19a45]/20"
          id="btn_floating_cart"
        >
          <ShoppingCart size={22} className="animate-pulse" />
          
          {/* Dynamic Floating Numeric Badge */}
          {cartItemsCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-slate-900 border border-[#ebd7a7] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center font-mono">
              {cartItemsCount}
            </span>
          )}
        </motion.button>
      </div>

      {/* ================= EXPANSIVE SLIDE-OVER DRAWER (CARRITO FLOTANTE DESPLAZABLE) ================= */}
      <AnimatePresence>
        {isCartDrawerOpen && (
          <>
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartDrawerOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 transition"
              id="cart_drawer_backdrop"
            />
            
            {/* Sliding Drawer Body */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col justify-between p-6 border-l border-slate-200"
              id="cart_drawer_slider"
            >
              {/* Header inside drawer */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShoppingCart size={20} className="text-[#c19a45]" />
                  <h4 className="text-md font-serif font-black text-slate-900">Mi Carrito de Compras</h4>
                </div>
                <button 
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 p-1.5 rounded-lg text-slate-500 hover:text-slate-900 transition"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Interactive notification notice inside cart drawer */}
              {isOrderOrdered && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 my-2 text-center text-emerald-800 space-y-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto">
                    <Check size={20} />
                  </div>
                  <div>
                    <h5 className="font-extrabold">¡Pedido Comercial Atendido!</h5>
                    <p className="text-[10px] text-emerald-700 mt-1">Tu número de guía de abono es: <span className="font-mono font-black">{latestOrderId}</span></p>
                    <p className="text-[10px] text-slate-500 leading-normal mt-2">La mercadería se asignó al camión repartidor para liquidar de forma segura en metálico al momento de la llegada.</p>
                  </div>
                  <button
                    onClick={closeConfirmationState}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black rounded-lg transition"
                  >
                    Seguir Comprando
                  </button>
                </div>
              )}

              {/* Items List Inside Slider */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3.5 scrollbar-thin">
                {cart.length === 0 ? (
                  <div className="h-44 flex flex-col items-center justify-center text-slate-400 space-y-2 mt-12">
                    <div className="p-3 bg-slate-50 rounded-full text-slate-300">
                      <ShoppingCart size={26} />
                    </div>
                    <span className="text-xs font-bold font-sans">El carrito está vacío.</span>
                    <p className="text-[11px] text-slate-400 font-medium text-center max-w-[200px]">Selecciona tus tenis o detergentes preferidos para verlos aquí.</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div 
                      key={item.product.id} 
                      className="flex gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/40 relative shadow-2xs group"
                    >
                      <div className="w-16 h-16 bg-white border border-slate-100 rounded-lg overflow-hidden shrink-0">
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      
                      <div className="min-w-0 flex-1 space-y-1 text-left">
                        <div className="flex justify-between items-start pr-1">
                          <h5 className="font-bold text-slate-800 text-xs truncate leading-normal pr-4">{item.product.name}</h5>
                          <button 
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-slate-400 hover:text-red-500 transition absolute top-2 right-2 duration-150"
                            title="Eliminar artículo"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <span className="text-[9px] font-mono text-slate-400 block tracking-wider leading-none mt-0.5">{item.product.category === 'Zapatos' ? '👠 Calzado' : '🧴 Limpieza'}</span>
                        
                        <div className="pt-1.5 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 bg-white border border-slate-200 p-0.5 rounded-lg">
                            <button 
                              onClick={() => updateQuantity(item.product.id, -1)}
                              className="w-5 h-5 bg-slate-50 hover:bg-slate-100 rounded-sm text-xs font-black flex items-center justify-center text-slate-600 transition"
                            >
                              -
                            </button>
                            <span className="text-xs font-mono font-black text-slate-800 px-1">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.product.id, 1)}
                              className="w-5 h-5 bg-slate-50 hover:bg-slate-100 rounded-sm text-xs font-black flex items-center justify-center text-slate-600 transition"
                            >
                              +
                            </button>
                          </div>
                          
                          <p className="text-xs font-black text-slate-800 font-mono">${item.product.price * item.quantity} MXN</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Subtotal & Checkout form (Inside sliding drawer only when populated!) */}
              {cart.length > 0 && (
                <div className="border-t border-slate-150 pt-4 space-y-4 text-left">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/50 space-y-1.5">
                    <div className="flex justify-between text-slate-500 font-bold text-xs font-sans">
                      <span>Artículos del Hogar ({cartItemsCount})</span>
                      <span className="font-mono">${cartTotalAmount} MXN</span>
                    </div>
                    <div className="flex justify-between text-slate-500 font-bold text-xs font-sans">
                      <span>Logística de Envío Nacional</span>
                      <span className="text-emerald-700 font-black uppercase">¡Gratis!</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-2 border-t border-slate-200/30">
                      <span className="text-xs font-serif font-black text-slate-900 uppercase">Monto Total a Liquidar</span>
                      <span className="text-base font-black text-slate-900 font-mono">${cartTotalAmount} MXN</span>
                    </div>
                  </div>

                  {/* Contact / Delivery form automatically populated with Valeria Fuentes' premium credentials */}
                  <form onSubmit={handleCheckoutSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Nombre Entrega *</label>
                        <input
                          type="text"
                          required
                          value={checkoutName}
                          onChange={(e) => setCheckoutName(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Celular Contacto *</label>
                        <input
                          type="tel"
                          required
                          value={checkoutPhone}
                          onChange={(e) => setCheckoutPhone(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Ubicación Domiciliar Residencia *</label>
                      <textarea
                        required
                        value={checkoutAddress}
                        onChange={(e) => setCheckoutAddress(e.target.value)}
                        rows={2}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-bold leading-tight"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-slate-900 to-indigo-950 hover:opacity-90 text-white text-xs font-black rounded-xl shadow-md transition uppercase tracking-wider cursor-pointer"
                    >
                      🤝 Procesar Pedido (Pago Contra Entrega)
                    </button>
                    <p className="text-[9.5px] text-slate-400 text-center font-medium leading-none">Pagas de manera segura al mensajero al momento del arribo físico.</p>
                  </form>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ================= USER PROFILE CUSTOMIZATION MODAL (Perfil de Usuario) ================= */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl text-left space-y-6"
              id="user_profile_modal"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="text-base font-serif font-black text-slate-900 flex items-center gap-2">
                  <User size={18} className="text-[#c19a45]" />
                  <span>Módulo de Configuración de Perfil</span>
                </h3>
                <button
                  onClick={() => setIsProfileModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-50 transition text-slate-400 hover:text-slate-700"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Profile setup card */}
              <div className="space-y-4 font-sans text-xs">
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/50">
                  <div className="w-12 h-12 rounded-full bg-[#ebd7a7] text-[#c19a45] flex items-center justify-center font-black text-lg shadow-sm">
                    {userProfile.name.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 leading-tight">{userProfile.name}</h4>
                    <span className="text-[10px] font-black text-[#c5a85c] bg-white border border-[#c19a45]/20 px-2 py-0.5 rounded-md mt-1 inline-block uppercase font-mono tracking-wider">
                      {userProfile.roleLabel}
                    </span>
                  </div>
                </div>

                <div className="space-y-3.5 pt-2">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Nombre Completo del Comprador</label>
                    <input 
                      type="text" 
                      value={userProfile.name}
                      onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold font-sans text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Correo Inteligente</label>
                    <input 
                      type="email" 
                      value={userProfile.email}
                      onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold font-sans text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Celular de Contacto</label>
                      <input 
                        type="tel" 
                        value={userProfile.phone}
                        onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Ciudad Residencia</label>
                      <input 
                        type="text" 
                        value={userProfile.city}
                        onChange={(e) => setUserProfile({...userProfile, city: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold font-sans text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Dirección de Destino Predeterminada</label>
                    <textarea 
                      value={userProfile.address}
                      onChange={(e) => setUserProfile({...userProfile, address: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold font-sans text-slate-800 leading-tight"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex gap-2">
                  <button
                    onClick={() => setIsProfileModalOpen(false)}
                    className="flex-1 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 font-extrabold rounded-xl transition cursor-pointer text-center"
                  >
                    Guardar Configuración
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= ADD NEW PRODUCT MODAL (Alta Logística) ================= */}
      <AnimatePresence>
        {showAddProductModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl space-y-5 text-left"
              id="add_new_catalog_modal"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="text-base font-serif font-black text-slate-900 flex items-center gap-2">
                  <Package size={18} className="text-[#c5a85c]" />
                  <span>Alta de Nuevo Item de Almacén</span>
                </h3>
                <button 
                  onClick={() => setShowAddProductModal(false)}
                  className="text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-lg transition"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleManagerCreateProduct} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Nombre Comercial *</label>
                  <input
                    type="text"
                    required
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    placeholder="Ej. Tenis Deportivos Pro-Flex"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 font-bold focus:border-[#c5a85c] focus:outline-none"
                    id="m_pname"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Categoría</label>
                    <select
                      value={pCategory}
                      onChange={(e) => setPCategory(e.target.value as any)}
                      className="w-full px-2.5 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 font-bold focus:border-[#c5a85c] focus:outline-none"
                      id="m_pcategory"
                    >
                      <option value="Productos de limpieza">Productos de limpieza</option>
                      <option value="Zapatos">Zapatos (Calzado)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Stock de Almacén *</label>
                    <input
                      type="number"
                      required
                      value={pStock}
                      onChange={(e) => setPStock(e.target.value)}
                      placeholder="12"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:border-[#c5a85c] focus:outline-none"
                      id="m_pstock"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Precio ($ MXN) *</label>
                    <input
                      type="number"
                      required
                      value={pPrice}
                      onChange={(e) => setPPrice(e.target.value)}
                      placeholder="899"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:border-[#c5a85c] focus:outline-none"
                      id="m_pprice"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Imagen URL (Opcional)</label>
                    <input
                      type="text"
                      value={pImgUrl}
                      onChange={(e) => setPImgUrl(e.target.value)}
                      placeholder="https://ejemplo.com/foto.jpg"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:border-[#c5a85c] focus:outline-none"
                      id="m_pimgurl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Descripción de Producto</label>
                  <textarea
                    value={pDesc}
                    onChange={(e) => setPDesc(e.target.value)}
                    placeholder="Detalles técnicos, materiales o especificaciones..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:border-[#c5a85c] focus:outline-none"
                    rows={2}
                    id="m_pdesc"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-black rounded-xl transition"
                  >
                    Regresar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-[#c5a85c] hover:bg-[#b59549] text-white text-xs font-black rounded-xl transition shadow-sm"
                  >
                    Crear Item
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= SECCIÓN DE DETALLE / VISTA COMPLETA DEL PRODUCTO ================= */}
      <AnimatePresence>
        {selectedProductDetails && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-2xl w-full shadow-2xl text-left space-y-6 relative overflow-hidden"
              id="product_details_modal"
            >
              <button
                onClick={() => setSelectedProductDetails(null)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 transition text-slate-400 hover:text-slate-850 cursor-pointer"
                title="Cerrar vista"
              >
                <X size={20} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-2">
                {/* Product Large Image Showcase */}
                <div className="space-y-3 flex flex-col justify-between">
                  {/* Embedded Custom CSS Keyframe Animations for Laser scan line and camera flash */}
                  <style dangerouslySetInnerHTML={{__html: `
                    @keyframes xsweep {
                      0% { left: 5%; opacity: 0; }
                      30% { opacity: 0.7; }
                      70% { opacity: 0.7; }
                      100% { left: 95%; opacity: 0; }
                    }
                    .animate-infinite-x-sweep {
                      animation: xsweep 2.2s infinite linear;
                    }
                    @keyframes flashanim {
                      0% { opacity: 1; }
                      100% { opacity: 0; }
                    }
                    .animate-flash-intensity {
                      animation: flashanim 0.4s forwards ease-out;
                    }
                    .animate-spin-once {
                      animation: spin 0.8s ease-in-out-once;
                    }
                  `}} />

                  {/* Media Mode Segmented Buttons */}
                  <div className="flex bg-slate-150 p-1 rounded-2xl text-[9px] font-black uppercase tracking-wider gap-0.5 border border-slate-200">
                    <button 
                      type="button"
                      onClick={() => setArMediaMode('photo')}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-center transition cursor-pointer ${arMediaMode === 'photo' ? 'bg-[#c5a85c] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      📸 Foto
                    </button>
                    <button 
                      type="button"
                      onClick={() => setArMediaMode('rotate360')}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-center transition cursor-pointer ${arMediaMode === 'rotate360' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      🔄 Giro 360°
                    </button>
                    <button 
                      type="button"
                      onClick={() => setArMediaMode('ar_camera')}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-center transition cursor-pointer ${arMediaMode === 'ar_camera' ? 'bg-[#c5a85c] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      🕶️ Ver en AR
                    </button>
                  </div>

                  {/* Main Display Viewport */}
                  <div 
                    className={(arMediaMode === 'ar_camera' || arMediaMode === 'rotate360') 
                      ? "fixed inset-0 w-full h-full z-[100] bg-slate-950 flex flex-col select-none overflow-hidden"
                      : "relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-250 shadow-inner flex items-center justify-center select-none group"
                    }
                    onMouseDown={(e) => {
                      if (arMediaMode === 'rotate360' || arMediaMode === 'ar_camera') {
                        setIsDraggingProduct(true);
                        setDragStart({ x: e.clientX, y: e.clientY });
                      }
                    }}
                    onMouseMove={(e) => {
                      if (isDraggingProduct) {
                        const dx = e.clientX - dragStart.x;
                        const dy = e.clientY - dragStart.y;
                        if (arMediaMode === 'rotate360') {
                          setRotateAngle(prev => (prev + dx * 0.7 + 360) % 360);
                          setRotatePitch(prev => Math.max(-30, Math.min(30, prev - dy * 0.5)));
                        } else if (arMediaMode === 'ar_camera') {
                          setArPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
                        }
                        setDragStart({ x: e.clientX, y: e.clientY });
                      }
                    }}
                    onMouseUp={() => setIsDraggingProduct(false)}
                    onMouseLeave={() => setIsDraggingProduct(false)}
                    onTouchStart={(e) => {
                      if ((arMediaMode === 'rotate360' || arMediaMode === 'ar_camera') && e.touches[0]) {
                        setIsDraggingProduct(true);
                        setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
                      }
                    }}
                    onTouchMove={(e) => {
                      if (isDraggingProduct && e.touches[0]) {
                        const dx = e.touches[0].clientX - dragStart.x;
                        const dy = e.touches[0].clientY - dragStart.y;
                        if (arMediaMode === 'rotate360') {
                          setRotateAngle(prev => (prev + dx * 0.7 + 360) % 360);
                          setRotatePitch(prev => Math.max(-30, Math.min(30, prev - dy * 0.5)));
                        } else if (arMediaMode === 'ar_camera') {
                          setArPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
                        }
                        setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
                      }
                    }}
                    onTouchEnd={() => setIsDraggingProduct(false)}
                  >
                    {/* 1. PHOTO VIEW MODE */}
                    {arMediaMode === 'photo' && (
                      <div className="w-full h-full bg-slate-50 relative flex items-center justify-center">
                        <img 
                          src={selectedProductDetails.imageUrl} 
                          alt={selectedProductDetails.name} 
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        {/* QR Code Trigger Button */}
                        <button
                          type="button"
                          onClick={() => setShowQrCodeOverlay(true)}
                          className="absolute bottom-3 right-3 bg-white/95 text-slate-900 border border-slate-200 shadow-lg px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer hover:bg-slate-100 hover:border-[#c5a85c] transition-all"
                        >
                          <QrCode size={12} className="text-[#c5a85c]" />
                          <span>QR Móvil / AR</span>
                        </button>
                      </div>
                    )}

                    {/* 2. ROTATE 360° MODE */}
                    {arMediaMode === 'rotate360' && (
                      <div className="w-full h-full absolute inset-0 text-white select-none flex flex-col justify-between animate-fade-in">
                        {/* 3D background layout grids */}
                        <div className="absolute inset-0 bg-gradient-to-b from-[#0c1220] to-[#04060b]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,92,0.15)_0%,transparent_70%)] pointer-events-none" />
                        
                        {/* Top HUD overlay and control selectors */}
                        <div className="absolute top-0 inset-x-0 p-4 z-30 bg-gradient-to-b from-black/90 to-transparent flex flex-wrap gap-2 justify-between items-center">
                          {/* Back / Volver button */}
                          <button 
                            type="button"
                            onClick={() => setArMediaMode('photo')}
                            className="flex items-center gap-1.5 bg-black/60 hover:bg-black/90 text-white border border-white/25 px-3 py-1.5 rounded-xl cursor-pointer text-[10px] font-black uppercase tracking-wider transition-all"
                          >
                            <ArrowLeft size={11} className="text-[#c5a85c]" />
                            <span>Volver</span>
                          </button>

                          {/* Product details header text */}
                          <div className="hidden sm:block text-left">
                            <h4 className="text-[12px] font-serif font-black text-[#c5a85c] leading-none">{selectedProductDetails.name}</h4>
                            <p className="text-[7px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">Visor Interactivo 360°</p>
                          </div>

                          {/* Tab switcher options overlay */}
                          <div className="flex bg-black/65 p-0.5 rounded-xl text-[8.5px] font-black uppercase tracking-wider gap-0.5 border border-white/10">
                            <button 
                              type="button"
                              onClick={() => { setArMediaMode('photo'); }}
                              className="py-1 px-2.5 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                            >
                              📸 Foto
                            </button>
                            <button 
                              type="button"
                              className="py-1 px-2.5 rounded-lg bg-[#c5a85c] text-white shadow font-bold"
                            >
                              🔄 360°
                            </button>
                            <button 
                              type="button"
                              onClick={() => { setArMediaMode('ar_camera'); }}
                              className="py-1 px-2.5 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                            >
                              🕶️ AR Móvil
                            </button>
                          </div>

                          {/* Direct Exit Close */}
                          <button 
                            type="button"
                            onClick={() => { setArMediaMode('photo'); }}
                            className="bg-black/60 hover:bg-black/95 text-white border border-white/20 p-2 rounded-xl cursor-pointer transition-all"
                            title="Regresar a Foto"
                          >
                            <X size={13} />
                          </button>
                        </div>

                        {/* Middle HUD stats telemetry overlay */}
                        <div className="absolute top-16 right-4 left-4 flex justify-between items-center text-[8px] font-mono text-slate-300 z-10 pointer-events-none">
                          <span className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 shadow-lg">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            EJE: HORIZONTAL-GLIDE
                          </span>
                          <span className="bg-black/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 shadow-lg flex items-center gap-1">
                            <span>Escala:</span>
                            <span className="text-amber-500">
                              {Math.round(arScale * 100)}%
                            </span>
                          </span>
                        </div>

                        {/* Interactive dynamic revolving product image in viewport */}
                        <div className="flex-1 flex items-center justify-center relative w-full h-full">
                          <img 
                            src={selectedProductDetails.imageUrl} 
                            alt={selectedProductDetails.name} 
                            className="w-48 h-48 sm:w-64 sm:h-64 object-contain pointer-events-none select-none transition-transform duration-100 z-25"
                            style={{
                              transform: `rotateY(${rotateAngle}deg) rotateX(${rotatePitch}deg) scale(${arScale})`,
                              mixBlendMode: arBlendMultiply ? 'multiply' : 'normal',
                              filter: `brightness(${1.0 + Math.sin(rotateAngle * Math.PI / 180) * 0.15}) contrast(${1.0 + Math.abs(Math.sin(rotateAngle * Math.PI / 180)) * 0.05}) drop-shadow(${Math.sin(rotateAngle * Math.PI / 180) * 12}px 12px 14px rgba(0,0,0,0.6))`
                            }}
                            referrerPolicy="no-referrer"
                          />

                          {/* Futuristic Scan Line Laser Effect */}
                          <div className="absolute inset-y-0 left-1/2 w-0.5 bg-gradient-to-r from-transparent via-[#c5a85c]/40 to-transparent animate-infinite-x-sweep pointer-events-none z-10" />
                        </div>

                        {/* Immersive unified Bottom Panel (Safe-area responsive) containing 360 instructions */}
                        <div className="relative mt-auto w-full z-30 bg-gradient-to-t from-slate-950 via-slate-950/98 to-slate-950/85 backdrop-blur-md border-t border-white/10 p-4 space-y-3 max-h-[48vh] overflow-y-auto pb-8">
                          
                          {/* ================= INSTRUCTIONS COMPONENT AT THE BOTTOM ================= */}
                          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 text-left flex gap-2 items-start">
                            <Sparkles size={13} className="text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                            <div className="space-y-0.5">
                              <p className="font-serif font-black text-amber-400 text-[10px] uppercase tracking-wider">¿Cómo navegar el calzado en 360°?</p>
                              <p className="text-[8.5px] text-slate-300 leading-normal font-sans">
                                <b>Arrastra o desliza tu dedo</b> a la izquierda o derecha de la pantalla para rotar el producto. Prueba activar el <b>giro automático</b> para ver un modelado continuo en 3D.
                              </p>
                            </div>
                          </div>

                          {/* Interactive Slider controls row */}
                          <div className="space-y-1.5 bg-black/40 p-2 rounded-lg border border-white/5">
                            <div className="flex justify-between items-center text-[8.5px] font-mono text-slate-300">
                              <span className="font-bold text-amber-500 flex items-center gap-1">
                                <span className="bg-slate-800 px-1 py-0.5 rounded text-amber-500">Giro Y: {Math.round(rotateAngle)}°</span>
                                <span className="bg-slate-850 px-1 py-0.5 rounded text-[#c5a85c]">Inclinación X: {Math.round(rotatePitch)}°</span>
                              </span>
                              <span className="font-bold text-slate-400 uppercase text-[7px]">Control Deslizante</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setIsAutoRotate(!isAutoRotate)}
                                className={`p-1.5 px-2.5 rounded-xl text-center border cursor-pointer transition-all flex items-center justify-center gap-1 text-[9px] font-bold ${isAutoRotate ? 'bg-[#c5a85c] text-slate-950 border-[#c5a85c]' : 'bg-slate-900 text-slate-450 border-slate-700 hover:text-white'}`}
                                title={isAutoRotate ? "Pausar Rotación" : "Giro Automático"}
                              >
                                {isAutoRotate ? <Pause size={10} /> : <Play size={10} />}
                                <span>{isAutoRotate ? 'Pausar' : 'Auto Giro'}</span>
                              </button>
                              <input 
                                type="range"
                                min="0"
                                max="360"
                                value={rotateAngle}
                                onChange={(e) => setRotateAngle(Number(e.target.value))}
                                className="flex-1 accent-amber-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                              />
                              <button
                                type="button"
                                onClick={() => { setRotateAngle(180); setRotatePitch(5); }}
                                className="py-1 px-2.5 text-slate-300 hover:text-white bg-slate-900 rounded-xl border border-white/10 text-[9px] font-black uppercase cursor-pointer tracking-wider hover:brightness-105"
                              >
                                Reset
                              </button>
                            </div>
                          </div>

                          {/* Tweak Slider with Quick Scale */}
                          <div className="space-y-1.5 bg-black/40 p-2 rounded-lg border border-white/5">
                            <div className="flex justify-between items-center text-[8.5px] font-mono text-slate-300">
                              <span className="font-bold text-amber-500">Escala de Imagen:</span>
                              <span className="font-bold flex items-center gap-1">
                                {Math.round(arScale * 100)}% de tamaño
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <input 
                                type="range"
                                min="0.5"
                                max="1.5"
                                step="0.05"
                                value={arScale}
                                onChange={(e) => setArScale(Number(e.target.value))}
                                className="flex-1 accent-amber-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setArScale(1.0);
                                  onAddLog(`360 Sandbox: Reajustado a Escala Real`, 'info');
                                }}
                                className={`py-1 px-2.5 text-[8.5px] font-sans rounded-xl cursor-pointer transition uppercase font-black tracking-wider ${arScale === 1.0 ? 'bg-emerald-500 text-slate-900 border border-emerald-500' : 'bg-slate-900 text-slate-400 border border-white/10 hover:text-white'}`}
                              >
                                100%
                              </button>
                            </div>
                          </div>

                          {/* Brand Transparencies Advice and digital cutout options toggle */}
                          <div className="bg-black/40 p-2 rounded-lg border border-white/5 flex items-center justify-between gap-3 text-left">
                            <div className="space-y-0.5 flex-1">
                              <p className="text-[8.5px] font-black text-[#c5a85c] uppercase tracking-wide">¿Quitar Fondo Blanco de Foto?</p>
                              <p className="text-[7.5px] text-slate-200 leading-relaxed font-sans">
                                Si subes fotos con fondo blanco cuadriculado, activa "Quitar Fondo" para mezclarlo con el visor. <b>Para la máxima calidad, sube imágenes .PNG con fondo transparente.</b>
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setArBlendMultiply(!arBlendMultiply);
                                onAddLog(`360 Sandbox: Modo de fondo blanco ${!arBlendMultiply ? 'activado' : 'desactivado'} indicando PNG`, 'info');
                              }}
                              className={`py-1.5 px-2.5 rounded-lg text-[8px] font-black uppercase tracking-wider border shrink-0 transition-all ${arBlendMultiply ? 'bg-amber-400 text-slate-950 border-amber-400 font-extrabold' : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white'}`}
                            >
                              {arBlendMultiply ? '✂️ Quitar Fondo (ON)' : '📷 Foto Original'}
                            </button>
                          </div>

                          {/* Quick Alignment Reset helper */}
                          <div className="flex justify-center">
                            <button
                              type="button"
                              onClick={() => {
                                setRotateAngle(180);
                                setRotatePitch(5);
                                onAddLog(`360 Sandbox: Calibración y alineación completada`, 'info');
                              }}
                              className="text-[8.5px] font-mono text-slate-400 hover:text-white cursor-pointer underline tracking-wider"
                            >
                              🔧 Re-centrar Zapato en Pantalla
                            </button>
                          </div>

                        </div>
                      </div>
                    )}

                    {/* 3. AR CAMERA MODE */}
                    {arMediaMode === 'ar_camera' && (
                      <div className="w-full h-full absolute inset-0 text-white select-none flex flex-col justify-between">
                        
                        {/* Live webcam feed or premium realistic room fallback picture */}
                        {isArCameraActive && arStream ? (
                          <video 
                            ref={arVideoRef}
                            className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-80 z-0 animate-fade-in"
                            playsInline
                            muted
                          />
                        ) : (
                          <div className="absolute inset-0 w-full h-full pointer-events-none bg-cover bg-center opacity-70 transition-opacity duration-500" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800&auto=format&fit=crop&q=80')` }}>
                            {/* Ambient helper tag info */}
                            <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-black/85 backdrop-blur-md text-[8px] font-mono font-black text-[#c5a85c] py-1 px-4 rounded-full border border-amber-500/20 shadow-lg block uppercase tracking-widest z-10">
                              Cámara en vivo • Simulación de Habitación
                            </div>
                          </div>
                        )}

                        {/* Top HUD overlay and control selectors */}
                        <div className="absolute top-0 inset-x-0 p-4 z-30 bg-gradient-to-b from-black/90 to-transparent flex flex-wrap gap-2 justify-between items-center">
                          {/* Back / Volver button */}
                          <button 
                            type="button"
                            onClick={() => setArMediaMode('photo')}
                            className="flex items-center gap-1.5 bg-black/60 hover:bg-black/90 text-white border border-white/25 px-3 py-1.5 rounded-xl cursor-pointer text-[10px] font-black uppercase tracking-wider transition-all"
                          >
                            <ArrowLeft size={11} className="text-[#c5a85c]" />
                            <span>Volver</span>
                          </button>

                          {/* Product details header text */}
                          <div className="hidden sm:block text-left">
                            <h4 className="text-[12px] font-serif font-black text-[#c5a85c] leading-none">{selectedProductDetails.name}</h4>
                            <p className="text-[7px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">Visor AR de Alta Fidelidad</p>
                          </div>

                          {/* Tab switcher options overlay */}
                          <div className="flex bg-black/65 p-0.5 rounded-xl text-[8.5px] font-black uppercase tracking-wider gap-0.5 border border-white/10">
                            <button 
                              type="button"
                              onClick={() => { setArMediaMode('photo'); }}
                              className="py-1 px-2.5 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                            >
                              📸 Foto
                            </button>
                            <button 
                              type="button"
                              onClick={() => { setArMediaMode('rotate360'); }}
                              className="py-1 px-2.5 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                            >
                              🔄 360°
                            </button>
                            <button 
                              type="button"
                              className="py-1 px-2.5 rounded-lg bg-[#c5a85c] text-white shadow font-bold"
                            >
                              🕶️ AR Móvil
                            </button>
                          </div>

                          {/* Direct Exit Close */}
                          <button 
                            type="button"
                            onClick={() => { setArMediaMode('photo'); }}
                            className="bg-black/60 hover:bg-black/95 text-white border border-white/20 p-2 rounded-xl cursor-pointer transition-all"
                            title="Regresar a Foto"
                          >
                            <X size={13} />
                          </button>
                        </div>

                        {/* Middle Indicators of Placement Sensor SLAM Status */}
                        <div className="absolute top-16 right-4 left-4 flex justify-between items-center text-[8px] font-mono text-slate-300 z-10 pointer-events-none">
                          <span className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 shadow-lg">
                            <span className={`w-1.5 h-1.5 rounded-full ${isScanningSurface ? 'bg-amber-500 animate-ping' : isPlacedOnFloor ? 'bg-emerald-400' : 'bg-red-400 animate-pulse'}`} />
                            {isScanningSurface ? 'ESCANEANDO_SUELO...' : isPlacedOnFloor ? 'LOCK: SUELO HORIZONTAL' : 'PLACER: MANUAL_STAGE'}
                          </span>
                          <span className="bg-black/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 shadow-lg flex items-center gap-1">
                            <span>Escala:</span>
                            <span className={arScale === 1.0 ? "text-emerald-400 font-extrabold" : "text-amber-500"}>
                              {arScale === 1.0 ? "100% (Real 1:1)" : `${Math.round(arScale * 100)}%`}
                            </span>
                          </span>
                        </div>

                        {/* HIGH FIDELITY AR COGNITIVE RADAR PHASES */}
                        {isScanningSurface ? (
                          /* Phase A: Mapping Room with LiDAR style Point Cloud animation */
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/45 backdrop-blur-xs z-20 pointer-events-none">
                            <div className="relative w-16 h-16 flex items-center justify-center">
                              <div className="absolute inset-0 border-4 border-amber-500/10 rounded-full" />
                              <div className="absolute inset-0 border-4 border-t-amber-500 rounded-full animate-spin" />
                              <RefreshCw size={20} className="text-amber-500 animate-pulse" />
                            </div>
                            <div className="mt-4 text-center space-y-1">
                              <p className="font-mono text-[9px] font-black uppercase text-amber-500 tracking-widest animate-pulse">Calibrando Sensores de Suelo...</p>
                              <p className="text-[8.5px] text-slate-300 max-w-[220px] leading-relaxed font-sans">Mueve levemente tu cámara enfocando el piso plano para trazar el calzado.</p>
                            </div>
                            {/* Random floating cyber radar dots */}
                            <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-amber-500 rounded-full animate-ping" />
                            <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-amber-400 rounded-full animate-pulse" />
                          </div>
                        ) : !isPlacedOnFloor ? (
                          /* Phase B: Real-time Placement Reticle Hint inviting placement */
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                            {/* Target reticle grid */}
                            <div className="w-20 h-20 border-2 border-dashed border-amber-500/50 rounded-full flex items-center justify-center animate-pulse">
                              <div className="w-12 h-12 border border-amber-500/30 rounded-full flex items-center justify-center" />
                            </div>
                            <div className="mt-3 bg-black/85 backdrop-blur-md px-3.5 py-2 rounded-xl text-center border border-amber-500/40 max-w-[220px] shadow-2xl">
                              <p className="text-[9px] font-bold text-amber-400 uppercase tracking-widest">¡Suelo Inteligente Listo!</p>
                              <p className="text-[8px] text-slate-300 mt-0.5 leading-tight font-sans">Presiona "⬇️ Fijar en el Suelo" abajo para colocar el calzado virtual.</p>
                            </div>
                          </div>
                        ) : null}

                        {/* Holographic floor grid guide lines (Only visible when placing or when active) */}
                        <div className="absolute inset-x-4 bottom-1/3 top-1/4 border border-dashed border-white/5 rounded-3xl pointer-events-none flex items-center justify-center z-10">
                          <div className="w-1.5 h-1.5 bg-amber-500/90 rounded-full animate-ping absolute" />
                          <div className={`w-40 h-20 border-2 border-amber-500/30 rounded-full [transform:rotateX(75deg)] absolute transition-all duration-700 ${isPlacedOnFloor ? 'scale-125 border-emerald-400/50 bg-emerald-500/5' : 'scale-90 animate-pulse'}`} />
                        </div>

                        {/* Floating placeable and draggable product image inside viewport */}
                        <div className="flex-1 flex items-center justify-center relative w-full h-full">
                          <motion.div
                            drag
                            dragMomentum={false}
                            dragElastic={0.1}
                            style={{
                              x: arPosition.x,
                              y: arPosition.y,
                              scale: arScale,
                            }}
                            className="cursor-grab active:cursor-grabbing z-20 absolute flex flex-col items-center justify-center"
                          >
                            {/* Realistic casting floor shadow based on household light source toggle */}
                            {isPlacedOnFloor && (
                              <div 
                                className="w-36 h-6 rounded-full filter blur-md transition-all duration-500 pointer-events-none absolute -bottom-2"
                                style={{
                                  background: arLightMode === 'warm' ? 'rgba(65, 36, 0, 0.65)' : arLightMode === 'sunset' ? 'rgba(92, 28, 0, 0.6)' : arLightMode === 'fluorescent' ? 'rgba(15, 23, 42, 0.55)' : 'rgba(0, 0, 0, 0.72)',
                                  width: `${144 * arScale}px`,
                                  opacity: 0.95,
                                  transform: 'scaleY(0.35) translateY(8px)'
                                }}
                              />
                            )}

                            {/* Shoe item actual image representation */}
                            <img 
                              src={selectedProductDetails.imageUrl} 
                              alt={selectedProductDetails.name} 
                              className={`w-40 h-40 md:w-48 md:h-48 object-contain pointer-events-none transition-all duration-300 ${!isPlacedOnFloor ? 'opacity-60 animate-pulse border-2 border-dashed border-amber-500/25 rounded-full p-4' : 'opacity-100'}`}
                              style={{
                                transform: `rotateY(${rotateAngle}deg) rotateX(${rotatePitch}deg)`,
                                mixBlendMode: arBlendMultiply ? 'multiply' : 'normal',
                                filter: arLightMode === 'warm' 
                                  ? 'brightness(0.92) sepia(0.25) saturate(1.3) hue-rotate(-8deg) drop-shadow(0 15px 10px rgba(0,0,0,0.4))' 
                                  : arLightMode === 'sunset' 
                                  ? 'brightness(0.85) sepia(0.4) saturate(1.5) hue-rotate(12deg) contrast(1.1) drop-shadow(0 20px 15px rgba(0,0,0,0.55))' 
                                  : arLightMode === 'fluorescent' 
                                  ? 'brightness(1.08) saturate(0.85) hue-rotate(-12deg) drop-shadow(0 12px 10px rgba(0,0,0,0.3))' 
                                  : 'brightness(1.0) contrast(1.0) saturate(1.05) drop-shadow(0 15px 12px rgba(0,0,0,0.5))'
                              }}
                              referrerPolicy="no-referrer"
                            />

                            {/* HUD Annotation floating right above the shoe detailing standard scale */}
                            {isPlacedOnFloor && arScale === 1.0 && (
                              <span className="absolute -top-8 bg-emerald-500 text-slate-950 text-[7px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-lg block pointer-events-none animate-bounce">
                                Escala Real Suelo 1:1
                              </span>
                            )}
                          </motion.div>
                        </div>

                        {/* Immersive unified Bottom Panel (Safe-area responsive) containing step-by-step instructions */}
                        <div className="relative mt-auto w-full z-30 bg-gradient-to-t from-slate-950 via-slate-950/98 to-slate-950/85 backdrop-blur-md border-t border-white/10 p-4 space-y-3 max-h-[48vh] overflow-y-auto pb-8">
                          
                          {/* ================= INSTRUCTIONS COMPONENT AT THE BOTTOM ================= */}
                          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 text-left flex gap-2 items-start">
                            <Sparkles size={13} className="text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                            <div className="space-y-0.5">
                              <p className="font-serif font-black text-amber-400 text-[10px] uppercase tracking-wider">¿Cómo acomodar el calzado en tu piso?</p>
                              <p className="text-[8.5px] text-slate-300 leading-normal font-sans">
                                Apunta la cámara al <b>suelo</b> de tu habitación. Presiona el botón dorado para <b>fijarlo</b>, y luego <b>arrastra con tu dedo</b> para ubicar el zapato. Puedes probar los tonos de luz de tu casa abajo.
                              </p>
                            </div>
                          </div>

                          {/* Top controls grid */}
                          <div className="grid grid-cols-2 gap-2">
                            {/* Anchor Action button */}
                            {!isPlacedOnFloor ? (
                              <button
                                type="button"
                                disabled={isScanningSurface}
                                onClick={() => {
                                  setIsPlacedOnFloor(true);
                                  setArScale(1.0); // Snap directly to scale 1:1
                                  onAddLog(`AR Sandbox: Calzado ${selectedProductDetails.name} fijado al suelo`, 'info');
                                }}
                                className={`w-full py-2 rounded-xl text-[9.5px] font-serif font-black uppercase tracking-wider transition-all cursor-pointer ${isScanningSurface ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-[#c5a85c] text-slate-950 hover:brightness-105 shadow-md font-bold'}`}
                              >
                                {isScanningSurface ? '🔍 Calibrando...' : '⬇️ Fijar en el Suelo'}
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setIsPlacedOnFloor(false);
                                  onAddLog(`AR Sandbox: Calzado desanclado`, 'info');
                                }}
                                className="w-full py-2 bg-slate-800 hover:bg-slate-755 text-amber-500 rounded-xl text-[9.5px] font-sans font-black uppercase tracking-wider cursor-pointer border border-slate-700 transition"
                              >
                                🔄 Cambiar Lugar / Levantar
                              </button>
                            )}

                            {/* Camera capture button */}
                            <button
                              type="button"
                              onClick={() => {
                                const flash = document.createElement('div');
                                flash.className = "absolute inset-0 bg-white z-[110] animate-flash-intensity";
                                flash.addEventListener('animationend', () => flash.remove());
                                document.getElementById('product_details_modal')?.appendChild(flash);
                                onAddLog(`AR Sandbox: Captura guardada para ${selectedProductDetails.name}`, 'info');
                                alert(`📸 ¡Fotografía simulada del calzado guardada con éxito en tu galería! Sigue explorando.`);
                              }}
                              className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-[9.5px] font-black uppercase tracking-wider cursor-pointer border border-white/10 flex items-center justify-center gap-1.5 transition"
                            >
                              <Camera size={11} className="text-[#c5a85c]" />
                              <span>Guardar Foto</span>
                            </button>
                          </div>

                          {/* Sizing Tweak Slider with Quick Scale Reset to 1:1 */}
                          <div className="space-y-1.5 bg-black/40 p-2 rounded-lg border border-white/5">
                            <div className="flex justify-between items-center text-[8.5px] font-mono text-slate-300">
                              <span className="font-bold text-amber-500">Ajuste de Tamaño Real:</span>
                              <span className="font-bold flex items-center gap-1">
                                {arScale === 1.0 ? (
                                  <span className="text-emerald-400">📏 Escala Real (100%)</span>
                                ) : (
                                  <span>{Math.round(arScale * 105)}% de tamaño</span>
                                )}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <input 
                                type="range"
                                min="0.5"
                                max="1.5"
                                step="0.05"
                                value={arScale}
                                onChange={(e) => setArScale(Number(e.target.value))}
                                className="flex-1 accent-amber-500 bg-white/20 h-1 rounded-lg cursor-pointer"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setArScale(1.0);
                                  onAddLog(`AR Sandbox: Reajustado a Escala Real`, 'info');
                                }}
                                className={`py-0.5 px-2 text-[8px] font-sans rounded-md cursor-pointer transition uppercase font-black tracking-wider ${arScale === 1.0 ? 'bg-emerald-500 text-slate-900 border border-emerald-500' : 'bg-white/10 text-white border border-white/5'}`}
                              >
                                100% Real
                              </button>
                            </div>
                          </div>

                          {/* Ambient Lights controls matching user home scenario */}
                          <div className="space-y-1 bg-black/40 p-2 rounded-lg border border-white/5">
                            <div className="flex justify-between items-center text-[8px] font-mono text-slate-300">
                              <span>Luz de tu Habitación (Filtro Adaptativo):</span>
                              <span className="text-amber-400 font-bold uppercase">
                                {arLightMode === 'natural' && "Luz Cálida Día • 5500K"}
                                {arLightMode === 'warm' && "Foco Hogareño • 2700K"}
                                {arLightMode === 'sunset' && "Atardecer de Ventana • 1800K"}
                                {arLightMode === 'fluorescent' && "Luz Fría de Oficina • 4000K"}
                              </span>
                            </div>
                            <div className="grid grid-cols-4 gap-1 text-[8px] font-black uppercase text-center mt-1">
                              <button
                                type="button"
                                onClick={() => setArLightMode('natural')}
                                className={`py-1 rounded-md transition cursor-pointer ${arLightMode === 'natural' ? 'bg-[#c5a85c] text-slate-900 font-extrabold shadow' : 'bg-slate-900 text-slate-400 border border-white/5'}`}
                              >
                                ☀️ Día
                              </button>
                              <button
                                type="button"
                                onClick={() => setArLightMode('warm')}
                                className={`py-1 rounded-md transition cursor-pointer ${arLightMode === 'warm' ? 'bg-[#c5a85c] text-slate-900 font-extrabold shadow' : 'bg-slate-900 text-slate-400 border border-white/5'}`}
                              >
                                🏠 Cálida
                              </button>
                              <button
                                type="button"
                                onClick={() => setArLightMode('sunset')}
                                className={`py-1 rounded-md transition cursor-pointer ${arLightMode === 'sunset' ? 'bg-[#c5a85c] text-slate-900 font-extrabold shadow' : 'bg-slate-900 text-slate-400 border border-white/5'}`}
                              >
                                🌅 Tarde
                              </button>
                              <button
                                type="button"
                                onClick={() => setArLightMode('fluorescent')}
                                className={`py-1 rounded-md transition cursor-pointer ${arLightMode === 'fluorescent' ? 'bg-[#c5a85c] text-slate-900 font-extrabold shadow' : 'bg-slate-900 text-slate-400 border border-white/5'}`}
                              >
                                💡 Fría
                              </button>
                            </div>
                          </div>

                          {/* Brand Transparencies Advice and digital cutout options toggle */}
                          <div className="bg-black/40 p-2 rounded-lg border border-white/5 flex items-center justify-between gap-3 text-left">
                            <div className="space-y-0.5 flex-1">
                              <p className="text-[8.5px] font-black text-[#c5a85c] uppercase tracking-wide">¿Quitar Fondo Blanco de Foto?</p>
                              <p className="text-[7.5px] text-slate-200 leading-relaxed font-sans">
                                Si subes fotos con fondo blanco cuadriculado, activa "Quitar Fondo" para mezclarlo con el cuarto. <b>Para la máxima calidad, sube imágenes .PNG con fondo transparente.</b>
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setArBlendMultiply(!arBlendMultiply);
                                onAddLog(`AR Sandbox: Modo de fondo blanco ${!arBlendMultiply ? 'activado' : 'desactivado'} indicando PNG`, 'info');
                              }}
                              className={`py-1.5 px-2.5 rounded-lg text-[8px] font-black uppercase tracking-wider border shrink-0 transition-all ${arBlendMultiply ? 'bg-amber-400 text-slate-950 border-amber-400 font-extrabold' : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white'}`}
                            >
                              {arBlendMultiply ? '✂️ Quitar Fondo (ON)' : '📷 Foto Original'}
                            </button>
                          </div>

                          {/* Quick Alignment Reset helper */}
                          <div className="flex justify-center">
                            <button
                              type="button"
                              onClick={() => {
                                setArPosition({ x: 0, y: 0 });
                                setRotateAngle(180);
                                setRotatePitch(5);
                                onAddLog(`AR Sandbox: Calibración y alineación completada`, 'info');
                              }}
                              className="text-[8px] font-mono text-slate-450 hover:text-white cursor-pointer underline tracking-wider"
                            >
                              🔧 Re-centrar Zapato en Pantalla
                            </button>
                          </div>

                        </div>
                      </div>
                    )}
                  </div>

                  {/* QR Code Scap Popup Overlay inside Modal */}
                  <AnimatePresence>
                    {showQrCodeOverlay && (
                      <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md z-40 flex flex-col justify-between p-5 text-white text-center rounded-3xl">
                        <div className="flex justify-between items-center pb-2 border-b border-white/10">
                          <span className="font-serif font-black text-[10px] text-amber-500 tracking-wider uppercase">Visualizador Móvil Holográfico XR</span>
                          <button 
                            type="button"
                            onClick={() => setShowQrCodeOverlay(false)}
                            className="p-1 rounded-full hover:bg-white/10 text-white cursor-pointer"
                            title="Cerrar QR"
                          >
                            <X size={15} />
                          </button>
                        </div>

                        <div className="py-2.5 flex flex-col items-center justify-center space-y-3">
                          {/* Generative QR Code rendering */}
                          <div className="p-2.5 bg-white rounded-2xl inline-block shadow-2xl border-4 border-amber-500">
                            <img 
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=0f172a&data=${encodeURIComponent(
                                `${window.location.origin}${window.location.pathname}?ar_product=${selectedProductDetails.id}`
                              )}`} 
                              alt="QR Code interactivo"
                              className="w-32 h-32"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          
                          <div className="space-y-1.5 max-w-xs">
                            <p className="font-serif font-black text-[11px] text-slate-100 uppercase tracking-wide">Escanea con tu Smartphone</p>
                            <p className="text-[10px] text-slate-350 leading-relaxed font-sans">
                              Apunta tu cámara móvil aquí para cargar el modelo del calzado o producto <strong className="text-amber-500 font-extrabold">{selectedProductDetails.name}</strong> en AR directamente en tu recámara o sala.
                            </p>
                          </div>
                        </div>

                        <div className="bg-slate-800 p-2 rounded-xl border border-white/5 space-y-1 text-left text-[9px] text-slate-400 font-mono">
                          <p className="font-black text-slate-300 uppercase tracking-widest text-[8px]">Instrucciones Rápidas:</p>
                          <p>1. Escanea el código con la cámara de tu smartphone.</p>
                          <p>2. Abre el enlace WebAR de Homeli Space.</p>
                          <p>3. Permite accesar al giroscopio y proyecta el calzado en tu piso.</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowQrCodeOverlay(false)}
                          className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 text-[10px] font-black uppercase tracking-wider transition cursor-pointer mt-3 rounded-lg"
                        >
                          Listo, Cerrar Lector QR
                        </button>
                      </div>
                    )}
                  </AnimatePresence>

                  {/* Standard Metadata tag of the item */}
                  <div className="flex justify-between items-center text-[10px] sm:text-xs font-mono text-slate-400 z-10">
                    <span>SKU: {selectedProductDetails.sku || 'N/A'}</span>
                    <span className="bg-slate-100 text-slate-650 px-2.5 py-0.5 rounded-md uppercase font-bold text-[9px] border border-slate-200">
                      {selectedProductDetails.category === 'Zapatos' ? '👠 Calzado' : '🧴 Limpieza'}
                    </span>
                  </div>
                </div>

                {/* Product Meta & Interactive Quantity Counter Selector */}
                <div className="flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <h3 className="text-lg sm:text-2xl font-serif font-black text-slate-900 leading-tight">
                      {selectedProductDetails.name}
                    </h3>
                    
                    {/* Price Tag with larger readable fonts */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl sm:text-2xl font-black text-[#c19a45] font-mono">
                        ${selectedProductDetails.price} MXN
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        ${Math.round(selectedProductDetails.price * 1.25)} MXN
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                      {selectedProductDetails.description}
                    </p>

                    <div className="pt-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Disponibilidad Física</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${selectedProductDetails.stock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                        <span className="text-xs font-bold text-slate-700">
                          {selectedProductDetails.stock > 0 ? `${selectedProductDetails.stock} unidades en almacén central` : 'Producto temporalmente agotado'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    {/* Quantity Choice counter selector */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-black text-slate-800">Cantidad deseada:</span>
                      <div className="flex items-center gap-2.5 bg-slate-100 border border-[#ebd7a7]/30 p-1 rounded-xl">
                        <button 
                          onClick={() => setDetailsQuantity(q => Math.max(1, q - 1))}
                          className="w-8 h-8 bg-white hover:bg-slate-50 border border-slate-200/40 rounded-lg text-sm font-black flex items-center justify-center text-slate-700 transition cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-sm font-mono font-black text-slate-800 px-2 min-w-4 text-center">
                          {detailsQuantity}
                        </span>
                        <button 
                          onClick={() => setDetailsQuantity(q => Math.min(selectedProductDetails.stock, q + 1))}
                          disabled={detailsQuantity >= selectedProductDetails.stock}
                          className="w-8 h-8 bg-white hover:bg-slate-50 border border-slate-200/40 rounded-lg text-sm font-black flex items-center justify-center text-slate-700 transition disabled:opacity-50 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Submit Purchase option */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedProductDetails(null)}
                        className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs sm:text-sm font-black rounded-xl transition font-sans text-center cursor-pointer"
                      >
                        Cerrar Sección
                      </button>
                      <button
                        onClick={() => {
                          if (selectedProductDetails.stock > 0) {
                            // Add with computed counter quantity
                            for (let i = 0; i < detailsQuantity; i++) {
                              addToCart(selectedProductDetails);
                            }
                            setSelectedProductDetails(null);
                            setIsCartDrawerOpen(true);
                            onAddLog(`Carrito: Se agregaron ${detailsQuantity} unidades de ${selectedProductDetails.name}`, 'info');
                          }
                        }}
                        disabled={selectedProductDetails.stock <= 0}
                        className={`flex-1.5 py-3 text-white text-xs sm:text-sm font-black rounded-xl shadow-md transition-all font-sans text-center cursor-pointer ${selectedProductDetails.stock <= 0 ? 'bg-slate-300 cursor-not-allowed' : 'bg-gradient-to-r from-slate-900 to-indigo-950 hover:opacity-95'}`}
                      >
                        🛒 Agregar {detailsQuantity} al Carrito
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ServiceRequest, ProductItem, SalesOrder, SystemLog, UserProfile } from './types';

export const initialServices: ServiceRequest[] = [
  {
    id: 'SRV-101',
    clientName: 'Sofia Vergara',
    clientEmail: 'sofia@homeli.mx',
    serviceType: 'Limpieza Integral',
    date: '2026-06-04T09:00:00Z',
    address: 'Av. Paseo de la Reforma 450, Lomas, CDMX',
    price: 850,
    status: 'programado',
    assignedStaff: 'Carlos Ramos',
    priority: 'Media',
    notes: 'Llevar insumos especiales para mármol.'
  },
  {
    id: 'SRV-102',
    clientName: 'Andrés Manuel Torres',
    clientEmail: 'andres.torres@outlook.com',
    serviceType: 'Mantenimiento Fontanería',
    date: '2026-06-03T10:30:00Z',
    address: 'Calle Colima 120, Roma Norte, CDMX',
    price: 1200,
    status: 'en_progreso',
    assignedStaff: 'José Luis Alavez',
    priority: 'Alta',
    notes: 'Fuga persistente bajo la tarja de cocina.'
  },
  {
    id: 'SRV-103',
    clientName: 'Mariana Rodríguez',
    clientEmail: 'mariana.rgz@gmail.com',
    serviceType: 'Electricidad General',
    date: '2026-06-02T14:00:00Z',
    address: 'Cda. Centenario 24, San Ángel, CDMX',
    price: 650,
    status: 'completado',
    assignedStaff: 'Ramiro Hernández',
    priority: 'Baja',
    notes: 'Instalación de dimmers inteligentes en sala de estar.'
  },
  {
    id: 'SRV-104',
    clientName: 'Roberto Banchs',
    clientEmail: 'roberto.banchs@homeli.mx',
    serviceType: 'Pintura y Retoques',
    date: '2026-06-05T08:00:00Z',
    address: 'Boulevard del Sol 101, Huixquilucan, EdoMex',
    price: 3800,
    status: 'programado',
    assignedStaff: 'Eduardo Gándara',
    priority: 'Media',
    notes: 'Pintado de fachada y recámara principal.'
  },
  {
    id: 'SRV-105',
    clientName: 'Gabriela Palacios',
    clientEmail: 'gaby.palacios@live.com.mx',
    serviceType: 'Soporte Climatización',
    date: '2026-06-01T11:00:00Z',
    address: 'Plaza Carso, Depto 14B, CDMX',
    price: 1540,
    status: 'completado',
    assignedStaff: 'José Luis Alavez',
    priority: 'Alta',
    notes: 'Carga de gas refrigerante y limpieza de turbina.'
  }
];

export const initialProducts: ProductItem[] = [
  // Original products (preserved for historical compatibility with old orders)
  {
    id: 'PROD-001',
    name: 'Kit de Limpieza Multiusos Homeli-Pro',
    sku: 'HML-KIT-01',
    category: 'Productos de limpieza',
    price: 349,
    stock: 85,
    salesCount: 142,
    description: 'Kit completo biodegradable diseñado para superficies delicadas. Incluye 3 rociadores, paños de microfibra de alta densidad y abrillantador ecológico.',
    imageUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 'PROD-002',
    name: 'Cerradura Inteligente Homeli Secure Gen2',
    sku: 'HML-SHL-02',
    category: 'Seguridad',
    price: 2499,
    stock: 14,
    salesCount: 45,
    description: 'Apertura mediante huella dactilar, clave numérica, app móvil o llave de emergencia. Integrable con Homeli App del Administrador.',
    imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 'PROD-003',
    name: 'Filtro Purificador de Agua Carbón Activado',
    sku: 'HML-FLT-11',
    category: 'Hogar',
    price: 599,
    stock: 40,
    salesCount: 98,
    description: 'Filtro purificador de 5 etapas desmontable. Filtrado óptimo de sedimentos y sabor metálico. Instalación estándar para fregadero de cocina.',
    imageUrl: 'https://images.unsplash.com/photo-1585832770485-e68a5dbfad52?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 'PROD-004',
    name: 'Set de Desarmadores Ergonómicos de Precisión',
    sku: 'HML-TOOL-29',
    category: 'Herramientas',
    price: 189,
    stock: 120,
    salesCount: 215,
    description: 'Set de 24 cabezales intercambiables de acero al cromo vanadio. Ideal para reparaciones electrónicas menores e instalación de accesorios del hogar.',
    imageUrl: 'https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },

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

export const initialOrders: SalesOrder[] = [
  {
    id: 'ORD-9452',
    customerName: 'Patricia Sosa',
    customerEmail: 'patty.sosa@me.com',
    date: '2026-06-03T14:22:00Z',
    total: 3098,
    status: 'procesando',
    itemsCount: 2,
    productNames: ['Cerradura Inteligente Homeli Secure Gen2', 'Kit de Limpieza Multiusos Homeli-Pro']
  },
  {
    id: 'ORD-9451',
    customerName: 'Gerardo Ortiz',
    customerEmail: 'gerardo@ortiz-firm.mx',
    date: '2026-06-03T09:12:00Z',
    total: 349,
    status: 'enviado',
    itemsCount: 1,
    productNames: ['Kit de Limpieza Multiusos Homeli-Pro']
  },
  {
    id: 'ORD-9450',
    customerName: 'Diana Cazares',
    customerEmail: 'diana.c@homeli.mx',
    date: '2026-06-02T16:45:00Z',
    total: 599,
    status: 'entregado',
    itemsCount: 1,
    productNames: ['Filtro Purificador de Agua Carbón Activado']
  },
  {
    id: 'ORD-9449',
    customerName: 'Hugo Sánchez',
    customerEmail: 'pentapichichi@gmail.com',
    date: '2026-05-31T11:30:00Z',
    total: 3287,
    status: 'entregado',
    itemsCount: 3,
    productNames: ['Cerradura Inteligente Homeli Secure Gen2', 'Set de Desarmadores Ergonómicos de Precisión', 'Filtro Purificador de Agua']
  }
];

export const initialLogs: SystemLog[] = [
  {
    id: 'LOG-001',
    timestamp: '2026-06-03T15:34:22Z',
    actor: 'Felipe Admin',
    role: 'Administrador',
    action: 'Activación del modo de reservación express en CDMX',
    severity: 'info'
  },
  {
    id: 'LOG-002',
    timestamp: '2026-06-03T14:23:10Z',
    actor: 'Ventas Bot',
    role: 'Ventas',
    action: 'Nueva Orden de Ecommerce ORD-9452 procesada con éxito',
    severity: 'info'
  },
  {
    id: 'LOG-003',
    timestamp: '2026-06-03T10:31:05Z',
    actor: 'Coordinador Jose',
    role: 'Servicios',
    action: 'Servicio SRV-102 modificado a estado "En Progreso"',
    severity: 'info'
  },
  {
    id: 'LOG-004',
    timestamp: '2026-06-02T19:00:00Z',
    actor: 'Sistema Seguridad',
    role: 'Administrador',
    action: 'Intento de logueo inusual bloqueado desde IP 189.12.33.4',
    severity: 'warning'
  }
];

export const initialProfiles: UserProfile[] = [
  {
    id: 'USR-201',
    name: 'Felipe Alarcón',
    email: 'felipe.alarcon@homeli.mx',
    role: 'Administrador',
    status: 'Activo',
    lastActive: 'Hace 3 minutos'
  },
  {
    id: 'USR-202',
    name: 'José Luis Alavez',
    email: 'joseluis@homeli.mx',
    role: 'Servicios',
    status: 'Activo',
    lastActive: 'Hace 1 hora'
  },
  {
    id: 'USR-203',
    name: 'Valeria Martínez',
    email: 'valeria.sales@homeli.mx',
    role: 'Ventas',
    status: 'Activo',
    lastActive: 'Hace 5 minutos'
  },
  {
    id: 'USR-204',
    name: 'Eduardo Gándara',
    email: 'eduardo.g@homeli.mx',
    role: 'Servicios',
    status: 'Inactivo',
    lastActive: 'Ayer'
  }
];

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
  {
    id: 'PROD-001',
    name: 'Kit de Limpieza Multiusos Homeli-Pro',
    sku: 'HML-KIT-01',
    category: 'Limpieza',
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

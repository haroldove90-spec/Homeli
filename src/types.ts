/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ServiceStatus = 'programado' | 'en_progreso' | 'completado' | 'cancelado';

export interface ServiceRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  serviceType: 'Limpieza Integral' | 'Mantenimiento Fontanería' | 'Electricidad General' | 'Pintura y Retoques' | 'Soporte Climatización' | 'Jardinería Paisajismo' | string;
  date: string;
  address: string;
  price: number;
  status: ServiceStatus;
  assignedStaff: string;
  priority: 'Baja' | 'Media' | 'Alta';
  notes?: string;
  uploadedPhoto?: string;
  selectedItems?: string[];
}

export type OrderStatus = 'procesando' | 'enviado' | 'entregado' | 'cancelado';

export interface ProductItem {
  id: string;
  name: string;
  sku: string;
  category: 'Limpieza' | 'Ferretería' | 'Seguridad' | 'Hogar' | 'Herramientas' | 'Zapatos' | string;
  price: number;
  stock: number;
  salesCount: number;
  description: string;
  imageUrl?: string;
  active?: boolean;
  glbUrl?: string;
  usdzUrl?: string;
}

export type DeliveryStatus = 'unassigned' | 'launched' | 'assigned' | 'accepted' | 'collected' | 'in_transit' | 'with_customer' | 'delivered';

export interface SalesOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  total: number;
  status: OrderStatus;
  itemsCount: number;
  productNames: string[];
  // Delivery fields
  deliveryDate?: string;
  deliveryType?: 'next_day' | 'scheduled';
  deliveryCourierId?: string;
  deliveryStatus?: DeliveryStatus;
  deliveryNotes?: string;
}

export interface CourierProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicle: 'motocicleta' | 'bicicleta' | 'automóvil' | 'van';
  vehiclePlate?: string;
  photoUrl?: string;
  status: 'pending' | 'active' | 'rejected';
  documents: {
    ine: string;
    license: string;
    vehicleDoc?: string;
  };
  rating?: number;
  completedDeliveries?: number;
  earnings?: number;
  lastActive?: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  actor: string;
  role: 'Administrador' | 'Servicios' | 'Ventas' | 'Mensajería' | 'Negocio';
  action: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Administrador' | 'Servicios' | 'Ventas' | 'Mensajería' | 'Negocio';
  status: 'Activo' | 'Inactivo';
  lastActive: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  role: 'Administrador' | 'Servicios' | 'Ventas' | 'Mensajería' | 'Cliente' | 'Todos' | 'Negocio';
  read: boolean;
  targetId?: string;
  type?: 'compra' | 'asignacion' | 'mensajeria' | 'registro' | 'entrega' | 'sistema' | 'negocio';
}

export interface BusinessService {
  name: string;
  price: number;
  description: string;
}

export interface BusinessRegistration {
  id: string;
  name: string;
  logo: string;
  address: string;
  mapLink: string;
  telephones: string;
  whatsapp: string;
  ownerName: string;
  giro: string;
  status: 'Activo' | 'Suspendido' | 'Desactivado';
  services: BusinessService[];
  createdAt: string;
}



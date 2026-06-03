/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ServiceStatus = 'programado' | 'en_progreso' | 'completado' | 'cancelado';

export interface ServiceRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  serviceType: 'Limpieza Integral' | 'Mantenimiento Fontanería' | 'Electricidad General' | 'Pintura y Retoques' | 'Soporte Climatización' | 'Jardinería Paisajismo';
  date: string;
  address: string;
  price: number;
  status: ServiceStatus;
  assignedStaff: string;
  priority: 'Baja' | 'Media' | 'Alta';
  notes?: string;
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
}

export interface SalesOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  total: number;
  status: OrderStatus;
  itemsCount: number;
  productNames: string[];
}

export interface SystemLog {
  id: string;
  timestamp: string;
  actor: string;
  role: 'Administrador' | 'Servicios' | 'Ventas';
  action: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Administrador' | 'Servicios' | 'Ventas';
  status: 'Activo' | 'Inactivo';
  lastActive: string;
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ServiceRequest, ServiceStatus } from '../types';
import { 
  Calendar, 
  MapPin, 
  User, 
  Clock, 
  AlertCircle, 
  Plus, 
  ChevronRight, 
  SlidersHorizontal,
  Briefcase,
  TrendingDown,
  Wrench,
  Sparkles,
  Inbox,
  X,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ServiciosSectionProps {
  services: ServiceRequest[];
  onAddService: (service: ServiceRequest) => void;
  onUpdateServiceStatus: (id: string, status: ServiceStatus) => void;
  onAddLog: (action: string, severity: 'info' | 'warning' | 'critical') => void;
}

export default function ServiciosSection({
  services,
  onAddService,
  onUpdateServiceStatus,
  onAddLog
}: ServiciosSectionProps) {
  // Filters & triggers
  const [statusFilter, setStatusFilter] = useState<'todos' | ServiceStatus>('todos');
  const [priorityFilter, setPriorityFilter] = useState<'todos' | 'Baja' | 'Media' | 'Alta'>('todos');
  const [showBookModal, setShowBookModal] = useState(false);

  // New Service Booking form state
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [serviceType, setServiceType] = useState<ServiceRequest['serviceType']>('Limpieza Integral');
  const [address, setAddress] = useState('');
  const [assignedStaff, setAssignedStaff] = useState('');
  const [price, setPrice] = useState('850');
  const [priority, setPriority] = useState<'Baja' | 'Media' | 'Alta'>('Media');
  const [notes, setNotes] = useState('');

  // Selected Service for Detail Overlay
  const [selectedService, setSelectedService] = useState<ServiceRequest | null>(null);

  const handleBookService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !address.trim()) return;

    const newRequest: ServiceRequest = {
      id: `SRV-${Math.floor(106 + Math.random() * 800)}`,
      clientName,
      clientEmail: clientEmail.trim() || 'cliente@homeli.mx',
      serviceType,
      date: new Date().toISOString(),
      address,
      price: parseFloat(price) || 850,
      status: 'programado',
      assignedStaff: assignedStaff.trim() || 'Por Asignar',
      priority,
      notes: notes.trim()
    };

    onAddService(newRequest);
    onAddLog(`Nueva orden de servicio creada para: ${newRequest.clientName} (${newRequest.serviceType})`, 'info');

    // Reset Form
    setClientName('');
    setClientEmail('');
    setServiceType('Limpieza Integral');
    setAddress('');
    setAssignedStaff('');
    setPrice('850');
    setPriority('Media');
    setNotes('');
    setShowBookModal(false);
  };

  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case 'programado': return 'bg-sky-50 text-sky-700 border-sky-100';
      case 'en_progreso': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'completado': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'cancelado': return 'bg-rose-50 text-rose-700 border-rose-100';
    }
  };

  const getStatusLabel = (status: ServiceStatus) => {
    switch (status) {
      case 'programado': return 'Programado';
      case 'en_progreso': return 'En Progreso';
      case 'completado': return 'Completado';
      case 'cancelado': return 'Cancelado';
    }
  };

  const getServiceIcon = (type: ServiceRequest['serviceType']) => {
    switch (type) {
      case 'Limpieza Integral':
        return <Sparkles className="text-amber-500" size={18} />;
      default:
        return <Wrench className="text-blue-500" size={18} />;
    }
  };

  // Filter list
  const filteredServices = services.filter(s => {
    const statusMatch = statusFilter === 'todos' || s.status === statusFilter;
    const priorityMatch = priorityFilter === 'todos' || s.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  const scheduledCount = services.filter(s => s.status === 'programado').length;
  const inProgressCount = services.filter(s => s.status === 'en_progreso').length;
  const completedCount = services.filter(s => s.status === 'completado').length;

  return (
    <div className="space-y-6" id="services_section_wrapper">
      {/* Top operational summary bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="services_overview_cards">
        <div className="bg-white p-4 rounded-xl border border-natural-border shadow-sm flex items-center justify-between" id="metric_scheduled">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-earth-copper-light text-earth-copper rounded-xl">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-natural-muted">Servicios Programados</p>
              <h4 className="text-lg font-bold font-serif text-natural-dark mt-0.5">{scheduledCount} órdenes</h4>
            </div>
          </div>
          <span className="text-[10px] text-natural-silt">En espera</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-natural-border shadow-sm flex items-center justify-between" id="metric_inprogress">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-earth-green-light text-earth-green-dark rounded-xl">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-natural-muted">En Operación Activa</p>
              <h4 className="text-lg font-bold font-serif text-natural-dark mt-0.5">{inProgressCount} técnicos</h4>
            </div>
          </div>
          <span className="text-[10px] text-earth-green font-bold animate-pulse">● En ruta</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-natural-border shadow-sm flex items-center justify-between" id="metric_completed">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-earth-green-light text-earth-green rounded-xl">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-natural-muted">Completados esta Semana</p>
              <h4 className="text-lg font-bold font-serif text-natural-dark mt-0.5">{completedCount} entregas</h4>
            </div>
          </div>
          <span className="text-[10px] text-earth-green font-bold">100% Calidad</span>
        </div>
      </div>

      {/* Control filters & action bar */}
      <div className="bg-white p-4 rounded-xl border border-natural-border shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" id="services_controls">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-natural-muted text-xs font-bold uppercase tracking-wider pr-2 border-r border-natural-border">
            <SlidersHorizontal size={14} />
            <span>Filtros</span>
          </div>

          <div className="flex rounded-lg bg-natural-bg p-0.5 border border-natural-border" id="status_filter_group">
            <button
              onClick={() => setStatusFilter('todos')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition cursor-pointer ${statusFilter === 'todos' ? 'bg-white shadow-sm font-extrabold text-natural-dark' : 'text-natural-silt hover:text-natural-dark'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setStatusFilter('programado')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition cursor-pointer ${statusFilter === 'programado' ? 'bg-white shadow-sm font-extrabold text-natural-dark' : 'text-natural-silt hover:text-natural-dark'}`}
            >
              Programado
            </button>
            <button
              onClick={() => setStatusFilter('en_progreso')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition cursor-pointer ${statusFilter === 'en_progreso' ? 'bg-white shadow-sm font-extrabold text-natural-dark' : 'text-natural-silt hover:text-natural-dark'}`}
            >
              En Ruta
            </button>
            <button
              onClick={() => setStatusFilter('completado')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition cursor-pointer ${statusFilter === 'completado' ? 'bg-white shadow-sm font-extrabold text-natural-dark' : 'text-natural-silt hover:text-natural-dark'}`}
            >
              Completado
            </button>
          </div>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="px-3 py-1 text-xs font-bold rounded-lg bg-natural-bg border border-natural-border text-natural-dark focus:outline-none focus:border-earth-green bg-white"
            id="priority_filter_select"
          >
            <option value="todos">Prioridad: Todos</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>

        <button
          onClick={() => setShowBookModal(true)}
          className="w-full sm:w-auto px-4 py-2 bg-earth-green hover:bg-earth-green-dark text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-md cursor-pointer"
          id="btn_book_service_trigger"
        >
          <Plus size={16} />
          Agendar Servicio Homeli
        </button>
      </div>

      {/* Main Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="services_card_grid">
        <AnimatePresence mode="popLayout">
          {filteredServices.length === 0 ? (
            <div className="col-span-1 md:col-span-2 py-16 bg-white rounded-2xl border border-natural-border text-center text-natural-muted text-sm flex flex-col items-center justify-center space-y-2">
              <Inbox size={32} className="text-natural-muted" />
              <p className="font-bold text-natural-dark">Ningún servicio coincide con los filtros</p>
              <p className="text-xs text-natural-muted">Intenta remover o cambiar el estatus en la barra superior</p>
            </div>
          ) : (
            filteredServices.map(service => (
              <motion.div
                key={service.id}
                layoutId={`service_card_${service.id}`}
                onClick={() => setSelectedService(service)}
                className="bg-white p-5 rounded-2xl border border-natural-border shadow-sm hover:shadow-md transition duration-250 cursor-pointer hover:border-earth-green/60 group flex flex-col justify-between text-left"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className="text-[10px] text-earth-green font-bold bg-earth-green-light border border-earth-green/20 px-2 py-0.5 rounded-full font-mono">
                      {service.id}
                    </span>
                    <div className="flex gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${getStatusColor(service.status)}`}>
                        {getStatusLabel(service.status)}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        service.priority === 'Alta' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        service.priority === 'Media' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-natural-bg text-natural-silt border border-natural-border'
                      }`}>
                        {service.priority}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-bold font-serif text-natural-dark text-[15px] group-hover:text-earth-green transition flex items-center gap-1.5 leading-tight mb-2">
                    {getServiceIcon(service.serviceType)}
                    {service.serviceType}
                  </h4>

                  <p className="text-xs text-natural-muted font-medium line-clamp-1 mb-3">
                    Cliente: <span className="text-natural-dark font-bold">{service.clientName}</span>
                  </p>

                  <div className="space-y-1.5 pt-3 border-t border-natural-border text-xs text-natural-muted font-medium">
                    <p className="flex items-center gap-2">
                      <MapPin size={13} className="text-natural-muted shrink-0" />
                      <span className="line-clamp-1">{service.address}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <User size={13} className="text-natural-muted shrink-0" />
                      <span>Especialista: <strong className="text-natural-dark">{service.assignedStaff}</strong></span>
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-5 pt-3 border-t border-natural-border">
                  <div>
                    <p className="text-[9px] text-natural-muted uppercase tracking-widest font-bold">Costo total</p>
                    <p className="text-sm font-extrabold text-natural-dark">${service.price} MXN</p>
                  </div>
                  <span className="text-[11px] font-bold text-earth-green group-hover:translate-x-1 transition flex items-center gap-0.5">
                    Ver detalles <ChevronRight size={14} />
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Details Overlay and status updater */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 bg-natural-dark/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              layoutId={`service_card_${selectedService.id}`}
              className="bg-white rounded-2xl border border-natural-border p-6 max-w-lg w-full shadow-2xl relative space-y-6 text-left"
              id="service_detail_modal"
            >
              <button 
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-natural-muted hover:bg-natural-bg transition cursor-pointer"
              >
                <X size={18} />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-earth-green font-bold bg-earth-green-light border border-earth-green/20 px-2 py-0.5 rounded-full font-mono">
                    {selectedService.id}
                  </span>
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${getStatusColor(selectedService.status)}`}>
                    {getStatusLabel(selectedService.status)}
                  </span>
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                    selectedService.priority === 'Alta' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    selectedService.priority === 'Media' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-natural-bg text-natural-silt border border-natural-border'
                  }`}>
                    Prioridad {selectedService.priority}
                  </span>
                </div>

                <h3 className="text-xl font-bold font-serif text-natural-dark mt-3 flex items-center gap-2">
                  {getServiceIcon(selectedService.serviceType)}
                  {selectedService.serviceType}
                </h3>
                <p className="text-sm font-bold text-earth-green mt-1">${selectedService.price} MXN</p>
              </div>

              <div className="space-y-4 py-4 border-y border-natural-border text-sm text-natural-dark">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-[10px] font-bold text-natural-muted uppercase tracking-widest leading-none mb-1.5">Cliente</h5>
                    <p className="font-bold text-natural-dark">{selectedService.clientName}</p>
                    <p className="text-xs text-natural-muted font-mono">{selectedService.clientEmail}</p>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-natural-muted uppercase tracking-widest leading-none mb-1.5">Especialista Homeli</h5>
                    <p className="font-bold text-natural-dark">{selectedService.assignedStaff}</p>
                  </div>
                </div>

                <div>
                  <h5 className="text-[10px] font-bold text-natural-muted uppercase tracking-widest leading-none mb-1.5">Dirección de Destino</h5>
                  <p className="font-medium text-natural-dark flex items-start gap-1 pb-1">
                    <MapPin size={14} className="text-natural-muted shrink-0 mt-0.5" />
                    <span>{selectedService.address}</span>
                  </p>
                </div>

                {selectedService.notes && (
                  <div className="p-3 bg-natural-bg rounded-xl border border-natural-border">
                    <h5 className="text-xs font-bold text-natural-silt mb-1.5 flex items-center gap-1">
                      <FileText size={12} />
                      Notas de operación
                    </h5>
                    <p className="text-xs text-natural-text italic leading-relaxed">{selectedService.notes}</p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-natural-muted uppercase tracking-widest mb-3">Cambiar Estado del Servicio</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => {
                      onUpdateServiceStatus(selectedService.id, 'programado');
                      setSelectedService(prev => prev ? { ...prev, status: 'programado' } : null);
                    }}
                    className={`px-2 py-2 text-xs font-bold rounded-xl border text-center transition cursor-pointer ${selectedService.status === 'programado' ? 'bg-earth-slate text-white border-transparent' : 'bg-white text-natural-dark hover:bg-natural-bg border-natural-border'}`}
                  >
                    Programar
                  </button>
                  <button
                    onClick={() => {
                      onUpdateServiceStatus(selectedService.id, 'en_progreso');
                      setSelectedService(prev => prev ? { ...prev, status: 'en_progreso' } : null);
                    }}
                    className={`px-2 py-2 text-xs font-bold rounded-xl border text-center transition cursor-pointer ${selectedService.status === 'en_progreso' ? 'bg-earth-copper text-white border-transparent' : 'bg-white text-natural-dark hover:bg-natural-bg border-natural-border'}`}
                  >
                    En Ruta
                  </button>
                  <button
                    onClick={() => {
                      onUpdateServiceStatus(selectedService.id, 'completado');
                      setSelectedService(prev => prev ? { ...prev, status: 'completado' } : null);
                    }}
                    className={`px-2 py-2 text-xs font-bold rounded-xl border text-center transition cursor-pointer ${selectedService.status === 'completado' ? 'bg-earth-green text-white border-transparent' : 'bg-white text-natural-dark hover:bg-natural-bg border-natural-border'}`}
                  >
                    Terminar
                  </button>
                  <button
                    onClick={() => {
                      onUpdateServiceStatus(selectedService.id, 'cancelado');
                      setSelectedService(prev => prev ? { ...prev, status: 'cancelado' } : null);
                    }}
                    className={`px-2 py-2 text-xs font-bold rounded-xl border text-center transition cursor-pointer ${selectedService.status === 'cancelado' ? 'bg-rose-600 text-white border-transparent' : 'bg-white text-natural-dark hover:bg-rose-50 border-natural-border'}`}
                  >
                    Cancelar
                  </button>
                </div>
              </div>

              <div className="text-right pt-4">
                <button
                  onClick={() => setSelectedService(null)}
                  className="px-6 py-2 bg-earth-green hover:bg-earth-green-dark text-white font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Confirmar y Salir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Booking Form Modal */}
      <AnimatePresence>
        {showBookModal && (
          <div className="fixed inset-0 bg-natural-dark/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-natural-border p-6 max-w-lg w-full shadow-2xl space-y-6 text-left"
              id="book_service_modal"
            >
              <div className="flex justify-between items-center pb-3 border-b border-natural-border">
                <h3 className="text-lg font-bold font-serif text-natural-dark flex items-center gap-2">
                  <Calendar size={20} className="text-earth-green" />
                  Nueva Reservación Homeli
                </h3>
                <button 
                  onClick={() => setShowBookModal(false)}
                  className="text-natural-muted hover:text-natural-dark text-sm font-bold cursor-pointer transition"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleBookService} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-natural-muted uppercase tracking-wider mb-1.5">Nombre del Cliente</label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ej. Patricia González"
                      className="w-full px-3 py-2 border border-natural-border rounded-xl focus:outline-none focus:border-earth-green text-sm bg-natural-bg text-natural-dark"
                      id="book_client_name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-natural-muted uppercase tracking-wider mb-1.5">Correo Electrónico</label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="correo@ejemplo.com"
                      className="w-full px-3 py-2 border border-natural-border rounded-xl focus:outline-none focus:border-earth-green text-sm bg-natural-bg text-natural-dark"
                      id="book_client_email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-natural-muted uppercase tracking-wider mb-1.5">Tipo de Servicio</label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value as any)}
                      className="w-full px-3 py-2 border border-natural-border rounded-xl bg-white focus:outline-none focus:border-earth-green text-sm bg-natural-bg text-natural-dark"
                      id="book_service_type"
                    >
                      <option value="Limpieza Integral">Limpieza Integral</option>
                      <option value="Mantenimiento Fontanería">Mantenimiento Fontanería</option>
                      <option value="Electricidad General">Electricidad General</option>
                      <option value="Pintura y Retoques">Pintura y Retoques</option>
                      <option value="Soporte Climatización">Soporte Climatización</option>
                      <option value="Jardinería Paisajismo">Jardinería Paisajismo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-natural-muted uppercase tracking-wider mb-1.5">Costo Estimado ($ MXN)</label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="850"
                      className="w-full px-3 py-2 border border-natural-border rounded-xl focus:outline-none focus:border-earth-green text-sm font-bold bg-natural-bg text-natural-dark font-mono"
                      id="book_price"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-natural-muted uppercase tracking-wider mb-1.5">Dirección de Destino</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Calle, Número, Colonia, Delegación"
                    className="w-full px-3 py-2 border border-natural-border rounded-xl focus:outline-none focus:border-earth-green text-sm bg-natural-bg text-natural-dark"
                    id="book_address"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-natural-muted uppercase tracking-wider mb-1.5">Especialista Asignado</label>
                    <input
                      type="text"
                      value={assignedStaff}
                      onChange={(e) => setAssignedStaff(e.target.value)}
                      placeholder="Ej. José Luis Alavez"
                      className="w-full px-3 py-2 border border-natural-border rounded-xl focus:outline-none focus:border-earth-green text-sm bg-natural-bg text-natural-dark"
                      id="book_staff"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-natural-muted uppercase tracking-wider mb-1.5">Prioridad Operativa</label>
                    <div className="flex rounded-lg bg-natural-bg p-0.5 border border-natural-border w-full" id="priority_toggle_group">
                      <button
                        type="button"
                        onClick={() => setPriority('Baja')}
                        className={`flex-1 py-1 text-xs font-bold rounded-md transition cursor-pointer ${priority === 'Baja' ? 'bg-white shadow-sm font-extrabold text-natural-dark' : 'text-natural-silt hover:text-natural-dark'}`}
                      >
                        Baja
                      </button>
                      <button
                        type="button"
                        onClick={() => setPriority('Media')}
                        className={`flex-1 py-1 text-xs font-bold rounded-md transition cursor-pointer ${priority === 'Media' ? 'bg-white shadow-sm font-extrabold text-natural-dark' : 'text-natural-silt hover:text-natural-dark'}`}
                      >
                        Media
                      </button>
                      <button
                        type="button"
                        onClick={() => setPriority('Alta')}
                        className={`flex-1 py-1 text-xs font-bold rounded-md transition cursor-pointer ${priority === 'Alta' ? 'bg-rose-500 text-white font-extrabold' : 'text-natural-silt hover:text-rose-500'}`}
                      >
                        Alta
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-natural-muted uppercase tracking-wider mb-1.5">Notas u Advertencias</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Detalles sobre mascotas, estacionamiento o accesos..."
                    className="w-full px-3 py-2 border border-natural-border rounded-xl focus:outline-none focus:border-earth-green text-sm bg-natural-bg text-natural-dark text-left"
                    rows={3}
                    id="book_notes"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBookModal(false)}
                    className="flex-1 py-2 px-4 bg-natural-bg hover:bg-natural-border/50 text-natural-silt rounded-xl text-sm font-bold transition cursor-pointer"
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-earth-green hover:bg-earth-green-dark text-white rounded-xl text-sm font-bold transition shadow-md cursor-pointer"
                  >
                    Agendar Ahora
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

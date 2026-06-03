/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
  HelpCircle
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
}

export default function AdminSection({
  services,
  products,
  orders,
  logs,
  profiles,
  onAddUser,
  onAddLog,
  onClearLogs
}: AdminSectionProps) {
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

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelado')
    .reduce((acc, current) => acc + current.total, 0) + 
    services
    .filter(s => s.status === 'completado')
    .reduce((acc, s) => acc + s.price, 0);

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
  };

  // Filter logs safely
  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(logFilter.toLowerCase()) ||
    log.actor.toLowerCase().includes(logFilter.toLowerCase()) ||
    log.role.toLowerCase().includes(logFilter.toLowerCase())
  );

  return (
    <div className="space-y-8" id="admin_section_wrapper">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="admin_kpi_grid">
        <div className="p-5 bg-white rounded-2xl border border-natural-border shadow-sm" id="kpi_card_revenue">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-natural-muted uppercase tracking-wider">Ingreso Total Estimado</p>
              <h3 className="text-2xl font-bold font-serif tracking-tight text-natural-dark mt-2">
                ${totalRevenue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-xs text-earth-copper font-semibold mt-1">E-commerce + Servicios completados</p>
            </div>
            <div className="p-3 bg-earth-copper-light rounded-xl text-earth-copper">
              <DollarSign size={20} />
            </div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-natural-border shadow-sm" id="kpi_card_services">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-natural-muted uppercase tracking-wider">Servicios Pendientes</p>
              <h3 className="text-2xl font-bold font-serif tracking-tight text-natural-dark mt-2">
                {pendingServicesCount}
              </h3>
              <p className="text-xs text-earth-green font-semibold mt-1">Requieren atención operativa</p>
            </div>
            <div className="p-3 bg-earth-green-light rounded-xl text-earth-green-dark">
              <Sparkles size={20} />
            </div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-natural-border shadow-sm" id="kpi_card_orders">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-natural-muted uppercase tracking-wider">Pedidos por Procesar</p>
              <h3 className="text-2xl font-bold font-serif tracking-tight text-natural-dark mt-2">
                {processingOrdersCount}
              </h3>
              <p className="text-xs text-earth-slate font-semibold mt-1">Ecommerce en espera de envío</p>
            </div>
            <div className="p-3 bg-earth-slate-light rounded-xl text-earth-slate">
              <ShoppingBag size={20} />
            </div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-natural-border shadow-sm" id="kpi_card_users">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-natural-muted uppercase tracking-wider">Equipo Activo</p>
              <h3 className="text-2xl font-bold font-serif tracking-tight text-natural-dark mt-2">
                {profiles.filter(p => p.status === 'Activo').length} / {profiles.length}
              </h3>
              <p className="text-xs text-earth-green font-semibold mt-1">Colaboradores en línea</p>
            </div>
            <div className="p-3 bg-earth-green-light rounded-xl text-earth-green">
              <Users size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="admin_splits">
        {/* Left column: Controls & Personnel */}
        <div className="lg:col-span-1 space-y-8" id="admin_left_col">
          {/* Settings / Configs */}
          <div className="bg-white p-6 rounded-2xl border border-natural-border shadow-sm" id="settings_panel">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-natural-border">
              <Settings className="text-natural-muted" size={18} />
              <h4 className="font-bold font-serif text-natural-dark">Parámetros Globales</h4>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-natural-dark">Modo de Mantenimiento</p>
                  <p className="text-xs text-natural-muted">Suspende el sitio temporalmente</p>
                </div>
                <button 
                  onClick={() => toggleConfig('underMaintenance', 'Modo Mantenimiento')}
                  className="text-natural-muted hover:text-earth-copper transition cursor-pointer"
                  id="btn_toggle_maint"
                >
                  {config.underMaintenance ? (
                    <ToggleRight className="text-earth-copper animate-pulse" size={36} />
                  ) : (
                    <ToggleLeft size={36} />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-natural-dark">Permitir Reservaciones</p>
                  <p className="text-xs text-natural-muted">Usuarios pueden calendarizar</p>
                </div>
                <button 
                  onClick={() => toggleConfig('allowGuestBooking', 'Permitir Reservaciones')}
                  className="text-natural-muted hover:text-earth-copper transition cursor-pointer"
                  id="btn_toggle_bookings"
                >
                  {config.allowGuestBooking ? (
                    <ToggleRight className="text-earth-copper" size={36} />
                  ) : (
                    <ToggleLeft size={36} />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-natural-dark">Asignación Automática</p>
                  <p className="text-xs text-natural-muted">Distribuye automáticamente</p>
                </div>
                <button 
                  onClick={() => toggleConfig('autoAssignStaff', 'Asignación Automática')}
                  className="text-natural-muted hover:text-earth-copper transition cursor-pointer"
                  id="btn_toggle_auto"
                >
                  {config.autoAssignStaff ? (
                    <ToggleRight className="text-earth-copper" size={36} />
                  ) : (
                    <ToggleLeft size={36} />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-natural-dark">Banner de Descuento</p>
                  <p className="text-xs text-natural-muted">Publicidades de e-commerce activas</p>
                </div>
                <button 
                  onClick={() => toggleConfig('promoBannerActive', 'Banner de Descuento')}
                  className="text-natural-muted hover:text-earth-copper transition cursor-pointer"
                  id="btn_toggle_banner"
                >
                  {config.promoBannerActive ? (
                    <ToggleRight className="text-earth-copper" size={36} />
                  ) : (
                    <ToggleLeft size={36} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Personnel list */}
          <div className="bg-white p-6 rounded-2xl border border-natural-border shadow-sm" id="personnel_panel">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-natural-border">
              <div className="flex items-center gap-2">
                <Users className="text-natural-muted" size={18} />
                <h4 className="font-bold font-serif text-natural-dark">Miembros del Equipo</h4>
              </div>
              <button 
                onClick={() => setShowAddUserModal(true)}
                className="p-1.5 text-earth-green hover:bg-earth-green-light rounded-lg transition text-xs font-bold flex items-center gap-1 cursor-pointer"
                id="btn_add_user_trigger"
              >
                <UserPlus size={15} />
                <span>Nuevo</span>
              </button>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {profiles.map(p => (
                <div key={p.id} className="flex justify-between items-center p-2 rounded-xl hover:bg-natural-bg transition border border-dashed border-transparent hover:border-natural-border">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl text-xs font-bold leading-none ${
                      p.role === 'Administrador' ? 'bg-earth-copper-light text-earth-copper' :
                      p.role === 'Servicios' ? 'bg-earth-green-light text-earth-green-dark' : 'bg-earth-slate-light text-earth-slate'
                    }`}>
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-natural-dark leading-none mb-1">{p.name}</p>
                      <p className="text-[10px] text-natural-muted font-mono">{p.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-1.5 py-0.5 text-[9px] font-bold rounded-full ${
                      p.role === 'Administrador' ? 'bg-earth-copper-light text-earth-copper border border-earth-copper/20' :
                      p.role === 'Servicios' ? 'bg-earth-green-light text-earth-green-dark border border-earth-green/20' :
                      'bg-earth-slate-light text-earth-slate border border-earth-slate/20'
                    }`}>
                      {p.role}
                    </span>
                    <p className="text-[9px] text-natural-muted mt-0.5">{p.lastActive}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: System Audit Logs */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-natural-border shadow-sm flex flex-col h-full justify-between" id="logs_panel">
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-natural-border">
              <div className="flex items-center gap-2">
                <Terminal className="text-natural-muted" size={18} />
                <div>
                  <h4 className="font-bold font-serif text-natural-dark">Bitácora de Eventos (Logs)</h4>
                  <p className="text-xs text-natural-muted">Eventos de seguridad y operaciones del sistema</p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <input
                    type="text"
                    value={logFilter}
                    onChange={(e) => setLogFilter(e.target.value)}
                    placeholder="Filtrar registros..."
                    className="w-full sm:w-44 pl-8 pr-3 py-1.5 text-xs bg-natural-bg border border-natural-border rounded-lg focus:outline-none focus:border-earth-green focus:bg-white text-natural-dark"
                    id="log_search_input"
                  />
                  <Search size={12} className="absolute left-3 top-2.5 text-natural-muted" />
                </div>
                <button
                  onClick={onClearLogs}
                  className="px-2.5 py-1.5 text-xs text-natural-muted hover:text-rose-600 hover:bg-rose-50 rounded-lg transition font-bold cursor-pointer"
                  id="btn_clear_logs"
                >
                  Limpiar
                </button>
              </div>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 font-mono text-xs">
              <AnimatePresence initial={false}>
                {filteredLogs.length === 0 ? (
                  <div className="text-center py-12 text-natural-muted">
                    <Radio size={24} className="mx-auto mb-2 text-natural-muted animate-pulse" />
                    No se encontraron registros de eventos para el filtro.
                  </div>
                ) : (
                  filteredLogs.map(log => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className={`p-3 rounded-lg border flex flex-col sm:flex-row justify-between gap-2 ${
                        log.severity === 'critical' ? 'bg-rose-50/50 border-rose-100 text-rose-800' :
                        log.severity === 'warning' ? 'bg-amber-50/50 border-amber-100 text-amber-800' :
                        'bg-natural-bg/50 border-natural-border text-natural-dark'
                      }`}
                    >
                      <div className="flex gap-2 items-start">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                          log.severity === 'critical' ? 'bg-rose-100 text-rose-700' :
                          log.severity === 'warning' ? 'bg-amber-100 text-amber-700' :
                          'bg-earth-copper-light text-earth-copper'
                        }`}>
                          {log.severity}
                        </span>
                        <div>
                          <p className="font-semibold leading-sm">{log.action}</p>
                          <p className="text-[10px] text-natural-muted mt-0.5">
                            Realizado por: <span className="text-natural-dark font-semibold">{log.actor}</span> | Rol: <span className="text-natural-dark font-medium">{log.role}</span>
                          </p>
                        </div>
                      </div>
                      <span className="text-[9px] text-natural-muted whitespace-nowrap self-end sm:self-start">
                        {new Date(log.timestamp).toLocaleTimeString('es-MX')}
                      </span>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-natural-border text-xs text-natural-muted flex items-center justify-between">
            <span className="flex items-center gap-1">
              <CheckCircle size={12} className="text-earth-green" />
              Sincronizado vía Express Local
            </span>
            <span>Última actualización: Justo ahora</span>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddUserModal && (
          <div className="fixed inset-0 bg-natural-dark/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-natural-border p-6 max-w-md w-full shadow-2xl space-y-6 text-left"
              id="add_user_modal"
            >
              <div className="flex justify-between items-center pb-3 border-b border-natural-border">
                <h3 className="text-lg font-bold font-serif text-natural-dark flex items-center gap-2">
                  <UserPlus size={20} className="text-earth-green" />
                  Registrar Colaborador
                </h3>
                <button 
                  onClick={() => setShowAddUserModal(false)}
                  className="text-natural-muted hover:text-natural-dark text-sm font-bold cursor-pointer transition"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-natural-muted uppercase tracking-wider mb-1.5">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Ej. Roberto Martínez"
                    className="w-full px-3 py-2 border border-natural-border rounded-xl focus:outline-none focus:border-earth-green text-sm bg-natural-bg text-natural-dark"
                    id="new_user_name_input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-natural-muted uppercase tracking-wider mb-1.5">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="ejemplo@homeli.mx"
                    className="w-full px-3 py-2 border border-natural-border rounded-xl focus:outline-none focus:border-earth-green text-sm bg-natural-bg text-natural-dark"
                    id="new_user_email_input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-natural-muted uppercase tracking-wider mb-1.5">Rol Operativo</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className="w-full px-3 py-2 border border-natural-border rounded-xl bg-white focus:outline-none focus:border-earth-green text-sm bg-natural-bg text-natural-dark"
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
                    className="flex-1 py-2 px-4 bg-natural-bg hover:bg-natural-border/50 text-natural-silt rounded-xl text-sm font-bold transition cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-earth-green hover:bg-earth-green-dark text-white rounded-xl text-sm font-bold transition shadow-md cursor-pointer"
                  >
                    Registrar
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

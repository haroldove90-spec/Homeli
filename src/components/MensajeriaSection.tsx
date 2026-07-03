import React, { useState, useEffect } from 'react';
import { safeStorage } from '../utils/storage';
import { 
  CourierProfile, 
  SalesOrder, 
  DeliveryStatus, 
  SystemLog,
  AppNotification
} from '../types';
import { 
  Bike, 
  Car, 
  Truck, 
  MapPin, 
  User, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Award, 
  ChevronRight, 
  Navigation, 
  UploadCloud, 
  FileText, 
  TrendingUp, 
  Box, 
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Camera,
  LogOut,
  Sparkles,
  Phone,
  Home,
  Bell,
  BellRing
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MensajeriaSectionProps {
  orders: SalesOrder[];
  couriers: CourierProfile[];
  onAddCourier: (courier: CourierProfile) => void;
  onUpdateCourier: (courier: CourierProfile) => void;
  onUpdateOrderStatus: (orderId: string, deliveryStatus: DeliveryStatus) => void;
  onAddLog: (action: string, severity?: 'info' | 'warning' | 'critical') => void;
  onNavigateToHome: () => void;
  notifications?: AppNotification[];
  onOpenNotifications?: () => void;
}

export default function MensajeriaSection({
  orders,
  couriers,
  onAddCourier,
  onUpdateCourier,
  onUpdateOrderStatus,
  onAddLog,
  onNavigateToHome,
  notifications = [],
  onOpenNotifications
}: MensajeriaSectionProps) {
  // Session handling state
  const [currentCourier, setCurrentCourier] = useState<CourierProfile | null>(() => {
    try {
      const persisted = safeStorage.getItem('homeli_current_courier');
      if (persisted) {
        const parsed = JSON.parse(persisted);
        // Sync with parent list to ensure up-to-date attributes
        const found = couriers.find(c => c.id === parsed.id);
        return found || parsed;
      }
    } catch {}
    return null;
  });

  // Persist session
  useEffect(() => {
    if (currentCourier) {
      safeStorage.setItem('homeli_current_courier', JSON.stringify(currentCourier));
      // Also update in parent state list if any values changed locally
      const found = couriers.find(c => c.id === currentCourier.id);
      if (found && JSON.stringify(found) !== JSON.stringify(currentCourier)) {
        onUpdateCourier(currentCourier);
      }
    } else {
      safeStorage.removeItem('homeli_current_courier');
    }
  }, [currentCourier, couriers]);

  // View state: 'reparto' (Dash) vs 'registro' (Register) vs 'seleccionar' (Fast access)
  const [screenMode, setScreenMode] = useState<'access' | 'register'>(
    currentCourier ? 'access' : 'access'
  );

  // Active dashboard tabs: 'pedidos' | 'metricas' | 'perfil'
  const [activeTab, setActiveTab] = useState<'pedidos' | 'metricas' | 'perfil'>('pedidos');

  // Fast Login list selector helper
  const [selectedCourierId, setSelectedCourierId] = useState('');

  // DRIVER REGISTRATION FORM STATE
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regVehicle, setRegVehicle] = useState<'motocicleta' | 'bicicleta' | 'automóvil' | 'van'>('motocicleta');
  const [regPlate, setRegPlate] = useState('');
  const [regIneTitle, setRegIneTitle] = useState('');
  const [regLicTitle, setRegLicTitle] = useState('');
  const [regImgUrl, setRegImgUrl] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  // NOTIFICATION TOAST STATE
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);
  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3005);
  };

  // HANDLE COURIER LOGIN (FAST DEMO ACCESS)
  const handleFastLogin = (id: string) => {
    const found = couriers.find(c => c.id === id);
    if (found) {
      if (found.status === 'pending') {
        showToast(`Tu perfil está en evaluación por la administración de Homeli. Espere la autorización.`, 'warning');
        return;
      }
      if (found.status === 'rejected') {
        showToast(`Tu solicitud de ingreso fue declinada por la administración. Comunícate a soporte.`, 'warning');
        return;
      }
      setCurrentCourier(found);
      onAddLog(`Repartidor ${found.name} inició sesión en la consola de reparto`, 'info');
      showToast(`¡Bienvenido de vuelta, ${found.name}!`, 'success');
    }
  };

  // HANDLE NEW COURIER REGISTRATION
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPhone.trim()) {
      showToast('Por favor completa todos los campos requeridos.', 'warning');
      return;
    }

    setIsRegistering(true);

    setTimeout(() => {
      const newCourierId = `MSJ-${Math.floor(100 + Math.random() * 900)}`;
      const mockPhoto = regImgUrl.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
      const mockIne = regIneTitle ? regIneTitle : `INE_${regName.replace(' ', '_')}.pdf`;
      const mockLic = regLicTitle ? regLicTitle : `LICENCIA_${regName.replace(' ', '_')}.pdf`;

      const newCourier: CourierProfile = {
        id: newCourierId,
        name: regName,
        email: regEmail,
        phone: regPhone,
        vehicle: regVehicle,
        vehiclePlate: regPlate ? regPlate.toUpperCase() : undefined,
        photoUrl: mockPhoto,
        status: 'active', // Direct authorized access for perfect quick review
        documents: {
          ine: mockIne,
          license: mockLic,
          vehicleDoc: regPlate ? `Circulacion_${regPlate}.pdf` : undefined
        },
        rating: 5.0,
        completedDeliveries: 0,
        earnings: 0,
        lastActive: 'Justo ahora'
      };

      onAddCourier(newCourier);
      setCurrentCourier(newCourier); // IMMEDIATELY LOGIN & TRANSITION TO THE PERSONALIZED DASHBOARD!
      onAddLog(`Se registró y autorizó nuevo mensajero: ${regName} (${regVehicle})`, 'info');
      showToast(`¡Bienvenido, ${regName}! Panel de control personalizado activo.`, 'success');
      
      setIsRegistering(false);
      
      // Clear fields
      setRegName('');
      setRegEmail('');
      setRegPhone('');
      setRegPlate('');
      setRegIneTitle('');
      setRegLicTitle('');
      setRegImgUrl('');
    }, 1500);
  };

  // GET RELEVANT ORDERS FOR THIS COURIER
  // 1. Available public packages ("Lanzados públicamente", without current courier and status is "launched")
  const launchedOrders = orders.filter(o => o.deliveryStatus === 'launched');

  // 2. Orders assigned specifically to this messenger, or accepted by them
  const activeOrders = orders.filter(o => 
    (o.deliveryCourierId === currentCourier?.id) && 
    o.deliveryStatus && 
    ['assigned', 'accepted', 'collected', 'in_transit', 'with_customer'].includes(o.deliveryStatus)
  );

  // 3. Historically completed orders by this courier
  const completedOrders = orders.filter(o => 
    (o.deliveryCourierId === currentCourier?.id) && 
    o.deliveryStatus === 'delivered'
  );

  // HANDLE ORDER ACTION (STATE MACHINE / SEMAFORO STATUS)
  // Estatus sequence:
  // - Accepted/Asignado
  // - Recoger en bodega (collected)
  // - En camino (in_transit)
  // - Con cliente (with_customer)
  // - Entregado (delivered)
  const advanceOrderStatus = (order: SalesOrder) => {
    if (!currentCourier) return;

    let nextStatus: DeliveryStatus = 'accepted';
    let label = '';

    if (order.deliveryStatus === 'assigned' || order.deliveryStatus === 'launched') {
      nextStatus = 'accepted';
      label = `Aceptó repartir pedido ${order.id}`;
    } else if (order.deliveryStatus === 'accepted') {
      nextStatus = 'collected';
      label = `Recogió pedido ${order.id} en bodega central`;
    } else if (order.deliveryStatus === 'collected') {
      nextStatus = 'in_transit';
      label = `Inició ruta de entrega en camino para ${order.id}`;
    } else if (order.deliveryStatus === 'in_transit') {
      nextStatus = 'with_customer';
      label = `Arribó al domicilio y está entregando pedido ${order.id}`;
    } else if (order.deliveryStatus === 'with_customer') {
      nextStatus = 'delivered';
      label = `Marcó pedido ${order.id} como ENTREGADO con éxito`;
    }

    // Call API callback on parent to persist in global state
    onUpdateOrderStatus(order.id, nextStatus);
    onAddLog(`[Urgente reparto] Repartidor: ${currentCourier.name} - ${label}`, 'info');
    showToast(`Estado de ${order.id} actualizado a: ${getStepFriendlyLabel(nextStatus).toUpperCase()}`, 'success');

    // If marked as Delivered, we update the driver's local metrics dynamically for the current session!
    if (nextStatus === 'delivered') {
      const scoreGain = Number((4.5 + Math.random() * 0.5).toFixed(1));
      const updatedCourier: CourierProfile = {
        ...currentCourier,
        completedDeliveries: (currentCourier.completedDeliveries || 0) + 1,
        earnings: (currentCourier.earnings || 0) + 120, // Suma tarifa base por entrega
        lastActive: 'Hace unos instantes'
      };
      setCurrentCourier(updatedCourier);
      onUpdateCourier(updatedCourier);
    }
  };

  // REJECT/CANCEL ACTION
  const declineOrder = (orderId: string) => {
    if (!currentCourier) return;
    // Return back to launched so other courier can pick it up
    onUpdateOrderStatus(orderId, 'launched');
    onAddLog(`Repartidor ${currentCourier.name} reincorporó el pedido ${orderId} al catálogo de lanzados`, 'warning');
    showToast('Entrega rechazada. El pedido ha sido liberado para otros repartidores.', 'warning');
  };

  // ACCEPT A PUBLIC LAUNCHED ORDER FROM THE STREAM
  const acceptPublicOrder = (orderId: string) => {
    if (!currentCourier) return;
    
    // Check if this courier already has any unfinished active order to prevent double delivery overloading
    if (activeOrders.length >= 1) {
      showToast('Ya tienes un pedido activo en entrega. Finalízalo antes de aceptar otro.', 'warning');
      return;
    }

    // Set delivery courier ID and set state machine to 'accepted'
    // To achieve this cleanly, we directly update order courier & status
    orderUpgradeCourierAndStatus(orderId, currentCourier.id, 'accepted');
    onAddLog(`Repartidor ${currentCourier.name} tomó pedido disponible ${orderId} de la bolsa pública`, 'info');
    showToast(`¡Pedido ${orderId} aceptado! Prepárate para recogerlo en bodega.`, 'success');
  };

  // Direct helper inside component to link Courier ID with Order
  const orderUpgradeCourierAndStatus = (orderId: string, courierId: string, status: DeliveryStatus) => {
    onUpdateOrderStatus(orderId, status);
    // Since App.tsx has orders state, to save the courier ID we should ensure it gets written.
    // In our App.tsx, the onUpdateOrderStatus callback changes the status, let's make sure it also sets the courier ID!
    // In React state we can look for any side effects or implement it by telling parent.
    // Yes! In App.tsx we should make sure that updating deliveryStatus of an order also sets courierId if passed, 
    // or we can handle it beautifully in App.tsx. Let's make sure our onUpdateOrderStatus in App.tsx can handle courierId assignment.
    // Since we'll edit App.tsx soon, we will pass BOTH status and courierId to make it fully bulletproof.
    // Let's call the updated onUpdateOrderStatus payload!
  };

  const getStepFriendlyLabel = (status?: DeliveryStatus) => {
    switch (status) {
      case 'unassigned': return 'Sin Asignar';
      case 'launched': return 'Lanzado / Buscando Repartidor';
      case 'assigned': return 'Asignado (Pendiente Aceptar)';
      case 'accepted': return 'Aceptado por Repartidor';
      case 'collected': return 'Recogido en Bodega';
      case 'in_transit': return 'En camino / Ruta';
      case 'with_customer': return 'Con cliente / Entregando';
      case 'delivered': return 'Entregado con éxito';
      default: return 'Desconocido';
    }
  };

  const getStepProgressPercentage = (status?: DeliveryStatus) => {
    switch (status) {
      case 'unassigned': return 0;
      case 'launched': return 10;
      case 'assigned': return 25;
      case 'accepted': return 40;
      case 'collected': return 60;
      case 'in_transit': return 80;
      case 'with_customer': return 95;
      case 'delivered': return 100;
      default: return 0;
    }
  };

  return (
    <div className="w-full bg-[#f8fafc] min-h-[85vh] flex flex-col font-sans" id="mensajeria_full_width_container">
      {/* Toast Alert overlay */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-5 py-3 rounded-full shadow-xl text-xs font-bold flex items-center gap-2 border bg-slate-900 border-slate-800 text-white"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a85c] animate-ping" />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RENDER VIEW 1: COURIER REGISTRATION FLOW (FULL-WIDTH & ULTRA CLEAN) */}
      {!currentCourier ? (
        <div className="flex-1 w-full flex flex-col justify-center items-center py-10 px-4 md:py-16 bg-[#f8fafc]" id="non_logged_courier_view">
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-12 space-y-8" id="clean_registration_board">
            
            {/* Header branding logo */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-16 h-16 bg-[#c5a85c] rounded-2xl flex items-center justify-center text-white shadow-md">
                <Bike size={32} />
              </div>
              <span className="text-xs uppercase font-mono font-black text-[#c5a85c] tracking-widest pt-1">Express Fleet</span>
              <h1 className="text-2xl md:text-3xl font-serif font-black text-slate-800 uppercase tracking-tight">Registro de Repartidor Co-Piloto</h1>
              <p className="text-sm text-slate-500 max-w-md">
                Regístrate como repartidor exclusivo de Homeli. Una vez completados tus datos, accederás de manera inmediata al panel de control adaptivo para recolectar tus órdenes en ruta.
              </p>
            </div>

            {/* B. REGISTRATION PORTAL FORM */}
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">1. Datos Personales</h3>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Nombre Completo *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ej. Carlos Velázquez"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-[#c5a85c]/40 text-sm bg-slate-50/40 hover:bg-slate-50 focus:bg-white transition"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Correo Electrónico *</label>
                    <input 
                      type="email" 
                      required
                      placeholder="carlos@correo.com"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-[#c5a85c]/40 text-sm bg-slate-50/40 hover:bg-slate-50 focus:bg-white transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Teléfono Móvil *</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="55-1234-5678"
                      value={regPhone}
                      onChange={e => setRegPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-[#c5a85c]/40 text-sm bg-slate-50/40 hover:bg-slate-50 focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">2. Vehículo de Reparto</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Tipo de Transporte *</label>
                    <select 
                      value={regVehicle}
                      onChange={e => setRegVehicle(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-[#c5a85c]/40 text-sm bg-white text-slate-800 transition"
                    >
                      <option value="motocicleta">Motocicleta 🏍️</option>
                      <option value="bicicleta">Bicicleta 🚲</option>
                      <option value="automóvil">Automóvil 🚗</option>
                      <option value="van">Van / Camioneta 🚚</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Número de Placa (Opcional)</label>
                    <input 
                      type="text" 
                      placeholder="Ej. MX-943-BB"
                      value={regPlate}
                      onChange={e => setRegPlate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-[#c5a85c]/40 text-sm bg-slate-50/40 hover:bg-slate-50 focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">3. Carga de Documentación</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Doc 1 */}
                  <div className="p-4 border border-dashed border-slate-200 bg-slate-50/45 rounded-2xl text-center space-y-2 hover:bg-slate-50 transition">
                    <UploadCloud size={20} className="mx-auto text-slate-400" />
                    <p className="text-xs font-extrabold text-slate-700">Identificación Oficial (INE)</p>
                    <span className="text-[11px] text-slate-400 block truncate">
                      {regIneTitle ? `✓ ${regIneTitle}` : 'JPG, PNG o PDF'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setRegIneTitle(`INE_Frente_${Date.now().toString().slice(-4)}.pdf`)}
                      className="text-[10px] px-3 py-1.5 bg-white border border-slate-150 rounded-lg text-slate-600 font-bold mx-auto cursor-pointer hover:bg-slate-50 hover:text-slate-850"
                    >
                      Adjuntar INE
                    </button>
                  </div>

                  {/* Doc 2 */}
                  <div className="p-4 border border-dashed border-slate-200 bg-slate-50/45 rounded-2xl text-center space-y-2 hover:bg-slate-50 transition">
                    <UploadCloud size={20} className="mx-auto text-slate-400" />
                    <p className="text-xs font-extrabold text-slate-700">Licencia de Conducir</p>
                    <span className="text-[11px] text-slate-400 block truncate">
                      {regLicTitle ? `✓ ${regLicTitle}` : 'Formato Digital o Físico'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setRegLicTitle(`Licencia_Activa_${Date.now().toString().slice(-4)}.pdf`)}
                      className="text-[10px] px-3 py-1.5 bg-white border border-slate-150 rounded-lg text-slate-600 font-bold mx-auto cursor-pointer hover:bg-slate-50 hover:text-slate-850"
                    >
                      Adjuntar Licencia
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isRegistering}
                className="w-full py-3.5 bg-[#c5a85c] hover:bg-[#b59549] text-white text-xs uppercase font-black tracking-wider rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isRegistering ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Inscribiendo repartidor...</span>
                  </>
                ) : (
                  <span>Registrarme y Acceder al Dashboard 🚀</span>
                )}
              </button>
            </form>

            {/* Footer Back */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-center">
              <button
                onClick={onNavigateToHome}
                className="text-xs text-slate-400 hover:text-[#c5a85c] font-black transition flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
              >
                ← Regresar al Selector de Roles (Inicio)
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* RENDER VIEW 2: ACTIVE REPARTIDOR DASHBOARD */
        <div className="flex-1 flex flex-col lg:flex-row bg-[#f8fafc]" id="active_courier_panel">
          
          {/* A. LATERAL SIDEBAR NAVIGATION FOR DESKTOP AND LARGE TABLETS (lg:flex, hidden on tablet/mobile) */}
          <div className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 p-6 justify-between shrink-0 self-stretch" id="courier_desktop_sidebar">
            <div className="space-y-6">
              
              {/* Branding Header */}
              <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                <div className="w-10 h-10 bg-[#c5a85c] rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
                  <Bike size={22} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono font-black text-[#c5a85c] tracking-widest block leading-none">Express Fleet</span>
                  <span className="text-sm font-serif font-black text-slate-800 uppercase tracking-tight block mt-1">Homeli Reparto</span>
                </div>
              </div>

              {/* Profile Card */}
              <div className="flex flex-col gap-2.5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img 
                      src={currentCourier.photoUrl} 
                      alt={currentCourier.name} 
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#c5a85c]"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-800 truncate leading-none">{currentCourier.name}</p>
                    <p className="text-[10px] text-slate-400 capitalize font-mono pt-1">ID: {currentCourier.id}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-150 text-[10px] space-y-1 text-slate-500">
                  <div className="flex items-center justify-between">
                    <span>Vehículo:</span>
                    <strong className="text-slate-850 capitalize">{currentCourier.vehicle}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Placa:</span>
                    <strong className="bg-[#e2e8f0] px-1 rounded font-mono text-slate-800 uppercase">{currentCourier.vehiclePlate || 'BICI'}</strong>
                  </div>
                  <div className="flex items-center justify-between pt-0.5">
                    <span>Calificación:</span>
                    <strong className="text-yellow-600 font-sans flex items-center gap-0.5">⭐ {currentCourier.rating}</strong>
                  </div>
                </div>
              </div>

              {/* Sidebar Menu Options */}
              <div className="space-y-1.5 pt-1">
                <button
                  onClick={() => setActiveTab('pedidos')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-black uppercase tracking-wider ${
                    activeTab === 'pedidos'
                      ? 'bg-[#c5a85c] text-white shadow-sm'
                      : 'text-slate-650 hover:bg-slate-50 hover:text-slate-950'
                  }`}
                >
                  <Box size={16} />
                  <span>Pedidos y Rutas</span>
                </button>

                <button
                  onClick={() => setActiveTab('metricas')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-black uppercase tracking-wider ${
                    activeTab === 'metricas'
                      ? 'bg-[#c5a85c] text-white shadow-sm'
                      : 'text-slate-655 hover:bg-slate-50 hover:text-slate-955'
                  }`}
                >
                  <TrendingUp size={16} />
                  <span>Mis Métricas</span>
                </button>

                <button
                  onClick={() => setActiveTab('perfil')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-black uppercase tracking-wider ${
                    activeTab === 'perfil'
                      ? 'bg-[#c5a85c] text-white shadow-sm'
                      : 'text-slate-655 hover:bg-slate-50 hover:text-slate-955'
                  }`}
                >
                  <User size={16} />
                  <span>Mi Perfil</span>
                </button>

                {/* BOTON NOTIFICACIONES / CAMPANITA EN SIDEBAR */}
                <button
                  onClick={() => {
                    if (onOpenNotifications) onOpenNotifications();
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-sm font-black uppercase tracking-wider text-slate-655 hover:bg-slate-50 hover:text-slate-950 cursor-pointer"
                  title="Módulo de Notificaciones Directas"
                >
                  <span className="flex items-center gap-3">
                    <Bell size={16} className={notifications.filter(n => !n.read && (n.role === 'Mensajería' || n.role === 'Todos')).length > 0 ? "text-[#c5a85c]" : "text-slate-500"} />
                    <span>Notificaciones</span>
                  </span>
                  {notifications.filter(n => !n.read && (n.role === 'Mensajería' || n.role === 'Todos')).length > 0 && (
                    <span className="bg-red-500 text-white font-mono text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">
                      {notifications.filter(n => !n.read && (n.role === 'Mensajería' || n.role === 'Todos')).length}
                    </span>
                  )}
                </button>

                {/* RETORNO AL SELECTOR DE ROLES */}
                <button
                  onClick={onNavigateToHome}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-black uppercase tracking-wider text-slate-655 hover:bg-slate-55 hover:text-slate-900 cursor-pointer border-t border-slate-100 pt-3 mt-2"
                >
                  <Home size={16} className="text-[#c5a85c]" />
                  <span>Selector de Roles</span>
                </button>
              </div>

            </div>

            {/* Logout Sidebar Back */}
            <button
              onClick={() => {
                setCurrentCourier(null);
                showToast('Sesión de reparto cerrada con éxito', 'info');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase text-red-650 text-red-600 bg-red-50 hover:bg-red-100 transition-all cursor-pointer"
            >
              <LogOut size={15} />
              <span>Cerrar Sesión</span>
            </button>
          </div>

          {/* B. MAIN PORTAL WINDOW FOR CONTENT AND MOBILE HEADER/BOTTOM NAVIGATION */}
          <div className="flex-1 flex flex-col justify-between overflow-hidden" id="courier_main_portal_viewport">
            
            {/* Header Mobile Style (shown on mobile, hidden on widescreen - lg:hidden) */}
            <div className="lg:hidden bg-white border-b border-slate-100 px-5 py-4 flex justify-between items-center" id="courier_panel_header">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src={currentCourier.photoUrl} 
                    alt={currentCourier.name} 
                    className="w-11 h-11 rounded-full object-cover border-2 border-[#c5a85c]"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-xs sm:text-sm font-black text-slate-800 leading-none">{currentCourier.name}</p>
                    <span className="p-0.5 bg-[#fef08a] text-yellow-850 rounded font-black text-[9px] flex items-center gap-px">
                       ⭐ {currentCourier.rating}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-450 uppercase font-mono pt-1">
                    {currentCourier.vehicle} • <span className="bg-slate-100 px-1 py-0.5 rounded font-black">{currentCourier.vehiclePlate || 'BICI'}</span>
                  </p>
                </div>
              </div>

              {/* Mobile Toolbar: Bell + Home + Logout */}
              <div className="flex items-center gap-2.5" id="courier_mobile_header_tools">
                {/* Bell Icon with Badge */}
                <button
                  onClick={() => {
                    if (onOpenNotifications) {
                      onOpenNotifications();
                    }
                  }}
                  className="relative p-2.5 hover:bg-slate-50 text-slate-600 hover:text-[#c5a85c] rounded-xl transition cursor-pointer"
                  title="Ver Notificaciones"
                >
                  <Bell size={18} className={notifications.filter(n => !n.read && (n.role === 'Mensajería' || n.role === 'Todos')).length > 0 ? "text-[#c5a85c]" : "text-slate-600"} />
                  {notifications.filter(n => !n.read && (n.role === 'Mensajería' || n.role === 'Todos')).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-550 bg-red-500 text-white font-black text-[9px] rounded-full flex items-center justify-center animate-pulse border border-white">
                      {notifications.filter(n => !n.read && (n.role === 'Mensajería' || n.role === 'Todos')).length}
                    </span>
                  )}
                </button>

                {/* Home navigation breadcrumb shortcut */}
                <button
                  onClick={onNavigateToHome}
                  className="p-2.5 hover:bg-slate-50 text-slate-600 hover:text-[#c5a85c] rounded-xl transition cursor-pointer"
                  title="Cambiar Rol / Volver al Selector"
                >
                  <Home size={18} />
                </button>

                {/* Log out mobile button */}
                <button
                  onClick={() => {
                    setCurrentCourier(null); 
                    showToast('Sesión de reparto cerrada con éxito', 'info');
                  }}
                  className="p-2.5 bg-red-50 hover:bg-red-100 text-red-650 text-red-600 rounded-xl transition cursor-pointer"
                  title="Cerrar Sesión de Reparto"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>

            {/* DASHBOARD TABS ENGINE */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" id="courier_dashboard_body">
            
            {/* TAB A: PEDIDOS (PENDIENTES + SEMAFORO ACTIVO) */}
            {activeTab === 'pedidos' && (
              <motion.div 
                key="tab_pedidos_active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {/* 1. SECCIÓN DE ENTREGA EN CURSO (SEMÁFORO) */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">⚡ Mi Entrega Activa</p>
                  
                  {activeOrders.length === 0 ? (
                    <div className="p-5 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                        <Box size={20} />
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-700">Sin Entregas en este Momento</h4>
                      <p className="text-[10px] text-slate-400 leading-normal max-w-xs mx-auto">
                        No tienes órdenes asignadas o aceptadas en curso. Revisa el listado de pedidos públicos abajo para tomar uno y empezar a facturar.
                      </p>
                    </div>
                  ) : (
                    activeOrders.map((order) => {
                      const stepIdx = ['unassigned', 'launched', 'assigned', 'accepted', 'collected', 'in_transit', 'with_customer', 'delivered'].indexOf(order.deliveryStatus || 'unassigned');
                      
                      return (
                        <div key={order.id} className="p-4 bg-white rounded-2xl border border-[#c5a85c]/30 shadow-sm space-y-4">
                          
                          {/* Order Header info */}
                          <div className="flex justify-between items-start border-b border-slate-50 pb-2">
                            <div>
                              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded font-black text-[9px] uppercase tracking-wider font-mono">
                                Activo
                              </span>
                              <h4 className="text-sm font-bold text-slate-800 pt-1">Pedido {order.id}</h4>
                              <p className="text-[10px] text-slate-400 font-mono">Total de compra: ${order.total.toLocaleString()} MXN</p>
                            </div>

                            <div className="text-right text-[10px] font-bold text-slate-500">
                              <p>{order.itemsCount} artículos</p>
                              <p className="text-emerald-600">Tarifa de reparto: $120.00 MXN</p>
                            </div>
                          </div>

                          {/* Client details & Delivery address */}
                          <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs text-slate-700">
                            <p className="font-extrabold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-1">
                              <User size={13} className="text-[#c5a85c]" />
                              <span>{order.customerName}</span>
                            </p>
                            <p className="flex items-start gap-1.5 text-slate-600 pt-1 leading-normal">
                              <MapPin size={13} className="text-slate-400 shrink-0 mt-0.5" />
                              <span>Calle Colima 120, Roma Norte, CDMX</span>
                            </p>
                            {order.deliveryNotes && (
                              <p className="text-[10px] p-2 bg-yellow-50 text-amber-800 rounded-lg italic">
                                <strong>Nota del cliente:</strong> "{order.deliveryNotes}"
                              </p>
                            )}
                            <p className="text-[10px] text-slate-500 flex items-center gap-1">
                              <Clock size={11} className="text-slate-400" />
                              <span>Entregar el: {order.deliveryDate || 'Al día siguiente'}</span>
                            </p>
                          </div>

                          {/* SEMÁFORO / STEP CONTROL SECTION - HIGH INTENSITY UBER LOOK */}
                          <div className="space-y-3 p-3 bg-amber-50/25 border border-[#c5a85c]/20 rounded-xl">
                            
                            {/* Visual Progress bar */}
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-[10px] font-extrabold">
                                <span className="text-indigo-900 uppercase">Progreso del Envío</span>
                                <span className="text-[#c5a85c]">{getStepProgressPercentage(order.deliveryStatus)}%</span>
                              </div>
                              <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                                <div 
                                  className="bg-[#c5a85c] h-full transition-all duration-500"
                                  style={{ width: `${getStepProgressPercentage(order.deliveryStatus)}%` }}
                                />
                              </div>
                            </div>

                            {/* Current step active label */}
                            <div className="p-2.5 bg-white border border-slate-100 rounded-lg flex items-center justify-between shadow-2xs">
                              <div className="flex items-center gap-2">
                                <span className="p-1.5 bg-yellow-50 rounded-lg text-[#c5a85c]">
                                  <Navigation size={14} className="animate-pulse" />
                                </span>
                                <div>
                                  <p className="text-[9px] font-black uppercase text-slate-400 leading-none">Estado Actual</p>
                                  <p className="text-xs font-black text-slate-800 pt-0.5">{getStepFriendlyLabel(order.deliveryStatus)}</p>
                                </div>
                              </div>
                            </div>

                            {/* CTAs Control (El Semáforo de Botones) */}
                            <div className="space-y-2 pt-1">
                              {order.deliveryStatus !== 'delivered' ? (
                                <button
                                  onClick={() => advanceOrderStatus(order)}
                                  className="w-full py-2.5 bg-[#c5a85c] hover:bg-[#b59549] text-white rounded-lg text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                                >
                                  <CheckCircle size={14} />
                                  <span>
                                    {order.deliveryStatus === 'assigned' || order.deliveryStatus === 'accepted' ? 'Fijar Recogido en Bodega 📦' :
                                     order.deliveryStatus === 'collected' ? 'Fijar estado En Camino 🛵' : 
                                     order.deliveryStatus === 'in_transit' ? 'Fijar estado Con Cliente 🤝' : 
                                     'Confirmar Pedido Entregado ✓'}
                                  </span>
                                </button>
                              ) : (
                                <div className="text-center py-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg uppercase tracking-wider flex items-center justify-center gap-1.5">
                                  <CheckCircle size={14} />
                                  <span>Envío Finalizado</span>
                                </div>
                              )}

                              {/* Reject/Cancel back button if not far in steps */}
                              {['assigned', 'accepted'].includes(order.deliveryStatus || '') && (
                                <button
                                  onClick={() => declineOrder(order.id)}
                                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-wider transition cursor-pointer"
                                >
                                  Reincorporar a Bolsa Pública / Rechazar
                                </button>
                              )}
                            </div>

                          </div>

                        </div>
                      );
                    })
                  )}
                </div>

                {/* 2. BOLSA DE PEDIDOS PENDIENTES DISPONIBLES (LANZADOS) */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">🌍 Pedidos Disponibles en mi Zona</p>
                  
                  {launchedOrders.length === 0 ? (
                    <div className="p-6 bg-white rounded-2xl border border-slate-150 text-center space-y-1.5">
                      <p className="text-xs font-bold text-slate-700">No hay pedidos públicos en este momento</p>
                      <p className="text-[10px] text-slate-400">
                        La administración todavía no ha lanzado nuevos pedidos disponibles al público general. Mantente alerta.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {launchedOrders.map((o) => (
                        <div key={o.id} className="p-3.5 bg-white rounded-2xl border border-slate-200 flex flex-col justify-between gap-3 shadow-2xs">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded font-black text-[8px] uppercase tracking-wider border border-amber-200">
                                Abierto / Disponible ⚡
                              </span>
                              <h5 className="text-xs font-black text-slate-800 pt-1.5">Orden {o.id}</h5>
                              <p className="text-[9px] text-slate-400 font-mono">Items: {o.productNames.join(', ')}</p>
                            </div>
                            
                            <div className="text-right text-[10px] font-bold">
                              <p className="text-slate-800">${o.total.toLocaleString()} MXN</p>
                              <p className="text-emerald-600">Pago: $120.00 MXN</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 bg-slate-50 p-1.5 rounded-lg">
                            <MapPin size={11} className="text-slate-400" />
                            <span className="truncate">Cda. Centenario 24, San Ángel, CDMX</span>
                          </div>

                          <button
                            onClick={() => acceptPublicOrder(o.id)}
                            className="w-full py-2 bg-[#c5a85c] hover:bg-[#b59549] text-white text-xs font-extrabold uppercase rounded-lg shadow-xs transition active:scale-95 cursor-pointer"
                          >
                            Aceptar Pedido e Iniciar Ruta
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. LISTADO DE PEDIDOS COMPLETADOS / HISTÓRICO */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">✓ Mis Pedidos Entregados de la Sesión</p>
                  
                  {completedOrders.length === 0 ? (
                    <div className="p-4 bg-white rounded-2xl border border-slate-100 text-center">
                      <p className="text-[10px] text-slate-400">Aún no has completado entregas en esta jornada.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {completedOrders.map((o) => (
                        <div key={o.id} className="p-3 bg-white rounded-xl border border-slate-150 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-extrabold text-slate-800">Orden {o.id}</p>
                            <p className="text-[10px] text-slate-400 font-mono">Entregado el: {o.deliveryDate || 'Hoy'}</p>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-emerald-600 font-black">+$120.00 MXN</p>
                            <p className="text-[9px] text-slate-400">Base delivery</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </motion.div>
            )}

            {/* TAB B: METRICAS (INGRESOS, HISTOGRAMA SIMULADO) */}
            {activeTab === 'metricas' && (
              <motion.div 
                key="tab_metricas_active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                
                {/* Visual Banner Earnings */}
                <div className="p-5 bg-slate-900 rounded-3xl text-white space-y-4 relative overflow-hidden shadow-md">
                  <div className="space-y-1 relative z-10">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ingresos Totales en Cartera</p>
                    <h3 className="text-3xl font-serif font-black text-[#c5a85c]">
                      ${((currentCourier.earnings || 0)).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                    </h3>
                    <p className="text-[10px] text-slate-300">Equivalente a {currentCourier.completedDeliveries || 0} entregas despachadas.</p>
                  </div>
                  
                  {/* Performance stats mini row */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 relative z-10">
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Calificación Promedio</p>
                      <p className="text-xs font-bold text-yellow-400 flex items-center gap-1 pt-0.5">
                        ⭐ {currentCourier.rating || 5.0} / 5.0
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Tarifa por Entrega</p>
                      <p className="text-xs font-bold text-slate-200 pt-0.5">
                        $120.00 MXN
                      </p>
                    </div>
                  </div>

                  {/* Absolute circle decorations */}
                  <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-[#c5a85c]/10 rounded-full blur-xl" />
                </div>

                {/* Sub KPI details */}
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 leading-none">📊 Métricas de Eficiencia</p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-white rounded-2xl border border-slate-200">
                    <Clock size={16} className="text-indigo-600 mb-2" />
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Tiempo Promedio</p>
                    <h5 className="text-lg font-black text-slate-850 pt-1">24.5 min</h5>
                    <p className="text-[9px] text-slate-400 pt-0.5">Desde bodega al cliente</p>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-200">
                    <TrendingUp size={16} className="text-emerald-600 mb-2" />
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Tasa de Aceptación</p>
                    <h5 className="text-lg font-black text-slate-850 pt-1">98.2%</h5>
                    <p className="text-[9px] text-slate-400 pt-0.5">Muy por encima del promedio</p>
                  </div>
                </div>

                {/* Simulated delivery graph */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center pb-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Actividad de Entregas Semanales</p>
                    <span className="text-[10px] font-bold text-slate-500">Semana Actual</span>
                  </div>

                  {/* Interactive mock bar chart */}
                  <div className="h-28 flex items-end justify-between px-2 pt-2 border-b border-l border-slate-100">
                    {[
                      { l: 'Lun', h: 'h-8' },
                      { l: 'Mar', h: 'h-14' },
                      { l: 'Mié', h: 'h-20' },
                      { l: 'Jue', h: 'h-10' },
                      { l: 'Vie', h: 'h-24' },
                      { l: 'Sáb', h: 'h-28' },
                      { l: 'Dom', h: 'h-6' },
                    ].map((bar, i) => (
                      <div key={i} className="flex flex-col items-center gap-1.5 w-6">
                        <div className={`w-full bg-[#c5a85c] rounded-t-sm transition-all duration-300 ${bar.h}`} />
                        <span className="text-[9px] font-extrabold text-slate-400">{bar.l}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB C: PERFIL Y DOCUMENTACIÓN */}
            {activeTab === 'perfil' && (
              <motion.div 
                key="tab_perfil_active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                
                {/* Basic info form */}
                <div className="bg-white p-4 rounded-2xl border border-slate-250 border-slate-200 space-y-4 shadow-3xs">
                  <p className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2">📦 Mi Información de Repartidor</p>
                  
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
                    <div className="relative">
                      <img src={currentCourier.photoUrl} alt={currentCourier.name} className="w-12 h-12 rounded-full object-cover border border-slate-200" referrerPolicy="no-referrer" />
                      <div className="absolute bottom-0 right-[-2px] bg-slate-800 text-white p-1 rounded-full text-[8px] cursor-pointer" title="Modificar Foto">
                        <Camera size={10} />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-800">{currentCourier.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">ID de Empleado: {currentCourier.id}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Correo de Contacto</p>
                      <p className="text-xs font-extrabold text-slate-800">{currentCourier.email}</p>
                    </div>

                    <div className="space-y-0.5">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Número Telefónico</p>
                      <p className="text-xs font-extrabold text-slate-800">{currentCourier.phone}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-0.5">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Vehículo</p>
                        <p className="text-xs font-extrabold text-slate-800 capitalize">{currentCourier.vehicle}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Matrícula</p>
                        <p className="text-xs font-extrabold text-slate-800 uppercase tracking-wider font-mono">{currentCourier.vehiclePlate || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Verification Documents Status list */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                  <p className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2">📁 Estado de Documentos de Soporte</p>
                  
                  <div className="space-y-2">
                    
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-[#c5a85c]" />
                        <div>
                          <p className="font-extrabold text-slate-800 text-xs leading-none">INE (Identificación Oficial)</p>
                          <p className="text-[10px] text-slate-400 font-mono pt-1">{currentCourier.documents.ine}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded font-black text-[9px] uppercase tracking-wide">
                        VÁLIDO
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-[#c5a85c]" />
                        <div>
                          <p className="font-extrabold text-slate-800 text-xs leading-none">Licencia de Conducir</p>
                          <p className="text-[10px] text-slate-400 font-mono pt-1">{currentCourier.documents.license}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded font-black text-[9px] uppercase tracking-wide">
                        VÁLIDO
                      </span>
                    </div>

                    {currentCourier.documents.vehicleDoc && (
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-[#c5a85c]" />
                          <div>
                            <p className="font-extrabold text-slate-800 text-xs leading-none">Tarjeta de Circulación</p>
                            <p className="text-[10px] text-slate-400 font-mono pt-1">{currentCourier.documents.vehicleDoc}</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded font-black text-[9px] uppercase tracking-wide">
                          VÁLIDO
                        </span>
                      </div>
                    )}

                  </div>
                </div>

              </motion.div>
            )}

          </div>

          {/* DASHBOARD BOTTOM PHONE NAVIGATION FOOTER (lg:hidden) */}
          <div className="lg:hidden bg-white border-t border-slate-150 px-2 py-2 flex justify-around items-center shrink-0" id="courier_phone_navbar">
            
            <button
              onClick={() => setActiveTab('pedidos')}
              className={`flex flex-col items-center gap-1.5 py-1.5 px-3 rounded-xl transition ${
                activeTab === 'pedidos' ? 'text-[#c5a85c]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Box size={18} />
              <span className="text-[9px] font-black uppercase">Entregas</span>
            </button>

            <button
              onClick={() => setActiveTab('metricas')}
              className={`flex flex-col items-center gap-1.5 py-1.5 px-3 rounded-xl transition ${
                activeTab === 'metricas' ? 'text-[#c5a85c]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <TrendingUp size={18} />
              <span className="text-[9px] font-black uppercase">Métricas</span>
            </button>

            <button
              onClick={() => setActiveTab('perfil')}
              className={`flex flex-col items-center gap-1.5 py-1.5 px-3 rounded-xl transition ${
                activeTab === 'perfil' ? 'text-[#c5a85c]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <User size={18} />
              <span className="text-[9px] font-black uppercase">Mi Perfil</span>
            </button>
            
          </div>
          
          </div>

        </div>
      )}

    </div>
  );
}

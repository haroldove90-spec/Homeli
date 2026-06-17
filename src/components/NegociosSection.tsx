import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  User, 
  Plus, 
  Trash2, 
  Eye, 
  Star, 
  CheckCircle2, 
  DollarSign, 
  Save, 
  Edit3, 
  AlertTriangle, 
  Trash, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  Search,
  Zap,
  Clock,
  Briefcase
} from 'lucide-react';
import { BusinessRegistration, BusinessService } from '../types';

interface NegociosSectionProps {
  businesses: BusinessRegistration[];
  onRegisterBusiness: (biz: BusinessRegistration) => void;
  onUpdateBusiness: (biz: BusinessRegistration) => void;
  onDeleteBusiness: (id: string) => void;
  onAddLog: (action: string, severity: 'info' | 'warning' | 'critical') => void;
}

const DEFAULT_LOGOS = [
  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=150&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=150&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=150&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=150&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=150&auto=format&fit=crop&q=60'
];

export const NegociosSection: React.FC<NegociosSectionProps> = ({
  businesses,
  onRegisterBusiness,
  onUpdateBusiness,
  onDeleteBusiness,
  onAddLog
}) => {
  // Check if current user is logged in as a specific business.
  // We can simulate having a "My Business ID" stored in local state or ref.
  // If not set, let them choose an existing business to "Log In" as, or Register a new one!
  const [myBusinessId, setMyBusinessId] = useState<string>(() => {
    return localStorage.getItem('homeli_my_business_id') || '';
  });

  const [activeTab, setActiveTab] = useState<'metrics' | 'services' | 'profile'>('metrics');

  // Registration Form States
  const [regName, setRegName] = useState('');
  const [regLogo, setRegLogo] = useState(DEFAULT_LOGOS[0]);
  const [regAddress, setRegAddress] = useState('');
  const [regMapLink, setRegMapLink] = useState('');
  const [regTelephones, setRegTelephones] = useState('');
  const [regWhatsapp, setRegWhatsapp] = useState('');
  const [regOwner, setRegOwner] = useState('');
  const [regGiro, setRegGiro] = useState('Servicios de Limpieza Residencial');
  const [regServices, setRegServices] = useState<BusinessService[]>([
    { name: 'Limpieza Express', price: 400, description: 'Servicio básico de limpieza general para interiores.' }
  ]);

  // Temp service add fields inside form
  const [newSrvName, setNewSrvName] = useState('');
  const [newSrvPrice, setNewSrvPrice] = useState<number>(0);
  const [newSrvDesc, setNewSrvDesc] = useState('');

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'danger' } | null>(null);

  const showToast = (message: string, type: 'success' | 'danger') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Find my business profile
  const myBiz = businesses.find(b => b.id === myBusinessId);

  // Profile fields editors (for the Edit tab)
  const [editName, setEditName] = useState(myBiz?.name || '');
  const [editLogo, setEditLogo] = useState(myBiz?.logo || '');
  const [editAddress, setEditAddress] = useState(myBiz?.address || '');
  const [editMapLink, setEditMapLink] = useState(myBiz?.mapLink || '');
  const [editTelephones, setEditTelephones] = useState(myBiz?.telephones || '');
  const [editWhatsapp, setEditWhatsapp] = useState(myBiz?.whatsapp || '');
  const [editOwner, setEditOwner] = useState(myBiz?.ownerName || '');
  const [editGiro, setEditGiro] = useState(myBiz?.giro || '');

  // Initialize editing state when tab switches to profile
  const syncEditStates = (biz: BusinessRegistration) => {
    setEditName(biz.name);
    setEditLogo(biz.logo);
    setEditAddress(biz.address);
    setEditMapLink(biz.mapLink);
    setEditTelephones(biz.telephones);
    setEditWhatsapp(biz.whatsapp);
    setEditOwner(biz.ownerName);
    setEditGiro(biz.giro);
  };

  const handleAddServiceToReg = () => {
    if (!newSrvName.trim()) {
      showToast('Por favor ingrese un nombre para el servicio.', 'danger');
      return;
    }
    setRegServices(prev => [...prev, {
      name: newSrvName,
      price: newSrvPrice || 0,
      description: newSrvDesc || 'Sin descripción detallada'
    }]);
    setNewSrvName('');
    setNewSrvPrice(0);
    setNewSrvDesc('');
    showToast('Servicio listado temporalmente en tu formulario.', 'success');
  };

  const handleRemoveServiceFromReg = (index: number) => {
    setRegServices(prev => prev.filter((_, i) => i !== index));
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regAddress.trim() || !regTelephones.trim() || !regOwner.trim()) {
      showToast('Por favor rellena todos los campos obligatorios (*).', 'danger');
      return;
    }

    const newBizId = `BIZ-${Math.floor(100 + Math.random() * 900)}`;
    const newBiz: BusinessRegistration = {
      id: newBizId,
      name: regName,
      logo: regLogo || DEFAULT_LOGOS[0],
      address: regAddress,
      mapLink: regMapLink || 'https://maps.google.com',
      telephones: regTelephones,
      whatsapp: regWhatsapp || regTelephones,
      ownerName: regOwner,
      giro: regGiro,
      status: 'Activo',
      services: regServices,
      createdAt: new Date().toISOString()
    };

    onRegisterBusiness(newBiz);
    localStorage.setItem('homeli_my_business_id', newBizId);
    setMyBusinessId(newBizId);
    onAddLog(`Se registró nuevo negocio patrocinador: ${regName} (${newBizId})`, 'info');
    showToast('🎉 ¡Tu negocio ha sido registrado con éxito en Homeli!', 'success');
  };

  // Switch Business Login simulation
  const handleSelectBusinessLogin = (id: string) => {
    localStorage.setItem('homeli_my_business_id', id);
    setMyBusinessId(id);
    const found = businesses.find(b => b.id === id);
    if (found) {
      syncEditStates(found);
      onAddLog(`Inicio de sesión de negocio simulado: ${found.name}`, 'info');
      showToast(`¡Sesión iniciada como ${found.name}!`, 'success');
    }
  };

  // Modify / Add Services once Registered
  const [activeBizSrvName, setActiveBizSrvName] = useState('');
  const [activeBizSrvPrice, setActiveBizSrvPrice] = useState<number>(0);
  const [activeBizSrvDesc, setActiveBizSrvDesc] = useState('');

  const handleAddServiceActive = () => {
    if (!myBiz) return;
    if (!activeBizSrvName.trim()) {
      showToast('Por favor ingresa un nombre para el servicio.', 'danger');
      return;
    }

    const updatedServices = [...myBiz.services, {
      name: activeBizSrvName,
      price: activeBizSrvPrice || 0,
      description: activeBizSrvDesc || 'Sin descripción'
    }];

    const updatedBiz = {
      ...myBiz,
      services: updatedServices
    };

    onUpdateBusiness(updatedBiz);
    setActiveBizSrvName('');
    setActiveBizSrvPrice(0);
    setActiveBizSrvDesc('');
    onAddLog(`Negocio ${myBiz.name} añadió el servicio: ${activeBizSrvName}`, 'info');
    showToast('¡Servicio añadido con éxito!', 'success');
  };

  const handleRemoveServiceActive = (index: number) => {
    if (!myBiz) return;
    const removedSrv = myBiz.services[index];
    const updatedServices = myBiz.services.filter((_, i) => i !== index);
    const updatedBiz = {
      ...myBiz,
      services: updatedServices
    };

    onUpdateBusiness(updatedBiz);
    onAddLog(`Negocio ${myBiz.name} eliminó el servicio: ${removedSrv.name}`, 'warning');
    showToast('Servicio eliminado exitosamente.', 'success');
  };

  // Update business profile handler
  const handleUpdateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myBiz) return;

    if (!editName.trim() || !editAddress.trim() || !editTelephones.trim() || !editOwner.trim()) {
      showToast('Por favor rellena los campos obligatorios del perfil.', 'danger');
      return;
    }

    const updatedBiz: BusinessRegistration = {
      ...myBiz,
      name: editName,
      logo: editLogo,
      address: editAddress,
      mapLink: editMapLink,
      telephones: editTelephones,
      whatsapp: editWhatsapp,
      ownerName: editOwner,
      giro: editGiro
    };

    onUpdateBusiness(updatedBiz);
    onAddLog(`Negocio ${myBiz.name} actualizó su perfil corporativo`, 'info');
    showToast('¡Perfil de negocio guardado con éxito!', 'success');
  };

  // Delete own business
  const handleDeleteMyBusiness = () => {
    if (!myBiz) return;
    if (confirm(`¿Estás completamente seguro de dar de baja tu negocio "${myBiz.name}"? Esta acción eliminará permanentemente todos tus servicios y métricas de Homeli.`)) {
      onDeleteBusiness(myBiz.id);
      localStorage.removeItem('homeli_my_business_id');
      setMyBusinessId('');
      onAddLog(`Negocio dado de baja por el dueño: ${myBiz.name} (${myBiz.id})`, 'critical');
      showToast('Tu negocio ha sido eliminado de la plataforma.', 'danger');
    }
  };

  return (
    <div className="space-y-6" id="negocios_section_root">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 font-bold text-xs ${
              toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
            }`}
          >
            {toast.type === 'success' ? '✨' : '⚠️'}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Selector Simulator Block */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-lg border border-slate-800 space-y-4 text-left">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c5a85c] animate-pulse" />
              <p className="text-[10px] font-mono font-black text-[#ebd7a7] uppercase tracking-widest">NUEVO ROL PRO: NEGOCIOS</p>
            </div>
            <h2 className="text-xl font-serif font-black">Portal de Negocios y Patrocinadores</h2>
            <p className="text-xs text-slate-350">Regístrate como negocio afiliado para publicar tu catálogo de servicios de limpieza y ganar visibilidad en el directorio oficial.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {myBusinessId && (
              <button
                onClick={() => {
                  localStorage.removeItem('homeli_my_business_id');
                  setMyBusinessId('');
                  showToast('Sesión de negocio cerrada.', 'success');
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-705 text-slate-300 font-bold text-[10px] uppercase rounded-lg border border-slate-700 transition"
              >
                Cerrar Sesión Negocio
              </button>
            )}
            
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-700">
              <span className="text-[10px] font-bold text-slate-400">Simulador de Acceso:</span>
              <select
                value={myBusinessId}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) {
                    setMyBusinessId('');
                    localStorage.removeItem('homeli_my_business_id');
                  } else {
                    handleSelectBusinessLogin(val);
                  }
                }}
                className="bg-transparent text-white font-bold text-[10px] border-none focus:ring-0 cursor-pointer pr-6 min-h-[30px]"
              >
                <option value="" className="text-slate-800">-- Crear Nuevo Registro --</option>
                {businesses.map(b => (
                  <option key={b.id} value={b.id} className="text-slate-800">
                    🏢 {b.name} ({b.status})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN VIEWPORT */}
      {!myBiz ? (
        /* REGISTRATION ONBOARDING FLOW */
        <motion.div
          key="onboarding_form_container"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Instructions and Mock list teaser */}
          <div className="lg:col-span-1 space-y-6 text-left">
            <div className="bg-[#fcfaf2] border border-[#c5a85c]/20 rounded-3xl p-6 shadow-sm space-y-4">
              <span className="text-3xl">🚀</span>
              <h3 className="text-base font-serif font-black text-slate-800">¡Únete como Socio de Limpieza Homeli!</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nuestra plataforma ahora permite a empresas de limpieza, sanitización y mantenimiento registrarse como patrocinadores. 
                Los usuarios que visiten la pestaña <strong>"Servicios"</strong> podrán buscarte directamente en el directorio, ver tus precios, tus datos de WhatsApp y contratarte de manera directa.
              </p>
              
              <div className="border-t border-[#c5a85c]/10 pt-3 space-y-2 text-xs text-slate-500">
                <span className="font-bold text-[#a38439] block uppercase tracking-wider text-[9px]">Garantías y beneficios:</span>
                <p>✓ Panel de control exclusivo con métricas de visitas estimadas.</p>
                <p>✓ Botón directo de redireccionamiento a tu ubicación en Google Maps.</p>
                <p>✓ Botonera directa para enviar WhatsApp o llamadas sin intermediarios.</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
              <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">Negocios Registrados Actualmente ({businesses.length})</h4>
              <div className="space-y-3">
                {businesses.map(b => (
                  <div key={b.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <img src={b.logo} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-250" />
                    <div className="flex-1 text-xs">
                      <p className="font-bold text-slate-800 leading-tight">{b.name}</p>
                      <p className="text-slate-500 text-[10px] mt-0.5">{b.giro}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`px-1 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                          b.status === 'Activo' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {b.status}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono italic">{b.services.length} servicios</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form wrapper */}
          <div className="lg:col-span-2">
            <form onSubmit={handleRegisterSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 text-left">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-serif font-black text-slate-850">Formulario de Afiliación de Negocio</h3>
                <p className="text-xs text-slate-400 mt-0.5">Introduce la información oficial de tu marca. El registro es de aprobación inmediata para propósitos de simulación.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Biz Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-650 flex items-center gap-1">
                    <span>Nombre Comercial *</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-slate-400"><Building2 size={16} /></span>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Ej. Limpieza Brillo Mágico"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-[#c5a85c] focus:outline-none transition font-medium"
                    />
                  </div>
                </div>

                {/* Owner Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-650">Nombre del Propietario / Representante *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-slate-400"><User size={16} /></span>
                    <input
                      type="text"
                      required
                      value={regOwner}
                      onChange={(e) => setRegOwner(e.target.value)}
                      placeholder="Ej. Ing. Juan Pérez Alarcón"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-[#c5a85c] focus:outline-none transition font-medium"
                    />
                  </div>
                </div>

                {/* Giro dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-650">Giro o Especialidad *</label>
                  <select
                    value={regGiro}
                    onChange={(e) => setRegGiro(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-[#c5a85c] focus:outline-none transition font-semibold"
                  >
                    <option value="Servicios de Limpieza Residencial">Servicios de Limpieza Residencial</option>
                    <option value="Limpieza Industrial e Institucional">Limpieza Industrial e Institucional</option>
                    <option value="Lavado de Alfombras y Muebles Finos">Lavado de Alfombras y Muebles Finos</option>
                    <option value="Sanitización y Control de Plagas">Sanitización y Control de Plagas</option>
                    <option value="Mantenimiento General / Fontanería y Pintura">Mantenimiento General / Fontanería y Pintura</option>
                  </select>
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-650">Dirección Física Completa *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-slate-400"><MapPin size={16} /></span>
                    <input
                      type="text"
                      required
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                      placeholder="Ej. Av. Universidad 1024, Col. Del Valle, Benito Juárez, CDMX"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-[#c5a85c] focus:outline-none transition font-medium"
                    />
                  </div>
                </div>

                {/* Map Link */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-black text-slate-650 flex items-center justify-between">
                    <span>Enlace URL de Google Maps (Ubicación de tu Negocio)</span>
                    <span className="text-[10px] text-slate-400 font-normal">Soporta enlaces compartidos del móvil</span>
                  </label>
                  <input
                    type="url"
                    value={regMapLink}
                    onChange={(e) => setRegMapLink(e.target.value)}
                    placeholder="Ej. https://maps.app.goo.gl/XbazWxXmhjRtB4sc9"
                    className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-[#c5a85c] focus:outline-none transition font-medium"
                  />
                </div>

                {/* Telephones */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-650">Teléfono del Negocio *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-slate-400"><Phone size={16} /></span>
                    <input
                      type="tel"
                      required
                      value={regTelephones}
                      onChange={(e) => setRegTelephones(e.target.value)}
                      placeholder="Ej. 55-4433-2211"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-[#c5a85c] focus:outline-none transition font-medium"
                    />
                  </div>
                </div>

                {/* WhatsApp Link */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-650">Número WhatsApp Comercial (Opcional)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-slate-400"><MessageSquare size={16} /></span>
                    <input
                      type="tel"
                      value={regWhatsapp}
                      onChange={(e) => setRegWhatsapp(e.target.value)}
                      placeholder="Ej. 55-9988-7766"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-[#c5a85c] focus:outline-none transition font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Logo Selector Preset options */}
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <label className="text-xs font-black text-slate-650 block">Seleccione Logo o Logotipo Prediseñado</label>
                <div className="flex gap-3 flex-wrap">
                  {DEFAULT_LOGOS.map((logoUrl, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setRegLogo(logoUrl)}
                      className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition ${
                        regLogo === logoUrl ? 'border-[#c5a85c] scale-110 shadow-md' : 'border-slate-200 opacity-60'
                      }`}
                    >
                      <img src={logoUrl} alt="" className="w-full h-full object-cover" />
                      {regLogo === logoUrl && (
                        <span className="absolute bottom-0 right-0 bg-[#c5a85c] text-white p-0.5 text-[8px] rounded-tl font-bold">✓</span>
                      )}
                    </button>
                  ))}
                  
                  {/* Custom Logo URL Box */}
                  <div className="flex-1 min-w-[200px]">
                    <input
                      type="text"
                      value={regLogo}
                      onChange={(e) => setRegLogo(e.target.value)}
                      placeholder="O introduzca URL de su propio logo..."
                      className="w-full h-11 px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-[#c5a85c] focus:outline-none transition text-slate-600 font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* SERVICES LIST BUILDER ON REGISTRATION Form */}
              <div className="space-y-4 border-t border-slate-150 pt-4">
                <div>
                  <h4 className="text-sm font-serif font-black text-slate-800 flex items-center gap-1.5">
                    <Zap size={15} className="text-[#c5a85c]" />
                    <span>Módulo de Portafolio: Publica tus Servicios</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">Añade cada uno de los servicios de limpieza que ofreces, con su respectivo precio base estimado y una pequeña descripción explicativa.</p>
                </div>

                {/* Sub Form adding list */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-500">Nombre del Servicio</span>
                      <input
                        type="text"
                        value={newSrvName}
                        onChange={(e) => setNewSrvName(e.target.value)}
                        placeholder="Ej. Limpieza Profunda Post-Obra"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-[#c5a85c] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-500">Costo Estimado ($ MXN)</span>
                      <input
                        type="number"
                        value={newSrvPrice || ''}
                        onChange={(e) => setNewSrvPrice(parseFloat(e.target.value) || 0)}
                        placeholder="Ej. 1200"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-[#c5a85c] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <span className="text-[10px] font-black uppercase text-slate-500">Descripción Breve o Qué Incluye</span>
                      <input
                        type="text"
                        value={newSrvDesc}
                        onChange={(e) => setNewSrvDesc(e.target.value)}
                        placeholder="Ej. Pulido de pisos, limpieza de yeso sobrante, sacudido profundo y lavado de ventanería."
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-[#c5a85c] focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddServiceToReg}
                    className="px-4 py-2 bg-slate-900 border border-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Añadir Servicio a mi Lista (+)</span>
                  </button>
                </div>

                {/* Items pre-added table/list view */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-500 block">Tus Servicios Listados ({regServices.length})</span>
                  {regServices.length === 0 ? (
                    <div className="p-4 bg-slate-50 border rounded-2xl text-center text-slate-400 text-xs italic">
                      No has añadido servicios todavía. Ingrese datos en la casilla de arriba y presione en Agregar.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="registration_services_pre_list">
                      {regServices.map((srv, index) => (
                        <div key={index} className="bg-white border border-slate-150 p-3 rounded-xl flex justify-between items-start gap-3">
                          <div className="text-xs space-y-1">
                            <h5 className="font-extrabold text-slate-850">{srv.name}</h5>
                            <p className="text-slate-500 text-[10px] leading-relaxed max-w-sm">{srv.description}</p>
                            <span className="font-bold text-emerald-600 block mt-1">${srv.price} MXN</span>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => handleRemoveServiceFromReg(index)}
                            className="text-rose-400 hover:text-rose-600 p-1 hover:bg-rose-50 rounded-lg transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-800 to-slate-900 text-white font-serif font-black uppercase text-xs rounded-xl hover:opacity-95 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 size={16} />
                  <span>Dar de Alta Mi Negocio en Homeli</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      ) : (
        /* REGISTERED BUSINESS CO-PILOT DASHBOARD */
        <motion.div
          key="registered_dashboard_portal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Top Elegant Banner Profile Header */}
          <div className="bg-white border border-slate-205 rounded-3xl p-6 shadow-sm text-left flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={myBiz.logo} 
                alt={`${myBiz.name} Logo`} 
                className="w-16 h-16 rounded-2xl object-cover bg-slate-100 border border-slate-150"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                    myBiz.status === 'Activo' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                  }`}>
                    {myBiz.status === 'Activo' ? '● Afiliado Activo' : '⚠️ Suspendido / Inactivo'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono italic">{myBiz.giro}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-800 mt-1">{myBiz.name}</h2>
                <p className="text-xs text-slate-500 mt-0.5">Representante: <strong>{myBiz.ownerName}</strong> • ID: <strong className="font-mono text-[10px]">{myBiz.id}</strong></p>
              </div>
            </div>

            {/* Redirection actions shortcuts */}
            <div className="flex items-center gap-2 shrink-0">
              <a 
                href={myBiz.mapLink} 
                target="_blank" 
                rel="noreferrer" 
                className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 text-[10px] font-black uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 border border-sky-100"
              >
                <MapPin size={12} />
                <span>Ver Ubicación</span>
              </a>

              <a 
                href={`https://wa.me/${myBiz.whatsapp}`} 
                target="_blank" 
                rel="noreferrer" 
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 border border-emerald-100"
              >
                <MessageSquare size={12} />
                <span>Enviar chat WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Metrics stats dashboard */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-5 text-left shadow-xs space-y-1">
              <span className="text-2xl">🧹</span>
              <p className="text-[9px] font-black uppercase text-slate-400">Total de Servicios</p>
              <h4 className="text-xl font-serif font-black text-slate-800">24</h4>
              <p className="text-[9px] text-slate-400 font-bold">↑ 8% mes actual</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-5 text-left shadow-xs space-y-1">
              <span className="text-2xl">💸</span>
              <p className="text-[9px] font-black uppercase text-slate-400">Ingreso Estimado</p>
              <h4 className="text-xl font-serif font-black text-[#c5a85c]">$18,450 <span className="text-slate-550 text-xs font-sans">MXN</span></h4>
              <p className="text-[9px] text-slate-450 font-bold">Por consultas y agendamientos directos</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-5 text-left shadow-xs space-y-1">
              <span className="text-2xl">👀</span>
              <p className="text-[9px] font-black uppercase text-slate-400">Vistas de Perfil</p>
              <h4 className="text-xl font-serif font-black text-slate-800">340</h4>
              <p className="text-[9px] text-indigo-505 text-emerald-600 font-bold">Tráfico en Homeli Directorio</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-5 text-left shadow-xs space-y-1">
              <span className="text-2xl">⭐</span>
              <p className="text-[9px] font-black uppercase text-slate-400">Promedio Calificación</p>
              <div className="flex items-center gap-1">
                <span className="text-xl font-serif font-black text-slate-800">4.9</span>
                <div className="flex text-amber-500 scale-75 -ml-1">🎨 ★★★★★</div>
              </div>
              <p className="text-[9px] text-slate-400 font-bold">Basado en 45 opiniones</p>
            </div>
          </div>

          {/* Dashboard internal routing navigation tabs */}
          <div className="flex gap-2 border-b border-slate-200 pb-1 text-left">
            <button
              onClick={() => setActiveTab('metrics')}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-b-2 transition ${
                activeTab === 'metrics' ? 'border-[#c5a85c] text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Métricas & Análisis
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-b-2 transition ${
                activeTab === 'services' ? 'border-[#c5a85c] text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Módulo de Servicios ({myBiz.services.length})
            </button>
            <button
              onClick={() => {
                syncEditStates(myBiz);
                setActiveTab('profile');
              }}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider border-b-2 transition ${
                activeTab === 'profile' ? 'border-[#c5a85c] text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Gestión de Perfil Comercial
            </button>
          </div>

          {/* INTERNAL CONTENT TABS */}
          <div className="mt-4">
            <AnimatePresence mode="wait">
              {activeTab === 'metrics' && (
                <motion.div
                  key="metrics_dashboard_display"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white border border-slate-200 rounded-3xl p-6 text-left space-y-6"
                >
                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="font-serif font-black text-slate-800 text-base">Dashboard Comercial de Rendimiento</h3>
                    <p className="text-xs text-slate-500">Consulta las estadísticas de visitas y solicitudes que Homeli ha re-direccionado hacia tu WhatsApp o ficha técnica comercial en el taller o directorio.</p>
                  </div>

                  {/* Elegant statistical widgets grids */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Performance Progress */}
                    <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-2xl space-y-3">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">Servicios Más Visitados</span>
                      <div className="space-y-2 text-xs">
                        {myBiz.services.map((srv, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="font-bold text-slate-700">{srv.name}</span>
                              <span className="font-mono text-slate-500">{124 - (idx * 30)} consultas</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-[#c5a85c] h-full" style={{ width: `${90 - (idx * 25)}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Operational advice */}
                    <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-2xl space-y-3">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">Análisis de Distribución Geográfica</span>
                      <div className="space-y-2 text-xs text-slate-650 leading-relaxed">
                        <p>✓ <strong>CDMX Central (Roma/Polanco):</strong> 65% de tus visitas de perfil.</p>
                        <p>✓ <strong>CDMX Sur (Coyoacán/Del Valle):</strong> 25% de tus visitas.</p>
                        <p>✓ <strong>Otras zonas colindantes:</strong> 10% de tus visitas.</p>
                        <p className="text-[10px] text-slate-400 italic mt-3 block">Consejo: Mantén tu mapa actualizado para mejorar la captura de clics de área.</p>
                      </div>
                    </div>

                    {/* Fun statistics */}
                    <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-2xl space-y-3">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">Historial de Interacción Directa</span>
                      <div className="space-y-3 text-xs">
                        <div className="flex items-center justify-between pb-1.5 border-b border-indigo-100/30">
                          <span className="font-semibold text-slate-600 flex items-center gap-1.5">📲 clics a WhatsApp</span>
                          <span className="font-bold text-slate-800 font-mono">134 contactos</span>
                        </div>
                        <div className="flex items-center justify-between pb-1.5 border-b border-indigo-100/30">
                          <span className="font-semibold text-slate-600 flex items-center gap-1.5">📞 Llamadas Telefónicas</span>
                          <span className="font-bold text-slate-800 font-mono">48 llamadas</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-600 flex items-center gap-1.5">🗺️ Clics a Google Maps</span>
                          <span className="font-bold text-slate-800 font-mono">158 vistas</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'services' && (
                <motion.div
                  key="services_panel_edit"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white border border-slate-200 rounded-3xl p-6 text-left space-y-6"
                >
                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="font-serif font-black text-slate-800 text-base">Portafolio Oficial de Servicios Publicados</h3>
                    <p className="text-xs text-slate-500">Puedes añadir o eliminar servicios en tiempo real. Estos se verán inmediatamente reflejados en el Directorio de la App.</p>
                  </div>

                  {/* Add a service on-the-fly */}
                  <div className="bg-[#fcfaf2] border border-[#c5a85c]/30 rounded-2xl p-4 space-y-3">
                    <h4 className="text-xs font-black uppercase text-slate-700">Añadir Nuevo Servicio (+)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-slate-500 uppercase">Nombre del Servicio</span>
                        <input
                          type="text"
                          value={activeBizSrvName}
                          onChange={(e) => setActiveBizSrvName(e.target.value)}
                          placeholder="Ej. Pulido de mármol especializado"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-[#c5a85c] focus:outline-none font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-slate-500 uppercase">Precio Base ($ MXN)</span>
                        <input
                          type="number"
                          value={activeBizSrvPrice || ''}
                          onChange={(e) => setActiveBizSrvPrice(parseFloat(e.target.value) || 0)}
                          placeholder="Ej. 1500"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-[#c5a85c] focus:outline-none font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-slate-500 uppercase">Breve Descripción</span>
                        <input
                          type="text"
                          value={activeBizSrvDesc}
                          onChange={(e) => setActiveBizSrvDesc(e.target.value)}
                          placeholder="Ej. Lavado mecánico y abrillantado."
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-[#c5a85c] focus:outline-none font-medium"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleAddServiceActive}
                      className="px-4 py-2 bg-gradient-to-r from-purple-800 to-indigo-900 text-white text-[10px] font-black uppercase rounded-lg shadow-sm transition inline-block cursor-pointer"
                    >
                      Publicar Nuevo Servicio (+)
                    </button>
                  </div>

                  {/* List of current services */}
                  <div className="space-y-3 mt-4">
                    <span className="text-xs font-black uppercase text-slate-500 block">Listado De Servicios de {myBiz.name} ({myBiz.services.length})</span>
                    
                    {myBiz.services.length === 0 ? (
                      <div className="text-center p-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs">
                        No has listado ningún servicio todavía. Utiliza el módulo de arriba para agregar el primero.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {myBiz.services.map((srv, index) => (
                          <div 
                            key={index} 
                            className="p-4 bg-white border border-slate-180 hover:border-slate-300 transition duration-150 rounded-2xl flex justify-between items-start gap-4"
                          >
                            <div className="space-y-1 text-xs">
                              <h4 className="font-extrabold text-slate-800 text-sm">{srv.name}</h4>
                              <p className="text-slate-500 text-[10px] leading-relaxed max-w-sm">{srv.description}</p>
                              <div className="pt-1 select-none">
                                <span className="font-bold text-emerald-600 font-mono text-xs bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                                  ${srv.price} MXN
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleRemoveServiceActive(index)}
                              className="text-rose-450 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-xl transition"
                              title="Eliminar Servicio"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div
                  key="business_profile_edit"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white border border-slate-200 rounded-3xl p-6 text-left space-y-6"
                >
                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="font-serif font-black text-slate-800 text-base">Configuración de Ficha Comercial</h3>
                    <p className="text-xs text-slate-500">Ver y editar los datos informativos de tu empresa. El cambio se propaga de forma instantánea por toda la interfaz.</p>
                  </div>

                  <form onSubmit={handleUpdateProfileSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <span className="text-xs font-black text-slate-650 block">Nombre del Negocio *</span>
                        <input
                          type="text"
                          required
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-[#c5a85c] focus:outline-none"
                        />
                      </div>

                      {/* Owner */}
                      <div className="space-y-1.5">
                        <span className="text-xs font-black text-slate-650 block">Representante Legal *</span>
                        <input
                          type="text"
                          required
                          value={editOwner}
                          onChange={(e) => setEditOwner(e.target.value)}
                          className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-[#c5a85c] focus:outline-none"
                        />
                      </div>

                      {/* Giro */}
                      <div className="space-y-1.5">
                        <span className="text-xs font-black text-slate-650 block">Giro Especialista</span>
                        <input
                          type="text"
                          value={editGiro}
                          onChange={(e) => setEditGiro(e.target.value)}
                          className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-[#c5a85c] focus:outline-none"
                        />
                      </div>

                      {/* Address */}
                      <div className="space-y-1.5">
                        <span className="text-xs font-black text-slate-650 block">Dirección Matriz *</span>
                        <input
                          type="text"
                          required
                          value={editAddress}
                          onChange={(e) => setEditAddress(e.target.value)}
                          className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-[#c5a85c] focus:outline-none"
                        />
                      </div>

                      {/* Map link */}
                      <div className="space-y-1.5 md:col-span-2">
                        <span className="text-xs font-black text-slate-650 block">Filtro Enlace Google Maps</span>
                        <input
                          type="text"
                          value={editMapLink}
                          onChange={(e) => setEditMapLink(e.target.value)}
                          className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-[#c5a85c] focus:outline-none"
                        />
                      </div>

                      {/* Telephones */}
                      <div className="space-y-1.5">
                        <span className="text-xs font-black text-slate-650 block">Teléfono *</span>
                        <input
                          type="text"
                          required
                          value={editTelephones}
                          onChange={(e) => setEditTelephones(e.target.value)}
                          className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-[#c5a85c] focus:outline-none"
                        />
                      </div>

                      {/* Whatsapp */}
                      <div className="space-y-1.5">
                        <span className="text-xs font-black text-slate-650 block">WhatsApp de Reservación Directa</span>
                        <input
                          type="text"
                          value={editWhatsapp}
                          onChange={(e) => setEditWhatsapp(e.target.value)}
                          className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-[#c5a85c] focus:outline-none"
                        />
                      </div>

                      {/* Logo URL */}
                      <div className="space-y-1.5 md:col-span-2">
                        <span className="text-xs font-black text-slate-650 block">URL de Logotipo Oficial</span>
                        <input
                          type="text"
                          value={editLogo}
                          onChange={(e) => setEditLogo(e.target.value)}
                          className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-[#c5a85c] focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleDeleteMyBusiness}
                        className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash size={14} />
                        <span>Dar de baja mi negocio</span>
                      </button>

                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save size={14} />
                        <span>Guardar Cambios del Perfil</span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
};

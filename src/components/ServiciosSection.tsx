/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { ServiceRequest, ServiceStatus, ProductItem } from '../types';
import { 
  Calendar, 
  MapPin, 
  User, 
  Clock, 
  Sparkles, 
  Inbox, 
  X, 
  FileText,
  Camera,
  Upload,
  Check,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  Briefcase,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  ListFilter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ServiciosSectionProps {
  services: ServiceRequest[];
  onAddService: (service: ServiceRequest) => void;
  onUpdateServiceStatus: (id: string, status: ServiceStatus) => void;
  onAddLog: (action: string, severity: 'info' | 'warning' | 'critical') => void;
  products: ProductItem[];
}

export default function ServiciosSection({
  services,
  onAddService,
  onUpdateServiceStatus,
  onAddLog,
  products = []
}: ServiciosSectionProps) {
  // Navigation tabs: 'cliente' (mockup form) vs 'control' (operator panel)
  const [currentView, setCurrentView] = useState<'cliente' | 'control'>('cliente');

  // Filters for Technician Board
  const [statusFilter, setStatusFilter] = useState<'todos' | ServiceStatus>('todos');
  const [priorityFilter, setPriorityFilter] = useState<'todos' | 'Baja' | 'Media' | 'Alta'>('todos');
  
  // CLIENT CHECKOUT FORM STATE
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [address, setAddress] = useState('');
  const [priority, setPriority] = useState<'Baja' | 'Media' | 'Alta'>('Media');
  const [notes, setNotes] = useState('');
  
  // Photo capturing states
  const [uploadedPhoto, setUploadedPhoto] = useState<string>('');
  const [useCamera, setUseCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Selected Service for detail modal
  const [selectedService, setSelectedService] = useState<ServiceRequest | null>(null);
  const [successMessage, setSuccessMessage] = useState(false);

  // Synchronized service list directly driven by Admin master catalog (active category === 'Servicios')
  const activeServicesFromCatalog = products.filter(
    p => p.category === 'Servicios' && p.active !== false
  );

  // Toggle selection
  const handleToggleProduct = (prodId: string) => {
    setSelectedProductIds(prev => {
      if (prev.includes(prodId)) {
        return prev.filter(id => id !== prodId);
      } else {
        return [...prev, prodId];
      }
    });
  };

  // Camera logic
  const startWebcam = async () => {
    try {
      if (stream) {
        stopWebcam();
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: 640, height: 480 } 
      });
      setStream(mediaStream);
      setUseCamera(true);
    } catch (err) {
      console.error("Camera error:", err);
      alert("No se pudo iniciar la cámara. Por favor asegúrate de otorgar permisos o sube una foto local.");
    }
  };

  useEffect(() => {
    if (useCamera && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(err => console.error("Video play error:", err));
    }
  }, [useCamera, stream]);

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setUploadedPhoto(dataUrl);
        stopWebcam();
      }
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setUseCamera(false);
  };

  // Cleanup webcam on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Dynamic price calculation
  const calculatedPrice = selectedProductIds.reduce((total, id) => {
    const item = activeServicesFromCatalog.find(p => p.id === id);
    return total + (item ? item.price : 0);
  }, 0);

  // Submit new cleaning solicitation
  const handleSubmitSolicitation = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProductIds.length === 0) {
      alert("Por favor selecciona al menos un producto para programar la limpieza.");
      return;
    }
    if (!clientName.trim() || !address.trim() || !clientEmail.trim()) {
      alert("Por favor completa tu nombre, correo y dirección de entrega.");
      return;
    }

    // Name compiled from selection names
    const selectedNames = selectedProductIds.map(id => {
      const item = activeServicesFromCatalog.find(p => p.id === id);
      return item ? item.name : '';
    }).filter(Boolean);

    const mainServiceLabel = selectedNames.join(' + ');

    const newRequest: ServiceRequest = {
      id: `SRV-${Math.floor(101 + Math.random() * 899)}`,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      serviceType: mainServiceLabel,
      date: new Date().toISOString(),
      address: address.trim(),
      price: calculatedPrice,
      status: 'programado',
      assignedStaff: 'Por Asignar (Coordinador)',
      priority,
      notes: notes.trim(),
      uploadedPhoto: uploadedPhoto || undefined,
      selectedItems: selectedNames
    };

    onAddService(newRequest);
    onAddLog(`Nueva solicitud de limpieza registrada: ${newRequest.clientName} solicita [${newRequest.serviceType}]`, 'info');

    // Reset Cliente fields
    setSelectedProductIds([]);
    setClientName('');
    setClientEmail('');
    setAddress('');
    setNotes('');
    setUploadedPhoto('');
    setSuccessMessage(true);

    setTimeout(() => {
      setSuccessMessage(false);
    }, 5000);
  };

  // Technician View styling helpers
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
      case 'en_progreso': return 'En Ruta';
      case 'completado': return 'Completado';
      case 'cancelado': return 'Cancelado';
    }
  };

  // Filter Technician view list
  const filteredServices = services.filter(s => {
    const statusMatch = statusFilter === 'todos' || s.status === statusFilter;
    const priorityMatch = priorityFilter === 'todos' || s.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  return (
    <div className="space-y-6 pb-12 font-sans" id="services_section_main_board">
      
      {/* Header bar and role selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm" id="services_panel_header">
        <div>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="text-purple-600 shrink-0" size={24} />
            Atelier Servicios de Limpieza
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Agenda limpiezas de calzado, prendas y hogar. Los servicios y precios son configurados y actualizados por el Administrador.
          </p>
        </div>

        {/* View togglers with segmented animation */}
        <div className="bg-slate-100 p-1 rounded-xl flex border border-slate-200 shrink-0">
          <button
            onClick={() => { stopWebcam(); setCurrentView('cliente'); }}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              currentView === 'cliente' 
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📋 Solicitar Limpieza (Cliente)
          </button>
          <button
            onClick={() => { stopWebcam(); setCurrentView('control'); }}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              currentView === 'control' 
                ? 'bg-[#c5a85c] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚙️ Control de Operación (Técnico)
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* ======================= VIEW 1: CLIENT SOLICITATION SCREEN ======================= */}
        {currentView === 'cliente' && (
          <motion.div
            key="client_checkout_screener"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            
            {/* LEFT COLUMN: INTERACTIVE WHITEBOARD DOT-GRID PANEL */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
              
              {/* Whiteboard Header */}
              <div className="border-b border-slate-100 p-5 bg-gradient-to-r from-purple-50 to-indigo-50/50 flex justify-between items-center">
                <div>
                  <h3 className="font-serif font-black text-slate-950 text-base sm:text-lg flex items-center gap-1.5">
                    🛍️ Paso 1: Selecciona la Limpieza Requerida
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Puedes seleccionar uno o presionar varios para una solicitud múltiple</p>
                </div>
                {selectedProductIds.length > 0 && (
                  <button 
                    onClick={() => setSelectedProductIds([])}
                    className="text-[10px] uppercase font-black tracking-wider text-purple-600 hover:text-purple-800 bg-purple-50 px-2 py-1 rounded"
                  >
                    Limpiar selección
                  </button>
                )}
              </div>

              {/* Whiteboard Grid with realistic dotted grid style matching the mockup sketch */}
              <div 
                className="p-6 md:p-8 flex-1 min-h-[400px] border-b border-slate-150 relative bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:18px_18px]" 
                id="whiteboard_interactive_canvas"
                style={{ backgroundColor: '#fcfdfd' }}
              >
                
                {activeServicesFromCatalog.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-20 bg-white/80 rounded-2xl border border-dashed border-slate-200">
                    <Inbox className="text-slate-400 mb-2" size={32} />
                    <p className="font-bold text-slate-700">No hay servicios dados de alta</p>
                    <p className="text-xs text-slate-505">Activa o crea servicios en la categoría "Servicios" desde el rol Administrador</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="sketch_pills_container">
                    
                    {activeServicesFromCatalog.map((product) => {
                      const isSelected = selectedProductIds.includes(product.id);
                      
                      // Identify exact match from user sketch
                      const nameUpper = product.name.toUpperCase();
                      const isZapatos = nameUpper.includes('ZAPATOS');
                      const isRopas = nameUpper.includes('ROPAS');
                      const isFullHome = nameUpper.includes('FULL HOME') || nameUpper.includes('HOME CLEANING');
                      const isBano = nameUpper.includes('BAÑO') || nameUpper.includes('BANO');
                      const isCocinar = nameUpper.includes('COCINAR') || nameUpper.includes('COCINA');
                      const isTapetes = nameUpper.includes('TAPETES') || nameUpper.includes('SOF');

                      // Dynamic color pairing matching the sketch exactly
                      // Zapatos selected (lavender tint) vs Ropas/others (saturated magenta/violet)
                      let customBg = "bg-[#a855f7] hover:bg-[#b52be3]"; // Base bright magenta/violet
                      if (isSelected) {
                        customBg = "bg-[#9333ea] ring-4 ring-purple-300 ring-offset-2 scale-[1.02] shadow-md"; 
                      }

                      return (
                        <motion.button
                          key={product.id}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => handleToggleProduct(product.id)}
                          className={`relative p-5 rounded-3xl transition-all duration-200 text-white flex flex-col justify-between items-center text-center cursor-pointer min-h-[110px] shadow-sm select-none ${customBg}`}
                          id={`service_sketch_pill_${product.id}`}
                        >
                          {/* Inner selection glowing check badge */}
                          {isSelected && (
                            <span className="absolute top-2 right-2 bg-white text-purple-700 p-0.5 rounded-full shadow-xs">
                              <Check size={11} className="stroke-[4]" />
                            </span>
                          )}

                          {/* Image preview of card */}
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-white/20 border border-white/30 flex items-center justify-center mb-1">
                            <img 
                              src={product.imageUrl} 
                              alt={product.name} 
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          <div>
                            <span className="font-extrabold uppercase tracking-wide text-xs sm:text-xs">
                              {product.name}
                            </span>
                            <span className="block text-[10px] text-white/90 font-mono mt-0.5">
                              ${product.price} MXN
                            </span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                )}

                {/* BOTTOM WORKSPACE ELEMENT: MOCKUP "SUBIR FOTO DE LIMPIEZA" */}
                {/* Colored deep soil brown/earth-gray matching the hand drawn mock exactly */}
                <div className="mt-8">
                  <div 
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => {
                      if (!useCamera && fileInputRef.current) {
                        fileInputRef.current.click();
                      }
                    }}
                    className="w-full py-6 px-4 rounded-[40px] text-white font-extrabold text-center uppercase tracking-widest text-xs sm:text-sm shadow-md transition duration-200 hover:scale-[1.01] hover:brightness-105 select-none relative overflow-hidden cursor-pointer flex flex-col items-center justify-center gap-2"
                    style={{ backgroundColor: '#534F46' }} // Dark earth gray/brown from hand sketch
                    id="submit_photo_banner_btn"
                  >
                    
                    {uploadedPhoto ? (
                      <div className="flex items-center gap-3 w-full justify-center">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/20 shadow-inner bg-slate-800">
                          <img src={uploadedPhoto} alt="Product Upload preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-left">
                          <span className="block text-emerald-400 font-extrabold text-[11px] uppercase tracking-wider">✔ Foto Cargada con éxito</span>
                          <span className="block text-white/80 font-normal text-[10px] normal-case">Presiona para reemplazar o cambiar</span>
                        </div>
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadedPhoto('');
                          }}
                          className="p-1 bg-black/40 hover:bg-black/60 text-white rounded-lg transition shrink-0 ml-4"
                          title="Remover foto"
                        >
                          <ChevronRight size={14} className="rotate-90" />
                        </button>
                      </div>
                    ) : useCamera ? (
                      <div className="w-full flex flex-col items-center gap-3 p-1">
                        <div className="w-full max-w-sm h-48 bg-black rounded-2xl overflow-hidden border border-white/20 relative">
                          <video ref={videoRef} className="w-full h-full object-cover" playInline muted />
                          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); capturePhoto(); }}
                              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-full shadow"
                            >
                              📸 Capturar Foto
                            </button>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); stopWebcam(); }}
                              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-full shadow"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className="flex items-center gap-2 text-[13px] sm:text-[14px]">
                          🗂️ SUBIR FOTO DE LIMPIEZA
                        </span>
                        <span className="text-[10px] tracking-normal lowercase text-white/70 font-normal block">
                          arrastra tu archivo aquí, haz click o presiona abajo para usar tu cámara
                        </span>
                      </>
                    )}
                    
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden" 
                    />
                  </div>

                  {/* Secondary Camera trigger option under banner */}
                  {!useCamera && !uploadedPhoto && (
                    <div className="flex justify-center mt-3">
                      <button
                        type="button"
                        onClick={startWebcam}
                        className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-650 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-1.5 rounded-full transition cursor-pointer"
                      >
                        <Camera size={14} className="text-purple-600" />
                        Usar Cámara del Dispositivo
                      </button>
                    </div>
                  )}
                </div>

              </div>
              
              {/* Whiteboard Footer displaying counts */}
              <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-500 font-sans">
                <span>Total Selección: {selectedProductIds.length} ítems</span>
                <span>Costo estimado: <strong className="text-slate-800 text-sm font-mono">${calculatedPrice} MXN</strong></span>
              </div>

            </div>

            {/* RIGHT COLUMN: SOLICITATION REGISTRY FORM */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Informative Alert for Success */}
              <AnimatePresence>
                {successMessage && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 bg-emerald-50 border border-emerald-150 rounded-2xl text-emerald-800 text-xs font-bold flex gap-3 shadow-md"
                  >
                    <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={18} />
                    <div>
                      <p className="text-sm font-extrabold">¡Servicio Agendado!</p>
                      <p className="font-medium text-emerald-700/90 mt-1">La solicitud fue enviada en tiempo real. Un técnico del Atelier ha sido alertado para validar y programar la recolección.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Solicitation parameters form card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-205 shadow-sm text-left">
                <div className="pb-4 border-b border-slate-100 mb-5">
                  <h3 className="font-serif font-black text-slate-900 text-lg flex items-center gap-1.5">
                    📝 Paso 2: Detalles del Cliente
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Ingresa los datos del destinatario para programar el servicio</p>
                </div>

                <form onSubmit={handleSubmitSolicitation} className="space-y-4">
                  
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">Nombre Completo</label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ej. Sofía Valenzuela"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 bg-slate-50 text-slate-800 text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="sofia@ejemplo.com"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 bg-slate-50 text-slate-800 text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">Dirección de Recogida y Entrega</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Calle, Colonia, Delegación o C.P."
                      className="w-full px-3 py-2.5 border border-slate-205 rounded-xl focus:outline-none focus:border-purple-500 bg-slate-50 text-slate-800 text-sm font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">Prioridad Operativa</label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as any)}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 bg-slate-50 text-slate-805 text-sm font-bold"
                      >
                        <option value="Baja">🟢 Baja (Estándar)</option>
                        <option value="Media">🟡 Media</option>
                        <option value="Alta">🔴 Alta (Express)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">Método Pago sugerido</label>
                      <div className="px-3 py-2.5 bg-slate-100 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold font-mono text-center">
                        💵 Pago contra entrega
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">Notas especiales o advertencias (Opcional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ej. Tocar timbre portón azul / Detale en la suela del calzado"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 bg-slate-50 text-slate-800 text-xs font-bold text-left"
                      rows={2}
                    />
                  </div>

                  {/* Receipt check outline summarizer */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-201 text-xs text-slate-600 font-sans space-y-2 mt-4">
                    <span className="block text-[10px] uppercase font-black text-slate-400 tracking-widest pb-1 border-b border-slate-200">Resumen del Pedido</span>
                    <div className="flex justify-between font-bold">
                      <span>Servicios seleccionados:</span>
                      <span className="text-purple-700">{selectedProductIds.length}</span>
                    </div>
                    {selectedProductIds.length > 0 && (
                      <div className="text-[11px] font-mono text-slate-500 leading-normal pl-2 border-l border-purple-200">
                        {selectedProductIds.map(id => {
                          const item = activeServicesFromCatalog.find(p => p.id === id);
                          return item ? `• ${item.name} ($${item.price} MXN)` : '';
                        }).filter(Boolean).map(line => <div key={line}>{line}</div>)}
                      </div>
                    )}
                    <div className="flex justify-between border-t border-slate-200 pt-2 font-black text-slate-800 text-sm">
                      <span>Total estimado:</span>
                      <span className="font-mono text-purple-700">${calculatedPrice} MXN</span>
                    </div>
                  </div>

                  {/* Submission Button */}
                  <button
                    type="submit"
                    disabled={selectedProductIds.length === 0}
                    className={`w-full py-3.5 px-4 rounded-xl text-white font-black uppercase text-xs tracking-wider transition-all duration-200 shadow flex items-center justify-center gap-2 cursor-pointer ${
                      selectedProductIds.length > 0 
                        ? 'bg-purple-600 hover:bg-purple-700 hover:scale-[1.01]' 
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Sparkles size={14} />
                    Agendar Limpieza Ahora
                  </button>
                </form>

              </div>
            </div>

          </motion.div>
        )}

        {/* ======================= VIEW 2: TECHNICIANS OPERATOR BOARD ======================= */}
        {currentView === 'control' && (
          <motion.div
            key="technician_control_dash"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Metrics cards inside technician panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="tech_quick_stats">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between" id="metric_scheduled">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-50 text-indigo-700 rounded-xl">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-550">Servicios Programados</p>
                    <h4 className="text-lg font-bold font-serif text-slate-900 mt-0.5">{services.filter(s => s.status === 'programado').length} solicitudes</h4>
                  </div>
                </div>
                <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-black">En espera</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between" id="metric_inprogress">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-550">En Ruta / Operación</p>
                    <h4 className="text-lg font-bold font-serif text-slate-900 mt-0.5">{services.filter(s => s.status === 'en_progreso').length} activos</h4>
                  </div>
                </div>
                <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-black animate-pulse">● En ruta</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between" id="metric_completed">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
                    <Check size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-550">Completados con éxito</p>
                    <h4 className="text-lg font-bold font-serif text-slate-900 mt-0.5">{services.filter(s => s.status === 'completado').length} cerrados</h4>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-black">100% Calidad</span>
              </div>
            </div>

            {/* Controls Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" id="tech_filters">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-black uppercase tracking-wider pr-2 border-r border-slate-200">
                  <SlidersHorizontal size={14} className="text-slate-400" />
                  <span>Filtros Operativos</span>
                </div>

                <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-220" id="tech_status_filter_clicks">
                  <button
                    onClick={() => setStatusFilter('todos')}
                    className={`px-3 py-1.5 text-xs font-black rounded-md transition cursor-pointer ${statusFilter === 'todos' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setStatusFilter('programado')}
                    className={`px-3 py-1.5 text-xs font-black rounded-md transition cursor-pointer ${statusFilter === 'programado' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    Programados
                  </button>
                  <button
                    onClick={() => setStatusFilter('en_progreso')}
                    className={`px-3 py-1.5 text-xs font-black rounded-md transition cursor-pointer ${statusFilter === 'en_progreso' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    En Ruta
                  </button>
                  <button
                    onClick={() => setStatusFilter('completado')}
                    className={`px-3 py-1.5 text-xs font-black rounded-md transition cursor-pointer ${statusFilter === 'completado' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    Completados
                  </button>
                </div>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as any)}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white border border-slate-205 text-slate-800 focus:outline-none focus:border-purple-600 bg-white"
                >
                  <option value="todos">Prioridad: Todos</option>
                  <option value="Alta">🔴 Alta</option>
                  <option value="Media">🟡 Media</option>
                  <option value="Baja">🟢 Baja</option>
                </select>
              </div>
            </div>

            {/* Grid of registered service requests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="tech_orders_grid_cards">
              <AnimatePresence mode="popLayout">
                {filteredServices.length === 0 ? (
                  <div className="col-span-1 md:col-span-2 py-16 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-sm flex flex-col items-center justify-center space-y-2">
                    <Inbox size={32} className="text-slate-400" />
                    <p className="font-bold text-slate-700">Ningún servicio coincide con los filtros</p>
                    <p className="text-xs text-slate-450">Los clientes pueden enviar solicitudes desde el "Modo Cliente"</p>
                  </div>
                ) : (
                  filteredServices.map(service => (
                    <motion.div
                      key={service.id}
                      layoutId={`srv_grid_card_${service.id}`}
                      onClick={() => setSelectedService(service)}
                      className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#c5a85c] hover:shadow-md transition duration-200 cursor-pointer text-left flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-3">
                          <span className="text-[10px] text-purple-700 font-bold bg-purple-50 border border-purple-200/20 px-2.5 py-0.5 rounded-full font-mono">
                            {service.id}
                          </span>
                          <div className="flex gap-1.5">
                            <span className={`px-2 py-0.5 text-[10px] font-black rounded-full border ${getStatusColor(service.status)}`}>
                              {getStatusLabel(service.status)}
                            </span>
                            <span className={`px-2 py-0.5 text-[10px] font-black rounded-full ${
                              service.priority === 'Alta' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                              service.priority === 'Media' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              {service.priority}
                            </span>
                          </div>
                        </div>

                        <h4 className="font-serif font-black text-slate-900 text-base leading-snug line-clamp-2 mb-2">
                          {service.serviceType}
                        </h4>

                        <p className="text-xs text-slate-500 font-bold leading-none mb-3">
                          Cliente: <span className="text-slate-800 font-black">{service.clientName}</span>
                        </p>

                        <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
                          <p className="flex items-center gap-1.5">
                            <MapPin size={13} className="text-slate-400 shrink-0" />
                            <span className="line-clamp-1">{service.address}</span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <User size={13} className="text-slate-400 shrink-0" />
                            <span>Especialista: <strong className="text-slate-700 font-black">{service.assignedStaff}</strong></span>
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-5 pt-3 border-t border-slate-100 font-sans">
                        <div>
                          <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Costo del Servicio</p>
                          <p className="text-sm font-black text-slate-900 font-mono">${service.price} MXN</p>
                        </div>
                        {service.uploadedPhoto && (
                          <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                            <img src={service.uploadedPhoto} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <span className="text-[11px] font-bold text-[#c5a85c] flex items-center gap-0.5">
                          Gestionar <ChevronRight size={14} />
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DETAILED OVERLAY POPUP FOR TECHNICIAN CARD MANAGEMENT */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              layoutId={`srv_grid_card_${selectedService.id}`}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 max-w-lg w-full shadow-2xl relative space-y-6 text-left font-sans"
              id="service_detail_modal_popup"
            >
              <button 
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 transition cursor-pointer"
              >
                <X size={18} />
              </button>

              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-purple-700 font-bold bg-purple-50 border border-purple-200/20 px-2.5 py-0.5 rounded-full font-mono">
                    {selectedService.id}
                  </span>
                  <span className={`px-2.5 py-1 text-xs font-black rounded-full border ${getStatusColor(selectedService.status)}`}>
                    {getStatusLabel(selectedService.status)}
                  </span>
                  <span className={`px-2.5 py-1 text-xs font-black rounded-full ${
                    selectedService.priority === 'Alta' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    selectedService.priority === 'Media' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-slate-105 text-slate-600 border border-slate-200'
                  }`}>
                    Prioridad {selectedService.priority}
                  </span>
                </div>

                <h3 className="text-xl font-serif font-black text-slate-900 mt-3 leading-tight">
                  {selectedService.serviceType}
                </h3>
                <p className="text-base font-black text-purple-700 font-mono mt-1">${selectedService.price} MXN</p>
              </div>

              {/* Uploaded item photo preview from uploader hook */}
              {selectedService.uploadedPhoto && (
                <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-2xl border border-slate-200 text-center">
                  <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Foto del artículo a limpiar (Tomada / Subida por el cliente)</h5>
                  <div className="w-full h-44 rounded-xl overflow-hidden bg-white border border-slate-205 flex items-center justify-center">
                    <img 
                      src={selectedService.uploadedPhoto} 
                      alt="Product to be cleaned" 
                      className="w-full h-full object-contain bg-slate-100" 
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4 py-4 border-y border-slate-150 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Cliente</h5>
                    <p className="font-black text-slate-805">{selectedService.clientName}</p>
                    <p className="text-xs text-slate-450 font-mono">{selectedService.clientEmail}</p>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Técnico Asignado</h5>
                    <p className="font-bold text-slate-805 italic">{selectedService.assignedStaff}</p>
                  </div>
                </div>

                <div>
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Dirección de Destino</h5>
                  <p className="font-semibold text-slate-800 flex items-start gap-1 pb-1">
                    <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                    <span>{selectedService.address}</span>
                  </p>
                </div>

                {selectedService.notes && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <h5 className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1 leading-none font-mono uppercase tracking-wider">
                      <FileText size={12} className="text-slate-400" />
                      Notas de operación
                    </h5>
                    <p className="text-xs text-slate-600 italic leading-relaxed">{selectedService.notes}</p>
                  </div>
                )}
              </div>

              {/* Status editing tools */}
              <div>
                <h4 className="text-[10px] font-black text-slate-550 uppercase tracking-widest mb-3">Cambiar Estado del Servicio</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-sans">
                  <button
                    onClick={() => {
                      onUpdateServiceStatus(selectedService.id, 'programado');
                      setSelectedService(prev => prev ? { ...prev, status: 'programado' } : null);
                    }}
                    className={`px-2 py-2 text-xs font-bold rounded-xl border text-center transition cursor-pointer ${selectedService.status === 'programado' ? 'bg-[#c5a85c] text-white border-transparent' : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'}`}
                  >
                    Programar
                  </button>
                  <button
                    onClick={() => {
                      onUpdateServiceStatus(selectedService.id, 'en_progreso');
                      setSelectedService(prev => prev ? { ...prev, status: 'en_progreso' } : null);
                    }}
                    className={`px-2 py-2 text-xs font-bold rounded-xl border text-center transition cursor-pointer ${selectedService.status === 'en_progreso'    ? 'bg-amber-600' : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'} text-slate-700 border-slate-200 ${selectedService.status === 'en_progreso' ? 'text-white border-transparent' : ''}`}
                  >
                    En Ruta
                  </button>
                  <button
                    onClick={() => {
                      onUpdateServiceStatus(selectedService.id, 'completado');
                      setSelectedService(prev => prev ? { ...prev, status: 'completado' } : null);
                    }}
                    className={`px-2 py-2 text-xs font-bold rounded-xl border text-center transition cursor-pointer ${selectedService.status === 'completado' ? 'bg-emerald-600 text-white border-transparent' : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'}`}
                  >
                    Completar
                  </button>
                  <button
                    onClick={() => {
                      onUpdateServiceStatus(selectedService.id, 'cancelado');
                      setSelectedService(prev => prev ? { ...prev, status: 'cancelado' } : null);
                    }}
                    className={`px-2 py-2 text-xs font-bold rounded-xl border text-center transition cursor-pointer ${selectedService.status === 'cancelado' ? 'bg-rose-600 text-white border-transparent' : 'bg-white text-slate-700 hover:bg-rose-50'}`}
                  >
                    Cancelar
                  </button>
                </div>
              </div>

              <div className="text-right pt-4 border-t border-slate-100">
                <button
                  onClick={() => setSelectedService(null)}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-950 text-white font-black rounded-xl text-xs transition cursor-pointer uppercase tracking-wider"
                >
                  Confirmar y Salir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

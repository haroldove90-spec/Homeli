import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { safeStorage } from '../utils/storage';
import { ProductItem, ServiceRequest, BusinessRegistration } from '../types';
import { 
  Sparkles, 
  ShieldCheck, 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle, 
  ChevronRight, 
  Award, 
  Star, 
  MessageSquare,
  TrendingUp,
  Settings,
  X,
  Plus,
  Send,
  HelpCircle
} from 'lucide-react';

interface LandingPageProps {
  products: ProductItem[];
  services: ServiceRequest[];
  businesses: BusinessRegistration[];
  currentUser: any;
  onAddService: (service: ServiceRequest) => void;
  onAddLog: (message: string, type: 'info' | 'warning' | 'critical' | 'success') => void;
  bannerBg: string;
  bannerTitle: string;
  bannerTag: string;
  bannerDesc: string;
  bannerOverlayCol: string;
  bannerOverlayOpacity: number;
  onUpdateBannerSettings: (bg: string, title: string, tag: string, desc: string, overlayCol: string, overlayOpacity: number) => void;
}

export default function LandingPageSection({
  products,
  services,
  businesses,
  currentUser,
  onAddService,
  onAddLog,
  bannerBg,
  bannerTitle,
  bannerTag,
  bannerDesc,
  bannerOverlayCol,
  bannerOverlayOpacity,
  onUpdateBannerSettings,
}: LandingPageProps) {
  // Safe Storage helper
  const getPersistedText = (key: string, defaultValue: string) => {
    return safeStorage.getItem(key) || defaultValue;
  };

  // Editable Landing Contents
  const [heroTagline, setHeroTagline] = useState(() => getPersistedText('homeli_landing_hero_tagline', 'EXCLUSIVIDAD Y CONFORT'));
  const [aboutTitle, setAboutTitle] = useState(() => getPersistedText('homeli_landing_about_title', 'El Arte del Confort y la Sanidad'));
  const [aboutText, setAboutText] = useState(() => getPersistedText('homeli_landing_about_text', 'En Homeli Boutique redefinimos el cuidado de tu hogar. Fusionamos la elegancia de nuestra exclusiva colección de calzado de descanso con la sanidad más rigurosa de nuestros productos y servicios de limpieza profesional. Creamos espacios armoniosos, impecablemente desinfectados y diseñados para tu máximo confort personal.'));
  
  const [benefit1Title, setBenefit1Title] = useState(() => getPersistedText('homeli_landing_b1_title', 'Sanidad Impecable'));
  const [benefit1Desc, setBenefit1Desc] = useState(() => getPersistedText('homeli_landing_b1_desc', 'Fórmulas biodegradables de grado quirúrgico que protegen a tu familia y tus mascotas.'));
  
  const [benefit2Title, setBenefit2Title] = useState(() => getPersistedText('homeli_landing_b2_title', 'Calzado Premium'));
  const [benefit2Desc, setBenefit2Desc] = useState(() => getPersistedText('homeli_landing_b2_desc', 'Materiales orgánicos y plantillas ergonómicas diseñadas para un descanso absoluto en el hogar.'));

  const [benefit3Title, setBenefit3Title] = useState(() => getPersistedText('homeli_landing_b3_title', 'Servicio Certificado'));
  const [benefit3Desc, setBenefit3Desc] = useState(() => getPersistedText('homeli_landing_b3_desc', 'Personal altamente capacitado con estrictas auditorías de seguridad y bioseguridad.'));

  // Testimonials content
  const [testifierName, setTestifierName] = useState(() => getPersistedText('homeli_landing_testifier', 'Sofía Villarreal G.'));
  const [testimonialText, setTestimonialText] = useState(() => getPersistedText('homeli_landing_testimonial', '“El servicio de sanitización profunda de Homeli devolvió la frescura a mi sala, y sus pantuflas de descanso son una obra de arte para mis pies después de una larga jornada laboral.”'));

  // UI state
  const [showEditor, setShowEditor] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'shoes' | 'cleaning' | 'calculator'>('preview');

  // Calculator states
  const [homeSize, setHomeSize] = useState<number>(120); // sqm
  const [roomsCount, setRoomsCount] = useState<number>(3);
  const [cleaningFrequency, setCleaningFrequency] = useState<'once' | 'weekly' | 'biweekly'>('weekly');
  const [includeDisinfection, setIncludeDisinfection] = useState<boolean>(true);

  // Quote Request Form
  const [quoteName, setQuoteName] = useState('');
  const [quoteEmail, setQuoteEmail] = useState('');
  const [quotePhone, setQuotePhone] = useState('');
  const [quoteService, setQuoteService] = useState('Limpieza Integral');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Handle saving landing content settings
  const handleSaveContent = () => {
    safeStorage.setItem('homeli_landing_hero_tagline', heroTagline);
    safeStorage.setItem('homeli_landing_about_title', aboutTitle);
    safeStorage.setItem('homeli_landing_about_text', aboutText);
    safeStorage.setItem('homeli_landing_b1_title', benefit1Title);
    safeStorage.setItem('homeli_landing_b1_desc', benefit1Desc);
    safeStorage.setItem('homeli_landing_b2_title', benefit2Title);
    safeStorage.setItem('homeli_landing_b2_desc', benefit2Desc);
    safeStorage.setItem('homeli_landing_b3_title', benefit3Title);
    safeStorage.setItem('homeli_landing_b3_desc', benefit3Desc);
    safeStorage.setItem('homeli_landing_testifier', testifierName);
    safeStorage.setItem('homeli_landing_testimonial', testimonialText);
    
    onAddLog('Se actualizaron los textos de la Landing Page pública en el almacenamiento', 'success');
    setShowEditor(false);
  };

  // Cleaning quote calculation
  const calculateEstimate = () => {
    let basePrice = 450; // base price MXN
    basePrice += homeSize * 4; // 4 MXN per sqm
    basePrice += roomsCount * 120; // 120 MXN per room/bathroom
    
    if (includeDisinfection) {
      basePrice += 250; // Special surgical disinfection
    }

    if (cleaningFrequency === 'weekly') {
      basePrice = basePrice * 0.85; // 15% discount for weekly subscription
    } else if (cleaningFrequency === 'biweekly') {
      basePrice = basePrice * 0.90; // 10% discount for biweekly
    }

    return Math.round(basePrice);
  };

  const handleCreateServiceFromQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteName || !quoteEmail) return;

    const newServiceId = `SRV-${Math.floor(1000 + Math.random() * 9000)}`;
    const newService: ServiceRequest = {
      id: newServiceId,
      clientName: quoteName,
      clientEmail: quoteEmail,
      serviceType: quoteService,
      date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days from now
      address: `Solicitado vía Landing Page - Tel: ${quotePhone}`,
      price: quoteService === 'Limpieza Integral' ? calculateEstimate() : 890,
      status: 'programado',
      assignedStaff: 'Por asignar',
      priority: 'Media',
      notes: `${quoteNotes} (Calculado para casa de ${homeSize}m² con ${roomsCount} habitaciones)`
    };

    onAddService(newService);
    onAddLog(`Nueva reservación automática generada desde Landing Page: ${quoteName} (${newServiceId})`, 'success');
    setFormSubmitted(true);
    
    setTimeout(() => {
      setFormSubmitted(false);
      setQuoteName('');
      setQuoteEmail('');
      setQuotePhone('');
      setQuoteNotes('');
    }, 4500);
  };

  // Filter catalog items
  const shoesProducts = products.filter(p => p.category === 'Zapatos' && p.active !== false);
  const cleaningProducts = products.filter(p => p.category === 'Productos de limpieza' && p.active !== false);

  return (
    <div className="space-y-12" id="landing_page_module">
      
      {/* Header and Editor Toggle Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 border border-slate-200 rounded-3xl p-5 gap-4 shadow-xs" id="landing_admin_bar">
        <div className="text-left space-y-1">
          <span className="px-2.5 py-0.5 bg-[#c5a85c]/10 text-[#a38439] rounded text-[10px] font-black tracking-wider uppercase">
            Módulo Público Activo
          </span>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Landing Page Boutique & Captación
          </h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Este módulo representa la página de cara al público de Homeli. Permite captar clientes de manera directa mediante cotizaciones en tiempo real e integra el catálogo de calzado y sanidad.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {currentUser?.role === 'Administrador' ? (
            <button
              onClick={() => setShowEditor(!showEditor)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              id="btn_toggle_landing_editor"
            >
              <Settings size={14} className={showEditor ? "animate-spin" : ""} />
              {showEditor ? 'Cerrar Editor' : 'Personalizar Contenido'}
            </button>
          ) : (
            <div className="text-xs bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-2 rounded-xl flex items-center gap-1.5">
              <span>💡</span>
              <span>Inicia sesión como <strong>Admin</strong> para editar estos textos.</span>
            </div>
          )}
        </div>
      </div>

      {/* TEXTS AND COVER EDITOR (Visible for Administrators) */}
      <AnimatePresence>
        {showEditor && currentUser?.role === 'Administrador' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white border-2 border-[#c5a85c]/30 rounded-3xl p-6 shadow-lg space-y-6 text-left"
            id="landing_editor_panel"
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                <span className="text-lg">✍️</span>
                Editor del Sistema Landing Page Homeli
              </h3>
              <button 
                onClick={() => setShowEditor(false)}
                className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Cover & Hero Settings */}
              <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-150">
                <h4 className="text-xs font-extrabold text-[#a38439] uppercase tracking-wider">
                  1. Encabezado de la Landing (Boutique Hero)
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">Título Principal (Hero)</label>
                    <input 
                      type="text" 
                      value={bannerTitle} 
                      onChange={(e) => onUpdateBannerSettings(bannerBg, e.target.value, bannerTag, bannerDesc, bannerOverlayCol, bannerOverlayOpacity)}
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-[#c5a85c]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">Etiqueta Dorada</label>
                      <input 
                        type="text" 
                        value={bannerTag} 
                        onChange={(e) => onUpdateBannerSettings(bannerBg, bannerTitle, e.target.value, bannerDesc, bannerOverlayCol, bannerOverlayOpacity)}
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-[#c5a85c]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">Subetiqueta Landing</label>
                      <input 
                        type="text" 
                        value={heroTagline} 
                        onChange={(e) => setHeroTagline(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-[#c5a85c]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">Descripción del Hero</label>
                    <textarea 
                      value={bannerDesc} 
                      onChange={(e) => onUpdateBannerSettings(bannerBg, bannerTitle, bannerTag, e.target.value, bannerOverlayCol, bannerOverlayOpacity)}
                      rows={3}
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-[#c5a85c] resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">Imagen de Fondo URL (Opcional - Vacío para Gradiente)</label>
                    <input 
                      type="text" 
                      value={bannerBg} 
                      onChange={(e) => onUpdateBannerSettings(e.target.value, bannerTitle, bannerTag, bannerDesc, bannerOverlayCol, bannerOverlayOpacity)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl font-mono text-slate-700 focus:outline-none focus:border-[#c5a85c]"
                    />
                  </div>
                </div>
              </div>

              {/* Corporate Marketing content settings */}
              <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-150">
                <h4 className="text-xs font-extrabold text-[#a38439] uppercase tracking-wider">
                  2. Sección Nosotros y Propuesta
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">Título Nosotros</label>
                    <input 
                      type="text" 
                      value={aboutTitle} 
                      onChange={(e) => setAboutTitle(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">Texto de Filosofía</label>
                    <textarea 
                      value={aboutText} 
                      onChange={(e) => setAboutText(e.target.value)}
                      rows={4}
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">Testigo Nombre</label>
                      <input 
                        type="text" 
                        value={testifierName} 
                        onChange={(e) => setTestifierName(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">Testimonio Reseña</label>
                      <input 
                        type="text" 
                        value={testimonialText} 
                        onChange={(e) => setTestimonialText(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-700"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Benefits cards edit */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-4">
              <h4 className="text-xs font-extrabold text-[#a38439] uppercase tracking-wider">
                3. Tres Pilares / Beneficios de la Marca
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                  <input 
                    type="text" 
                    value={benefit1Title} 
                    onChange={(e) => setBenefit1Title(e.target.value)} 
                    className="w-full text-xs font-black p-1.5 border-b border-slate-100 focus:outline-none" 
                    placeholder="Pilar 1"
                  />
                  <textarea 
                    value={benefit1Desc} 
                    onChange={(e) => setBenefit1Desc(e.target.value)} 
                    className="w-full text-[11px] text-slate-600 p-1.5 h-16 resize-none focus:outline-none"
                    placeholder="Descripción 1"
                  />
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                  <input 
                    type="text" 
                    value={benefit2Title} 
                    onChange={(e) => setBenefit2Title(e.target.value)} 
                    className="w-full text-xs font-black p-1.5 border-b border-slate-100 focus:outline-none" 
                    placeholder="Pilar 2"
                  />
                  <textarea 
                    value={benefit2Desc} 
                    onChange={(e) => setBenefit2Desc(e.target.value)} 
                    className="w-full text-[11px] text-slate-600 p-1.5 h-16 resize-none focus:outline-none"
                    placeholder="Descripción 2"
                  />
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                  <input 
                    type="text" 
                    value={benefit3Title} 
                    onChange={(e) => setBenefit3Title(e.target.value)} 
                    className="w-full text-xs font-black p-1.5 border-b border-slate-100 focus:outline-none" 
                    placeholder="Pilar 3"
                  />
                  <textarea 
                    value={benefit3Desc} 
                    onChange={(e) => setBenefit3Desc(e.target.value)} 
                    className="w-full text-[11px] text-slate-600 p-1.5 h-16 resize-none focus:outline-none"
                    placeholder="Descripción 3"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowEditor(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveContent}
                className="px-5 py-2 bg-[#c5a85c] hover:bg-[#b59549] text-white text-xs font-bold rounded-xl transition shadow-xs"
              >
                Guardar Cambios
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LANDING CONTENT SECTION */}
      <div className="bg-white rounded-[32px] border border-slate-150 shadow-sm overflow-hidden" id="landing_live_page_card">
        
        {/* BOUTIQUE HERO COVER HEADER */}
        <div 
          className="relative min-h-[500px] flex items-center justify-center p-8 sm:p-16 text-center overflow-hidden transition-all duration-700"
          style={{
            backgroundImage: bannerBg ? `url(${bannerBg})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: bannerOverlayCol
          }}
          id="landing_hero_cover"
        >
          {/* Ambient overlays */}
          {!bannerBg && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-[#1e1a0f]" />
          )}
          <div 
            className="absolute inset-0 mix-blend-multiply transition-opacity duration-300" 
            style={{ 
              backgroundColor: bannerOverlayCol, 
              opacity: (bannerOverlayOpacity / 100) 
            }} 
          />
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/40 pointer-events-none" />

          {/* Golden animated dust particles */}
          <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-screen" style={{ backgroundImage: 'radial-gradient(circle, #c5a85c 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

          <div className="relative max-w-3xl space-y-6 z-10 flex flex-col items-center">
            
            {/* Elegant Golden Tag */}
            <motion.div 
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#c5a85c]/20 border border-[#c5a85c]/40 rounded-full text-[#c5a85c] text-[10px] font-black tracking-widest uppercase select-none"
            >
              <Sparkles size={11} className="animate-spin" style={{ animationDuration: '4s' }} />
              <span>{bannerTag || 'BOUTIQUE'}</span>
              <span className="w-1 h-1 rounded-full bg-[#c5a85c] mx-0.5" />
              <span>{heroTagline}</span>
            </motion.div>

            {/* Premium Typography Heading */}
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none"
              style={{ fontFamily: '"Space Grotesk", sans-serif' }}
            >
              {bannerTitle || 'Catálogo Exclusivo Homeli'}
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs sm:text-sm text-slate-200 max-w-xl mx-auto leading-relaxed font-medium"
            >
              {bannerDesc || 'Descubre nuestras dos exclusivas divisiones diseñadas meticulosamente para brindar confort personal y sanidad impecable en tu hogar.'}
            </motion.p>

            {/* Quick Action buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-3 pt-4"
            >
              <button
                onClick={() => {
                  const el = document.getElementById('interactive_modules_section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                  setActiveTab('calculator');
                }}
                className="px-6 py-3 bg-[#c5a85c] hover:bg-[#b59549] text-white text-xs font-black rounded-xl transition shadow-md transform hover:-translate-y-0.5"
              >
                Cotizador Inteligente
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('contact_booking_section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-black rounded-xl transition backdrop-blur-sm"
              >
                Agendar Servicio en Línea
              </button>
            </motion.div>
          </div>
        </div>

        {/* THREE PILARS / CORPORATE VALUE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-slate-100" id="landing_value_cards">
          
          <div className="p-8 space-y-3 text-left hover:bg-slate-50/50 transition border-b md:border-b-0 md:border-r border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-[#c5a85c]/10 text-[#a38439] flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <h4 className="text-sm font-black text-slate-800">{benefit1Title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">{benefit1Desc}</p>
          </div>

          <div className="p-8 space-y-3 text-left hover:bg-slate-50/50 transition border-b md:border-b-0 md:border-r border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Heart size={20} />
            </div>
            <h4 className="text-sm font-black text-slate-800">{benefit2Title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">{benefit2Desc}</p>
          </div>

          <div className="p-8 space-y-3 text-left hover:bg-slate-50/50 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award size={20} />
            </div>
            <h4 className="text-sm font-black text-slate-800">{benefit3Title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">{benefit3Desc}</p>
          </div>

        </div>

        {/* SECTION 2: BRAND PHILOSOPHY & ABOUT US */}
        <div className="p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-50/30">
          
          {/* Narrative Content */}
          <div className="lg:col-span-7 text-left space-y-5">
            <div className="inline-flex items-center gap-1 text-xs text-[#a38439] font-black uppercase tracking-wider">
              <span>💎</span>
              <span>Filosofía de Servicio Homeli</span>
            </div>
            <h2 className="text-2xl sm:text-3.5xl font-black text-slate-800 tracking-tight leading-none" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              {aboutTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {aboutText}
            </p>

            {/* Testimonial Quote */}
            <div className="bg-white border border-slate-150 p-5 rounded-2xl space-y-3 shadow-xs">
              <p className="text-xs text-slate-500 italic font-medium">
                {testimonialText}
              </p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs">⭐</div>
                <div className="text-left leading-none">
                  <p className="text-[10px] font-black text-slate-800">{testifierName}</p>
                  <p className="text-[8px] font-bold text-slate-400 mt-0.5">Cliente Homeli Exclusive</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Interactive Panel Mock */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Socio Patrocinador Oficial
              </span>
              <span className="text-[10px] font-mono text-slate-400">Homeli Hub</span>
            </div>

            {businesses.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-lg select-none">
                    🏢
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-black text-slate-800">{businesses[0].name}</h4>
                    <p className="text-[10px] font-bold text-[#a38439]">{businesses[0].giro}</p>
                  </div>
                </div>
                
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  Patrocinador oficial de los insumos ecológicos y el soporte logístico prioritario en toda el área metropolitana de Homeli.
                </p>

                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="text-left">
                    <p className="text-[8px] text-slate-400 uppercase font-bold">Contacto</p>
                    <p className="text-[10px] font-bold text-slate-700 truncate">{businesses[0].whatsapp || businesses[0].telephones}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-[8px] text-slate-400 uppercase font-bold">Ubicación</p>
                    <p className="text-[10px] font-bold text-slate-700 truncate">{businesses[0].address}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Cargando socios de negocios patrocinadores...</p>
            )}

            <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
              <span className="text-[9px] text-slate-400 font-bold">Soporte Integrado</span>
              <span className="text-[10px] text-[#c5a85c] font-black">100% Sanitizado</span>
            </div>
          </div>

        </div>

        {/* INTERACTIVE MODULES TAB SECTION */}
        <div className="border-t border-slate-100 p-8 sm:p-12 space-y-8" id="interactive_modules_section">
          
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black text-[#a38439] uppercase tracking-wider bg-amber-50 px-2.5 py-1 rounded">
              Explora Nuestro Catálogo
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              Servicios y Artículos de Alta Gama
            </h3>
            <p className="text-xs text-slate-500 max-w-lg mx-auto">
              Navega en tiempo real entre nuestras exclusivas colecciones de calzado ergonómico y productos de sanidad impecable.
            </p>
          </div>

          {/* Navigation Tab bar */}
          <div className="flex justify-center border-b border-slate-100 max-w-md mx-auto p-0.5 bg-slate-50 border border-slate-200 rounded-xl" id="landing_tabs">
            <button 
              onClick={() => setActiveTab('preview')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeTab === 'preview' ? 'bg-[#c5a85c] text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Servicios Premium
            </button>
            <button 
              onClick={() => setActiveTab('shoes')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeTab === 'shoes' ? 'bg-[#c5a85c] text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Calzado 👠
            </button>
            <button 
              onClick={() => setActiveTab('cleaning')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeTab === 'cleaning' ? 'bg-[#c5a85c] text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Sanidad 🧴
            </button>
            <button 
              onClick={() => setActiveTab('calculator')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeTab === 'calculator' ? 'bg-[#c5a85c] text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Calculador 🧮
            </button>
          </div>

          {/* Tab contents with motion */}
          <AnimatePresence mode="wait">
            
            {/* Tab 1: Premium Services list */}
            {activeTab === 'preview' && (
              <motion.div 
                key="tab_services"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left"
              >
                {[
                  { name: 'Limpieza Integral de Interiores', desc: 'Saneamiento exhaustivo de habitaciones, cocina, cristales y mobiliario fino.', price: '$1,250 MXN', icon: '✨' },
                  { name: 'Sanitización Quirúrgica', desc: 'Nebulización profunda ecológica que elimina el 99.9% de gérmenes y bacterias.', price: '$850 MXN', icon: '🧴' },
                  { name: 'Lavandería y Cuidado Fino', desc: 'Tratamiento exclusivo para sábanas de hilos altos, toallas y prendas delicadas.', price: '$590 MXN', icon: '🧺' },
                ].map((srv, idx) => (
                  <div key={idx} className="bg-slate-50 hover:bg-slate-100/50 border border-slate-200/80 rounded-2xl p-5 space-y-4 flex flex-col justify-between transition shadow-2xs group">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-2xl select-none">{srv.icon}</span>
                        <span className="px-2 py-0.5 bg-emerald-50 rounded text-emerald-600 text-[9px] font-extrabold uppercase">Súper Sanitizado</span>
                      </div>
                      <h4 className="text-xs font-black text-slate-800 group-hover:text-[#a38439] transition-colors">{srv.name}</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{srv.desc}</p>
                    </div>
                    <div className="pt-3 border-t border-slate-200/60 flex justify-between items-center">
                      <div>
                        <p className="text-[8px] text-slate-400 font-bold uppercase">Estimado base</p>
                        <p className="text-xs font-black text-slate-800">{srv.price}</p>
                      </div>
                      <button
                        onClick={() => {
                          setQuoteService(srv.name);
                          const el = document.getElementById('contact_booking_section');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="p-2 bg-[#c5a85c]/10 text-[#a38439] rounded-xl hover:bg-[#c5a85c] hover:text-white transition cursor-pointer"
                        title="Seleccionar y agendar"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Tab 2: Shoes products from live store */}
            {activeTab === 'shoes' && (
              <motion.div 
                key="tab_shoes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left"
              >
                {shoesProducts.slice(0, 4).map((prod) => (
                  <div key={prod.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition flex flex-col justify-between group">
                    <div className="relative bg-slate-50/50 aspect-square flex items-center justify-center p-4">
                      {prod.imageUrl ? (
                        <img 
                          src={prod.imageUrl} 
                          alt={prod.name} 
                          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-3xl select-none">👠</span>
                      )}
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#c5a85c]/20 text-[#a38439] border border-[#c5a85c]/30 rounded text-[8px] font-black uppercase">
                        Confort Fino
                      </span>
                    </div>

                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-slate-800 truncate" title={prod.name}>{prod.name}</h4>
                        <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight font-medium">{prod.description}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                        <div>
                          <p className="text-[8px] text-slate-400 font-bold">PRECIO</p>
                          <p className="text-xs font-black text-slate-800">${prod.price.toLocaleString()} MXN</p>
                        </div>
                        <span className="text-[10px] text-amber-500 font-bold flex items-center gap-0.5">
                          <Star size={10} fill="currentColor" />
                          4.9
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Tab 3: Cleaning products from live store */}
            {activeTab === 'cleaning' && (
              <motion.div 
                key="tab_cleaning"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left"
              >
                {cleaningProducts.slice(0, 4).map((prod) => (
                  <div key={prod.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition flex flex-col justify-between group">
                    <div className="relative bg-slate-50/50 aspect-square flex items-center justify-center p-4">
                      {prod.imageUrl ? (
                        <img 
                          src={prod.imageUrl} 
                          alt={prod.name} 
                          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-3xl select-none">🧴</span>
                      )}
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded text-[8px] font-black uppercase">
                        Grado Quirúrgico
                      </span>
                    </div>

                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-slate-800 truncate" title={prod.name}>{prod.name}</h4>
                        <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight font-medium">{prod.description}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                        <div>
                          <p className="text-[8px] text-slate-400 font-bold">PRECIO</p>
                          <p className="text-xs font-black text-slate-800">${prod.price.toLocaleString()} MXN</p>
                        </div>
                        <span className="text-[10px] text-emerald-600 font-black">ECO-friendly</span>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Tab 4: Interactive Quote/Cleanliness Calculator */}
            {activeTab === 'calculator' && (
              <motion.div 
                key="tab_calculator"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-slate-50 border border-slate-200 rounded-3xl p-6 text-left grid grid-cols-1 md:grid-cols-12 gap-8"
              >
                
                {/* Sliders and controls */}
                <div className="md:col-span-7 space-y-6">
                  <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                    <span>🧮</span>
                    Configuración de Espacios
                  </h4>

                  <div className="space-y-5">
                    {/* Size of home slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-600">Tamaño de la Casa / Oficina</label>
                        <span className="text-xs font-black text-[#a38439] bg-white border border-slate-200 px-2.5 py-0.5 rounded-md shadow-3xs">{homeSize} m²</span>
                      </div>
                      <input 
                        type="range" 
                        min="30" 
                        max="400" 
                        value={homeSize} 
                        onChange={(e) => setHomeSize(Number(e.target.value))}
                        className="w-full accent-[#c5a85c] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                        <span>30 m² (Apartamento)</span>
                        <span>400 m² (Residencia)</span>
                      </div>
                    </div>

                    {/* Rooms count slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-600">Número de Habitaciones / Baños</label>
                        <span className="text-xs font-black text-[#a38439] bg-white border border-slate-200 px-2.5 py-0.5 rounded-md shadow-3xs">{roomsCount} áreas</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        value={roomsCount} 
                        onChange={(e) => setRoomsCount(Number(e.target.value))}
                        className="w-full accent-[#c5a85c] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                        <span>1 Habitación</span>
                        <span>10 Áreas Grandes</span>
                      </div>
                    </div>

                    {/* Frequency selector */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-600 block">Frecuencia de Limpieza recomendada</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'once', label: 'Única vez', discount: 'Normal' },
                          { id: 'weekly', label: 'Semanal', discount: '-15% Desc' },
                          { id: 'biweekly', label: 'Quincenal', discount: '-10% Desc' },
                        ].map((freq) => (
                          <button
                            key={freq.id}
                            onClick={() => setCleaningFrequency(freq.id as any)}
                            className={`p-3 text-left border rounded-xl transition cursor-pointer ${cleaningFrequency === freq.id ? 'bg-[#c5a85c]/15 border-[#c5a85c] text-[#a38439]' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                          >
                            <p className="text-xs font-bold leading-none">{freq.label}</p>
                            <p className="text-[9px] font-extrabold text-slate-400 mt-1 leading-none">{freq.discount}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Advanced surgical disinfection toggle */}
                    <label className="flex items-center gap-3 bg-white p-3.5 border border-slate-200 rounded-2xl cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={includeDisinfection} 
                        onChange={(e) => setIncludeDisinfection(e.target.checked)}
                        className="w-4 h-4 rounded text-[#c5a85c] focus:ring-[#c5a85c] border-slate-300"
                      />
                      <div className="text-left leading-tight">
                        <p className="text-xs font-black text-slate-800">Saneamiento Nebulizado Quirúrgico (+ $250 MXN)</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Fórmula ecológica que inactiva hongos, bacterias y patógenos en el aire y superficies.</p>
                      </div>
                    </label>

                  </div>
                </div>

                {/* Estimate output and dynamic quotation box */}
                <div className="md:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-6">
                  
                  <div className="space-y-3">
                    <span className="px-2 py-0.5 bg-[#c5a85c]/10 text-[#a38439] rounded text-[9px] font-black tracking-wider uppercase">
                      Estimado Personalizado
                    </span>
                    <h5 className="text-xs font-black text-slate-800">Resumen de Cotización</h5>
                    
                    <div className="space-y-2 text-xs font-bold text-slate-500">
                      <div className="flex justify-between">
                        <span>Área calculada:</span>
                        <span className="text-slate-800">{homeSize} m²</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Zonas de limpieza:</span>
                        <span className="text-slate-800">{roomsCount} áreas</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Frecuencia:</span>
                        <span className="text-slate-800 capitalize">{cleaningFrequency === 'once' ? 'Única vez' : cleaningFrequency === 'weekly' ? 'Semanal' : 'Quincenal'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nebulización quirúrgica:</span>
                        <span className="text-slate-800">{includeDisinfection ? 'Incluida' : 'Excluida'}</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-3 flex justify-between items-end">
                      <div>
                        <p className="text-[9px] text-slate-400 uppercase font-black">Costo Estimado</p>
                        <p className="text-2xl font-black text-[#a38439]">${calculateEstimate().toLocaleString()} <span className="text-xs font-bold text-slate-500">MXN</span></p>
                      </div>
                      <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">IVA Incluido</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setQuoteService('Limpieza Integral');
                      setQuoteNotes(`Cotización calculada para casa de ${homeSize}m² con ${roomsCount} habitaciones. Frecuencia: ${cleaningFrequency}. Nebulización: ${includeDisinfection ? 'Sí' : 'No'}.`);
                      const el = document.getElementById('contact_booking_section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl transition shadow-xs text-center cursor-pointer uppercase tracking-wider"
                  >
                    Agendar este presupuesto
                  </button>
                </div>

              </motion.div>
            )}

          </AnimatePresence>

        </div>

        {/* SECTION 3: DIRECT CAPTATION & APPOINTMENT BOOKING FORM */}
        <div className="p-8 sm:p-12 lg:p-16 border-t border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-8 bg-slate-50/20" id="contact_booking_section">
          
          <div className="lg:col-span-5 text-left space-y-6">
            <span className="px-2.5 py-0.5 bg-[#c5a85c]/10 text-[#a38439] rounded text-[10px] font-black tracking-wider uppercase inline-block">
              Atención Inmediata
            </span>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
              Agenda tu Servicio de Sanidad Homeli
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Completa el formulario interactivo para programar tu servicio de limpieza profunda o sanitización. Un asesor de Homeli se comunicará contigo en menos de 15 minutos para confirmar el bloque de tiempo.
            </p>

            {/* Quick contact list */}
            <div className="space-y-3 pt-3">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-150 flex items-center justify-center text-[#a38439]">
                  <Phone size={14} />
                </div>
                <div className="text-left">
                  <p className="text-[8px] text-slate-400 font-bold uppercase">Llamadas o WhatsApp</p>
                  <p className="text-xs font-bold text-slate-700">+52 (55) 4321-0987</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-150 flex items-center justify-center text-[#a38439]">
                  <Mail size={14} />
                </div>
                <div className="text-left">
                  <p className="text-[8px] text-slate-400 font-bold uppercase">Correo Electrónico</p>
                  <p className="text-xs font-bold text-slate-700">contacto@homeli.com.mx</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-150 flex items-center justify-center text-[#a38439]">
                  <MapPin size={14} />
                </div>
                <div className="text-left">
                  <p className="text-[8px] text-slate-400 font-bold uppercase">Cobertura Premium</p>
                  <p className="text-xs font-bold text-slate-700">CDMX, Monterrey y Guadalajara</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form area */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            
            <AnimatePresence mode="wait">
              {formSubmitted ? (
                <motion.div 
                  key="success_view"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-12 text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto border border-emerald-100 text-2xl select-none">
                    🎉
                  </div>
                  <h4 className="text-lg font-black text-slate-800">¡Tu reservación ha sido generada!</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Hemos registrado exitosamente el servicio de <strong>{quoteService}</strong> en nuestra agenda central. Tu folio temporal se ha enviado a tu correo. Un asesor de Homeli te llamará pronto.
                  </p>
                  <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl max-w-xs mx-auto text-left space-y-1">
                    <p className="text-[9px] text-slate-400 uppercase font-black">Siguiente Paso</p>
                    <p className="text-xs text-slate-600 font-semibold">Puedes ver tu reservación ingresando al <strong>Panel de Servicios</strong> de la aplicación.</p>
                  </div>
                </motion.div>
              ) : (
                <motion.form 
                  key="form_view"
                  onSubmit={handleCreateServiceFromQuote}
                  className="space-y-4 text-left"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Nombre Completo</label>
                      <input 
                        type="text" 
                        required 
                        value={quoteName} 
                        onChange={(e) => setQuoteName(e.target.value)}
                        placeholder="Ej: Alejandro Garza"
                        className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-[#c5a85c]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Correo Electrónico</label>
                      <input 
                        type="email" 
                        required 
                        value={quoteEmail} 
                        onChange={(e) => setQuoteEmail(e.target.value)}
                        placeholder="ejemplo@correo.com"
                        className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-[#c5a85c]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Teléfono Móvil (WhatsApp)</label>
                      <input 
                        type="tel" 
                        value={quotePhone} 
                        onChange={(e) => setQuotePhone(e.target.value)}
                        placeholder="55-1234-5678"
                        className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-[#c5a85c]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Servicio Requerido</label>
                      <select 
                        value={quoteService} 
                        onChange={(e) => setQuoteService(e.target.value)}
                        className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:border-[#c5a85c]"
                      >
                        <option value="Limpieza Integral">Limpieza Integral de Interiores</option>
                        <option value="Sanitización Quirúrgica">Sanitización Quirúrgica Profunda</option>
                        <option value="Lavandería y Cuidado Fino">Lavandería y Cuidado Fino</option>
                        <option value="Mantenimiento Fontanería">Mantenimiento y Fontanería</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Notas de Sanitización o Dirección</label>
                    <textarea 
                      value={quoteNotes} 
                      onChange={(e) => setQuoteNotes(e.target.value)}
                      placeholder="Indícanos si tienes mascotas o requerimientos especiales de desinfección..."
                      rows={3}
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-[#c5a85c] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#c5a85c] hover:bg-[#b59549] text-white text-xs font-black rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                  >
                    <Send size={14} />
                    <span>Confirmar Reservación de Sanitización</span>
                  </button>

                  <p className="text-[10px] text-slate-400 text-center font-bold">
                    🛡️ Tu información está protegida por nuestra política de privacidad boutique de alta seguridad.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>

    </div>
  );
}

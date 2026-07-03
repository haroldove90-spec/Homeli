-- =====================================================================
-- DATABASE SCHEMA & INITIAL DATA SEED - HOMELI ATELIER V2
-- Target Engines: PostgreSQL / MySQL / CockroachDB
-- Fully synchronized with current in-memory React application catalog
-- =====================================================================

BEGIN;

-- 1. DROP EXISTING TABLES IF NEEDED
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS business_services CASCADE;
DROP TABLE IF EXISTS businesses CASCADE;

-- 2. CREATE SCHEMAS

-- Table: Users (Profiles/Colaboradores)
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Administrador', 'Servicios', 'Ventas', 'Mensajería', 'Negocio')),
    status VARCHAR(50) NOT NULL DEFAULT 'Activo' CHECK (status IN ('Activo', 'Inactivo')),
    password VARCHAR(255) NOT NULL DEFAULT 'password123',
    last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Categories
CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Products (Catálogo de Artículos)
CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    category_id VARCHAR(50) NOT NULL REFERENCES categories(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00 CHECK (price >= 0),
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    sales_count INT NOT NULL DEFAULT 0 CHECK (sales_count >= 0),
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Orders (Pedidos de la Tienda)
CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00 CHECK (total_amount >= 0),
    status VARCHAR(50) NOT NULL DEFAULT 'procesando' CHECK (status IN ('procesando', 'enviado', 'entregado', 'cancelado')),
    items_count INT NOT NULL DEFAULT 1 CHECK (items_count >= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Order Items (Relación muchos-a-muchos intermedia)
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
    product_id VARCHAR(50) REFERENCES products(id) ON DELETE SET NULL ON UPDATE CASCADE,
    product_name_fallback VARCHAR(255) NOT NULL, -- Safeguard if product gets deleted
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity >= 1),
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00 CHECK (unit_price >= 0)
);

-- Table: Services (Agendamiento de Servicios Operativos)
CREATE TABLE services (
    id VARCHAR(50) PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    address TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    status VARCHAR(50) NOT NULL DEFAULT 'programado' CHECK (status IN ('programado', 'en_progreso', 'completado', 'cancelado')),
    assigned_staff VARCHAR(255) NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'Media' CHECK (priority IN ('Baja', 'Media', 'Alta')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Audit Logs (Bitácora de Sucesos)
CREATE TABLE audit_logs (
    id VARCHAR(50) PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actor VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Administrador', 'Servicios', 'Ventas', 'Mensajería', 'Negocio')),
    action TEXT NOT NULL,
    severity VARCHAR(30) NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical'))
);

-- Table: Businesses (Negocios / Patrocinadores)
CREATE TABLE businesses (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo TEXT,
    address TEXT NOT NULL,
    map_link TEXT,
    telephones VARCHAR(100),
    whatsapp VARCHAR(100),
    owner_name VARCHAR(255) NOT NULL,
    giro VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Activo' CHECK (status IN ('Activo', 'Suspendido')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: Business Services (Servicios por Negocio)
CREATE TABLE business_services (
    id SERIAL PRIMARY KEY,
    business_id VARCHAR(50) NOT NULL REFERENCES businesses(id) ON DELETE CASCADE ON UPDATE CASCADE,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00 CHECK (price >= 0),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- 3. CREATE STABILITY INDEXES for performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_services_status ON services(status);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_business_services_biz ON business_services(business_id);
CREATE INDEX idx_businesses_status ON businesses(status);


-- 4. INSERT DATA SEEDING (Sincronizado con data.ts)

-- Users Data
INSERT INTO users (id, name, email, role, status, last_active) VALUES
('USR-201', 'Felipe Alarcón', 'felipe.alarcon@homeli.mx', 'Administrador', 'Activo', CURRENT_TIMESTAMP - INTERVAL '3 MINUTES'),
('USR-202', 'José Luis Alavez', 'joseluis@homeli.mx', 'Servicios', 'Activo', CURRENT_TIMESTAMP - INTERVAL '1 HOUR'),
('USR-203', 'Valeria Martínez', 'valeria.sales@homeli.mx', 'Ventas', 'Activo', CURRENT_TIMESTAMP - INTERVAL '5 MINUTES'),
('USR-204', 'Eduardo Gándara', 'eduardo.g@homeli.mx', 'Servicios', 'Inactivo', CURRENT_TIMESTAMP - INTERVAL '1 DAY');

-- E-commerce Categories Data
INSERT INTO categories (id, name, description) VALUES
('CAT-01', 'Zapatos', 'Calzado ergonómico y corporativo premium de alta costura y estilo cómodo.'),
('CAT-02', 'Productos de limpieza', 'Soluciones y compuestos biodegradables de clase industrial y hogareña para desinfección profunda.'),
('CAT-03', 'Seguridad', 'Dispositivos de cerrajería inteligente y hardware de protección de accesos.'),
('CAT-04', 'Hogar', 'Mueblería, purificación de agua y utensilios de utilidad hogareña.'),
('CAT-05', 'Herramientas', 'Kits de precisión metálica de desarmadores y gadgets de reparación.');

-- Products Catalog Seeding
INSERT INTO products (id, name, sku, category_id, price, stock, sales_count, description, image_url) VALUES
-- Compatibility originals
('PROD-001', 'Kit de Limpieza Multiusos Homeli-Pro', 'HML-KIT-01', 'CAT-02', 349.00, 85, 142, 'Kit completo biodegradable diseñado para superficies delicadas. Incluye 3 rociadores, paños de microfibra de alta densidad y abrillantador ecológico.', 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'),
('PROD-002', 'Cerradura Inteligente Homeli Secure Gen2', 'HML-SHL-02', 'CAT-03', 2499.00, 14, 45, 'Apertura mediante huella dactilar, clave numérica, app móvil o llave de emergencia. Integrable con Homeli App del Administrador.', 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'),
('PROD-003', 'Filtro Purificador de Agua Carbón Activado', 'HML-FLT-11', 'CAT-04', 599.00, 40, 98, 'Filtro purificador de 5 etapas desmontable. Filtrado óptimo de sedimentos y sabor metálico. Instalación estándar para fregadero de cocina.', 'https://images.unsplash.com/photo-1585832770485-e68a5dbfad52?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'),
('PROD-004', 'Set de Desarmadores Ergonómicos de Precisión', 'HML-TOOL-29', 'CAT-05', 189.00, 120, 215, 'Set de 24 cabezales intercambiables de acero al cromo vanadio. Ideal para reparaciones electrónicas menores e instalación de accesorios del hogar.', 'https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'),

-- Zapatos Seeding (6 items)
('SHO-001', 'Tenis Deportivos Urbanos Pro', 'HML-ZAP-01', 'CAT-01', 899.00, 24, 15, 'Calzado ergonómico transpirable con suela de amortiguación reforzada, ideal para caminar o actividades deportivas cotidianas.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsPlV5u1UOTpXsbHztz8RAntDJ8LeRMTVFaQ&s'),
('SHO-002', 'Tacones Elegantes de Dama Premium', 'HML-ZAP-02', 'CAT-01', 1249.00, 12, 8, 'Zapatos de tacón alto de diseño estilizado con plantilla acolchada especial que garantiza comodidad sin perder la elegancia corporativa.', 'https://http2.mlstatic.com/D_NQ_NP_892119-MLM107536539708_032026-O-zapatos-de-tacon-para-dama.webp'),
('SHO-003', 'Mocasines Oxford en Piel Noble', 'HML-ZAP-03', 'CAT-01', 950.00, 18, 12, 'Mocasines casuales confeccionados en piel de gran calidad con costuras reforzadas a mano y soporte anatómico interno.', 'https://i5.walmartimages.com/asr/a7f7be61-d437-47e6-9055-38bbf88221a5.3ffac1d7b8ab258d67177a5f64909dd1.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF'),
('SHO-004', 'Botas de Trabajo Robustas Protect', 'HML-ZAP-04', 'CAT-01', 1499.00, 15, 6, 'Botas industriales de alta resistencia con puntera protectora reforzada e impermeabilidad garantizada para todo tipo de terreno.', 'https://i5.walmartimages.com/asr/27da81b6-9b11-40f3-8676-e79c776d1cac.b9d1842f0abc1b5ef370ebf33851477e.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF'),
('SHO-005', 'Zapatillas Casuales de Lona Retro', 'HML-ZAP-05', 'CAT-01', 599.00, 45, 34, 'Clásicos tenis de lona transpirable con suela vulcanizada de alta durabilidad para un estilo fresco y un andar ultraligero.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuZfJOXBwKruDyOvaXo11a4qhIEnjr-6K-gw&s'),
('SHO-006', 'Mocasines Modernos Soft-Fit Flex', 'HML-ZAP-06', 'CAT-01', 799.00, 22, 19, 'Zapatos cómodos de vestir con diseño elástico de fácil calzado, ideales para jornadas extensas de pie.', 'https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/0f0fa935ea6bcae5e5f6a25f5f87cf7c.jpg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp'),

-- Productos de limpieza Seeding (6 items)
('CLN-001', 'Detergente Líquido Persil Profesional 5L', 'HML-LIM-01', 'CAT-02', 289.00, 35, 52, 'Detergente premium alemán súper concentrado para lavado profundo que protege la intensidad del color y remueve manchas desde la primera lavada.', 'https://www.jadyquimica.com/wp-content/uploads/2023/08/Detergente-liquido-persil-color-pina-de-5-1-600x600.jpg'),
('CLN-002', 'Suavizante de Telas Concentrado Care', 'HML-LIM-02', 'CAT-02', 125.00, 40, 41, 'Suavizante intensivo que reduce la estática, facilita el planchado y deja una fragancia de larga duración sumamente fresca.', 'https://images-na.ssl-images-amazon.com/images/I/51cqPQUFOHL._AC_UL375_SR375,375_.jpg'),
('CLN-003', 'Windex Limpiador de Vidrios original', 'HML-LIM-03', 'CAT-02', 89.00, 55, 78, 'Limpiador de ventanas con fórmula de brillo reluciente sin dejar rayas ni residuos empañados en vidrios, espejos o vitrinas.', 'https://www.bodegamesones.mx/cdn/shop/files/WINDEXVIDRIOSfrente1353322795Bn.jpg?v=1766439822'),
('CLN-004', 'Axion Lavatrastes Líquido Limón', 'HML-LIM-04', 'CAT-02', 45.00, 90, 120, 'Arrancagrasa poderoso con extracto natural de limón que elimina los malos olores y desinfecta profundamente la vajilla.', 'https://www.desechablesmonterrey.com/wp-content/uploads/2014/02/Axion.jpg'),
('CLN-005', 'Cloro Desinfectante Multiusos Premium', 'HML-LIM-05', 'CAT-02', 65.00, 48, 65, 'Agente desinfectante concentrado para eliminar el 99.9% de gérmenes domésticos en pisos, baños y áreas comunes.', 'https://ecotropa.mx/cdn/shop/products/BRL_0524fa1b-f52c-48c0-b5d8-5b9713eca802_700x.jpg?v=1667955081'),
('CLN-006', 'Fabuloso Multiusos Frescura Lavanda 2L', 'HML-LIM-06', 'CAT-02', 55.00, 60, 95, 'Limpiador líquido aromatizante universal de pisos que neutraliza olores desagradables y brinda un aroma relajante de lavanda.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuB_85xkc8sC17WUP9lqDuIEY-KbX-tOJHqg&s');

-- Historic Orders Seeding
INSERT INTO orders (id, customer_name, customer_email, total_amount, status, items_count) VALUES
('ORD-9452', 'Patricia Sosa', 'patty.sosa@me.com', 3098.00, 'procesando', 2),
('ORD-9451', 'Gerardo Ortiz', 'gerardo@ortiz-firm.mx', 349.00, 'enviado', 1),
('ORD-9450', 'Diana Cazares', 'diana.c@homeli.mx', 599.00, 'entregado', 1);

-- Order Items details mapping
INSERT INTO order_items (order_id, product_id, product_name_fallback, quantity, unit_price) VALUES
('ORD-9452', 'PROD-002', 'Cerradura Inteligente Homeli Secure Gen2', 1, 2499.00),
('ORD-9452', 'PROD-001', 'Kit de Limpieza Multiusos Homeli-Pro', 1, 349.00),
('ORD-9451', 'PROD-001', 'Kit de Limpieza Multiusos Homeli-Pro', 1, 349.00),
('ORD-9450', 'PROD-003', 'Filtro Purificador de Agua Carbón Activado', 1, 599.00);

-- Scheduled Services Seeding
INSERT INTO services (id, client_name, client_email, service_type, scheduled_date, address, price, status, assigned_staff, priority, notes) VALUES
('SRV-101', 'Sofia Vergara', 'sofia@homeli.mx', 'Limpieza Integral', '2026-06-04 09:00:00+00', 'Av. Paseo de la Reforma 450, CDMX', 850.00, 'programado', 'Carlos Ramos', 'Media', 'Llevar insumos especiales para mármol'),
('SRV-102', 'Andrés Manuel Torres', 'andres.torres@outlook.com', 'Mantenimiento Fontanería', '2026-06-03 10:30:00+00', 'Calle Colima 120, CDMX', 1200.00, 'en_progreso', 'José Luis Alavez', 'Alta', 'Fuga bajo la tarja de cocina'),
('SRV-103', 'Mariana Rodríguez', 'mariana.rgz@gmail.com', 'Electricidad General', '2026-06-02 14:00:00+00', 'Cda. Centenario 24, CDMX', 650.00, 'completado', 'Ramiro Hernández', 'Baja', 'Instalación de dimmers inteligentes');

-- Audit Logs Seeding
INSERT INTO audit_logs (id, timestamp, actor, role, action, severity) VALUES
('LOG-001', CURRENT_TIMESTAMP - INTERVAL '1 HOUR', 'Felipe Admin', 'Administrador', 'Activación del modo de reservación express en CDMX', 'info'),
('LOG-002', CURRENT_TIMESTAMP - INTERVAL '2 HOURS', 'Ventas Bot', 'Ventas', 'Nueva Orden de Ecommerce ORD-9452 procesada con éxito', 'info'),
('LOG-003', CURRENT_TIMESTAMP - INTERVAL '3 HOURS', 'Coordinador Jose', 'Servicios', 'Servicio SRV-102 modificado a estado "En Progreso"', 'info');

-- Businesses & Business Services Seed Data (Cleaners sample)
INSERT INTO businesses (id, name, logo, address, map_link, telephones, whatsapp, owner_name, giro, status) VALUES
('BIZ-001', 'Brillo Impecable de México', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=150&auto=format&fit=crop&q=60', 'Av. Insurgentes Sur 1450, Col. Del Valle, CDMX', 'https://maps.app.goo.gl/XbazWxXmhjRtB4sc9', '55-5678-1234', '55-9876-5432', 'Ing. Alejandro Rosales', 'Servicios de Limpieza Residencial e Industrial', 'Activo'),
('BIZ-002', 'Limpiezas Express CDMX', 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=150&auto=format&fit=crop&q=60', 'Paseo de la Reforma 250, Col. Juárez, CDMX', 'https://maps.app.goo.gl/XbazWxXmhjRtB4sc9', '55-4321-8765', '55-1234-5678', 'Lic. Clara Salazar', 'Limpieza Especializada y Desinfección', 'Activo');

INSERT INTO business_services (business_id, name, price, description) VALUES
('BIZ-001', 'Limpieza Express Residencial', 450.00, 'Limpieza rápida de habitaciones principales, sacudido, barrido y trapeado.'),
('BIZ-001', 'Sanitizado Químico Premium', 850.00, 'Desinfección por termonebulización de áreas comunes, certificado oficial.'),
('BIZ-001', 'Lavado Mecánico de Alfombras', 1200.00, 'Inyección profunda de agentes quitamanchas en tapetes and sillones.'),
('BIZ-002', 'Limpieza Profunda de Cocina', 900.00, 'Desengrase a detalle de estufas, campanas, azulejos y encimeras.'),
('BIZ-002', 'Sanitizado de Salas y Muebles', 1100.00, 'Remoción de ácaros y lavado por succión de sillones de tela o piel.');

COMMIT;
-- =====================================================================
-- SCHEMA READY FOR PRODUCTION DEPLOYMENT
-- =====================================================================

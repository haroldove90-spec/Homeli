-- ====================================================================
-- SCRIPT SQL: Base de Datos para el Módulo de Servicios de Homeli
-- ====================================================================
-- Este script crea la tabla 'service_requests' y define las estructuras
-- necesarias para almacenar las solicitudes y sus respectivas imágenes.
--
-- Existen dos (2) alternativas principales para guardar imágenes en bases de datos relacionales:
--   Alternativa A (Recomendada): Almacenar una URL o un string Base64 en una columna TEXT.
--   Alternativa B: Almacenar los datos binarios directamente usando BYTEA (PostgreSQL) o BLOB (MySQL).
--
-- A continuación se presentan las dos alternativas estructuradas.

-- ====================================================================
-- ALTERNATIVA A: Almacenamiento por URL / Base64 (Recomendado por rendimiento)
-- ====================================================================
-- Ideal si subes las fotos a un servicio de almacenamiento en la nube 
-- (como Google Cloud Storage, Firebase Storage o Amazon S3) y guardas la URL de acceso,
-- o si guardas directamente la cadena en formato Data URI Base64 (ej. 'data:image/jpeg;base64,...').

CREATE TABLE IF NOT EXISTS service_requests (
    id VARCHAR(50) PRIMARY KEY,                                      -- Identificador del servicio (ej. 'SRV-102')
    client_name VARCHAR(150) NOT NULL,                               -- Nombre completo del cliente de la solicitud
    client_email VARCHAR(150) NOT NULL,                              -- Correo de contacto del cliente
    service_type VARCHAR(255) NOT NULL,                              -- Tipo de servicio (ej: "ZAPATOS + ROPAS")
    request_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Fecha y hora de creación de la solicitud
    address TEXT NOT NULL,                                           -- Dirección de recogida y entrega
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,                      -- Costo calculado del servicio ($ MXN)
    status VARCHAR(30) NOT NULL DEFAULT 'programado',                -- Estado: 'programado', 'en_progreso', 'completado', 'cancelado'
    assigned_staff VARCHAR(100) DEFAULT 'Por Asignar',               -- Técnico o especialista asignado
    priority VARCHAR(15) NOT NULL DEFAULT 'Media',                   -- Prioridad: 'Baja', 'Media', 'Alta'
    notes TEXT,                                                      -- Notas operativas o advertencias adicionales
    
    -- Columna para imagen (Alternativa A)
    -- Almacena la URL de la nube o la cadena codificada en Base64 directamente
    uploaded_photo TEXT,                                             
    
    -- Lista de items seleccionados
    -- JSONB en PostgreSQL permite guardar arreglos fácilmente y consultarlos de manera ágil
    selected_items JSONB DEFAULT '[]'::jsonb,
    
    -- Control interno de auditoría
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices de optimización para búsquedas y filtros comunes
CREATE INDEX IF NOT EXISTS idx_services_status ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_services_priority ON service_requests(priority);
CREATE INDEX IF NOT EXISTS idx_services_client_email ON service_requests(client_email);


-- ====================================================================
-- ALTERNATIVA B: Almacenamiento Binario Directo (En Base de Datos)
-- ====================================================================
-- Si prefieres no usar buckets de almacenamiento externos y quieres guardar
-- la foto codificada como archivo binario directamente en la base de datos PostgreSQL.

/*
-- Código para PostgreSQL (Usa BYTEA)
CREATE TABLE IF NOT EXISTS service_requests_binary (
    id VARCHAR(50) PRIMARY KEY,
    client_name VARCHAR(150) NOT NULL,
    client_email VARCHAR(150) NOT NULL,
    service_type VARCHAR(255) NOT NULL,
    request_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    address TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    status VARCHAR(30) NOT NULL,
    assigned_staff VARCHAR(100),
    priority VARCHAR(15) NOT NULL,
    notes TEXT,
    
    -- Columna para imagen (Alternativa B: Binario puro)
    uploaded_photo_binary BYTEA, -- Almacena los bytes binarios de la imagen
    photo_mime_type VARCHAR(50),  -- Almacena el tipo mime (ej: 'image/jpeg', 'image/png')
    
    selected_items JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Código alternativo para MySQL (Usa MEDIUMBLOB o LONGBLOB)
CREATE TABLE IF NOT EXISTS service_requests_mysql (
    id VARCHAR(50) PRIMARY KEY,
    client_name VARCHAR(150) NOT NULL,
    client_email VARCHAR(150) NOT NULL,
    service_type VARCHAR(255) NOT NULL,
    request_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    address TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(30) NOT NULL,
    assigned_staff VARCHAR(100),
    priority VARCHAR(15) NOT NULL,
    notes TEXT,
    
    uploaded_photo_binary MEDIUMBLOB, -- MediumBlob soporta imágenes de hasta 16 Megabytes
    photo_mime_type VARCHAR(50),
    
    selected_items TEXT, -- JSON representado en TEXT para MySQL clásico
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
*/

-- ====================================================================
-- EJEMPLO DE INSERT: Registrar una nueva solicitud con imagen Base64
-- ====================================================================
-- INSERT INTO service_requests (
--     id, client_name, client_email, service_type, address, price, status, priority, notes, uploaded_photo, selected_items
-- ) VALUES (
--     'SRV-102', 
--     'Sofía Valenzuela', 
--     'sofia@ejemplo.com', 
--     'ZAPATOS + ROPAS', 
--     'Colonia Roma Norte, CDMX', 
--     800.00, 
--     'programado', 
--     'Media', 
--     'Timbre portón azul, detalle en costuras de gamuza.', 
--     'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP...', -- Ejemplo del string Base64 o URL
--     '["ZAPATOS", "ROPAS"]'::jsonb
-- );

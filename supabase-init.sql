-- ============================================================
-- Alexa Tours — Schema para Supabase (PostgreSQL)
-- Ejecutar en: Supabase → SQL Editor
-- ============================================================

-- ------------------------------------------------------------
-- DESTINOS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS destinos (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  pais        VARCHAR(100) NOT NULL,
  descripcion TEXT,
  imagen_url  VARCHAR(500),
  activo      BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- PAQUETES
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS paquetes (
  id              SERIAL PRIMARY KEY,
  nombre          VARCHAR(150) NOT NULL,
  descripcion     TEXT,
  precio          DECIMAL(10, 2) NOT NULL,
  duracion_dias   INT NOT NULL,
  incluye         TEXT,
  destino_id      INT REFERENCES destinos(id) ON DELETE SET NULL,
  imagen_url      VARCHAR(500),
  galeria_imagenes TEXT,
  itinerario      TEXT,
  oferta_precio   DECIMAL(10, 2),
  oferta_hasta    DATE,
  activo          BOOLEAN NOT NULL DEFAULT true,
  destacado       BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- CLIENTES / LEADS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS clientes (
  id         SERIAL PRIMARY KEY,
  nombre     VARCHAR(150) NOT NULL,
  email      VARCHAR(255),
  telefono   VARCHAR(30),
  ciudad     VARCHAR(100),
  mensaje    TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- USUARIOS (admin panel)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id             SERIAL PRIMARY KEY,
  email          VARCHAR(255) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL,
  nombre         VARCHAR(150),
  rol            VARCHAR(20) NOT NULL DEFAULT 'staff' CHECK (rol IN ('admin', 'staff')),
  activo         BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- RESERVAS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reservas (
  id             SERIAL PRIMARY KEY,
  nombre         VARCHAR(100) NOT NULL,
  email          VARCHAR(150),
  telefono       VARCHAR(20),
  paquete_id     INT NOT NULL,
  paquete_nombre VARCHAR(200),
  fecha_viaje    DATE NOT NULL,
  num_personas   INT NOT NULL DEFAULT 1,
  notas          TEXT,
  estado         VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente','confirmada','cancelada')),
  precio_total   DECIMAL(10, 2),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- BLOG
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blog (
  id           SERIAL PRIMARY KEY,
  titulo       VARCHAR(255) NOT NULL,
  slug         VARCHAR(255) NOT NULL UNIQUE,
  resumen      TEXT,
  contenido    TEXT,
  imagen_url   VARCHAR(500),
  publicado    BOOLEAN NOT NULL DEFAULT false,
  autor        VARCHAR(150),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- TESTIMONIOS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS testimonios (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(150) NOT NULL,
  ciudad      VARCHAR(100),
  texto       TEXT NOT NULL,
  calificacion INT DEFAULT 5,
  foto_url    VARCHAR(500),
  activo      BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- CONTACTO (mensajes)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contacto (
  id         SERIAL PRIMARY KEY,
  nombre     VARCHAR(150) NOT NULL,
  email      VARCHAR(255),
  telefono   VARCHAR(30),
  asunto     VARCHAR(255),
  mensaje    TEXT,
  leido      BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- NEWSLETTER
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS newsletter (
  id         SERIAL PRIMARY KEY,
  email      VARCHAR(255) NOT NULL UNIQUE,
  activo     BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- CUPONES
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cupones (
  id           SERIAL PRIMARY KEY,
  codigo       VARCHAR(50) NOT NULL UNIQUE,
  descuento    DECIMAL(5, 2) NOT NULL,
  tipo         VARCHAR(20) NOT NULL DEFAULT 'porcentaje' CHECK (tipo IN ('porcentaje','fijo')),
  activo       BOOLEAN NOT NULL DEFAULT true,
  usos_max     INT,
  usos_actuales INT NOT NULL DEFAULT 0,
  fecha_inicio DATE,
  fecha_fin    DATE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- CONFIGURACION (site settings key-value store)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS configuracion (
  clave      VARCHAR(100) NOT NULL PRIMARY KEY,
  valor      TEXT,
  grupo      VARCHAR(50),
  etiqueta   VARCHAR(150),
  tipo       VARCHAR(20) NOT NULL DEFAULT 'text',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO destinos (nombre, pais, descripcion, imagen_url) VALUES
('Cancún',           'México',               'Playas de arena blanca y mar turquesa en el Caribe mexicano.',  'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=800'),
('París',            'Francia',              'La ciudad del amor, la moda y la gastronomía.',                  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800'),
('Nueva York',       'Estados Unidos',       'La ciudad que nunca duerme, llena de cultura y energía.',       'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800'),
('Punta Cana',       'República Dominicana', 'Resort all-inclusive con playas paradisíacas.',                  'https://images.unsplash.com/photo-1570737209810-87a8e7245f88?w=800'),
('Ciudad de México', 'México',               'Historia, gastronomía y cultura a tu alcance.',                  'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=800'),
('Mérida',           'México',               'La ciudad blanca, puerta a la cultura maya y el sureste.',       'https://images.unsplash.com/photo-1574436328-c6d3703f6a17?w=800')
ON CONFLICT DO NOTHING;

INSERT INTO paquetes (nombre, descripcion, precio, duracion_dias, incluye, destino_id, destacado) VALUES
('Cancún Todo Incluido', 'Disfruta del Caribe con todo incluido: vuelo, hotel 5 estrellas, traslados y tours.', 18500.00, 7, 'Vuelo redondo,Hotel 5 estrellas,Traslados,Alimentación completa,Tour a Chichén Itzá', 1, true),
('París Romántico',      'Una escapada perfecta para parejas: Eiffel, Versalles y los mejores restaurantes.',   32000.00, 8, 'Vuelo redondo,Hotel boutique,Desayunos,Tour ciudad,Versalles', 2, true),
('Nueva York Express',   'La gran manzana en 5 días: Times Square, Central Park, museos y Broadway.',           28500.00, 5, 'Vuelo redondo,Hotel Manhattan,Desayunos,Pase de museos,Tour en bus', 3, false),
('Punta Cana Relax',     'Resort de lujo en el Caribe con playa privada y actividades acuáticas.',             16900.00, 6, 'Vuelo redondo,Resort all-inclusive,Traslados,Snorkel,Kayak', 4, true),
('México Cultural',      'Visita Teotihuacán, Xochimilco, el Centro Histórico y la gastronomía mexicana.',     12500.00, 5, 'Vuelo redondo,Hotel céntrico,Desayunos,Tours incluidos,Guía local', 5, false),
('Ruta Maya Campeche',   'Explora Campeche, Uxmal y las zonas arqueológicas mayas desde el sureste.',           9800.00, 4, 'Transporte,Hotel colonial,Desayunos,Tours arqueológicos,Guía certificado', 6, false)
ON CONFLICT DO NOTHING;

-- Admin: password = Admin1234!
INSERT INTO usuarios (email, password_hash, nombre, rol) VALUES
('admin@alexatours.mx', '$2b$10$c0zg70R/V4OyxgQaqPVXdeapUMpGZ6UmwbakuMs0CjW5xf10aTT5G', 'Administrador', 'admin')
ON CONFLICT DO NOTHING;

INSERT INTO configuracion (clave, valor, grupo, etiqueta, tipo) VALUES
('whatsapp_numero',   '529991234567',                         'contacto',      'Número WhatsApp (con código país)',      'tel'),
('telefono_display',  '+52 (999) 123-4567',                   'contacto',      'Teléfono visible en el sitio',           'tel'),
('email_contacto',    'info@alexatours.mx',                   'contacto',      'Email de contacto',                      'email'),
('direccion',         'Mérida, Yucatán, México',              'contacto',      'Dirección de la oficina',                'text'),
('instagram_url',     'https://instagram.com/alexatours',     'redes',         'URL Instagram',                          'url'),
('facebook_url',      'https://facebook.com/alexatours',      'redes',         'URL Facebook',                           'url'),
('tiktok_url',        'https://tiktok.com/@alexatours',       'redes',         'URL TikTok',                             'url'),
('hero_titulo',       'Descubre el Mundo con Alexa Tours',    'hero',          'Título principal del Hero',              'text'),
('hero_subtitulo',    'Experiencias únicas, recuerdos para siempre. Viaja con los expertos.', 'hero', 'Subtítulo del Hero', 'textarea'),
('hero_cta_texto',    'Ver Paquetes',                         'hero',          'Texto del botón CTA',                    'text'),
('hero_imagen_url',   'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600', 'hero', 'Imagen de fondo del Hero', 'image'),
('nombre_empresa',    'Alexa Tours',                          'general',       'Nombre de la empresa',                   'text'),
('slogan',            'Tu agencia de viajes de confianza',    'general',       'Slogan',                                 'text'),
('cta_whatsapp_msg',  'Hola! Me interesa conocer más sobre sus paquetes de viaje.', 'general', 'Mensaje inicial WhatsApp CTA', 'textarea')
ON CONFLICT (clave) DO NOTHING;

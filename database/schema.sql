-- Base de datos para el sistema de entradas de carnaval (MySQL)

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombreUsuario VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'vendedor', 'receptor') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de entradas
CREATE TABLE IF NOT EXISTS entrada (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dni VARCHAR(20) NOT NULL,
    estado ENUM('pendiente ingreso', 'ingreso registrado') NOT NULL DEFAULT 'pendiente ingreso',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_ingreso TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    idUsuario INT
);

-- Índices para búsquedas rápidas
CREATE INDEX idx_entrada_dni ON entrada(dni);
CREATE INDEX idx_entrada_nombre ON entrada(nombre);
CREATE INDEX idx_entrada_apellido ON entrada(apellido);
CREATE INDEX idx_entrada_estado ON entrada(estado);
CREATE INDEX idx_usuario_nombreUsuario ON usuario(nombreUsuario);

-- Usuario de ejemplo (password: admin123, hash bcrypt)
-- INSERT INTO usuario (nombreUsuario, password, rol) VALUES 
-- ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin');
-- Nota: Reemplazar con hash real al crear el usuario

-- Script para migrar la base de datos existente a la nueva arquitectura multitenant (Eventos y Entidades)

-- 1. Crear tabla de entidades
CREATE TABLE IF NOT EXISTS entidad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 1.1 Insertar una entidad por defecto para asegurar la integridad referencial de los usuarios viejos
INSERT INTO entidad (id, nombre) VALUES (1, 'Clubes Unidos')
ON DUPLICATE KEY UPDATE nombre=nombre;

-- 2. Crear tabla de eventos
CREATE TABLE IF NOT EXISTS evento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idEntidad INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fechaVentaHasta DATE NOT NULL,
    horaVentaHasta TIME NOT NULL,
    fechaEvento DATE NOT NULL,
    nombreImagen VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idEntidad) REFERENCES entidad(id) ON DELETE CASCADE
);

-- 2.1 Insertar un evento por defecto para las entradas e ingresos antiguos
INSERT INTO evento (id, idEntidad, nombre, descripcion, fechaVentaHasta, horaVentaHasta, fechaEvento) 
VALUES (1, 1, 'Carnaval + Cumbión 2026', 'Carnaval + Cumbión 2026. Máximo Paz.', '2026-02-21', '12:00:00', '2026-02-21')
ON DUPLICATE KEY UPDATE nombre=nombre;

-- 3. Actualizar la tabla de usuarios
-- Añadimos la columna permitiendo el valor por defecto que acabamos de crear (1) para las filas existentes
ALTER TABLE usuario ADD COLUMN idEntidad INT NOT NULL DEFAULT 1;
ALTER TABLE usuario ADD CONSTRAINT fk_usuario_entidad FOREIGN KEY (idEntidad) REFERENCES entidad(id) ON DELETE CASCADE;

-- 4. Actualizar la tabla de entradas
ALTER TABLE entrada ADD COLUMN idEvento INT NOT NULL DEFAULT 1;
ALTER TABLE entrada ADD CONSTRAINT fk_entrada_evento FOREIGN KEY (idEvento) REFERENCES evento(id) ON DELETE CASCADE;

-- 5. Actualizar la tabla de ingresos
ALTER TABLE ingreso ADD COLUMN idEvento INT NOT NULL DEFAULT 1;
ALTER TABLE ingreso ADD CONSTRAINT fk_ingreso_evento FOREIGN KEY (idEvento) REFERENCES evento(id) ON DELETE CASCADE;

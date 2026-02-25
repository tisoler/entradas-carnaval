-- Migración para añadir soporte de coordenadas personalizables en Entradas
-- Ejecutar este archivo en la base de datos `carnaval_entradas`

ALTER TABLE evento
ADD COLUMN colorFondoQR VARCHAR(20) DEFAULT '#FFFFFF',
ADD COLUMN coordenadaYQR INT DEFAULT 336,
ADD COLUMN coordenadaXQR INT DEFAULT 100,
ADD COLUMN coordenadaYDatos INT DEFAULT 631,
ADD COLUMN coordenadaXDatos INT DEFAULT 65,
ADD COLUMN dimensionQR INT DEFAULT 122;

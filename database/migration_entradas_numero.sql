-- Añadir campo numero a la tabla entrada
ALTER TABLE entrada ADD COLUMN numero INT NOT NULL DEFAULT 0;

-- Opción: Si se quiere inicializar los números de las entradas ya existentes, 
-- se debería hacer una actualización por cada evento. Por ahora queda en 0 por defecto.

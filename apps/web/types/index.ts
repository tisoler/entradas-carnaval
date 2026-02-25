export interface Usuario {
  id: number;
  nombreUsuario: string;
  rol: 'admin' | 'vendedor' | 'receptor';
  idEntidad: number;
  nombreEntidad?: string;
}

export interface Entrada {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  estado: 'pendiente ingreso' | 'ingreso registrado';
  fecha_creacion: string;
  fecha_ingreso: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: Usuario;
}

export interface CreateEntradaRequest {
  nombre: string;
  apellido: string;
  dni: string;
  idEvento: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface Evento {
  id: number;
  idEntidad: number;
  nombre: string;
  descripcion: string | null;
  fechaVentaHasta: string;
  horaVentaHasta: string;
  fechaEvento: string;
  nombreImagen: string | null;
  colorFondoQR: string;
  coordenadaYQR: number;
  coordenadaXQR: number;
  coordenadaYDatos: number;
  coordenadaXDatos: number;
  dimensionQR: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventoRequest {
  nombre: string;
  descripcion?: string;
  fechaVentaHasta: string;
  horaVentaHasta: string;
  fechaEvento: string;
  nombreImagen?: string;
  colorFondoQR?: string;
  coordenadaYQR?: number;
  coordenadaXQR?: number;
  coordenadaYDatos?: number;
  coordenadaXDatos?: number;
  dimensionQR?: number;
}

export interface Usuario {
  id: number;
  nombreUsuario: string;
  rol: 'admin' | 'vendedor' | 'receptor';
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

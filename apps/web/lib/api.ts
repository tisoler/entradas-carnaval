import { LoginResponse, Entrada, CreateEntradaRequest, Usuario } from '@/types';

// En Next.js, las rutas API son relativas
const API_BASE_URL = '/api';

const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const api = {
  async login(nombreUsuario: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombreUsuario, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al iniciar sesión');
    }

    return response.json();
  },

  async getEntradas(search?: string): Promise<Entrada[]> {
    const url = new URL(`${API_BASE_URL}/entradas`, window.location.origin);
    if (search) {
      url.searchParams.append('search', search);
    }

    const response = await fetch(url.toString(), {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener entradas');
    }

    return response.json();
  },

  async getEntrada(id: number): Promise<Entrada> {
    const response = await fetch(`${API_BASE_URL}/entradas/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener entrada');
    }

    return response.json();
  },

  async createEntrada(data: CreateEntradaRequest): Promise<Entrada> {
    const response = await fetch(`${API_BASE_URL}/entradas`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al crear entrada');
    }

    return response.json();
  },

  async updateEntradaEstado(id: number, estado: 'pendiente ingreso' | 'ingreso registrado'): Promise<Entrada> {
    const response = await fetch(`${API_BASE_URL}/entradas/${id}/estado`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ estado }),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar estado');
    }

    return response.json();
  },

  async scanEntrada(entradaId: number): Promise<Entrada> {
    const response = await fetch(`${API_BASE_URL}/entradas/scan`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ entradaId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al escanear entrada');
    }

    return response.json();
  },
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};

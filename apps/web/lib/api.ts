import { LoginResponse, Entrada, CreateEntradaRequest, Usuario, PaginatedResponse } from '@/types';

// En Next.js, las rutas API son relativas
const API_BASE_URL = '/api';

const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refreshToken');
};

const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const headers = getAuthHeaders();
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (response.status === 401) {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      logout();
      throw new Error('Sesión expirada');
    }

    try {
      const refreshResponse = await api.refreshToken(refreshToken);
      localStorage.setItem('token', refreshResponse.token);
      localStorage.setItem('refreshToken', refreshResponse.refreshToken);

      // Retry original request with new token
      return fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
          Authorization: `Bearer ${refreshResponse.token}`,
        },
      });
    } catch (error) {
      logout();
      throw new Error('Sesión expirada');
    }
  }

  return response;
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

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Error al refrescar token');
    }

    return response.json();
  },

  async getEntradas(search?: string, page: number = 1, limit: number = 30): Promise<PaginatedResponse<Entrada>> {
    const url = new URL(`${API_BASE_URL}/entradas`, window.location.origin);
    if (search) {
      url.searchParams.append('search', search);
    }
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());

    const response = await fetchWithAuth(url.toString(), {
    });

    if (!response.ok) {
      throw new Error('Error al obtener entradas');
    }

    return response.json();
  },

  async getEntrada(id: number): Promise<Entrada> {
    const response = await fetchWithAuth(`${API_BASE_URL}/entradas/${id}`, {
    });

    if (!response.ok) {
      throw new Error('Error al obtener entrada');
    }

    return response.json();
  },

  async createEntrada(data: CreateEntradaRequest): Promise<Entrada> {
    const response = await fetchWithAuth(`${API_BASE_URL}/entradas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al crear entrada');
    }

    return response.json();
  },

  async updateEntradaEstado(id: number, estado: 'pendiente ingreso' | 'ingreso registrado'): Promise<Entrada> {
    const response = await fetchWithAuth(`${API_BASE_URL}/entradas/${id}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado }),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar estado');
    }

    return response.json();
  },

  async scanEntrada(entradaId: number): Promise<Entrada> {
    const response = await fetchWithAuth(`${API_BASE_URL}/entradas/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};

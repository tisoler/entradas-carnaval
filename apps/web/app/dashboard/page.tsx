'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Entrada } from '@/types';
import CreateEntradaModal from '@/components/CreateEntradaModal';
import EntradaList from '@/components/EntradaList';
import QRScanner from '@/components/QRScanner';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const { data, isLoading } = useQuery({
    queryKey: ['entradas', search, page],
    queryFn: () => api.getEntradas(search || undefined, page),
    enabled: isAuthenticated,
    refetchInterval: 15000, // Refetch cada 15 segundos
  });

  const { data: ingresosData } = useQuery({
    queryKey: ['ingresos_total'],
    queryFn: () => api.getIngresosTotal(),
    enabled: isAuthenticated,
    refetchInterval: 15000, // Refetch cada 15 segundos
  });

  const manualIngresoMutation = useMutation({
    mutationFn: () => api.registrarIngresoManual(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingresos_total'] });
    },
    onError: (error: any) => {
      alert(error.message || 'Error al registrar entrada en caja');
    },
  });



  const entradas = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 30, totalPages: 1 };

  const updateEstadoMutation = useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: 'pendiente ingreso' | 'ingreso registrado' }) =>
      api.updateEntradaEstado(id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entradas'] });
      queryClient.invalidateQueries({ queryKey: ['ingresos_total'] });
    },
  });

  const scanMutation = useMutation({
    mutationFn: (entradaId: number) => api.scanEntrada(entradaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entradas'] });
      queryClient.invalidateQueries({ queryKey: ['ingresos_total'] });
      setShowScanner(false);
      alert('Ingreso registrado exitosamente');
      router.push('/');
    },
    onError: (error: any) => {
      alert(error.message || 'Error al escanear entrada');
      router.push('/');
    },
  });

  const handleToggleEstado = (e: React.MouseEvent<HTMLButtonElement>, entrada: Entrada) => {
    e.stopPropagation();
    const nuevoEstado = entrada.estado === 'pendiente ingreso'
      ? 'ingreso registrado'
      : 'pendiente ingreso';
    updateEstadoMutation.mutate({ id: entrada.id, estado: nuevoEstado });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-600 to-blue-600">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-600">
                🎭 Carnaval 2026
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Hola, {user?.nombreUsuario}</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full flex flex-col items-center">
            {ingresosData && (
              <div className="mb-4 bg-white/10 p-3 rounded-lg shadow border border-gray-200 flex items-center gap-4">
                <span className="text-xl font-bold text-white tracking-widest bg-gradient-to-r from-red-600 to-blue-600 px-4 py-2 rounded-md shadow-inner">
                  Total Ingresos: {ingresosData.total}
                </span>
                <button
                  onClick={() => manualIngresoMutation.mutate()}
                  disabled={manualIngresoMutation.isPending}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {manualIngresoMutation.isPending ? 'Procesando...' : 'Entrada en caja'}
                </button>
              </div>
            )}
            <div className="w-full sm:max-w-md">
              <input
                type="text"
                placeholder="Buscar por DNI, nombre o apellido..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowScanner(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition flex items-center gap-2"
            >
              Escanear QR
            </button>
            { /*
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-neutral-800 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition"
              >
                + Crear Entrada
              </button>
            */ }
          </div>
        </div>

        <EntradaList
          entradas={entradas}
          isLoading={isLoading}
          onToggleEstado={handleToggleEstado}
          currentPage={page}
          totalPages={meta.totalPages}
          total={meta.total}
          onPageChange={setPage}
        />

        {showCreateModal && (
          <CreateEntradaModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              queryClient.invalidateQueries({ queryKey: ['entradas'] });
            }}
          />
        )}

        {showScanner && (
          <QRScanner
            onClose={() => setShowScanner(false)}
            onScan={(entradaId) => {
              scanMutation.mutate(entradaId);
            }}
          />
        )}
      </main>
    </div>
  );
}

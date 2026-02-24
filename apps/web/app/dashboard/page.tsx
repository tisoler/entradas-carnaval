'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import CreateEventoModal from '@/components/CreateEventoModal';
import EditEventoModal from '@/components/EditEventoModal';
import { Evento } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [eventoToEdit, setEventoToEdit] = useState<Evento | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const { data, isLoading } = useQuery({
    queryKey: ['eventos'],
    queryFn: () => api.getEventos(),
    enabled: isAuthenticated,
    refetchInterval: 60000, // Refetch eventos cada minuto
  });

  if (!isAuthenticated) {
    return null;
  }

  const eventos = data?.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-600 to-blue-600">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-600">
                🎟️ {user?.nombreEntidad || 'Entradas Paceñas'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Hola, {user?.nombreUsuario}</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white shadow-sm">Tus Eventos</h2>
          {user?.rol === 'admin' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-neutral-800 text-white rounded-lg font-semibold hover:bg-neutral-900 shadow-xl transform hover:scale-105 transition"
            >
              + Nuevo Evento
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : eventos.length === 0 ? (
          <div className="p-8 text-center bg-white/10 rounded-xl border border-white/20 text-white">
            <p className="text-xl">No hay eventos creados todavía.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventos.map((evento) => {
              const dateEvento = new Date(evento.fechaEvento).toLocaleDateString('es-AR', { timeZone: 'UTC' });
              const limitSale = new Date(evento.fechaVentaHasta).toLocaleDateString('es-AR', { timeZone: 'UTC' }) + ' ' + evento.horaVentaHasta.slice(11, 16) + ' hs';
              return (
                <div
                  key={evento.id}
                  onClick={() => router.push(`/dashboard/evento/${evento.id}`)}
                  className="bg-white rounded-xl shadow-lg p-6 cursor-pointer transform hover:-translate-y-2 hover:shadow-2xl transition duration-300 border border-gray-100 relative group"
                >
                  {user?.rol === 'admin' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEventoToEdit(evento);
                      }}
                      className="absolute top-4 right-4 p-2 bg-gray-100 text-gray-600 rounded-full opacity-0 group-hover:opacity-100 hover:bg-blue-100 hover:text-blue-600 transition"
                      title="Editar Evento"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  )}
                  <h3 className="text-2xl font-bold text-gray-800 mb-2 truncate pr-10">{evento.nombre}</h3>
                  {evento.descripcion && <p className="text-gray-600 text-sm mb-4 line-clamp-2">{evento.descripcion}</p>}

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-blue-50 rounded text-blue-800 font-medium">
                      <span>Día del Evento:</span>
                      <span>{dateEvento}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-red-50 rounded text-red-800 font-medium">
                      <span>Cierre de Ventas:</span>
                      <span>{limitSale}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showCreateModal && (
          <CreateEventoModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              queryClient.invalidateQueries({ queryKey: ['eventos'] });
            }}
          />
        )}

        {eventoToEdit && (
          <EditEventoModal
            evento={eventoToEdit}
            onClose={() => setEventoToEdit(null)}
            onSuccess={() => {
              setEventoToEdit(null);
              queryClient.invalidateQueries({ queryKey: ['eventos'] });
            }}
          />
        )}
      </main>
    </div>
  );
}

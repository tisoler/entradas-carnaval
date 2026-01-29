'use client';

import { useState, useMemo } from 'react';
import { Entrada } from '@/types';
import EntradaCardModal from './EntradaCardModal';

interface EntradaListProps {
  entradas: Entrada[];
  isLoading: boolean;
  onToggleEstado: (e: React.MouseEvent<HTMLButtonElement>, entrada: Entrada) => void;
  currentPage: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

const ITEMS_PER_PAGE = 30;

export default function EntradaList({
  entradas,
  isLoading,
  onToggleEstado,
  currentPage,
  totalPages,
  total,
  onPageChange
}: EntradaListProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedEntrada, setSelectedEntrada] = useState<Entrada | null>(null);

  const onOpenModal = (entrada: Entrada) => {
    setSelectedEntrada(entrada);
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando entradas...</p>
        </div>
      </div>
    );
  }

  if (entradas.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <div className="text-6xl mb-4">🎭</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">No hay entradas</h3>
        <p className="text-gray-600">Crea tu primera entrada para comenzar</p>
      </div>
    );
  }

  if (showModal && selectedEntrada) {
    return (
      <EntradaCardModal entrada={selectedEntrada} onClose={() => setShowModal(false)} />
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Nombre
              </th>
              <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Apellido
              </th>
              <th className="table-cell md:hidden px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Apellido y nombre
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                DNI
              </th>
              <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Fecha Creación
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Estado
              </th>
              <th className="hidden md:table-cell px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entradas.map((entrada) => {
              const isRegistrado = entrada.estado === 'ingreso registrado';
              return (
                <tr key={entrada.id} className="hover:bg-gray-50 transition-colors" onClick={() => onOpenModal(entrada)}>
                  <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {entrada.nombre}
                  </td>
                  <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {entrada.apellido}
                  </td>
                  <td className="table-cell md:hidden px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {entrada.apellido}, {entrada.nombre}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {entrada.dni}
                  </td>
                  <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {new Date(entrada.fecha_creacion).toLocaleDateString('es-AR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${isRegistrado
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                        }`}
                    >
                      {isRegistrado ? '✓ Ingreso Registrado' : '⏳ Pendiente Ingreso'}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                    <button
                      onClick={(e) => onToggleEstado(e, entrada)}
                      className={`px-4 py-2 rounded-lg font-semibold text-xs transition ${isRegistrado
                          ? 'bg-orange-500 text-white hover:bg-orange-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                    >
                      {isRegistrado ? '↩️ Marcar Pendiente' : '✓ Marcar Registrado'}
                    </button>
                  </td>
                  <td className="table-cell md:hidden px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                    <button
                      onClick={(e) => onToggleEstado(e, entrada)}
                      className={`px-2 py-3 rounded-lg font-semibold text-xs transition text-wrap ${isRegistrado
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                        }`}
                    >
                      {isRegistrado ? 'Ingreso Registrado' : 'Pendiente Ingreso'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <div className="flex items-center text-sm text-gray-700">
            Resultados: {total}
          </div>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Mostrando{' '}
              <span className="font-medium">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{' '}
              a{' '}
              <span className="font-medium">
                {Math.min(currentPage * ITEMS_PER_PAGE, total)}
              </span>{' '}
              de <span className="font-medium">{total}</span> resultados
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Anterior</span>
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Mostrar solo algunas páginas alrededor de la actual
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 2 && page <= currentPage + 2)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => onPageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page
                          ? 'z-10 bg-red-50 border-red-500 text-red-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 3 || page === currentPage + 3) {
                  return <span key={page} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>;
                }
                return null;
              })}
              <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Siguiente</span>
                →
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

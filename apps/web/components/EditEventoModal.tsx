'use client';

import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Evento, CreateEventoRequest } from '@/types';

interface EditEventoModalProps {
    evento: Evento;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditEventoModal({ evento, onClose, onSuccess }: EditEventoModalProps) {
    const [formData, setFormData] = useState<CreateEventoRequest>({
        nombre: '',
        descripcion: '',
        fechaVentaHasta: '',
        horaVentaHasta: '',
        fechaEvento: '',
        nombreImagen: ''
    });

    useEffect(() => {
        // Formatear las fechas para inputs de tipo date y time
        const formatFecha = (isoString: string) => {
            if (!isoString) return '';
            return new Date(isoString).toISOString().split('T')[0];
        };

        const formatHora = (isoString: string) => {
            if (!isoString) return '';
            // "1970-01-01T23:59:00Z" -> "23:59"
            const match = isoString.match(/T(\d{2}:\d{2})/);
            return match ? match[1] : '';
        };

        setFormData({
            nombre: evento.nombre || '',
            descripcion: evento.descripcion || '',
            fechaVentaHasta: formatFecha(evento.fechaVentaHasta),
            horaVentaHasta: formatHora(evento.horaVentaHasta),
            fechaEvento: formatFecha(evento.fechaEvento),
            nombreImagen: evento.nombreImagen || ''
        });
    }, [evento]);

    const mutation = useMutation({
        mutationFn: (data: CreateEventoRequest) => api.updateEvento(evento.id, data),
        onSuccess: () => {
            onSuccess();
        },
        onError: (error: any) => {
            alert(error.message || 'Error al actualizar evento');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Editar Evento</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del evento *</label>
                        <input
                            type="text"
                            name="nombre"
                            required
                            value={formData.nombre}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-black"
                            placeholder="Ej. Carnaval 2026 - Noche 1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-black"
                            placeholder="Detalles opcionales..."
                            rows={2}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha límite de venta *</label>
                            <input
                                type="date"
                                name="fechaVentaHasta"
                                required
                                value={formData.fechaVentaHasta}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-black"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hora límite de venta *</label>
                            <input
                                type="time"
                                name="horaVentaHasta"
                                required
                                value={formData.horaVentaHasta}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-black"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha del Evento *</label>
                        <input
                            type="date"
                            name="fechaEvento"
                            required
                            value={formData.fechaEvento}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Imagen (Carpeta /public)</label>
                        <input
                            type="text"
                            name="nombreImagen"
                            value={formData.nombreImagen}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-black"
                            placeholder="Ej. entrada-base-2.png"
                        />
                    </div>

                    <div className="pt-4 flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md shadow-blue-500/30 disabled:opacity-50 flex items-center justify-center min-w-[120px]"
                        >
                            {mutation.isPending ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                'Guardar Cambios'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

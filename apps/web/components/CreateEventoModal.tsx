'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { CreateEventoRequest } from '@/types';
import EntradaCardModal from './EntradaCardModal';

interface CreateEventoModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateEventoModal({ onClose, onSuccess }: CreateEventoModalProps) {
    const [showPreview, setShowPreview] = useState(false);
    const [formData, setFormData] = useState<CreateEventoRequest>({
        nombre: '',
        descripcion: '',
        fechaVentaHasta: '',
        horaVentaHasta: '',
        fechaEvento: '',
        nombreImagen: '',
        colorFondoQR: '#FFFFFF',
        coordenadaYQR: 336,
        coordenadaXQR: 100,
        coordenadaYDatos: 631,
        coordenadaXDatos: 65,
        dimensionQR: 122,
    });

    const mutation = useMutation({
        mutationFn: (data: CreateEventoRequest) => api.createEvento(data),
        onSuccess: () => {
            onSuccess();
        },
        onError: (error: any) => {
            alert(error.message || 'Error al crear evento');
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Crear Nuevo Evento</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Columna 1: Información General */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700 border-b pb-2">Información General</h3>
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
                        </div>

                        {/* Columna 2: Venta y Diseño */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700 border-b pb-2">Venta y Diseño</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha límite venta *</label>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hora límite *</label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Imagen (CDN)</label>
                                <input
                                    type="text"
                                    name="nombreImagen"
                                    value={formData.nombreImagen}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-black"
                                    placeholder="Ej. entrada-base.png"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Color Fondo QR</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        name="colorFondoQR"
                                        value={formData.colorFondoQR}
                                        onChange={handleChange}
                                        className="w-12 h-10 px-1 py-1 border border-gray-300 rounded-lg cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-500 font-mono uppercase">{formData.colorFondoQR}</span>
                                </div>
                            </div>
                        </div>

                        {/* Columna 3: Coordenadas */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700 border-b pb-2">Coordenadas de Impresión</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">QR X</label>
                                    <input
                                        type="number"
                                        name="coordenadaXQR"
                                        value={formData.coordenadaXQR}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">QR Y</label>
                                    <input
                                        type="number"
                                        name="coordenadaYQR"
                                        value={formData.coordenadaYQR}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-black"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño QR</label>
                                <input
                                    type="number"
                                    name="dimensionQR"
                                    value={formData.dimensionQR}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-black"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Datos X</label>
                                    <input
                                        type="number"
                                        name="coordenadaXDatos"
                                        value={formData.coordenadaXDatos}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Datos Y</label>
                                    <input
                                        type="number"
                                        name="coordenadaYDatos"
                                        value={formData.coordenadaYDatos}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-black"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-gray-100 flex gap-3 justify-end items-center">
                        <button
                            type="button"
                            onClick={() => setShowPreview(true)}
                            className="mr-auto px-5 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition font-medium flex items-center gap-2"
                        >
                            👁️ Ver Preview
                        </button>
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
                                'Crear Evento'
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {showPreview && (
                <EntradaCardModal
                    entrada={{
                        id: 999,
                        numero: 320,
                        nombre: 'Aníbal',
                        apellido: 'Matellán',
                        dni: '12345678',
                        estado: 'pendiente ingreso',
                        fecha_creacion: new Date().toISOString(),
                        fecha_ingreso: null,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    }}
                    onClose={() => setShowPreview(false)}
                    evento={formData as any}
                />
            )}
        </div>
    );
}

'use client';

import { useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import EntradaCard from './EntradaCard'
import { Entrada } from '@/types'
import html2canvas from 'html2canvas';
import { useAuth } from '@/contexts/AuthContext';

interface CreateEntradaModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function CreateEntradaModal({ onClose, onSuccess }: CreateEntradaModalProps) {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [dni, setDni] = useState('')
  const [createdEntrada, setCreatedEntrada] = useState<Entrada | null>(null)
  const divEntrada = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: { nombre: string; apellido: string; dni: string, idUsuario?: number }) =>
      api.createEntrada(data),
    onSuccess: (data) => {
      setCreatedEntrada(data);
      queryClient.invalidateQueries({ queryKey: ['entradas'] });
    },
    onError: (error: any) => {
      alert(error.message || 'Error al crear entrada')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate({ nombre, apellido, dni, idUsuario: user?.id })
  }
  /*
    const handleShare = async () => {
      if (!createdEntrada) return
  
      const url = `${window.location.origin}/entrada/${createdEntrada.id}`
      const text = `🎭 Entrada Carnaval 2026 - Máximo Paz\n\n${createdEntrada.nombre} ${createdEntrada.apellido}\nDNI: ${createdEntrada.dni}\n\nVer entrada: ${url}`
  
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Entrada Carnaval 2026 - Máximo Paz',
            text,
            url,
          })
        } catch (err) {
          console.error('Error sharing:', err)
        }
      } else {
        // Fallback: copiar al portapapeles o abrir WhatsApp
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
        window.open(whatsappUrl, '_blank')
      }
    }
      */
  const handleDescargar = async () => {
    console.log('descargando', divEntrada.current)
    if (!divEntrada.current || (!createdEntrada)) return
    // setCargando(true)

    // Configuración para asegurar que se capture todo y al tamaño correcto
    const canvas = await html2canvas(divEntrada.current, {
      scale: 1, // Tamaño original (evita el escalado por pixel ratio)
      useCORS: true, // Para imágenes externas (QR, etc)
      allowTaint: true,
      backgroundColor: null, // Fondo transparente si aplica
      width: 320, // Ancho fijo del card
      height: 796, // Alto fijo del card
      windowWidth: 320,
      windowHeight: 796,
      scrollX: 0,
      scrollY: 0,
    })
    const link = document.createElement('a')
    link.download = `${createdEntrada.dni}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()

    // setCargando(false)
  }

  const handleShare = async () => {
    if (!divEntrada.current) return
    // Configuración para asegurar que se capture todo y al tamaño correcto
    const canvas = await html2canvas(divEntrada.current, {
      scale: 1, // Tamaño original (evita el escalado por pixel ratio)
      useCORS: true, // Para imágenes externas (QR, etc)
      allowTaint: true,
      backgroundColor: null, // Fondo transparente si aplica
      width: 320, // Ancho fijo del card
      height: 796, // Alto fijo del card
      windowWidth: 320,
      windowHeight: 796,
      scrollX: 0,
      scrollY: 0,
    })
    canvas.toBlob(async (newFile) => {
      if (!newFile) return
      const data = {
        files: [
          new File([newFile], 'image.png', {
            type: newFile.type,
          }),
        ],
        title: 'Image',
        text: 'image',
      }
      try {
        await navigator.share(data)
      } catch (err) {
        console.error(err)
        alert(err)
      }
    })
  }

  if (createdEntrada) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50 w-full" onClick={onClose}>
        <div className="p-2 bg-white rounded-2xl w-full" onClick={(e) => e.stopPropagation()}>
          <div className="h-[88vh] relative overflow-y-auto flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-2">
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
              <div className="flex gap-1 text-sm">
                <button
                  onClick={handleDescargar}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-1 rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Descargar
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-1 rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Compartir
                </button>
                <button
                  onClick={() => {
                    setCreatedEntrada(null)
                    setNombre('')
                    setApellido('')
                    setDni('')
                    onSuccess()
                  }}
                  className="flex-1 bg-red-600 text-white px-2 py-1 rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Crear Otra
                </button>
              </div>
            </div>
            <EntradaCard entrada={createdEntrada} ref={divEntrada} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Crear Nueva Entrada</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellido
              </label>
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                DNI
              </label>
              <input
                type="text"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1 bg-gradient-to-r from-black via-red-600 to-blue-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
              >
                {createMutation.isPending ? 'Creando...' : 'Crear Entrada'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

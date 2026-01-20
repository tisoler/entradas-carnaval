import EntradaCard from "./EntradaCard"
import { Entrada } from "@/types"
import { useRef } from "react"
import html2canvas from "html2canvas"

interface EntradaCardModalProps {
  entrada: Entrada
  onClose: () => void
};

const EntradaCardModal = ({ entrada, onClose }: EntradaCardModalProps) => {
  if (!entrada) return null;
  const divEntrada = useRef<HTMLDivElement>(null);

  const handleDescargar = async () => {
    if (!divEntrada.current || (!entrada)) return
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
    link.download = `${entrada.dni}.png`
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
  /*
    const handleShare = async () => {
      if (!entrada) return
  
      const url = `${window.location.origin}/entrada/${entrada.id}`
      const text = `🎭 Entrada Carnaval 2026 - Máximo Paz\n\n${entrada.nombre} ${entrada.apellido}\nDNI: ${entrada.dni}\n\nVer entrada: ${url}`
  
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
    }*/

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50 w-full" onClick={onClose}>
      <div className="p-2 bg-white rounded-2xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="h-[88vh] relative overflow-y-auto flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-2">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl ml-2"
            >
              X
            </button>
            <div className="flex gap-3">
              <button
                onClick={handleDescargar}
                className="flex-1 px-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition"
              >
                Descargar
              </button>
              <button
                onClick={handleShare}
                className="flex-1 px-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition"
              >
                Compartir
              </button>
            </div>
          </div>
          <EntradaCard ref={divEntrada} entrada={entrada} />
        </div>
      </div>
    </div>
  )
}

export default EntradaCardModal

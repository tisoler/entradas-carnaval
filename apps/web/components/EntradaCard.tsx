'use client';

import { QRCodeSVG } from 'qrcode.react'
import { Entrada } from '@/types'
import Image from 'next/image';

interface EntradaCardProps {
  entrada: Entrada
  ref?: React.RefObject<HTMLDivElement | null>
  ventaFinalizada?: boolean
  nombreImagen?: string | null
}

export default function EntradaCard({ entrada, ref, ventaFinalizada, nombreImagen }: EntradaCardProps) {
  const qrValue = `${entrada.id}-${entrada.dni}`
  const bgImage = nombreImagen ? `https://tisolercdn.nyc3.cdn.digitaloceanspaces.com/entradas_eventos/${nombreImagen}` : '/entrada.webp';

  return (
    <div className="relative flex justify-center w-[320px] h-[796px]" ref={ref}>
      <div className="absolute inset-0 w-[320px] h-[796px]">
        {/* Usamos unoptimized para evitar problemas con srcset en html2canvas */}
        <Image
          src={bgImage}
          width={320}
          height={796}
          alt='entrada'
          className="w-full h-full object-cover"
          priority
          unoptimized
        />
      </div>
      {/* QR Code - Grande y destacado */}
      <div className="absolute top-[336px] left-[100px]">
        {ventaFinalizada ? (
          <div className="bg-red-600/90 w-[122px] h-[122px] flex items-center justify-center rounded-sm text-center font-bold text-white text-md border border-red-800">
            VENTA<br />FINALIZADA
          </div>
        ) : (
          <QRCodeSVG
            value={qrValue}
            size={122}
            level="H"
            includeMargin={false}
            className="rounded-sm"
            bgColor='#e8caa2'
          />
        )}
      </div>

      {/* Datos de la persona */}
      <div className="absolute top-[631px] left-[65px]">
        <div className="">
          <div className="flex gap-2">
            <span className="text-gray-900 font-medium text-sm">Nombre:</span>
            <span className="text-gray-900 font-bold text-sm">{entrada.nombre} {entrada.apellido}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-900 font-medium text-sm">DNI:</span>
            <span className="text-gray-900 font-bold text-sm">{entrada.dni}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-900 font-medium text-sm">N°:</span>
            <span className="text-gray-900 font-bold text-sm">{entrada.id}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

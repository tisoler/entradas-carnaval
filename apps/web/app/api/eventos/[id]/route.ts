import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateToken } from '@/lib/auth';

type RouteParams = {
  id: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const user = authenticateToken(request);
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const eventoId = parseInt(id, 10);

    const currentEvento = await prisma.evento.findUnique({
      where: { id: eventoId }
    });

    if (!currentEvento || currentEvento.idEntidad !== user.idEntidad) {
      return NextResponse.json({ error: 'Evento no encontrado o acceso denegado' }, { status: 404 });
    }

    return NextResponse.json(currentEvento);
  } catch (error) {
    console.error('Error al obtener evento:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const user = authenticateToken(request);
    if (!user || user.rol !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Support for Next.js 15+ where params can be a Promise
    const { id } = await params;
    const eventoId = parseInt(id, 10);

    // Verify ownership
    const currentEvento = await prisma.evento.findUnique({
      where: { id: eventoId }
    });

    if (!currentEvento || currentEvento.idEntidad !== user.idEntidad) {
      return NextResponse.json({ error: 'Evento no encontrado o acceso denegado' }, { status: 404 });
    }

    const body = await request.json();
    const {
      nombre, descripcion,
      fechaVentaHasta, horaVentaHasta, fechaEvento, nombreImagen,
      colorFondoQR, coordenadaYQR, coordenadaXQR, coordenadaYDatos, coordenadaXDatos, dimensionQR
    } = body;

    let horaVentaParsed = undefined;
    if (horaVentaHasta) {
      const horaVentaFormatted = horaVentaHasta.length === 5 ? `${horaVentaHasta}:00` : horaVentaHasta;
      horaVentaParsed = new Date(`1970-01-01T${horaVentaFormatted}Z`);
    }

    const eventoActualizado = await prisma.evento.update({
      where: { id: eventoId },
      data: {
        nombre,
        descripcion,
        fechaVentaHasta: fechaVentaHasta ? new Date(fechaVentaHasta) : undefined,
        horaVentaHasta: horaVentaParsed,
        fechaEvento: fechaEvento ? new Date(fechaEvento) : undefined,
        nombreImagen,
        colorFondoQR,
        coordenadaYQR: coordenadaYQR !== undefined ? Number(coordenadaYQR) : undefined,
        coordenadaXQR: coordenadaXQR !== undefined ? Number(coordenadaXQR) : undefined,
        coordenadaYDatos: coordenadaYDatos !== undefined ? Number(coordenadaYDatos) : undefined,
        coordenadaXDatos: coordenadaXDatos !== undefined ? Number(coordenadaXDatos) : undefined,
        dimensionQR: dimensionQR !== undefined ? Number(dimensionQR) : undefined,
      }
    });

    return NextResponse.json(eventoActualizado);
  } catch (error) {
    console.error('Error al actualizar evento:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateToken } from '@/lib/auth';

type RouteParams = {
  id: string;
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const user = authenticateToken(request);
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const entradaId = parseInt(id);
    const { estado } = await request.json();

    if (isNaN(entradaId)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    if (!estado || !['pendiente ingreso', 'ingreso registrado'].includes(estado)) {
      return NextResponse.json(
        { error: 'Estado inválido' },
        { status: 400 }
      );
    }

    const estadoPrisma = estado === 'pendiente ingreso' ? 'PENDIENTE_INGRESO' : 'INGRESO_REGISTRADO';
    const fechaIngreso = estado === 'ingreso registrado' ? new Date() : null;

    const entrada = await prisma.entrada.update({
      where: { id: entradaId },
      data: {
        estado: estadoPrisma,
        fechaIngreso,
      },
    });

    // Convertir a formato esperado por el frontend
    const formattedEntrada = {
      id: entrada.id,
      nombre: entrada.nombre,
      apellido: entrada.apellido,
      dni: entrada.dni,
      estado: entrada.estado === 'PENDIENTE_INGRESO' ? 'pendiente ingreso' : 'ingreso registrado',
      fecha_creacion: entrada.fechaCreacion.toISOString(),
      fecha_ingreso: entrada.fechaIngreso?.toISOString() || null,
      created_at: entrada.createdAt.toISOString(),
      updated_at: entrada.updatedAt.toISOString(),
    };

    // Emitir evento de actualización
    const { events } = await import('@/lib/events');
    events.emit('update');

    return NextResponse.json(formattedEntrada);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Entrada no encontrada' },
        { status: 404 }
      );
    }
    console.error('Error al actualizar estado:', error);
    return NextResponse.json(
      { error: 'Error al actualizar estado' },
      { status: 500 }
    );
  }
}

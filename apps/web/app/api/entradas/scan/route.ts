import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = authenticateToken(request);
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { entradaId } = await request.json();

    if (!entradaId) {
      return NextResponse.json(
        { error: 'ID de entrada es requerido' },
        { status: 400 }
      );
    }

    // Buscar la entrada y verificar que esté pendiente
    const entrada = await prisma.entrada.findFirst({
      where: {
        id: entradaId,
        estado: 'PENDIENTE_INGRESO',
      },
    });

    if (!entrada) {
      return NextResponse.json(
        { error: 'Entrada no encontrada o ya registrada' },
        { status: 404 }
      );
    }

    // Actualizar el estado
    const entradaActualizada = await prisma.entrada.update({
      where: { id: entradaId },
      data: {
        estado: 'INGRESO_REGISTRADO',
        fechaIngreso: new Date(),
      },
    });

    // Convertir a formato esperado por el frontend
    const formattedEntrada = {
      id: entradaActualizada.id,
      nombre: entradaActualizada.nombre,
      apellido: entradaActualizada.apellido,
      dni: entradaActualizada.dni,
      estado: 'ingreso registrado',
      fecha_creacion: entradaActualizada.fechaCreacion.toISOString(),
      fecha_ingreso: entradaActualizada.fechaIngreso?.toISOString() || null,
      created_at: entradaActualizada.createdAt.toISOString(),
      updated_at: entradaActualizada.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedEntrada);
  } catch (error) {
    console.error('Error al escanear entrada:', error);
    return NextResponse.json(
      { error: 'Error al escanear entrada' },
      { status: 500 }
    );
  }
}

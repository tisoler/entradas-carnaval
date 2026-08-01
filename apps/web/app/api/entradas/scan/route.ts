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

    // Buscar la entrada
    const entrada = await prisma.entrada.findUnique({
      where: { id: entradaId },
    });

    if (!entrada) {
      return NextResponse.json(
        { error: 'Entrada no encontrada' },
        { status: 404 }
      );
    }

    if (entrada.estado === 'INGRESO_REGISTRADO') {
      return NextResponse.json(
        {
          error: 'Esta entrada ya fue registrada',
          entrada: {
            id: entrada.id,
            nombre: entrada.nombre,
            apellido: entrada.apellido,
            dni: entrada.dni,
            estado: 'ingreso registrado',
            fecha_creacion: entrada.fechaCreacion.toISOString(),
            fecha_ingreso: entrada.fechaIngreso?.toISOString() || null,
          }
        },
        { status: 400 }
      );
    }

    // Actualizar el estado e insertar en ingreso
    const entradaActualizada = await prisma.$transaction(async (tx) => {
      const updated = await tx.entrada.update({
        where: { id: entradaId },
        data: {
          estado: 'INGRESO_REGISTRADO',
          fechaIngreso: new Date(),
        },
      });

      await tx.ingreso.upsert({
        where: { idEntrada: entradaId },
        update: { idEvento: updated.idEvento },
        create: { idEntrada: entradaId, idEvento: updated.idEvento },
      });

      return updated;
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

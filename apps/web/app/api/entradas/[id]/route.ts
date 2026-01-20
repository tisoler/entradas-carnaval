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
    const entradaId = parseInt(id);

    if (isNaN(entradaId)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const entrada = await prisma.entrada.findUnique({
      where: { id: entradaId },
    });

    if (!entrada) {
      return NextResponse.json(
        { error: 'Entrada no encontrada' },
        { status: 404 }
      );
    }

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

    return NextResponse.json(formattedEntrada);
  } catch (error) {
    console.error('Error al obtener entrada:', error);
    return NextResponse.json(
      { error: 'Error al obtener entrada' },
      { status: 500 }
    );
  }
}

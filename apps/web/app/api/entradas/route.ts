import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = authenticateToken(request);
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    
    const where = search
      ? {
          OR: [
            { dni: { contains: search } },
            { nombre: { contains: search } },
            { apellido: { contains: search } },
          ],
        }
      : {};

    const entradas = await prisma.entrada.findMany({
      where,
      orderBy: { fechaCreacion: 'desc' },
    });

    // Convertir a formato esperado por el frontend
    const formattedEntradas = entradas.map((entrada: any) => ({
      id: entrada.id,
      nombre: entrada.nombre,
      apellido: entrada.apellido,
      dni: entrada.dni,
      estado: entrada.estado === 'PENDIENTE_INGRESO' ? 'pendiente ingreso' : 'ingreso registrado',
      fecha_creacion: entrada.fechaCreacion.toISOString(),
      fecha_ingreso: entrada.fechaIngreso?.toISOString() || null,
      created_at: entrada.createdAt.toISOString(),
      updated_at: entrada.updatedAt.toISOString(),
    }));

    return NextResponse.json(formattedEntradas);
  } catch (error) {
    console.error('Error al obtener entradas:', error);
    return NextResponse.json(
      { error: 'Error al obtener entradas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = authenticateToken(request);
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { nombre, apellido, dni, idUsuario } = await request.json();

    if (!nombre || !apellido || !dni || !idUsuario) {
      return NextResponse.json(
        { error: 'Nombre, apellido, DNI e id de usuario son requeridos' },
        { status: 400 }
      );
    }

    const entrada = await prisma.entrada.create({
      data: {
        nombre,
        apellido,
        dni,
        estado: 'PENDIENTE_INGRESO',
        idUsuario,
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

    return NextResponse.json(formattedEntrada, { status: 201 });
  } catch (error) {
    console.error('Error al crear entrada:', error);
    return NextResponse.json(
      { error: 'Error al crear entrada' },
      { status: 500 }
    );
  }
}

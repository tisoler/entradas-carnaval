import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateToken } from '@/lib/auth';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const user = authenticateToken(request);
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '30');
    const skip = (page - 1) * limit;
    const idEventoParam = searchParams.get('idEvento');

    if (!idEventoParam) {
      return NextResponse.json({ error: 'idEvento es requerido' }, { status: 400 });
    }
    const idEvento = parseInt(idEventoParam, 10);

    let where: any = { idEvento };

    if (search) {
      const searchClean = search.replace(/\\D/g, '');
      const hasDigits = searchClean.length > 0;

      const conditions = [
        Prisma.sql`nombre LIKE ${`%${search}%`}`,
        Prisma.sql`apellido LIKE ${`%${search}%`}`,
        Prisma.sql`dni LIKE ${`%${search}%`}`
      ];

      if (hasDigits) {
        conditions.push(Prisma.sql`REPLACE(REPLACE(REPLACE(dni, '.', ''), '-', ''), ' ', '') LIKE ${`%${searchClean}%`}`);
      }

      const rawQuery = Prisma.sql`
        SELECT id FROM entrada
        WHERE idEvento = ${idEvento} AND (${Prisma.join(conditions, ' OR ')})
      `;

      const idsResult: { id: number }[] = await prisma.$queryRaw(rawQuery);
      const matchingIds = idsResult.map(r => r.id);

      where = {
        id: { in: matchingIds },
        idEvento
      };
    }

    const [entradas, total] = await Promise.all([
      prisma.entrada.findMany({
        where,
        skip,
        take: limit,
        orderBy: { fechaCreacion: 'desc' },
      }),
      prisma.entrada.count({ where }),
    ]);

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

    return NextResponse.json({
      data: formattedEntradas,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
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

    const { nombre, apellido, dni, idUsuario, idEvento } = await request.json();

    if (!nombre || !apellido || !dni || !idUsuario || !idEvento) {
      return NextResponse.json(
        { error: 'Nombre, apellido, DNI, idUsuario e idEvento son requeridos' },
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
        idEvento,
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

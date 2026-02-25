import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const user = authenticateToken(request);
        if (!user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const eventos = await prisma.evento.findMany({
            where: { idEntidad: user.idEntidad },
            orderBy: { fechaEvento: 'asc' }
        });

        return NextResponse.json({ data: eventos });
    } catch (error) {
        console.error('Error al obtener eventos:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = authenticateToken(request);
        if (!user || user.rol !== 'admin') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const body = await request.json();
        const { nombre, descripcion, fechaVentaHasta, horaVentaHasta, fechaEvento, nombreImagen, dimensionQR } = body;

        if (!nombre || !fechaVentaHasta || !horaVentaHasta || !fechaEvento) {
            return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
        }

        // To support Prisma db.Time, we add a dummy date to the time.
        // Assuming horaVentaHasta comes in "HH:MM" format.
        const horaVentaFormatted = horaVentaHasta.length === 5 ? `${horaVentaHasta}:00` : horaVentaHasta;

        const nuevoEvento = await prisma.evento.create({
            data: {
                idEntidad: user.idEntidad,
                nombre,
                descripcion,
                fechaVentaHasta: new Date(fechaVentaHasta),
                horaVentaHasta: new Date(`1970-01-01T${horaVentaFormatted}Z`),
                fechaEvento: new Date(fechaEvento),
                nombreImagen,
                dimensionQR: dimensionQR !== undefined ? Number(dimensionQR) : 122,
            }
        });

        return NextResponse.json(nuevoEvento, { status: 201 });
    } catch (error) {
        console.error('Error al crear evento:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

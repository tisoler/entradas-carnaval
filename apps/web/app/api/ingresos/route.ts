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
        const idEventoParam = searchParams.get('idEvento');

        if (!idEventoParam) {
            return NextResponse.json({ error: 'idEvento es requerido' }, { status: 400 });
        }

        const total = await prisma.ingreso.count({
            where: { idEvento: parseInt(idEventoParam, 10) }
        });

        return NextResponse.json({ total });
    } catch (error) {
        console.error('Error al obtener total de ingresos:', error);
        return NextResponse.json(
            { error: 'Error al obtener ingresos' },
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

        const { idEvento } = await request.json();

        if (!idEvento) {
            return NextResponse.json({ error: 'idEvento es requerido' }, { status: 400 });
        }

        const nuevoIngreso = await prisma.ingreso.create({
            data: {
                idEntrada: null,
                idEvento,
            },
        });

        return NextResponse.json(nuevoIngreso, { status: 201 });
    } catch (error) {
        console.error('Error al registrar ingreso manual:', error);
        return NextResponse.json(
            { error: 'Error al registrar ingreso' },
            { status: 500 }
        );
    }
}

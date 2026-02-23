import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const user = authenticateToken(request);
        if (!user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const total = await prisma.ingreso.count();

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

        const nuevoIngreso = await prisma.ingreso.create({
            data: {
                idEntrada: null,
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

import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, generateToken, generateRefreshToken } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const { refreshToken } = await request.json();

        if (!refreshToken) {
            return NextResponse.json(
                { error: 'Refresh token requerido' },
                { status: 400 }
            );
        }

        const decoded = verifyRefreshToken(refreshToken);

        if (!decoded) {
            return NextResponse.json(
                { error: 'Refresh token inválido o expirado' },
                { status: 401 }
            );
        }

        const user = await prisma.usuario.findUnique({
            where: { id: decoded.id },
            include: { entidad: true },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Usuario no encontrado' },
                { status: 401 }
            );
        }

        const newToken = generateToken({
            id: user.id,
            nombreUsuario: user.nombreUsuario,
            rol: user.rol,
            idEntidad: user.idEntidad,
            nombreEntidad: user.entidad.nombre,
        });

        const newRefreshToken = generateRefreshToken({
            id: user.id,
            nombreUsuario: user.nombreUsuario,
            rol: user.rol,
            idEntidad: user.idEntidad,
            nombreEntidad: user.entidad.nombre,
        });

        return NextResponse.json({
            token: newToken,
            refreshToken: newRefreshToken,
            user: {
                id: user.id,
                nombreUsuario: user.nombreUsuario,
                rol: user.rol,
                idEntidad: user.idEntidad,
                nombreEntidad: user.entidad.nombre,
            },
        });
    } catch (error) {
        console.error('Error en refresh token:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

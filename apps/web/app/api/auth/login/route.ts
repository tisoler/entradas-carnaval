import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { generateToken, generateRefreshToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { nombreUsuario, password } = await request.json();

    if (!nombreUsuario || !password) {
      return NextResponse.json(
        { error: 'Usuario y contraseña son requeridos' },
        { status: 400 }
      );
    }

    const user = await prisma.usuario.findUnique({
      where: { nombreUsuario },
      include: {
        entidad: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const token = generateToken({
      id: user.id,
      nombreUsuario: user.nombreUsuario,
      rol: user.rol,
      idEntidad: user.idEntidad,
      nombreEntidad: user.entidad.nombre,
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
      nombreUsuario: user.nombreUsuario,
      rol: user.rol,
      idEntidad: user.idEntidad,
      nombreEntidad: user.entidad.nombre,
    });

    return NextResponse.json({
      token,
      refreshToken,
      user: {
        id: user.id,
        nombreUsuario: user.nombreUsuario,
        rol: user.rol,
        idEntidad: user.idEntidad,
        nombreEntidad: user.entidad.nombre,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

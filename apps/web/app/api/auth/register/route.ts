import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Esquema de validación para el registro
const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
});

export async function POST(request: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'production') {
      console.log(`[REGISTER] Intento de registro: email=${request?.body?.email || 'N/A'} ip=${request.headers.get('x-forwarded-for') || request.headers.get('host')}`);
    }
    const body = await request.json();
    const { email, password, name } = registerSchema.parse(body);

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      if (process.env.NODE_ENV === 'production') {
        console.log(`[REGISTER] Fallo: usuario ya existe email=${email}`);
      }
      return NextResponse.json(
        { error: 'El usuario ya existe con este email' },
        { status: 400 }
      );
    }

    // Obtener la organización por defecto
    const organization = await prisma.organization.findFirst({
      where: { name: 'QA Services' },
    });

    if (!organization) {
      if (process.env.NODE_ENV === 'production') {
        console.log(`[REGISTER] Fallo: organización no encontrada para email=${email}`);
      }
      return NextResponse.json(
        { error: 'Organización no encontrada' },
        { status: 500 }
      );
    }

    // Hashear la contraseña
    const hashedPassword = await hash(password, 12);

    // Crear el usuario
    const user = await prisma.user.create({
    if (process.env.NODE_ENV === 'production') {
      console.log(`[REGISTER] Éxito: usuario registrado email=${email} id=${user.id}`);
    }
      data: {
        email,
        password: hashedPassword,
        name,
        organizationId: organization.id,
      },
    });

    // Asignar rol de usuario básico (puedes crear un rol "Usuario" si quieres)
    const userRole = await prisma.role.findFirst({
      where: { name: 'Usuario' },
    });

    if (userRole) {
      await prisma.roleAssignment.create({
        data: {
          userId: user.id,
          roleId: userRole.id,
        },
      });
    }

    // Retornar respuesta exitosa (sin la contraseña)
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(
      { 
        message: 'Usuario registrado exitosamente',
        user: userWithoutPassword 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error en registro:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

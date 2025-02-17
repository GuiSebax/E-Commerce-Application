import prisma from '../db/prisma';
import { ValidationError, NotFoundError } from '../utils/errors';

// Buscar todos os usuários (usei select para ocultar a senha)
export async function getAllUsers() {
    return prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true
        }
    });
}


// Buscar um usuário pelo id
export async function getUserById(userId: number) {
    if (!userId || userId <= 0) {
        throw new ValidationError('ID do usuário inválido');
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true
        }
    });

    if (!user) {
        throw new NotFoundError('Usuário não encontrado');
    }

    return user;
}

// Criar um novo usuário (senha será criptografads no AuthService)
export async function createUser(data: {
    email: string;
    password: string;
    name?: string;
    role?: string;
}) {
    if (!data.email || !data.password) {
        throw new ValidationError('Os campos "email" e "senha" são obrigatórios');
    }

    // Verificar se já existe um usuário com o email informado
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
    });

    if (existingUser) {
        throw new ValidationError('Já existe um usuário com o email informado');
    }

    return prisma.user.create({
        data: {
            email: data.email.trim().toLowerCase(),
            password: data.password, // A senha será criptografada no AuthService
            name: data.name?.trim() || null,
            role: data.role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER'
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true
        }
    });
}


// Atualizar um usuário
export async function updateUser(userId: number, data: {
    name?: string;
    role?: string;
}) {

    if (!userId || userId <= 0) {
        throw new ValidationError('ID do usuário inválido');
    }

    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        throw new NotFoundError('Usuário não encontrado');
    }

    return prisma.user.update({
        where: { id: userId },
        data: {
            ...(data.name !== undefined && { name: data.name.trim() }),
            ...(data.role !== undefined && { role: data.role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER' })
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true
        }
    });
}


// Deletar um usuário
export async function deleteUser(userId: number) {
    if (!userId || userId <= 0) {
        throw new ValidationError('ID do usuário inválido');
    }

    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        throw new NotFoundError('Usuário não encontrado');
    }

    return prisma.user.delete({
        where: { id: userId },
    });
}
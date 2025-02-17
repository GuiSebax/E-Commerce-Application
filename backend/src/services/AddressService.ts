import prisma from '../db/prisma';
import { ValidationError, NotFoundError } from '../utils/errors';


// Pegar todos os endereços indepentende do usuário
export async function getAllAddresses() {
    return prisma.address.findMany();
}

// Pegar todos os endereços de um usuário específico
export async function getAllAddressesByUserId(userId: number) {

    if (!userId || userId <= 0) {
        throw new ValidationError('ID do usuário inválido');
    }

    return prisma.address.findMany({
        where: { userId: userId }
    })
}
// Pegar um endereço pelo ID
export async function getAddressById(addressId: number) {
    if (!addressId || addressId <= 0) {
        throw new ValidationError('ID do endereço inválido');
    }
    const address = await prisma.address.findUnique({
        where: { id: addressId }
    })

    if (!address) {
        throw new NotFoundError(`Endereço com ID ${addressId} não encontrado`);
    }

    return address;
}

// Criar um novo endereço
export async function createAddress(data: {
    userId: number;
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode?: string;
}) {

    if (!data.userId || data.userId <= 0) {
        throw new ValidationError('ID do usuário inválido');
    }
    const userExists = await prisma.user.findUnique({
        where: { id: data.userId }
    });

    if (!userExists) {
        throw new NotFoundError(`Usuário com ID ${data.userId} não encontrado`);
    }
    if (!data.street || data.street.trim() === '') {
        throw new ValidationError('O campo "rua" é obrigatório.');
    }
    if (!data.city || data.city.trim() === '') {
        throw new ValidationError('O campo "cidade" é obrigatório.');
    }
    if (!data.state || data.state.trim() === '') {
        throw new ValidationError('O campo "estado" é obrigatório.');
    }
    if (!data.country || data.country.trim() === '') {
        throw new ValidationError('O campo "país" é obrigatório.');
    }

    return prisma.address.create({
        data: {
            userId: data.userId,
            street: data.street.trim(),
            city: data.city.trim(),
            state: data.state.trim(),
            country: data.country.trim(),
            zipCode: data.zipCode?.trim() || null,
        }
    })
}


// Atualizar um endereço    
export async function updateAddress(addressId: number, data: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
}) {
    // Verifica se o endereço existe
    const existing = await prisma.address.findUnique({
        where: { id: addressId },
    });

    if (!existing) {
        throw new NotFoundError(`Endereço com ID ${addressId} não encontrado.`);
    }

    // Validações dos campos opcionais
    if (data.street !== undefined && data.street.trim() === '') {
        throw new ValidationError('O campo "rua" não pode ser vazio.');
    }
    if (data.city !== undefined && data.city.trim() === '') {
        throw new ValidationError('O campo "cidade" não pode ser vazio.');
    }
    if (data.state !== undefined && data.state.trim() === '') {
        throw new ValidationError('O campo "estado" não pode ser vazio.');
    }
    if (data.country !== undefined && data.country.trim() === '') {
        throw new ValidationError('O campo "país" não pode ser vazio.');
    }

    return prisma.address.update({
        where: { id: addressId },
        data: {
            ...(data.street !== undefined && { street: data.street.trim() }),
            ...(data.city !== undefined && { city: data.city.trim() }),
            ...(data.state !== undefined && { state: data.state.trim() }),
            ...(data.country !== undefined && { country: data.country.trim() }),
            ...(data.zipCode !== undefined && { zipCode: data.zipCode.trim() || null }),
        }
    });
}


// Deletar um endereço
export async function deleteAddress(addressId: number) {
    const existing = await prisma.address.findUnique({
        where: { id: addressId },
    });

    if (!existing) {
        throw new NotFoundError(`Endereço com ID ${addressId} não encontrado.`);
    }

    // verificar se o endereço está vinculado a pedidos
    const addressUserInOrders = await prisma.order.findFirst({
        where: { userId: existing.userId }
    });

    if (addressUserInOrders) {
        throw new ValidationError('Não é possível excluir um endereço vinculado a um pedido.');
    }
    return prisma.address.delete({
        where: { id: addressId }
    });
}
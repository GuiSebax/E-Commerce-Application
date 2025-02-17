import prisma from '../db/prisma'
import { ValidationError, NotFoundError } from '../utils/errors';

// Função para listar todos os produtos
export async function findAllProducts() {
    return prisma.product.findMany({
        include: {
            images: true,
            categories: true,
        }
    });

}

// Função para buscar um produto pelo ID
export async function findProductById(productId: number) {
    const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
            images: true,
            categories: true,
            orderItems: {
                include: { order: true }
            }
        }
    });
    if (!product) {
        throw new NotFoundError(`Produto com ID ${productId} não encontrado`);
    }

    return product;
}

// Cria um novo produto
export async function createProduct(data: {
    name: string;
    description?: string;
    price: number;

}) {
    if (!data.name || data.name.trim() === '') {
        throw new ValidationError('O campo "nome" é obrigatório');
    }
    if (data.price < 0) {
        throw new ValidationError('O campo "preço" não pode ser negativo');
    }

    return prisma.product.create({
        data: {
            name: data.name.trim(),
            price: data.price,
            description: data.description?.trim() || null,
        }
    })
}

// Atualiza um produto por ID
export async function updateProduct(
    productId: number,
    data: {
        name?: string;
        description?: string;
        price?: number;
    }) {
    // verifica se o produto existe
    const existing = await prisma.product.findUnique({
        where: { id: productId },
    });
    if (!existing) {
        throw new NotFoundError(
            `Produto com ID ${productId} não encontrado.`
        );
    }

    if (data.name !== undefined && data.name.trim() === '') {
        throw new ValidationError('O campo "nome" não pode ser vazio.');
    }

    if (data.price !== undefined && data.price < 0) {
        throw new ValidationError('O campo "preço" não pode ser negativo.');
    }

    return prisma.product.update({
        where: { id: productId },
        data: {
            ...(data.name !== undefined && { name: data.name.trim() }),
            ...(data.price !== undefined && { price: data.price }),
            ...(data.description !== undefined && { description: data.description?.trim() }),
        }

    })
}

// Deleta um produto por ID
export async function deleteProduct(productId: number) {
    const existing = await prisma.product.findUnique({
        where: { id: productId },
    });

    if (!existing) {
        throw new NotFoundError(
            `Produto com ID ${productId} não encontrado.`
        );
    }

    return prisma.product.delete({
        where: { id: productId }
    })
}

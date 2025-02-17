import prisma from "../db/prisma";
import { ValidationError, NotFoundError } from "../utils/errors";

// Função para listar todas as categorias
export async function findAllCategories() {
    return prisma.category.findMany();
}

// Função para buscar uma categoria pelo ID
export async function findCategoryById(categoryId: number) {

    if (!categoryId || categoryId <= 0) {
        throw new ValidationError('O ID da categoria é inválido');
    }


    const category = await prisma.category.findUnique({
        where: { id: categoryId },
        include: {
            products: true,
        }
    });
    if (!category) {
        throw new NotFoundError(`Categoria com ID ${categoryId} não encontrada`);
    }

    return category;
}

// Cria uma nova categoria
export async function createCategory(name: string) {

    if (!name || name.trim() === '') {
        throw new ValidationError('O campo "nome" é obrigatório');
    }

    // Verifica se a categoria já existe
    const existingCategory = await prisma.category.findFirst({
        where: { name: name.trim() }
    });

    if (existingCategory) {
        throw new ValidationError('Já existe uma categoria com esse nome');
    }

    return prisma.category.create({
        data: {
            name: name.trim(),
        }
    })
}

// Atualiza uma categoria por ID
export async function updateCategory(categoryId: number, name: string) {

    if (!categoryId || categoryId <= 0) {
        throw new ValidationError('O ID da categoria é inválido');
    }

    if (!name || name.trim() === '') {
        throw new ValidationError('O campo "nome" é obrigatório');
    }

    // Verifica se a categoria existe antes de atualizar    
    const existingCategory = await prisma.category.findUnique({
        where: { id: categoryId }
    });

    if (!existingCategory) {
        throw new ValidationError(`Categoria com ID ${categoryId} não encontrada`);
    }

    // Verifica se já existe outra categoria com o mesmo nome
    const existingCategoryName = await prisma.category.findFirst({
        where: {
            name: name.trim(),
            NOT: { id: categoryId }
        }
    });

    if (existingCategoryName) {
        throw new ValidationError('Já existe uma categoria com esse nome');
    }

    return prisma.category.update({
        where: { id: categoryId },
        data: {
            ...(name !== undefined && { name: name.trim() }),
        }
    });
}

// Deleta uma categoria por ID
export async function deleteCategory(categoryId: number) {

    if (!categoryId || categoryId <= 0) {
        throw new ValidationError('O ID da categoria é inválido');
    }

    // Verifica se a categoria existe antes de deletar
    const existingCategory = await prisma.category.findUnique({
        where: { id: categoryId }
    });

    if (!existingCategory) {
        throw new NotFoundError(`Categoria com ID ${categoryId} não encontrada`);
    }

    // Verificar se há produtos associados a categoria
    const categoryHasProducts = await prisma.product.findFirst({
        where: {
            categories: {
                some: { id: categoryId }
            }
        }
    });

    if (categoryHasProducts) {
        throw new ValidationError('Não é possível deletar uma categoria com produtos associados');
    }

    return prisma.category.delete({
        where: { id: categoryId }
    });
}
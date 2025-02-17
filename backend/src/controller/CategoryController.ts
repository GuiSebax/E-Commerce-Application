import { Request, Response } from 'express';
import { findCategoryById, findAllCategories, createCategory, updateCategory, deleteCategory } from '../services/CategoryService';
import { ValidationError, NotFoundError } from '../utils/errors';
// Função para listar todas as categorias
export async function findAllCategoriesHandler(req: Request, res: Response) {
    try {
        const categories = await findAllCategories();
        res.json(categories);
    } catch (error) {
        handleError(error, res);
    }
}

// Função para buscar uma categoria pelo ID
export async function findCategoryByIdHandler(req: Request, res: Response) {
    try {
        const categoryId = Number(req.params.id);

        if (isNaN(categoryId) || categoryId <= 0) {
            res.status(400).json({ message: 'ID da categoria inválido.' });
            return;
        }

        const category = await findCategoryById(categoryId);
        res.json(category);
    } catch (error) {
        handleError(error, res);
    }
}


// Criar uma nova categoria
export async function createCategoryHandler(req: Request, res: Response) {
    try {
        const { name } = req.body;

        if (!name || name.trim() === '') {
            res.status(400).json({ message: 'O campo nome é obrigatório.' });
            return;
        }

        const category = await createCategory(name);
        res.status(201).json(category);
    } catch (error) {
        handleError(error, res);
    }
}

// Atualizar uma categoria
export async function updateCategoryHandler(req: Request, res: Response) {
    try {
        const categoryId = Number(req.params.id);
        if (isNaN(categoryId) || categoryId <= 0) {
            res.status(400).json({ message: 'ID da categoria inválido.' });
            return;
        }

        const { name } = req.body;

        if (!name || name.trim() === '') {
            res.status(400).json({ message: 'O campo nome é obrigatório.' });
            return;
        }

        const category = await updateCategory(categoryId, name);
        res.json(category);
    } catch (error) {
        handleError(error, res);
    }
}


// Deletar uma categoria    

export async function deleteCategoryHandler(req: Request, res: Response) {
    try {
        const categoryId = Number(req.params.id);
        if (isNaN(categoryId) || categoryId <= 0) {
            res.status(400).json({ message: 'ID da categoria inválido.' });
            return;
        }

        await deleteCategory(categoryId);
        res.status(204).send();
    } catch (error) {
        handleError(error, res);
    }
}

// Função para tratar erros
// Função para tratar os erros
function handleError(error: any, res: Response) {
    if (error instanceof ValidationError || error instanceof NotFoundError) {
        return res.status(error.statusCode).json({ message: error.message });
    }

    console.error('[CategoryController] Erro inesperado:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
}
import { Request, Response } from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from '../services/UserService';
import { ValidationError, NotFoundError } from '../utils/errors';

// Função para listar todos os usuários
export async function getAllUsersHandler(req: Request, res: Response) {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        handleError(error, res);
    }
}

// Função para buscar um usuário pelo ID
export async function getUserByIdHandler(req: Request, res: Response) {
    try {
        const userId = Number(req.params.id);
        if (isNaN(userId) || userId <= 0) {
            res.status(400).json({ message: 'ID do usuário inválido.' });
            return;
        }

        const user = await getUserById(userId);
        res.json(user);
    } catch (error) {
        handleError(error, res);
    }
}

// Função para criar um usuário
export async function createUserHandler(req: Request, res: Response) {
    try {
        const { email, password, name, role } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Email e senha são obrigatórios.' });
            return;
        }

        const user = await createUser({ email, password, name, role });
        res.status(201).json(user);
    } catch (error) {
        handleError(error, res);
    }
}

// Função para atualizar um usuário
export async function updateUserHandler(req: Request, res: Response) {
    try {
        const userId = Number(req.params.id);
        if (isNaN(userId) || userId <= 0) {
            res.status(400).json({ message: 'ID do usuário inválido.' });
            return;
        }

        const { name, role } = req.body;
        if (!name && !role) {
            res.status(400).json({ message: 'É necessário fornecer pelo menos um campo para atualização.' });
            return;
        }

        const user = await updateUser(userId, { name, role });
        res.json(user);
    } catch (error) {
        handleError(error, res);
    }
}

// Função para deletar um usuário
export async function deleteUserHandler(req: Request, res: Response) {
    try {
        const userId = Number(req.params.id);
        if (isNaN(userId) || userId <= 0) {
            res.status(400).json({ message: 'ID do usuário inválido.' });
            return;
        }

        await deleteUser(userId);
        res.status(204).send();
    } catch (error) {
        handleError(error, res);
    }
}

// Função para tratar erros
function handleError(error: any, res: Response) {
    if (error instanceof ValidationError || error instanceof NotFoundError) {
        return res.status(error.statusCode).json({ message: error.message });
    }

    console.error('[UserController] Erro inesperado:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
}
import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/AuthService';
import { ValidationError, NotFoundError } from '../utils/errors';

// Registar um usuário
export async function registerHandler(req: Request, res: Response) {
    try {
        const { email, password, name, role } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Email e senha são obrigatórios' });
            return;
        }

        const user = await registerUser(email, password, name, role);
        res.status(201).json(user);
    } catch (error) {
        handleError(error, res);
    }
}

// Login
export async function loginHandler(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Email e senha são obrigatórios' });
            return;
        }

        const user = await loginUser(email, password);
        res.status(200).json(user);
    } catch (error) {
        handleError(error, res);
    }
}

// Função para lidar com erros
function handleError(error: any, res: Response) {
    if (error instanceof ValidationError || error instanceof NotFoundError) {
        return res.status(error.statusCode).json({ message: error.message });
    }

    console.error("[AuthController] Erro inesperado:", error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
}
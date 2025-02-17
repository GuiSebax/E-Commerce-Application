import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ValidationError } from '../utils/errors';

const JWT_SECRET = process.env.JWT_SECRET || 'default';


// Verificar autenticação
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "Token não informado" });
            return;
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
        (req as any).userId = decoded.userId; // Adiciona o userId no objeto req 

        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido ou expirado" });
        return;
    }
}
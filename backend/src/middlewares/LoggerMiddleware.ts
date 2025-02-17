import { Request, Response, NextFunction } from 'express';

// Registrar logs de requisições
export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const timestamp = new Date().toISOString();

    console.log(`[${timestamp}] ${method} ${originalUrl}`);

    next(); // Chama o próximo middleware

}
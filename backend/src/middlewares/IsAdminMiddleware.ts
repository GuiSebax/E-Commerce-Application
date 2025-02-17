import { Request, Response, NextFunction } from "express";
import prisma from "../db/prisma";
import { NotFoundError, ValidationError } from "../utils/errors";

export async function isAdminMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).userId; // Pega o `userId` salvo no `authMiddleware`
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            throw new NotFoundError("Usuário não encontrado.");
        }

        if (user.role !== "ADMIN") {
            throw new ValidationError("Acesso negado. Você não tem permissão.");
        }

        next(); // Passa para a próxima função da rota
    } catch (error) {
        res.status(403).json({ message: "Acesso negado. Apenas administradores podem acessar esta rota." });
    }
}

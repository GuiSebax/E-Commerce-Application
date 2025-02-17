import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../utils/errors";

// Validar dados da requisição
export function validateMiddleware(schema: any) {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const messages = error.details.map((detail: any) => detail.message);
            res.status(400).json({ message: "Erro de validação", errors: messages });
            return;
        }

        next();
    };
}


// Usa um schema (como Joi) para validar os dados da requisição.
// Se os dados estiverem errados, retorna 400 Bad Request com a lista de erros.
// Se os dados forem válidos, chama next() e permite que a requisição continue.
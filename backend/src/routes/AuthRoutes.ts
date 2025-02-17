import { Router } from "express";
import { registerHandler, loginHandler } from "../controller/AuthController";
import { validateMiddleware } from "../middlewares/ValidateMiddleware";
import Joi from "joi";

const router = Router();

//  Schema de validação para registro de usuário
const registerSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "O campo 'email' deve ser um email válido.",
        "any.required": "O campo 'email' é obrigatório."
    }),
    password: Joi.string().min(6).required().messages({
        "string.min": "A senha deve ter no mínimo 6 caracteres.",
        "any.required": "O campo 'senha' é obrigatório."
    }),
    name: Joi.string().optional(),
    role: Joi.string().valid("ADMIN", "CUSTOMER").optional()
});

// Schema de validação para login 
const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "O campo 'email' deve ser um email válido.",
        "any.required": "O campo 'email' é obrigatório."
    }),
    password: Joi.string().required().messages({
        "any.required": "O campo 'senha' é obrigatório."
    })
});

//  Rota de registro com validação
router.post("/register", validateMiddleware(registerSchema), registerHandler);

//  Rota de login com validação
router.post("/login", validateMiddleware(loginSchema), loginHandler);

export default router;

import { Router } from "express";
import {
    getAllUsersHandler,
    getUserByIdHandler,
    createUserHandler,
    updateUserHandler,
    deleteUserHandler
} from "../controller/UserController";
import { authMiddleware } from "../middlewares/AuthMiddleware";

const router = Router();

// Rota para listar todos os usuários   
router.get('/', authMiddleware, getAllUsersHandler);

// Rota para buscar um usuário pelo ID
router.get('/:id', authMiddleware, getUserByIdHandler);

// Rota para criar um usuário
router.post('/', createUserHandler);

// Rota para atualizar um usuário
router.put('/:id', authMiddleware, updateUserHandler);

// Rota para deletar um usuário
router.delete('/:id', authMiddleware, deleteUserHandler);


export default router;
import { Router } from "express";
import { getordersHandler, getOrderByIdHandler, updateOrderStatusHandler, createOrderHandler, deleteOrderHandler } from "../controller/OrderController";
import { authMiddleware } from "../middlewares/AuthMiddleware";

const router = Router();

// Listar todos os pedidos
router.get('/', authMiddleware, getordersHandler);

// Buscar um pedido pelo ID
router.get('/:id', authMiddleware, getOrderByIdHandler);

// Criar um novo pedido
router.post('/', authMiddleware, createOrderHandler);

// Atualizar o status de um pedido
router.put('/:id/status', updateOrderStatusHandler);

// Deletar um pedido
router.delete('/:id', deleteOrderHandler);

export default router;
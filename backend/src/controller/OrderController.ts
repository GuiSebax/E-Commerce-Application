import { Request, Response } from 'express';
import { getAllOrders, getOrderById, createOrder, updateOrderStatus, deleteOrder } from '../services/OrderService';
import { ValidationError, NotFoundError } from '../utils/errors';

// Lista todos os pedidos
export async function getordersHandler(req: Request, res: Response) {
    try {
        const orders = await getAllOrders();
        res.json(orders);
    } catch (error) {
        handleError(error, res);
    }
}

// Busca um pedido pelo ID
export async function getOrderByIdHandler(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const order = await getOrderById(Number(id));
        if (!order) {
            res.status(404).json({ message: `Pedido com ID ${id} não encontrado` });
            return;
        }
        res.json(order);
    } catch (error) {
        handleError(error, res);
    }
}

// Cria um novo pedido
export async function createOrderHandler(req: Request, res: Response) {
    try {
        const { userId, items } = req.body;
        if (!userId || !Array.isArray(items) || items.length === 0) {
            res.status(400).json({ message: 'Usuario e itens do pedido são obrigatórios' });
            return;
        }
        const order = await createOrder(userId, items);
        res.status(201).json(order);
    } catch (error) {
        handleError(error, res);
    }
}

// Atualiza o status de um pedido
export async function updateOrderStatusHandler(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const validStatuses = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

        if (!validStatuses.includes(status)) {
            res.status(400).json({ message: 'Status inválido' });
            return;
        }

        const updatedOrder = await updateOrderStatus(Number(id), status);
        res.json(updatedOrder);
    } catch (error) {
        handleError(error, res);
    }
}

export async function deleteOrderHandler(req: Request, res: Response) {
    try {
        const { id } = req.params;
        await deleteOrder(Number(id));
        res.status(204).send();
    } catch (error) {
        handleError(error, res);
    }
}

// Função auxiliar para lidar com erros
function handleError(error: any, res: Response) {
    if (error instanceof ValidationError) {
        return res.status(error.statusCode).json({ message: error.message });
    }
    else if (error instanceof NotFoundError) {
        return res.status(error.statusCode).json({ message: error.message });
    }
    else {
        console.error('[OrderController] Erro inesperado:', error);
        return res.status(500).json({ message: 'Erro inesperado' });
    }
}
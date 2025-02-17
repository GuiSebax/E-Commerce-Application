import prisma from '../db/prisma';
import { ValidationError, NotFoundError } from '../utils/errors';

// Cria um novo pedido
// Calcula o total do pedido baseado nos produtos 
export async function createOrder(userId: number, items: { productId: number; quantity: number }[]) {
    if (!items || items.length === 0) {
        throw new ValidationError('O pedido deve conter pelo menos um produto.');
    }

    // Buscar os produtos no banco para calcular o total
    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
        where: { id: { in: productIds } }
    });

    if (products.length !== productIds.length) {
        throw new NotFoundError('Um ou mais produtos não foram encontrados.');
    }

    // Calcular o preço total do pedido
    let totalPrice = 0;
    const orderItems = items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) throw new NotFoundError(`Produto ID ${item.productId} não encontrado.`);
        const itemTotal = product.price * item.quantity;
        totalPrice += itemTotal;
        return {
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: product.price,
        };
    });

    // Criar o pedido no banco de dados
    const order = await prisma.order.create({
        data: {
            userId,
            totalPrice,
            status: 'PENDING',
            items: {
                create: orderItems,
            },
        },
        include: {
            items: true,
        }
    });

    return order;
}

// Retorna todos os pedidos
export async function getAllOrders() {
    return prisma.order.findMany({
        include: {
            items: true,
        },
    });
}

// Retorna um pedido pelo ID
export async function getOrderById(orderId: number) {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            items: {
                include: { product: true },
            },
        },
    });

    if (!order) {
        throw new NotFoundError(`Pedido com ID ${orderId} não encontrado.`);
    }

    return order;
}

// Atualiza o status de um pedido
export async function updateOrderStatus(
    orderId: number,
    status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED') {
    // Verifica se o pedido existe
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
        throw new NotFoundError(`Pedido com ID ${orderId} não encontrado.`);
    }

    // Atualiza o status do pedido
    return prisma.order.update({
        where: { id: orderId },
        data: { status },
    });
}


export async function deleteOrder(orderId: number) {
    // Verifica se o pedido existe
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
        throw new NotFoundError(`Pedido com ID ${orderId} não encontrado.`);
    }

    if (order.status !== 'PENDING') {
        throw new ValidationError('Apenas pedidos pendentes podem ser deletados.');
    }

    // Deleta o item do pedido
    await prisma.orderItem.deleteMany({ where: { orderId } });

    // Deleta o pedido
    await prisma.order.delete({ where: { id: orderId } });
}
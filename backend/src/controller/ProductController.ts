import { Request, Response } from 'express';
import { findAllProducts, findProductById, createProduct, updateProduct, deleteProduct } from "../services/ProductService";
import { ValidationError, NotFoundError } from "../utils/errors";

// Função p/ listagem de produtos
export async function getProductsHandler(req: Request, res: Response) {
    try {
        const products = await findAllProducts();
        res.json(products);
    } catch (error) {
        handleError(error, res);
    }
}

// Função p/ buscar produto por ID
export async function getProductByIdHandler(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const product = await findProductById(Number(id));
        res.json(product);
    } catch (error) {
        handleError(error, res);
    }
}

// Função p/ criar produto
export async function createProductHandler(req: Request, res: Response) {
    try {
        const { name, price, description } = req.body;
        const newProduct = await createProduct({ name, description, price });
        res.status(201).json(newProduct);
    } catch (error) {
        handleError(error, res);
    }
}

// Função p/ atualizar produto
export async function updateProductHandler(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { name, price, description } = req.body;
        const updatedProduct = await updateProduct(Number(id), { name, description, price });
        res.json(updatedProduct);
    } catch (error) {
        handleError(error, res);
    }
}

// Função p/ deletar produto
export async function deleteProductHandler(req: Request, res: Response) {
    try {
        const { id } = req.params;
        await deleteProduct(Number(id));
        res.status(204).send();
    } catch (error) {
        handleError(error, res);
    }
}

// Helper interno que decide qual status HTTP retornar
// com base no tipo de erro vindo do service

function handleError(error: any, res: Response) {
    if (error instanceof ValidationError) {
        // Erro de validação -> 400
        res.status(error.statusCode).json({ message: error.message });
    } else if (error instanceof NotFoundError) {
        // Não encontrado -> 404
        res.status(error.statusCode).json({ message: error.message });
    } else {
        // Erro interno -> 500
        console.log('[ProductController] Erro inesperado:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });

    }
}
import { Request, Response } from 'express';
import { getAddressById, getAllAddressesByUserId, getAllAddresses, createAddress, updateAddress, deleteAddress } from '../services/AddressService';
import { NotFoundError, ValidationError } from '../utils/errors';

// controller para pegar todos os endereços independente do usuário
export async function getAllAddressesHandler(req: Request, res: Response) {
    try {
        const addresses = await getAllAddresses();
        res.json(addresses);
    } catch (error) {
        handleError(error, res);
    }
}

// Pegar todos os endereços de um usuário específico
export async function getAllAddressesByUserIdHandler(req: Request, res: Response) {
    try {
        const userId = Number(req.params.id);
        if (isNaN(userId) || userId <= 0) {
            res.status(400).json({ message: 'ID do usuário inválido' });
            return;
        }
        const addresses = await getAllAddressesByUserId(userId);
        res.json(addresses);
    } catch (error) {
        handleError(error, res);
    }
}

// Pegar um endereço pelo ID do endereço
export async function getAddressByIdHandler(req: Request, res: Response) {
    try {
        const addressId = Number(req.params.id);
        if (isNaN(addressId) || addressId <= 0) {
            res.status(400).json({ message: 'ID do endereço inválido.' });
            return;
        }

        const address = await getAddressById(addressId);
        res.json(address);
    } catch (error) {
        handleError(error, res);
    }
}

// Criar um novo endereço
export async function createAddressHandler(req: Request, res: Response) {
    try {
        const { userId, street, city, state, country, zipCode } = req.body;
        if (!userId || !street || !city || !state || !country) {
            res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos.' });
            return;
        }

        const address = await createAddress({ userId, street, city, state, country, zipCode });
        res.status(201).json(address);
    } catch (error) {
        handleError(error, res);
    }
}

// Atualizar um endereço
export async function updateAddressHandler(req: Request, res: Response) {
    try {
        const addressId = Number(req.params.id);
        if (isNaN(addressId) || addressId <= 0) {
            res.status(400).json({ message: 'ID do endereço inválido.' });
            return;
        }

        const { street, city, state, country, zipCode } = req.body;
        const address = await updateAddress(addressId, { street, city, state, country, zipCode });
        res.json(address);
    } catch (error) {
        handleError(error, res);
    }
}


// Deletar um endereço
export async function deleteAddressHandler(req: Request, res: Response) {
    try {
        const addressId = Number(req.params.id);
        if (isNaN(addressId) || addressId <= 0) {
            res.status(400).json({ message: 'ID do endereço inválido.' });
            return;
        }

        await deleteAddress(addressId);
        res.sendStatus(204);
    } catch (error) {
        handleError(error, res);
    }
}

// Função para tratar os erros
function handleError(error: any, res: Response) {
    if (error instanceof ValidationError || error instanceof NotFoundError) {
        return res.status(error.statusCode).json({ message: error.message });
    }

    console.error('[AddressController] Erro inesperado:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
}
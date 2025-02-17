import { Router } from "express";
import { getAllAddressesHandler, getAddressByIdHandler, getAllAddressesByUserIdHandler, createAddressHandler, updateAddressHandler, deleteAddressHandler } from "../controller/AddressController";
import { authMiddleware } from "../middlewares/AuthMiddleware";

const router = Router();

// GET /addresses
router.get('/', authMiddleware, getAllAddressesHandler);

// GET /addresses/user/:id
router.get('/user/:id', authMiddleware, getAllAddressesByUserIdHandler);

// GET /addresses/:id   
router.get('/:id', authMiddleware, getAddressByIdHandler);

// POST /addresses
router.post('/', authMiddleware, createAddressHandler);

// PUT /addresses/:id
router.put('/:id', authMiddleware, updateAddressHandler);

// DELETE /addresses/:id
router.delete('/:id', authMiddleware, deleteAddressHandler);

export default router;
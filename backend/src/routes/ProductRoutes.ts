import { Router } from "express";
import { getProductsHandler, getProductByIdHandler, createProductHandler, updateProductHandler, deleteProductHandler } from "../controller/ProductController";
import {
    authMiddleware

} from "../middlewares/AuthMiddleware";
import { isAdminMiddleware } from "../middlewares/IsAdminMiddleware";
const router = Router();

// GET /api/products
router.get("/", getProductsHandler);

// GET /api/products/:id
router.get("/:id", getProductByIdHandler);

// POST /api/products
router.post("/", authMiddleware, isAdminMiddleware, createProductHandler);

// PUT /api/products/:id
router.put("/:id", authMiddleware, isAdminMiddleware, updateProductHandler);

// DELETE /api/products/:id 
router.delete("/:id", authMiddleware, isAdminMiddleware, deleteProductHandler);

export default router;
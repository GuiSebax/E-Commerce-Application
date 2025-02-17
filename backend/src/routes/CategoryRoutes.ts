import { Router } from "express";
import {
    findAllCategoriesHandler
    , findCategoryByIdHandler
    , createCategoryHandler
    , updateCategoryHandler
    , deleteCategoryHandler
} from "../controller/CategoryController";


const router = Router();

// Get all categories
router.get("/", findAllCategoriesHandler);

// Get category by ID
router.get("/:id", findCategoryByIdHandler);

// Create a new category
router.post("/", createCategoryHandler);

// Update a category
router.put("/:id", updateCategoryHandler);

// Delete a category
router.delete("/:id", deleteCategoryHandler);

export default router;
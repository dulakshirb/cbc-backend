import express from "express";
import {
  createProduct,
  getProducts,
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.post("/", createProduct);

export default productRouter;

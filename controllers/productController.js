import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export function createProduct(req, res) {
  if (!isAdmin(req)) {
    res.json({
      message: "Please login as administrator to add products.",
    });
  }

  const newProductData = req.body;

  const product = new Product(newProductData);

  product
    .save()
    .then(() => {
      res.json({
        message: "Product added successfully.",
      });
    })
    .catch((error) => {
      res.json({
        message: error,
      });
    });
}

export function getProducts(req, res) {
  Product.find({})
    .then((products) => {
      res.json(products);
    })
    .catch((error) => {
      res.json(error);
    });
}

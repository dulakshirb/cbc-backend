import Product from "../models/product.js";

export function createProduct(req, res) {

  //   Authentication
  if (req.user == null) {
    res.json({
      message: "You are not log in",
    });
    return;
  }

  //   Authorization
  if (req.user.type != "admin") {
    res.json({
      message: "You are not admin",
    });
    return;
  }

  const newProduct = new Product(req.body);

  newProduct
    .save()
    .then(() => {
      res.json({
        message: "Product created.",
      });
    })
    .catch(() => {
      res.json({
        message: "Product not created.",
      });
    });
}

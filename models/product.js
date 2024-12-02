import mongoose from "mongoose";

const productScheme = mongoose.Schema({
  name: String,
  price: Number,
  description: String,
});

const Product = mongoose.model("products", productScheme);

export default Product;

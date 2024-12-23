import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";
import productRouter from "./routes/productRouter.js";
import orderRouter from "./routes/orderRouter.js";

dotenv.config();

const app = express();
const mongoUrl = process.env.MONGO_DB_URI;

app.use(cors());

mongoose.connect(mongoUrl, {});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Database Connected.");
});

app.use(bodyParser.json());
app.use((req, res, next) => {
  const token = req.header("authorization")?.replace("Bearer ", "");
  console.log(token);

  if (token != null) {
    jwt.verify(token, process.env.SECRET, (error, decoded) => {
      if (!error) {
        console.log(decoded);
        req.user = decoded;
      }
    });
  }

  next();
});

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter)

app.listen(3000, () => {
  console.log("server is running on PORT: 3000");
});
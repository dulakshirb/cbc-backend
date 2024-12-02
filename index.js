import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import jwt from "jsonwebtoken";

const app = express();
const mongoUrl =
  "mongodb+srv://admin:admin123@cluster0.5zfl6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    jwt.verify(token, "cbc-secret-key-1234", (error, decoded) => {
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

app.listen(3000, () => {
  console.log("server is running on PORT: 3000");
});

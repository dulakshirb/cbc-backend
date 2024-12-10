import Order from "../models/order.js";
import Product from "../models/product.js";
import { isCustomer } from "./userController.js";

export async function createOrder(req, res) {
  if (!isCustomer) {
    res.json({
      message: "Please login to create an order.",
    });
  }

  try {
    //take the lastest order ID
    const latestOrder = await Order.find().sort({ date: -1 }).limit(1);

    let orderId;

    if (latestOrder.length == 0) {
      orderId = "CBC1000";
    } else {
      const currentOrderId = latestOrder[0].orderId;
      const numberString = currentOrderId.replace("CBC", "");
      const number = parseInt(numberString);
      orderId = "CBC" + (number + 1).toString().padStart(4, "0");
    }

    const newOrderData = req.body;

    if (
      !Array.isArray(newOrderData.orderedItems) ||
      newOrderData.orderedItems.length === 0
    ) {
      return res.status(400).json({
        message: "Invalid or missing ordered items.",
      });
    }

    const orderedItemsProductData = [];

    for (let i = 0; i < newOrderData.orderedItems.length; i++) {
      //console.log(newOrderData.orderedItems[i]);

      //fetch the product
      const product = await Product.findOne({
        productId: newOrderData.orderedItems[i].productId,
      });

      if (product == null) {
        res.json({
          message:
            "Product with ID " +
            newOrderData.orderedItems[i].productId +
            " not found.",
        });
        return;
      }

      //check stock availablity of the product
      if (product.stock < newOrderData.orderedItems[i].quantity) {
        res.json({
          message:
            "Product with ID " +
            newOrderData.orderedItems[i].productId +
            " is out of stock.",
        });
        return;
      }

      //update stock of the product
      product.stock -= newOrderData.orderedItems[i].quantity;
      console.log(product.stock);
      await product.updateOne({ stock: product.stock });

      //add the product to the order
      orderedItemsProductData[i] = {
        productId: product.productId,
        name: product.productName,
        price: product.lastPrice,
        quantity: newOrderData.orderedItems[i].quantity,
        image: product.images[0],
      };
    }

    newOrderData.orderedItems = orderedItemsProductData;

    newOrderData.orderId = orderId;
    newOrderData.email = req.user.email;

    const order = new Order(newOrderData);

    await order.save();

    res.json({
      message: "order created.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function getAllOrders(req, res) {
  try {
    const orders = await Order.find({ email: req.user.email });
    res.json({
      list: orders,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

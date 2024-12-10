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

    const orderedItemsProductData = [];

    for (let i = 0; i < newOrderData.orderedItems.length; i++) {
      //console.log(newOrderData.orderedItems[i]);

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

      orderedItemsProductData[i] = {
        productId: product.productId,
        name: product.productName,
        price: product.lastPrice,
        quantity: newOrderData.orderedItems[i].quantity,
        image: product.images[0],
      };
    }
    //console.log(orderedItemsProductData);

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
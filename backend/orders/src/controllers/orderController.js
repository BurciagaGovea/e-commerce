// import Orders from "../models/orderModel.js";
import { models } from "../models/index.js";
const {Orders, orderDetail} = models;
import { publishOrder } from "../rabbitmq/producer.js";

import { orderService } from "../services/orderService.js";
import { cartService } from "../services/cartService.js";
import { wishlistService } from "../services/wishlistService.js";

export const getOrders = async(req, res) => {
    try {
        const orders = await orderService.getOrders();
        if(!orders){
            return res.status(404).json({message: 'Orders not found'});
        }
        return res.status(200).json({
            orders: orders
        });
    } catch (error) {
        console.error('Error getting orders: ', error);
        return res.status(500).json({message: 'UNexpected error'});
    }
};

export const createOrderr = async(req, res) => {
    try{
        const {client_id, products} = req.body;
        const newOrder = await orderService.generateOrder(client_id, products);

        if (newOrder.error) {
            return res.status(500).json({
                message: 'Products do not exist or not enough stock',
                reason: newOrder.error
            });
        }

        return res.status(200).json({
            message: 'Order created',
            order: newOrder
        });
    } catch(err){
        console.error(err);
        return res.status(500).json({
            message: 'Unexpected error'
        });
    }
};

export const getOrdersDetails = async(req, res) => {
    try{
        const { order_id } = req.params;

        if(!order_id){
            return res.status(400).json({
                message: 'Provide an order id'
            });
        }

        const orderData = await orderService.getDetails(order_id);
        if(!orderData){
            return res.status(404).json({message: 'Order not found'});   
        }
        const {order, order_details} = orderData

        return res.status(200).json({
            order: order,
            orderDetails: order_details
        });

    } catch(error){
        console.error(error);
        return res.status(500).json({message: 'Unexpected error'});
    }
}

//esto debería ir en otro archivo pero x
export const addToCart = async(req, res) => {
    try{
        const {client_id, product} = req.body;
        const newOrder = await cartService.addToCart(client_id, product);

        if (newOrder.error) {
            return res.status(500).json({
                message: 'Products do not exist or not enough stock',
                reason: newOrder.error
            });
        }

        console.log(newOrder);
        return res.status(200).json({
            message: 'Added to cart',
            cart: newOrder
        });
    } catch(error){
        console.error(err);
        return res.status(500).json({
            message: 'Unexpected error'
        });
    }
};

export const payCart = async(req, res) => {
    try{
        const { client_id } = req.params;
        const cartPaid = await cartService.payCartRemaster(client_id);
        if(!cartPaid){
            return res.status(404).json({
                message: `No cart pendign for ${client_id}`
            });
        }

        if(cartPaid.error){
          return res.status(500).json({
            message: 'Products do not exist or not enough stock',
          });
        }

        return res.status(200).json({
            message: 'Cart paid',
            cart: cartPaid
        })

    }catch(error){
        console.error(error);
        return res.status(500).json({
            message: 'Unexpected error'
        })
    }
}

//también en otro archivo

export const getWishlist = async (req, res) => {
  try {
    const { user_id } = req.params;
    const wishlist = await wishlistService.getWishlist(user_id);

    return res.status(200).json({
      wishlist
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Unexpected error"
    });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { user_id, product_id } = req.body;

    const item = await wishlistService.addToWishlist(user_id, product_id);

    return res.status(200).json({
      message: "Added to wishlist",
      item
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Unexpected error"
    });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { user_id, product_id } = req.body;

    const removed = await wishlistService.removeFromWishlist(user_id, product_id);

    if (!removed) {
      return res.status(404).json({
        message: "Wishlist item not found"
      });
    }

    return res.status(200).json({
      message: "Removed from wishlist",
      item: removed
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Unexpected error"
    });
  }
};



// export const createOrder = async(req, res) => {
//     try{
//         const {client_id, total_price, status} = req.body;
//         const newOrder = await Orders.create({
//             client_id,
//             total_price, 
//             status
//         });

//         await publishOrder(newOrder);

//         return res.status(200).json({
//             message: 'Order created',
//             order: newOrder
//         });
//     } catch(error){
//         console.error('Err at creating order: ', error);
//         return res.status(500).json({
//             message: 'Unxpected error'
//         });
//     }
// };
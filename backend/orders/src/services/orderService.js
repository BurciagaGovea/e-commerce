import { models } from "../models/index.js";
const {Orders} = models;
import { requestPrice } from "../rabbitmq/producer.js";

export const orderService = {
    createOrder: async (client_id, products) => {
        try {
            if(!client_id || !products){
                throw new Error("Missing info");
            }

            let total_price = 0;
            const order = await Orders.create({
                client_id,
                total_price
            });


            for (const product of products) {
                // console.log(product.product_id);
                requestPrice(product.product_id, (price) => {
                    console.log(price)
                });                
            }
        } catch (error) {
            console.error(error);
        }
    }
};
import { or } from "sequelize";
import sequelize from "../config/database.js";
import { models } from "../models/index.js";
const {Orders, orderDetail} = models;
import { processOrder, requestPrice } from "../rabbitmq/producer.js";
import AsyncQueue from "sequelize/lib/dialects/mssql/async-queue";


export const orderService = {
    createOrder: async (client_id, products) => {
        // https://sequelize.org/docs/v6/other-topics/transactions/#unmanaged-transactions
        const t = await sequelize.transaction();
        try {

            if(!client_id || !products){
                throw new Error("Missing info");
            }

            let total_price = 0;
            const order = await Orders.create(
                {
                client_id,
                total_price
            },
            {
                transaction: t
            }
        );
            for (const product of products) {
                // console.log(product.product_id);
                const unit_price = await requestPrice(product.product_id);
                if(unit_price.error){
                    console.log(unit_price);
                    throw new Error(`Product ${product.product_id} not found`);
                }
                const subtotal = unit_price * product.quantity;
                total_price += subtotal
                const order_detail = await orderDetail.create({
                    product_id: product.product_id,
                    quantity: product.quantity,
                    unit_price,
                    subtotal,
                    order_id: order.dataValues.id
                },
                {transaction: t}
            );
                
                // console.log(order_detail);
                // console.log(`Price for ${product.product_id}: ${unit_price} sub: ${subtotal}`)              
            };

            order.total_price = total_price;
            await order.save({transaction: t});
            await t.commit();

            // console.log(order.dataValues);
            return order.dataValues;
        } catch (error) {
            await t.rollback();
            console.error(error);
            throw error;
        }
    },

    generateOrder: async(client_id, products) => {
        const t = await sequelize.transaction();
        try {
            let total_price = 0;

            const newOrder = await Orders.create(
                {
                    client_id,
                    total_price
                },
                {
                    transaction: t
                }
            );

            const productsDetails = await processOrder(products);
            if(productsDetails &&  productsDetails.error){
                console.log(productsDetails);
                await t.rollback();
                return productsDetails
                return null;

                throw new Error(`Products could not be processed`);
            }
            console.log(productsDetails)
            for(const product of productsDetails){
                product.subtotal = product.quantity * product.unit_price;
                total_price += product.subtotal;
                product.order_id = newOrder.id
            };  
            console.log(productsDetails)
            const newOrderDetails = await orderDetail.bulkCreate(productsDetails, {transaction: t})
            console.log(newOrderDetails.dataValues)

            newOrder.total_price = total_price;
            await newOrder.save({transaction:t});
            await t.commit();
            return newOrder.dataValues;

        } catch (error) {
            await t.rollback();
            console.error(error)
        }
    },

    getOrders: async () => {
        try{
            const orders = await Orders.findAll();
            if(!orders){
                return null;
            }
            return orders;
        } catch (error) {
            console.error('Error getting orders: ', error);
            throw error;
        }
    },

    getDetails: async (order_id) => {
        try{
            const order = await Orders.findByPk(order_id);
            if(!order){
                return null;
            }

            const order_details = await orderDetail.findAll({where: {order_id}})

            return {order, order_details};
        } catch(error){
            console.error(error);
            throw Error;
        }
    },
    
};
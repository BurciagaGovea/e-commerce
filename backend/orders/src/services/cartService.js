import { Op, where } from "sequelize";
import sequelize from "../config/database.js";
import { addToCart } from "../controllers/orderController.js";
import { models } from "../models/index.js";
const {Orders, orderDetail} = models;
import { requestPrice, requestPriceAvailibility } from "../rabbitmq/producer.js";

export const cartService = {
    addToCart: async (client_id, products) => {
        const t = await sequelize.transaction();
        try {
            if (!client_id || !products || !Array.isArray(products)) {
                throw new Error("Missing or invalid info");
            }
            let total_price = 0;
            const [cart, created] = await Orders.findOrCreate({
                where: {
                    [Op.and]: [
                        { client_id },
                        { status: 'pending' }
                    ]
                },
                defaults: {
                    client_id,
                    total_price,
                    status: 'pending'
                },
                transaction: t
            });


            const productsAvailables  = await requestPriceAvailibility(products);
            if(productsAvailables.error){
                console.log(productsAvailables);
                await t.rollback();
                return productsAvailables
            }

            for(const product of productsAvailables){
                product.subtotal = product.quantity * product.unit_price;
                total_price += product.subtotal;
                product.order_id = cart.id;
            }

            const newCartDetails = await orderDetail.bulkCreate(productsAvailables, {transaction: t});
            console.log(newCartDetails.dataValues);
            cart.total_price = total_price;
            await cart.save({transaction: t});
            await t.commit();
            return cart;

            // for (const product of products) {
            //     const unit_price = await requestPrice(product.product_id);
            //     if (unit_price.error) {
            //         throw new Error(`Product ${product.product_id} not found`);
            //     }

            //     const subtotal = Number(unit_price) * product.quantity;
            //     total_price += subtotal;

            //     await orderDetail.create({
            //         product_id: product.product_id,
            //         quantity: product.quantity,
            //         unit_price,
            //         subtotal,
            //         order_id: cart.id
            //     }, { transaction: t });
            // }

            // cart.total_price = total_price;
            // await cart.save({ transaction: t });
            // await t.commit();

            // return cart;
        } catch (error) {
            await t.rollback();
            console.error(error);
            throw error;
        }
    },

    payCart: async (client_id) => {
        const t = await sequelize.transaction();
        try{
            const cart = await Orders.findOne({
                where: {
                    [Op.and]: [{client_id}, {status: 'pending'}]
                },
                transaction: t
            });

            if(!cart){
                return null;
            }

            cart.status = 'completed';
            await cart.save({transaction: t});
            await t.commit();
            return cart;

        }catch(error){
            await t.rollback();
            console.error(error);
            throw error;
        }
    }
};

import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { models } from "../models/index.js";
// import Wishlist from "../models/wishlistModel.js";

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "mysql",
});

const initDB = async () => {
    try{
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await models.Orders.sync({alter: true});
        await models.orderDetail.sync({alter: true});
        await models.Wishlist.sync({alter: true})
        console.log('Models created!');
    } catch(error){
        console.error('Err at init: ', error);
    }
};

initDB();

export default sequelize;
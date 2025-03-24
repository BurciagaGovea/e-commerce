import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import Client from "../models/clientModel.js";

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "mysql"
});

const initDB = async () => {
    try{
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await Client.sync( {alter: true} );
    } catch(err) {
        console.err('Err at connection: ', err);
    }
};

initDB();

export default sequelize;
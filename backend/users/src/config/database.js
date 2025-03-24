import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import User from "../models/userModel.js";

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});

const initDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Conexión exitosa a la base de datos");
        await User.sync({ alter: true }); //generar sql
        console.log("Tabla creada");
    } catch (err) {
        console.error("Error en la conexión: ", err);
        process.exit(1); // Detener la aplicación si la conexión falla
    }
};

initDB();

export default sequelize;
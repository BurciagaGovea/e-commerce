import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { models } from "../models/index.js";

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "mysql",
    // logging: console.log,
});

export default sequelize;

const initDB = async () => {
    try{
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        // await Category.sync({force: true});
        // await Product.sync({force: true});
        // await Inventory.sync({force: true});
        
        await models.Comment.sync({alter: true});
        await models.Category.sync({ alter: true });
        await models.Product.sync({ alter: true });
        await models.Inventory.sync({ alter: true });

        console.log('Tables created!')
        
    } catch(err) {
        console.error('Unable to connect to the database:', err);
    }
};

initDB();
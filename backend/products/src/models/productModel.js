import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Product = sequelize.define(
    'Product',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false
        },
        url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        // category_id: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false
        // }
    },
    {
        tableName: "products",
        //para que no cree columnas de mas en auto
        timestamps: false  
    }
);
export default Product;


import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Inventory = sequelize.define(
    'Inventory',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        // product_id: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false
        // },
        stock: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0

        }
    },
    {
        tableName: "inventory"
    }
);

export default Inventory;

// import Product from "./productModel.js";

// Product.hasMany(Inventory, { //https://sequelize.org/docs/v6/core-concepts/assocs/
//     foreignKey: 'product_id',
// });  
// Inventory.belongsTo(Product);
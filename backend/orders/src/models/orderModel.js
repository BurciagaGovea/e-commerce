import { DataTypes } from "sequelize";
import { INTEGER, DECIMAL } from "sequelize";
import sequelize from "../config/database.js";

const Orders = sequelize.define(
    'Orders',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        client_id:{
            type: INTEGER,
            allowNull: false
        },
        total_price:{
            type: DECIMAL(10,2),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM,
            values: ['completed', 'canceled'],
            allowNull: false,
            defaultValue: 'completed'
        }
    },
    {
        tableName: "orders"
    }
);

export default Orders
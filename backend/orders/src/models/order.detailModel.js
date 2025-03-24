import sequelize from "../config/database.js";
import { INTEGER, DECIMAL, INET } from "sequelize";

const orderDetail = sequelize.define(
    'orderDetail',
    {
        id:{
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        product_id:{
            type: INTEGER,
            allowNull: false
        },
        quantity: {
            type: INTEGER,
            allowNull: false
        },
        unit_price:{
            type: DECIMAL(10,2),
            allowNull: false
        },
        subtotal:{
            type: DECIMAL(10,2),
            allowNull: false
        }
    },
    {
        tableName: "order_details"
    }
);

export default orderDetail;
import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Wishlist = sequelize.define(
    "wishlist",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
          user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
          },
          product_id: {
            type: DataTypes.INTEGER,
            allowNull: false
          },
        //   added_at: {
        //     type: DataTypes.DATE,
        //     defaultValue: DataTypes.NOW
        //   },
          is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
          }
    },
    {
        tableName: "wishlist",
        timestamps: true
    }
);

export default Wishlist;
import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Category = sequelize.define(
    'Category',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: 'categories'
    }
);

export default Category;
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Client = sequelize.define(
    'Client',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },

        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        middleName: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        
        email:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },

        phone: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },

        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },

        birthDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },

        postCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        street: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        number: {
            type: DataTypes.STRING(10),
            allowNull: false,
        } 
    },
    {
        timestamps: false,
        tableName: "clients",
    }
);

export default Client
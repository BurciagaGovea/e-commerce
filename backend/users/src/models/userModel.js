import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        // clientId: { no sé donde ponerlo
        //     type: DataTypes.INTEGER,
        //     allowNull: true,
        //     unique: true,
        // },

        email:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        
        middleName: {
            type: DataTypes.STRING,
            allowNull: true, //pq a lo mejor solo tiene un nombre
        },

        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        role: {
            type: DataTypes.ENUM,
            values: ['admin', 'superAdmin'],
            defaultValue: 'admin',
        },

        phone: { //https://stackoverflow.com/questions/24353778/which-is-best-data-type-for-phone-number-in-mysql-and-what-should-java-type-mapp
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },

        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        }
    },
    {
        timestamps: false,
        tableName: "users",
    }
);

export default User;
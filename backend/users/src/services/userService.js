import sequelize from "../config/database.js";
import User from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { createClient, userCreatedEvent, forgotPasswordEvent } from "../rabbitmq/publisher.js";

dotenv.config();

export const userService = {
    createUser: async(user, client) => {
        const t = await sequelize.transaction();
        try{
            const userExists = await User.findOne( {where: {email: user.email}} );
            if(userExists){
                return null;
            }

            const newUser = await User.create(user, {transaction: t});
            client.userId = newUser.id;
            const newClient = await createClient(client)
            if(newClient.error){
                console.error('Client creation error:', newClient);
                throw new Error('Client not created');
            }

            await t.commit();
            await userCreatedEvent(newUser);

            return { newUser, newClient};

        }catch(error) {
            await t.rollback();
            console.error(error);
            throw error;
        }
    },

    getUsers: async () => {
        try {
            const users = await User.findAll();
            return users;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    getUserById: async (id) => {
        try {
            const user = await User.findByPk(id);
            return user;
        } catch (error) {
            console.error('Error fetching user by ID:', error);
            throw error;
        }
    },

    login: async (email, password) => {
        try {
            const user = await User.findOne({ where: { email, password, status: true } });
    
            if (!user) {
                return null;
            }
    
            const token = jwt.sign(
                {
                  id: user.id,
                  email: user.email,
                  role: user.role,
                },
                process.env.SECRET_KEY,
                { expiresIn: '1h' }
              );
    
            return { token };
    
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    },

    forgotPassword: async(email) => {
        try {
            const user = await User.findOne({ where: { email } });
    
            if (!user) {
                return null;
            }
    
            await forgotPasswordEvent({ email: user.email });
            return true;
    
        } catch (error) {
            console.error('Error in forgotPassword:', error);
            throw error;
        }
    },

    deleteUser: async(id) => {
        try{
            const userToDelete = await User.findByPk(id);
            if(!userToDelete){
                return null;
            }
    
            if(!userToDelete.status){
                return true;
            } 

            userToDelete.status = false;
            await userToDelete.save();
            return userToDelete.status;
    
        } catch(err) {
            console.error('Err deleting user: ', err);
            throw err; 
        }
    }
}
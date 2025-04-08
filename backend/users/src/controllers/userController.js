import retryAsPromised from "retry-as-promised";
import User from "../models/userModel.js";
import { userService } from "../services/userService.js";

export const getUsers = async (req, res) => {
    try {
        const users = await userService.getUsers();
        res.status(200).json(users);
    } catch (err) {
        console.error('Error getting users: ', err);
        res.status(500).json({ message: 'Unexpected error retrieving users' });
    }
};

export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userService.getUserById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ user });

    } catch (err) {
        console.error('Error obtaining user: ', err);
        return res.status(500).json({ message: 'Unexpected error' });
    }
};

export const createUser = async (req, res) => {
    const { user, client } = req.body;
    try {
        const { email, password, firstName, middleName, lastName, phone,  } = user;
        if (!email || !firstName || !lastName || !phone || !password){
            return res.status(400).json({message: 'Provide all info needed'});
        }
    
        const data = await userService.createUser(user, client); //omfggggggggggggggggggggg {}{}{}{}}{}{}{}{}

        if (!data){
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        return res.status(200).json({
            data
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Unexpected erro'})
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'User and password needed' });
        }

        const loginResult = await userService.login(email, password);

        if (!loginResult) {
            return res.status(404).json({ message: 'Invalid credentials' });
        }

        return res.status(200).json({
            message: `Login succesful: ${email}`,
            token: loginResult.token
        });

    } catch (error) {
        console.error('Error loggin in:', error);
        return res.status(500).json({ message: 'Unexpected error' });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const result = await userService.forgotPassword(email);
        if (!result) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'Password recovery email sent' });
    } catch (error) {
        console.error('Error in forgotPassword:', error);
        return res.status(500).json({ message: 'Unexpected error' });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    
    try{
        const result = await userService.deleteUser(id);
        if (result === null){
            return res.status(404).json({ message: 'User not found' });
        } 

        if (result === true) {
            return res.status(200).json({ message: `User ${id} is already inactive` });
        }

        return res.status(200).json({ message: `User ${id} is now inactive` });

    } catch(err) {
        console.error('Err deleting user: ', err);
        return res.status(500).json({ message: 'Unexpected error'});
    }
}
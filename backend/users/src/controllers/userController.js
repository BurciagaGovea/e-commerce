import retryAsPromised from "retry-as-promised";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch(err) {
        console.error('Err gettting users: ', err);
        res.status(500).json({Message: 'Unexpected error retrieving users'})
    }
};  

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if(!user){
            return res.status(404).json({ message: 'User not found'})
        }

        return res.status(200).json({user})

    } catch(err){
        console.error('Error obtaining user: ', err)
        return res.status(500).json({ message: 'Unexpected error'});
    }
};

export const createUser = async (req, res) => {
    const { username, firstName, middleName, lastName, phone, password } = req.body;

    if (!username || !firstName || !middleName || !lastName || !phone || !password){
        return res.status(400).json({message: 'Provide all info needed'});
    }

    const userExists = await User.findOne( {where: {username}} );
    if(userExists){
        return res.staus(400).json({ message: 'Username already registered'});
    }

    try{
        const newUser = await User.create({
            username,
            firstName,
            middleName,
            lastName,
            phone,
            password
        });

        console.log(newUser);
        return res.status(201).json({ message: 'User created', info: newUser});

    } catch(err){
        console.err('Err creating user: ', err);
        return res.status(500).json({ message: 'Unexpected error: ', err});
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    
    try{
        const userToDelete = await User.findByPk(id);
        if(!userToDelete){
            return res.status(404).json({message: 'User not found'})
        }

        if(!userToDelete.status){
            return res.status(200).json({message: `User ${id} is already inactive`})
        } 
        userToDelete.status = false;
        await userToDelete.save();
        return res.status(200).json({message: `User ${id} is now inactive`})

    } catch(err) {
        console.error('Err deleting user: ', err);
        return res.status(500).json({ message: 'Unexpected error'});
    }
}
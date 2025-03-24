// import Category from "../models/productModel.js";

import { models } from "../models/index.js";

const { Category, Product, Inventory } = models;


export const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        return res.status(200).json({
            categories
        });
    } catch(err) {
        console.err('Err obtaining categories: ', err)
        return res.status(500).json({ message: 'Unexpected error'});
    }
};

export const createCategory = async(req, res) => {
    try{
        const { name, description } = req.body;
        const newCategory = await Category.create({ name, description});
        console.log(newCategory);
        return res.status(200).json({
            message: 'Category created',
            category: newCategory
        })
    } catch(err){
        console.error('Error creating category: ', err);
        return res.status(500).json({message: 'Unexpected error'});
    }
};
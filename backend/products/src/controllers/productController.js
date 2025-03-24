import { models } from "../models/index.js";

const { Category, Product, Inventory } = models;

export const getProducts = async(req, res) => {
    try{
        const products = await Product.findAll();
        return res.status(200).json({products});
    } catch(err){
        console.error(err);
    }
};

export const createProduct = async (req, res) => {
    const { name, description, price, category_id } = req.body;
    try {
        const productExists = await Product.findOne({where: {name}});
        if(productExists){
            return res.status(200).json({
                message: `${name} already exists`
            });
        }
        
        const newProduct = await Product.create({
            name,
            description,
            price,
            category_id
        });
        return res.status(200).json({ 
            message: 'Product created',
            product: newProduct
        });
    } catch (error) {
        console.error('Err crating product: ', error);
        return res.status(500).json({message: 'Unexpected error'});
    }
};
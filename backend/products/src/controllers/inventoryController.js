// import Inventory from "../models/inventoryModel.js";
import { models } from "../models/index.js";

const { Category, Product, Inventory } = models;


export const getInventory = async(req, res) => {
    try{
        const inventory = await Inventory.findAll();
        return res.status(200).json({
            inventory
        });

    } catch(err){
        console.error(err);
        return res.status(500).json({message: 'Unexpected error'});
    }
};

export const getStock = async(req, res) => {
    try {
        const { product_id } = req.params;
        const stock = await Inventory.findOne({where: {product_id}});
        if(!stock){
            return res.status(404).json(
                {message: 'This product has no inventory record'}
            );
        }
        return res.status(200).json({
            stock: stock
        });
    } catch (error) {
        console.error('Error getting stock: ', error);
        return res.status(500).json({
            message: 'Unexpected error'
        });
    }
};

export const editStock = async(req, res) => {
    try {
        const { product_id } = req.params;
        const { stock } = req.body;

        const inventory = await Inventory.findOne({ where: {product_id}});
        if(!inventory){
            return res.status(404).json({
                message: 'This product has no inventory record'
            });
        }
        inventory.stock = stock;
        await inventory.save();

        return res.status(200).json({
            message: 'Stock updated',
            stock: stock
        })
    } catch (error) {
        console.error('Error updating stock: ', error);
        return res.status(500).json({message: 'Unexpected error'});
    }
}

export const createInventory = async(req, res) => {
    const { stock, product_id } = req.body;
    try {
        const recordExists = await Inventory.findOne({where:{product_id}});
        if(recordExists){
            return res.status(200).json({message: 'A record for this product already exists'});
        }
        const newRecord = await Inventory.create({
            stock,
            product_id
        });

        return res.status(200).json({
            message: 'Record created for this product',
            data: newRecord
        });
    } catch (error) {
        console.error('Error creating record: ', error);
        return res.status(500).json({message: 'Unexpected error'});
    }
}

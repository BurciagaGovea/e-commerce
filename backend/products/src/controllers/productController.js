import { models } from "../models/index.js";
//____________Para que jale lo de drive____________
import { uploadImage } from "../../drive.js";
import fs from 'fs';
//________________________________________________

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
    
    //_____________PEDIMOS LA IMAGEN__________________

    const file = req.file

    if (!file){
        return res.status(400).json({message: 'No file uploaded o_o'});
    }

    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png'){
        return res.status(400).json({message: 'Invalid image tipe just PNG and JPEG 0_0'});
    }

    //_____________________________________________

    try {
        const productExists = await Product.findOne({where: {name}});
        if(productExists){
            return res.status(200).json({
                message: `${name} already exists`
            });
        }

        //____________________LA METEMOS 0__0________
        const image_Url = await uploadImage(file);

        fs.unlinkSync(file.path);


        //__________________________________________
        
        const newProduct = await Product.create({
            name,
            description,
            price,
            category_id,
            url: image_Url
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
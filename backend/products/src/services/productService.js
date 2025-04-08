import { models } from "../models/index.js";
import { uploadImage } from "../../drive.js";
import fs from 'fs';

const { Product } = models;

export const productService = {
    getAllProducts: async () => {
        try {
            return await Product.findAll();
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    },

    getProductById: async (id) => {
        try {
            return await Product.findByPk(id);
        } catch (error) {
            console.error("Error fetching product by ID:", error);
            throw error;
        }
    },

    createProduct: async (productData, file) => {
        const { name, description, price, category_id } = productData;

        if (!file) {
            throw new Error("No file uploaded");
        }

        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            throw new Error("Invalid image type");
        }

        try {
            const existing = await Product.findOne({ where: { name } });
            if (existing) {
                return { exists: true };
            }

            const imageUrl = await uploadImage(file);
            fs.unlinkSync(file.path);

            const newProduct = await Product.create({
                name,
                description,
                price,
                category_id,
                url: imageUrl
            });

            return { product: newProduct };
        } catch (err) {
            console.error("Error creating product:", err);
            throw err;
        }
    },

    updateProduct: async (id, productData) => {
        try {
            const product = await Product.findByPk(id);
            if (!product) return null;

            await product.update(productData);
            return product;
        } catch (error) {
            console.error("Error updating product:", error);
            throw error;
        }
    },

    deleteProduct: async (id) => {
        try {
            const product = await Product.findByPk(id);
            if (!product) return null;

            product.status = false;
            await product.save();
            return true;
        } catch (error) {
            console.error("Error deleting product:", error);
            throw error;
        }
    },

    getProductsByCategory: async (category_id) => {
        try {
            return await Product.findAll({ where: { category_id } });
        } catch (error) {
            console.error("Error fetching products by category:", error);
            throw error;
        }
    }
};

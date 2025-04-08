import { productService } from '../services/productService.js';

export const getProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        return res.status(200).json({ products });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Unexpected error' });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Not found' });
        return res.status(200).json({ product });
    } catch (err) {
        return res.status(500).json({ message: 'Unexpected error' });
    }
};

export const createProduct = async (req, res) => {
    const file = req.file;
    const productData = req.body;

    try {
        const result = await productService.createProduct(productData, file);

        if (result.exists) {
            return res.status(200).json({ message: `${productData.name} already exists` });
        }

        return res.status(200).json({
            message: 'Product created',
            product: result.product
        });

    } catch (error) {
        if (error.message === 'No file uploaded') {
            return res.status(400).json({ message: 'No file uploaded o_o' });
        }

        if (error.message === 'Invalid image type') {
            return res.status(400).json({ message: 'Invalid image type. Only PNG and JPEG allowed 0_0' });
        }

        console.error('Error creating product:', error);
        return res.status(500).json({ message: 'Unexpected error' });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await productService.updateProduct(req.params.id, req.body);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        return res.status(200).json({ message: 'Product updated', product });
    } catch (error) {
        return res.status(500).json({ message: 'Unexpected error' });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const success = await productService.deleteProduct(req.params.id);
        if (!success) return res.status(404).json({ message: 'Product not found' });
        return res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
        return res.status(500).json({ message: 'Unexpected error' });
    }
};

export const getProductsByCategory = async (req, res) => {
    try {
        const products = await productService.getProductsByCategory(req.params.category_id);
        return res.status(200).json({ products });
    } catch (err) {
        return res.status(500).json({ message: 'Unexpected error' });
    }
};


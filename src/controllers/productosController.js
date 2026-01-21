import Product from '../models/productos.js';
import __dirname from '../libs/dirname.js';
import path from 'path';
import fs from 'fs';
import User from '../models/users.js';
const uploadRoute = path.resolve(__dirname, '../uploads');

export const create = async(req, res) => {
    try {
        const newProduct = new Product({
            ...req.body,
            user: req.userId,
            image: req.file ? req.file.filename : null
        });
        const savedProduct = await newProduct.save();
        res.status(200).json({message: 'Product created successfully', savedProduct});
    } catch (error) {
        res.status(400).json({message: 'Error creating product', error});
    }
}
export const getUserProducts = async(req, res) => {
    try {
        const productos = await Product.find({user: req.userId});
        res.status(200).json({message: 'All User Products', productos});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user products' });
    }
}
export const getAll = async(req, res) => {
    try {
        const productos = await Product.find();
        res.status(200).json({message: 'All products', productos});
    } catch (error) {
        res.status(400).json({message: 'Error getting products', error});
    }
}

export const getById = async(req, res) => {
    try {
        const producto = await Product.findById(req.params.id);
        res.status(200).json({message: 'Product found', producto})
    } catch (error) {
        res.status(400).json({message: 'Product not found', error});
    }
}

export const update = async(req, res) => {
    try {
        //Verificar si el producto existe
        const findProduct = await Product.findById(req.params.id);
        if(!findProduct) return res.status(400).json({message: 'Product not found'});

        //Verificar si es el owner del producto o si es admin o moderator
        const user = await User.findById(req.userId).populate('role');
        const userRole = user.role.map(role => role.name);

        const isOwner = findProduct.user.toString() == req.userId;
        const isAdminOrMod = userRole.includes('admin') || userRole.includes('moderator');

        if(!isOwner && !isAdminOrMod)
            return res.status(403).json({message: 'Unauthorized to update this product'});

        if(req.file && findProduct.image) {
            const imageRoute = path.join(uploadRoute, findProduct.image);
            if(fs.existsSync(imageRoute)){
                fs.unlinkSync(imageRoute);
            }
        }
        const uploadData = {
            ...req.body,
            image: req.file ? req.file.filename : findProduct.image
        }
        const producto = await Product.findByIdAndUpdate(req.params.id, uploadData, {new: true});
        res.status(200).json({message: 'Updated Product', producto});
    } catch (error) {
        res.status(400).json({message: 'Error updating product', error})
    }
}

export const deleteProduct = async(req, res) => {
    try {
        const findProduct = await Product.findById(req.params.id);
        if(!findProduct) return res.status(400).json({message: 'Product not found'});

        const user = await User.findById(req.userId).populate('role');
        const userRole = user.role.map(role => role.name);
        console.log(userRole)
        const isOwner = findProduct.user.toString() == req.userId;
        const isAdminOrMod = userRole.includes('admin') || userRole.includes('moderator');

        if(!isOwner && !isAdminOrMod)
            return res.status(403).json({message: 'Unauthorized to delete this product'});

        if(findProduct.image) {
            const imageRoute = path.join(uploadRoute, findProduct.image);
            if(fs.existsSync(imageRoute)){
                fs.unlinkSync(imageRoute);
            }
        }

        const producto = await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({message: 'Deleted Product', producto});
    } catch (error) {
        res.status(400).json({message: 'Error deleting product', error});
    }
}
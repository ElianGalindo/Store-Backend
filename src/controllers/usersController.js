import User from '../models/users.js';
import Role from '../models/role.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import __dirname from '../libs/dirname.js';
dotenv.config({path: path.resolve(__dirname, '../../.env')})
const SECRET = process.env.SECRET;

export const registro = async(req, res) => {
    const {username, role} = req.body;
    const findUser = await User.findOne({username});
    if(findUser) return res.status(409).json({message: 'User already exists'});
    
    const newUser = new User(req.body);

    if(role) {
        const findRoles = await Role.find({name: {$in: role}});
        newUser.role = findRoles.map(role => role._id);
    } else {
        const newRoles = await Role.findOne({name: 'user'});
        newUser.role = [newRoles._id]
    }

    const userSaved = await newUser.save();
    const token = jwt.sign({id: userSaved._id}, SECRET, {expiresIn: '2h'})
    res.status(200).json({message: 'User registered successfully', userSaved, token});
}

export const login = async(req, res) => {
    try {
        const {username, password} = req.body;
        const findUser = await User.findOne({username});
        if(!findUser) return res.status(400).json({message: 'User not found'});

        const isMatch = await findUser.comparePassword(password)
        if(!isMatch) return res.status(400).json({message: 'Incorrect password'});
        
        const token = jwt.sign({id: findUser._id}, SECRET, {expiresIn: '2h'});
        res.status(200).json({message: 'Welcome!', findUser, token});
    } catch (error) {
        res.json({message: 'Something went wrong'})
    }
}

// export const addUser = async(req, res) => {
//     try {
//         const newUser = 
//     } catch (error) {
        
//     }
// }
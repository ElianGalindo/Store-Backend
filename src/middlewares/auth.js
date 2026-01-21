import User from '../models/users.js';
import Role from '../models/role.js';
import jwt from 'jsonwebtoken';
import __dirname from '../libs/dirname.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path: path.resolve(__dirname, '../../.env')});
const SECRET = process.env.SECRET;

export const verifyToken = async(req, res, next) => { 
    try {
        const token = req.headers["x-access-token"];
        if(!token) return res.status(403).json({message: "No token provided"});

        const decoded = jwt.verify(token, SECRET);
        req.userId = decoded.id;

        const user = await User.findById(req.userId, {password: 0});
        if(!user) return res.status(404).json({message: 'User not found'});
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

export const isModerator = async(req, res, next) => {
    const roles = await Role.find({_id: {$in: req.user.role}});
    
    const isModerator = roles.some(role => role.name === 'moderator')
    if(isModerator) return next();
    return res.status(403).json({ message: 'Moderator role required' });
}

export const isAdmin = async(req, res, next) => {
    const roles = await Role.find({_id: {$in: req.user.role}});
    const isAdmin = roles.some(role => role.name === 'admin');
    if(isAdmin) return next();

    return res.status(403).json({ message: 'Admin role required' });
};

export const isAdminOrModerator = async (req, res, next) => {
    const roles = await Role.find({ _id: { $in: req.user.role } });

    const hasAccess = roles.some(role =>
        role.name === "admin" || role.name === "moderator"
    );

    if (hasAccess) return next();

    return res.status(403).json({ message: 'Admin or Moderator role required' });
};
import mongoose from "mongoose";
import __dirname from "../libs/dirname.js";
import dotenv from "dotenv";
import path from "path";
dotenv.config({path: path.resolve(__dirname, '../../.env')})

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.uxgc9iq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`, {
            dbName: 'Store'
        });
        console.log('Database connected!')
    } catch (error) {
        console.error('Error connecting database =>', error)
    }
}

export default connectDB;
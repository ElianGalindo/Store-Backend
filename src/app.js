import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db.js';
import __dirname from './libs/dirname.js';
import { createRoles } from './libs/roleInitial.js';
import productRoutes from './routes/productos.routes.js';
import userRoutes from './routes/users.routes.js'
//Configurar dotenv
dotenv.config({path: path.resolve(__dirname, '../.env')})

//Configuraciones basicas
const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
//console.log(path.join(__dirname, '..','uploads'));
//Conectar Base de datos
connectDB();

//Crear Roles
createRoles();

//Configurar rutas
app.use('/productos', productRoutes);
app.use('/user', userRoutes);

//Configurar puerto
const port = process.env.PORT || 3000;
try {
    app.listen(port, () => {
        console.log('Server listening on port ', port);
    });
} catch (error) {
    console.error('Error running server', error);
}
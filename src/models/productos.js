import mongoose from "mongoose";

const productosScehma = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    user: {
        ref: 'Users',
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    image: {
        type: String,
    }
}, {timestamps: true});

export default mongoose.model('Productos', productosScehma, 'productos');
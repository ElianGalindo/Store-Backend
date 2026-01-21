import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
    name: {
        type: String
    }
}, {timestamps: true});

export default mongoose.model('Roles', roleSchema);
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: [{
        ref: 'Roles',
        type: mongoose.Schema.Types.ObjectId
    }]
},{timestamps: true});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password)
}

export default mongoose.model('Users', userSchema);
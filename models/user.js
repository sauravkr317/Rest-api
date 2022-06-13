import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name : {type: String, required: true},
    email: {type: String, require: true},
    password: {type: String, required: true},
    role: {type: String, default: 'customer'},
}, {timestamps: true});

export default mongoose.model('User', userSchema, 'users');
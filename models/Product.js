import mongoose from 'mongoose';
import {DOMAIN_URL} from '../config';
const Schema = mongoose.Schema;
const ProductSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, require: true },
    size: { type: String, required: true },
    image: {
        type: String, required: true, get: (image) => {
            return `${DOMAIN_URL}/${image}`;
        }
    }
}, { timestamps: true, toJSON: {getters: true} });

export default mongoose.model('Product', ProductSchema, 'Products');
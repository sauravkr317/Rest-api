import { User } from "../models"
import CustomerrorHandler from "../services/CustomerrorHandler";

const admin = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.user._id });
        if(user.role === 'admin') {
            next();
        }
        else{
            return next(CustomerrorHandler.unAuthorized());
        }
    } catch (error) {
        return next(CustomerrorHandler.serverError());
    }
}

export default admin;
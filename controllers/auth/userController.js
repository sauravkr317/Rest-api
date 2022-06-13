import { User } from "../../models";
import CustomerrorHandler from "../../services/CustomerrorHandler";


const userController = {
    async me(req, res, next) {
        try {
            const user = await User.findOne({ _id: req.user._id }).select('-password -__v -updatedAt');
            if (!user) {
                return next(CustomerrorHandler.notFound());
            }
            res.json(user)

        } catch (error) {
            return next(error);

        }
    }
};

export default userController;
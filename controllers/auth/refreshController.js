import Joi from 'joi';
import { REFRESH_SECRET } from '../../config';
import { refresh_token, User } from '../../models';
import CustomerrorHandler from '../../services/CustomerrorHandler';
import JwtServices from '../../services/JwtServices';

const refreshController = {
    async resfresh(req, res, next) {
        // validate
        const registerSchema = Joi.object({
            refresh_token: Joi.string().required(),
        })

        const { error } = registerSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        // database
        let refreshtoken
        let userId
        try {
            refreshtoken = await refresh_token.findOne({ token: req.body.refresh_token });
            if (!refreshtoken) {
                return next(CustomerrorHandler.unAuthorized('Invalid refresh token'));
            }

            try {
                const { _id, role } = JwtServices.verify(refreshtoken.token, REFRESH_SECRET);
                userId = _id
            } catch (error) {
                return next(CustomerrorHandler.unAuthorized('Something went wrong'));
            }

            // check user in database
            try {
                const user = await User.findOne({ _id: userId });

                if (!user) {
                    return next(CustomerrorHandler.unAuthorized('No user found!'));
                }

                // generate new tokens
                const access_token = JwtServices.sign({ _id: user._id, role: user.role });
                const Refresh_token = JwtServices.sign({ _id: user._id, role: user.role }, '1y', REFRESH_SECRET);

                await refresh_token.create({ token: Refresh_token });

                res.json({access_token: access_token, refresh_token: Refresh_token});


            } catch (error) {
                return next(CustomerrorHandler.unAuthorized('Something Went Wrong'));
            }

        } catch (error) {
            return next(error);
        }

    }
}

export default refreshController;
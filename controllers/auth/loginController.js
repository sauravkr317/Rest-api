import { refresh_token, User } from '../../models';
import CustomerrorHandler from '../../services/CustomerrorHandler';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import JwtServices from '../../services/JwtServices';
import { REFRESH_SECRET } from '../../config';

const loginController = {
    async login(req, res, next) {
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        });

        const { error } = loginSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return next(CustomerrorHandler.wrongCrendentials());
            }
            // compare the password
            const match = await bcrypt.compare(req.body.password, user.password)
            if (!match) {
                return next(CustomerrorHandler.wrongCrendentials());
            }

            // generate jwt token
            const access_token = JwtServices.sign({ _id: user._id, role: user.role });
            const Refresh_token = JwtServices.sign({ _id: user._id, role: user.role }, '1y', REFRESH_SECRET);

            await refresh_token.create({ token: Refresh_token });

            res.json({ access_token: access_token, refresh_token: Refresh_token });
        }
        catch (err) {
            return next(err);
        }
    },

    async logout(req, res, next) {
        const logoutSchema = Joi.object({
            refresh_token: Joi.string().required(),
        });

        const { error } = logoutSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        try {
            await refresh_token.deleteOne({token: req.body.refresh_token});
        } catch (error) {
            return next(new Error('Something went wrong in the database'));
        }

        res.json({status: 1});
    }
}

export default loginController;
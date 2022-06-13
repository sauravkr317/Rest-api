import Joi from 'joi';
import { refresh_token, User } from '../../models';
import CustomerrorHandler from '../../services/CustomerrorHandler';
import bcrypt from 'bcrypt';
import JwtServices from '../../services/JwtServices';
import { REFRESH_SECRET } from '../../config';

const registerController = {
    async register(req, res, next) {

        const registerSchema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
            repeat_password: Joi.ref('password')
        })

        const { error } = registerSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        // check if user is in the database
        try {
            const exist = await User.exists({ email: req.body.email });
            if (exist) {
                return next(CustomerrorHandler.alreadyExist('This email is already taken.'));
            }
        }
        catch (err) {
            return next(err);
        }

        const { name, email, password } = req.body;

        const hashpassword = await bcrypt.hash(password, 10);
        
        // database
        const user = new User({
            name: name,
            email: email,
            password: hashpassword
        });

        let access_token
        let Refresh_token

        try {
            const result = await user.save();

            // jwt token
            access_token = JwtServices.sign({ _id: result._id, role: result.role });
            Refresh_token = JwtServices.sign({ _id: result._id, role: result.role }, '1y', REFRESH_SECRET);

            await refresh_token.create({token: Refresh_token});

        } catch (err) {
            return next(err);
        }


        res.json({ access_token: access_token, refresh_token: Refresh_token });
    }
}

export default registerController;
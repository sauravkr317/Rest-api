import CustomerrorHandler from "../services/CustomerrorHandler";
import JwtServices from "../services/JwtServices";

const auth = async (req, res, next) => {
    let authHeader = req.headers.authorization;
    if (!authHeader) {
        return next(CustomerrorHandler.unAuthorized());
    }

    const token = authHeader.split(' ')[1];
    try {
        const { _id, role } = JwtServices.verify(token);
        const user = {
            _id,
            role
        }
        req.user = user;
        next();
    } catch (error) {
        return next(CustomerrorHandler.unAuthorized());
    }
}

export default auth;
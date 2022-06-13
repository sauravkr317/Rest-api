import {JWT_SECRET} from '../config';
import Jwt from 'jsonwebtoken';

class JwtServices{
    static sign(payload, expiry = '60s', secret = JWT_SECRET){
        return Jwt.sign(payload, secret, {expiresIn: expiry});
    }
    static verify(payload, secret = JWT_SECRET){
        return Jwt.verify(payload, secret);
    }
}

export default JwtServices;
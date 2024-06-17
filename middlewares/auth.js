import { User } from '../models/userschema.js';
import {catchasyncerror} from './catchasyncerror.js'
import ErrorHandler from './error.js';
import jwt from 'jsonwebtoken'

export const isauthenticated = catchasyncerror(async(req,res,next) => {
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler("user not authenticated" , 400));
    }

    const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decoded.id);
    next();
})
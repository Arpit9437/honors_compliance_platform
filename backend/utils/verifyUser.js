import jwt from 'jsonwebtoken'
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next)=>{
    console.log('verifyToken middleware called');
    const token = req.cookies.access_token;
    console.log('Cookie token:', token ? 'present' : 'missing');
    
    if(!token){
        console.log('No token found');
        return next(errorHandler(401, 'Unauthorized'))
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
        if(err){
            console.log('Token verification failed:', err.message);
            return next(errorHandler(401, 'Unauthorized'))
        }
        console.log('Token verified successfully');
        req.user = user
        next()
    })
}   
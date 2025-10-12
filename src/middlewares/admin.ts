import { NextFunction,Response,Request } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCodes } from "../exceptions/root";

const adminMiddleware =  (req:Request,res:Response,next:NextFunction) => {
    const user = req.user;
    if (!user) {
        return next(new UnauthorizedException("Unauthorized", ErrorCodes.UNAUTHORIZED_USER));
    }
    if (user.role === "ADMIN") {
       return  next()
    }

    return next(new UnauthorizedException("Unauthorized",ErrorCodes.UNAUTHORIZED_USER))
    
}

export default adminMiddleware;
import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCodes } from "../exceptions/root";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";

export const authMiddleware = async(req:Request,res:Response,next:NextFunction) => {
    const token = req.headers.authorization!;

    if(!token){
        next(new UnauthorizedException("Unauthorized",ErrorCodes.UNAUTHORIZED_USER))
    }
    try{
         const payload:any = jwt.verify(token,JWT_SECRET)
         const user = await prismaClient.user.findFirst({where:{id:payload.userId}})

         if(!user){
             return next(new UnauthorizedException("Unauthorized",ErrorCodes.UNAUTHORIZED_USER))
         }

         req.user = user;
         next()
    }
    catch(error){
        next(new UnauthorizedException("Unauthorized",ErrorCodes.UNAUTHORIZED_USER))
    }

    
   

}
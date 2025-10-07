import { NextFunction, Request,Response } from "express"
import { prismaClient } from "../index";
import {compareSync, hashSync} from "bcrypt";
import * as jwt from "jsonwebtoken"
import { JWT_SECRET } from "../secrets";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCodes } from "../exceptions/root";
import { signupSchema } from "../schema/users";
import { UnprocessableEntity } from "../exceptions/validation";

export const signup = async (req:Request,res:Response,next:NextFunction) => {
    signupSchema.parse(req.body)
    const {email,password,name} = req.body;

    let user = await prismaClient.user.findFirst({where:{email}})

    if(user){
        console.log("hello")
        next(new BadRequestException("User already Exist",ErrorCodes.USER_ALREADY_EXISTS))
    }
    
    user = await prismaClient.user.create({
        data:{
            name,
            email,
            password:hashSync(password,10)
        }
    })
    res.json({user})
   

}

export const login = async (req:Request,res:Response) => {
    const {email,password} = req.body;

    let user = await prismaClient.user.findFirst({where:{email}})

    if(!user){
        throw Error ("User does not  Exist..")
    }
    if(!compareSync(password,user.password)){
        throw Error ("Incorrect Password !!")
    }

    const token = jwt.sign({
        userId:user.id,
    },JWT_SECRET)
    
    res.json({user,token})
}
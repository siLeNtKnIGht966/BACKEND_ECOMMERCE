import { NextFunction, Request,Response } from "express"
import { prismaClient } from "../index";
import {compareSync, hashSync} from "bcrypt";
import * as jwt from "jsonwebtoken"
import { JWT_SECRET } from "../secrets";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCodes } from "../exceptions/root";
import { signupSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/not-found";


// Sign Up a new User.
export const signup = async (req:Request,res:Response,next:NextFunction) => {
    signupSchema.parse(req.body)
    const {email,password,name} = req.body;

    let user = await prismaClient.user.findFirst({where:{email}})

    if(user){
        throw new BadRequestException("User already Exist",ErrorCodes.USER_ALREADY_EXISTS,null)
    }
    
    user = await prismaClient.user.create({
        data:{
            name,
            email,
            password:hashSync(password,10)
        }
    })
    return res.json({user})
   

}

// Login the User..
export const login = async (req:Request,res:Response) => {
    const {email,password} = req.body;

    let user = await prismaClient.user.findFirst({where:{email}})

    if(!user){
        throw new NotFoundException("User does not  Exist..",ErrorCodes.USER_NOT_FOUND)
    }
    if(!compareSync(password,user.password)){
        throw new NotFoundException("Incorrect Password..",ErrorCodes.INCORRECT_PASSWORD)
    }

    const token = jwt.sign({
        userId:user.id,
    },JWT_SECRET)
    
    res.json({user,token})
}


//
export const me = async (req:Request,res:Response) => {
    res.json(req.user)
}
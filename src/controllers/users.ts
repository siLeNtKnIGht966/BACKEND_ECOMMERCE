import { Request,Response } from "express";
import { addressSchema } from "../schema/address";
import { prismaClient } from "../index";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";
import { User } from "@prisma/client";

//
export const addAddress = async(req:Request,res:Response) => {
    addressSchema.parse(req.body)
    const id = Number(req.body.userId)
    let user:User;
    try{
        user = await prismaClient.user.findFirstOrThrow({
            where:{
                id
            }
        })

    }catch(errors){
        throw new NotFoundException("User not Found",ErrorCodes.USER_NOT_FOUND,errors)
    }
    const addAddress = await prismaClient.address.create({
        data:{
            ...req.body,
            userId:user.id
        }
    })
    return res.json(addAddress)

}

export const deleteAddress = (req:Request,res:Response) => {
    
}

export const listAddress = (req:Request,res:Response) => {
    
}
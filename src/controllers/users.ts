import { Request,Response } from "express";
import { addressSchema } from "../schema/address";
import { prismaClient } from "../index";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";
import { User } from "@prisma/client";
import { updateSchema } from "../schema/users";
import { Address } from "../generated/prisma";
import { BadRequestException } from "../exceptions/bad-request";
import { error } from "console";
import { InternalException } from "../exceptions/internal-exception";

//Add new address....
export const addAddress = async(req:Request,res:Response) => {
      const valiadateData = addressSchema.parse(req.body)
      let user:User
      try{
        user = await prismaClient.user.findFirstOrThrow({
            where:{
                id:valiadateData.userId
            }
        })
      }
      catch(err){
         throw new NotFoundException("User not found",ErrorCodes.USER_NOT_FOUND,err)
      }

      const addAddress = await prismaClient.address.create({
        data:valiadateData
      })
      res.json({addAddress})

}
// Delete a address of user...

export const deleteAddress = async(req:Request,res:Response) => {
    try{
        const id = Number(req.params.id)
        await prismaClient.address.delete({
        where:{
            id
        }
    
    })
        return res.json({success:true})

    }catch(error){
         throw(new NotFoundException("Address Not Found",ErrorCodes.ADDRESS_NOT_FOUND,error))
    }
    
    
}

//list addresses of the user.
export const listAddress = async(req:Request,res:Response) => {
    const userId = req.user.id;
    try{
        const address = await prismaClient.address.findMany({
        where:{
            userId
        }
         
    })
    return res.json({
        address
    })
    }
    catch(err:any){
       throw new InternalException("Internal Error",ErrorCodes.INTERNAL_EXCEPTION,err)
    }
    
}

//update the shipping nd billing address.
export const updateUser = async(req:Request,res:Response) => {
    const validatedData = updateSchema.parse(req.body);
    let shippingAddress:Address;
    let BillingAddress:Address;
    
    // validate the shipping address

    if(validatedData.defaultShippingAddress){
        try{
        shippingAddress = await prismaClient.address.findFirstOrThrow({
            where:{
                id:validatedData.defaultShippingAddress!
            }
        })
        
    }catch(error){
        throw new NotFoundException("Address not found",ErrorCodes.ADDRESS_NOT_FOUND,error)
    }
    
    if(shippingAddress.id != req.user.id){
            throw new BadRequestException("Address does not belong to the user.",ErrorCodes.ADDRESS_DOES_NOT_BELONG,null)
        }
    // validate the billing address.

    }
    if(validatedData.defaultBillingAddress){
        try{
        BillingAddress = await prismaClient.address.findFirstOrThrow({
            where:{
                id:validatedData.defaultBillingAddress!
            }
        })
          
    }catch(error){
        throw new NotFoundException("Address not found",ErrorCodes.ADDRESS_NOT_FOUND,error)
    }
    if(BillingAddress.id != req.user.id){
            throw new BadRequestException("Address does not belong to the user.",ErrorCodes.ADDRESS_DOES_NOT_BELONG,null)
        }

    }

    const updateUser = await prismaClient.user.update({
        where:{
            id:req.user.id
        },
        data:validatedData
    })
    return res.json({updateUser})


}

import {Request,Response} from "express"
import { prismaClient } from "../index";
import { cartSchema, qualitySchema } from "../schema/cart";
import { Product } from "../generated/prisma";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";

export const addItemToCart = async(req:Request,res:Response) => {
    const {productId,quantity} = cartSchema.parse(req.body)
    let product:Product
    // check if the product exist.
    try{
        product = await prismaClient.product.findFirstOrThrow({
            where:{
                id:productId
            }
        })
    }
    catch(err){
         throw new NotFoundException("Product Not Found..",ErrorCodes.PRODUCT_NOT_FOUND,err)
    }
    // if the product exist in product table then find it in cart if it exist.
    const existingCartItem = await prismaClient.cartItem.findFirst({
        where: {
            productId:productId,
            userId: req.user.id
        }
    });
    //if it exist update the that product value as per the user need.
    
    if (existingCartItem){
        const updatedItem = await prismaClient.cartItem.update({
            where: {
                id: existingCartItem.id
            },
            data: {
                quantity: existingCartItem.quantity + quantity 
            }
        });
        
        return res.json({
            message: "Cart item quantity updated",
            data: updatedItem
        });
    }
    // if not then create a new cart item.
    const data = await prismaClient.cartItem.create({
        data:{
            productId,
            quantity,
            userId:req.user.id
        }
    })
    return res.json({data})

}

// delete item from user list.

export const deletetemFromCart = async(req:Request,res:Response) => {
    try{
        const id = Number(req.params.id);
        console.log(req.user.id)
        await prismaClient.cartItem.findFirstOrThrow({
            where:{
                id:id,
                userId:req.user.id
            }
        })
        const deleteItem = await prismaClient.cartItem.delete({
            where:{
                id
            }    
           })
           return res.json({
            message:"Item Deleted Successfully.",
            data:deleteItem
        })
    }catch(Err:any){
        throw(new NotFoundException("product not found or you don't have permission to delete it",ErrorCodes.PRODUCT_NOT_FOUND,Err.meta))
    }
    
}

// update the quantity of the cart items.
export const changeQuantity = async (req:Request,res:Response) => {
    const validateData = qualitySchema.parse(req.body)
    const id = Number(req.params.id)

    const updateCart = await prismaClient.cartItem.update({
        where:{
            id
        },
        data:{
            quantity:validateData.quantity
        }
    })
    return res.json({
        message:"updated successfully",
        data:updateCart
    })  
}

export const getCart = async (req:Request,res:Response) => {
    const cart = await prismaClient.cartItem.findMany({
        where:{
            userId:req.user.id
        },
        include:{
            product:true
        }
    })
    return res.json(cart)
    
}
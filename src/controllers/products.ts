import { Request,Response } from "express";
import { prismaClient } from "../index";
import { productSchema, productUpdateSchema } from "../schema/products";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";
import { number } from "zod";

// add a product...
export const createProduct = async(req:Request,res:Response) => {
    const value = productSchema.parse(req.body)
    const product = await prismaClient.product.create({
        data:{
           ...value,
        }
    })
    return res.json(product)
    
}

// Update a product.
export const updateProduct =  async(req:Request,res:Response) => {
    try{
        const product = productUpdateSchema.parse(req.body)
        const id = Number(req.params.id);
        const updateProduct = await prismaClient.product.update({
            where:{
                id
            },
            data:product
            
        })
       return res.json({
            message:"Item Updated Successfully.",
            data:updateProduct
        })

    }catch(Err){
        throw(new NotFoundException("product not found",ErrorCodes.PRODUCT_NOT_FOUND))
    }

}

// delete a product.
export const deleteProduct =  async(req:Request,res:Response) => {
     try{
        const id = Number(req.params.id);
        const deleteProduct = await prismaClient.product.delete({
            where:{
                id
            }    
        })
        return res.json({
            message:"Item Updated Successfully.",
            data:deleteProduct
        })

    }catch(Err){
        throw(new NotFoundException("product not found",ErrorCodes.PRODUCT_NOT_FOUND))
    }

    
}

// list the products.
export const listProduct =  async(req:Request,res:Response) => {
    const count = await prismaClient.product.count()
    const products = await  prismaClient.product.findMany({
        skip: Number(req.query.skip) || 0,
        take:5
    })
    res.json({
        count,data:products
    })
    
}

//Get a product details  by Id.
export const getProductById =  async(req:Request,res:Response) => {

     try{
        const id = Number(req.params.id);
        const Product = await prismaClient.product.findFirstOrThrow({
            where:{
                id
            }
            
        })
        return res.json(Product)

    }catch(Err){
        throw(new NotFoundException("product not found",ErrorCodes.PRODUCT_NOT_FOUND))
    }
    
}


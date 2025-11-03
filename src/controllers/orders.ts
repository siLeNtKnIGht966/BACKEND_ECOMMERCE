import {Request,Response} from "express"
import { prismaClient } from ".."


export const createOrder = async (req:Request,res:Response) => {
    const cartItems = await prismaClient.$transaction(async (tx) => {
        const cartItems = await tx.cartItem.findMany({
            where:{
                userId:req.user.id
            },
            include:{
                product:true
            }
        })
        if (cartItems.length == 0){
            return res.json({
                message:"Cart is empty."
            })
        }
        const price = cartItems.reduce((prev,current) => {
            return prev +(current.quantity * Number(current.product.price))
        },0)

        const address = await tx.address.findFirst({
            where:{
                id:req.user.defaultShippingAddress
            }
        })
        const order = await tx.order.create({
            data:{
                userId:req.user.id,
                netAmount:price,
                address:address!.formattedAddress,
                products:{
                    create:cartItems.map((cart) => {
                        return{
                            productId:cart.productId,
                            quantity:cart.quantity
                        }
                    })
                }

            }
        })
        const orderEvent = await tx.orderEvents.create({
            data:{
                orderId:order.id
            }

        })
        await tx.cartItem.deleteMany({
            where:{
                userId:req.user.id
            }

        })
        return res.json({
            order
        })
    })

}

export const listOrders = async (req:Request,res:Response) => {
    const orders  = await prismaClient.order.findMany({
        where:{
          userId:req.user.id
        }
    })
    res.json(orders)
    
}

export const cancelOrder = (req:Request,res:Response) => {
    
}

export const getOrderById = (req:Request,res:Response) => {
    
}
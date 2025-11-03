import {z} from "zod"

export const cartSchema = z.object({
       quantity:z.coerce.number().positive(),
       productId:z.coerce.number().positive()
})

export const qualitySchema = z.object({
       quantity:z.number()
})
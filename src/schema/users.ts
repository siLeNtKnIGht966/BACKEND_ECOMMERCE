import {z} from "zod"

export const signupSchema = z.object({
    name:z.string(),
    email:z.string().email(),
    password:z.string().min(6)

})

export const updateSchema = z.object({
    name:z.string().optional(),
    defaultShippingAddress:z.number().optional(),
    defaultBillingAddress:z.number().optional(),

})
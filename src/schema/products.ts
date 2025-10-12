import {z} from "zod"

export const productSchema = z.object({
    name:z.string(),
    descriptions:z.string(),
    price: z.string().refine(
  (val) => /^\d+\.\d{2}$/.test(val)).transform((val) => Number(val)),
    tags:z.array(z.string()).transform((tags) => tags.join(",")), 

})

export const productUpdateSchema = productSchema.partial();

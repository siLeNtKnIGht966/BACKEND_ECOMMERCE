import zod from "zod";

export const addressSchema = zod.object({
    lineOne: zod.string(),
    lineTwo: zod.string().nullable(),
    city:zod.string(),
    pincode: zod.string().length(6),
    userId:zod.number()

})
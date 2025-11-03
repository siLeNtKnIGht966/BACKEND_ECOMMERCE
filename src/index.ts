import express ,{Express,Request,Response}from "express"
import { PORT } from "./secrets";
import rootRouter from "./routes";
import { PrismaClient } from "../src/generated/prisma"
import { errorMiddleware } from "./middlewares/errors";
import { signupSchema } from "./schema/users";

const app:Express = express();

app.use(express.json())



app.use("/api",rootRouter)
app.use(errorMiddleware)

export const prismaClient = new PrismaClient({
    log:["query"] 
}).$extends({
    result:{
        address:{
            formattedAddress:{
                needs:{
                    lineOne:true,
                    lineTwo:true,
                    city:true,
                    pincode:true
                },
                compute:(addr) => {
                    return `${addr.lineOne},${addr.lineTwo},${addr.city},${addr.pincode}`
                }
            }
        }
    }
})




app.listen(PORT, () => {
    console.log(`app is listening...`)
})
import { User } from "../src/generated/prisma";
import express from "express"
declare module 'express' {
    export interface Request {
        user?:User
    }
}
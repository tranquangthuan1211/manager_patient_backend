
import "dotenv/config";
import { Request, Response, NextFunction } from "express";
import Database from "../configs/db";
import {signToken, verifyToken} from "../securities/jwt";
import { error } from "console";


export const authMiddleware = async(req:Request, res:Response, next: NextFunction) => {
    try {
        if(req.headers["authorization"] === undefined){
            throw new Error("Token is required");
        }
        const token = req.headers["authorization"];
        const tokenData = await verifyToken({tokens: token});
        const email = tokenData.email;
        const user = await Database.users.findOne({ email: email});
        if(!user){
            throw new Error("User not found");
        }
        next();
    } catch (error) {
        return res.status(400).json({ 
            error: 1,
            message: 'Invalid token',
            data: null
        });
    }
};
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import { IDecodeToken, IReqAuth } from '../config/interface';
import Users from '../models/userModel';

const auth = async (req: IReqAuth, res: Response, next: NextFunction) => {
    try {
        const token = req.header("Authorization")
        if(!token) return res.status(400).json({msg: "Invalid Authorization"})
        
        
        const decode = <IDecodeToken>jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`)
 
        if(!decode) return res.status(400).json({msg: "Invalid Authorization"})
        const user = await Users.findOne({_id: decode.id}).select("-password")
        
        if(!user) return res.status(400).json({msg: "User does not exist"})
        req.user = user
        
        next()
        
    } catch (error: any) {
        return res.status(500).json({msg: error.message})
    }
}

export default auth
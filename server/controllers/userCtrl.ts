import { NextFunction, Request, Response } from "express";
import { IReqAuth } from "../config/interface";
import Users from '../models/userModel'

const userCtrl = {
    updateUser: async (req: IReqAuth, res: Response, next: NextFunction) => {
        if(!req.user) return res.status(400).json({msg: "Invalid Authorization"})
        try {
            const {avatar, name} = req.body

            const user = await Users.findByIdAndUpdate({_id: req.user._id}, {avatar, name})
            res.json({msg: "Updated success", user})
        } catch (error: any) {
            return res.status(500).json({msg: error.message})
        }
    }
}

export default userCtrl
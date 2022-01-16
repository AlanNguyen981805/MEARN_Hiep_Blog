import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from "express";
import { IReqAuth } from "../config/interface";
import Users from '../models/userModel'

const userCtrl = {
    updateUser: async (req: IReqAuth, res: Response, next: NextFunction) => {
        if(!req.user) return res.status(400).json({msg: "Invalid Authorization"})
        if(req.user.type !== 'register')
            return res.status(400).json({msg: 'Khong the su dung chuc nang nay'})
        try {
            const {avatar, name} = req.body

            const user = await Users.findByIdAndUpdate({_id: req.user._id}, {avatar, name})
            res.json({msg: "Updated success", user})
        } catch (error: any) {
            return res.status(500).json({msg: error.message})
        }
    },
    resetPassword: async (req: IReqAuth, res: Response, next: NextFunction) => {
        if(!req.user) return res.status(400).json({msg: "Invalid Authorization"})
        try {
            const {password} = req.body
            const passwordHash = await bcrypt.hash(password, 12)

            const user = await Users.findByIdAndUpdate({_id: req.user._id}, {
                password: passwordHash
            })
            res.json({msg: "Reset password success", user})
        } catch (error: any) {
            return res.status(500).json({msg: error.message})
        }
    },
    getUser: async (req: IReqAuth, res: Response, next: NextFunction) => {
        try {
            const user = await Users.findById(req.params.id).select('-password')
            res.json(user)
        } catch (error: any) {
            return res.status(500).json({msg: error.message})
        }
    }

}

export default userCtrl
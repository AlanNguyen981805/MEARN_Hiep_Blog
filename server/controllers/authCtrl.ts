import jwt from 'jsonwebtoken';
import { generateActiveToken, generateAccessToken, generateRefeshToken } from './../config/generateToken';
import { Request, Response } from "express";
import Users from "../models/userModel";
import bcrypt from "bcrypt"
import sendEmail from '../config/sendMail';
import { validateEmail, validatePhone } from '../middleware/valid';
import { sendSms } from '../config/sendSMS';
import { IDecodeToken, IUser } from '../config/interface';

const CLIENT_URL = `${process.env.BASE_URL}`

const authCtrl = {
    register: async(req: Request, res: Response) => {
        try {
            const { name, account, password } = req.body;

            const user = await Users.findOne({account})
            if(user) return res.status(400).json({msg: 'Email hoặc số điện thoại đã tồn tại'})
            const passwordHash = await bcrypt.hash(password, 12)

            const newUser = { name, account, password: passwordHash }

            const active_token = generateActiveToken({newUser})
            const url = `${CLIENT_URL}/active/${active_token}`

            if(validateEmail(account)) {
                sendEmail(account, url, 'Verify your email address')
                return res.json({msg: "Success! Please check your email"})
            } else if(validatePhone(account)) {
                sendSms(account, url, "Veryfi phone number")
                return res.json({msg: "Success! please check your phone "})
            }

            res.json({
                status: "OK", 
                msg: "Dang ky thanh cong", 
                data: newUser,
                active_token
            })
             
        } catch (err: any) {
            console.log(err)
            return res.status(500).json({msg: err.message})
        }
    },

    activeAccount: async(req: Request, res: Response) => {
        try {
            const { active_token } = req.body;
            console.log(active_token);
            
            const decoded = <IDecodeToken>jwt.verify(active_token, `${process.env.ACTIVE_TOKEN_SECRET}`)
            const {newUser} = decoded
            if(!newUser) return res.status(400).json({ msg: "Invalid authentication" })
            const user = await Users.findOne({account: newUser.account})   

            if(user) return res.status(400).json({msg: "Account already exist"}) 
            const new_user = new Users(newUser)

            await new_user.save()

            res.json({msg: "Tài khoản đã được kích hoạt"})

        } catch (err: any) {
            console.log('errrr', err);
            
            return res.status(500).json({msg: err.message, status: 500})
        }
    },

    login: async(req: Request, res: Response) => {
        try {
            const { account, password } = req.body;
            const user = await Users.findOne({account})
            if(!user) return res.status(400).json({msg: 'Account khong ton tai'})

            // if login success
            loginUser(user, password, res)
             console.log(req.body);
             res.json({msg: 'Login success'})
             
             
        } catch (err: any) {
            console.log(err)
            return res.status(500).json({msg: err.message})
        }
    },

    refreshToken: async(req: Request, res: Response) => {
        try {
            const rf_token = req.cookies.refresh_token
            if(!rf_token) return res.status(400).json({msg: 'Vui log dang nhap'})
            const decoded = <IDecodeToken>jwt.verify(rf_token, `${process.env.REFESH_TOKEN_SECRET}`) 
            if(!decoded.id) return res.status(400).json({msg: ' Vui long dang nhap'})
            
            const user = await Users.findById(decoded.id).select('-password')
            
            if(!user) return res.status(400).json({msg: 'Tai khoan khong ton tai'})
            const accessToken = generateAccessToken({id: user._id  }) 

            res.json({accessToken, user})

            
        } catch (err: any) {
            console.log(err)
            return res.status(500).json({msg: err.message})
        }
    },
    logout: async(req: Request, res: Response) => {
        try {
            res.clearCookie('refresh_token',{ path: 'api/refresh_token'})
            return res.json({msg: `Đã đăng xuất`})
        } catch (err: any) {
            console.log(err)
            return res.status(500).json({msg: err.message})
        }
    },
}

const loginUser = (user: IUser, password: string, res: Response) => {
    const isMatch = bcrypt.compare(password, user.password)
    if(!isMatch) return res.status(400).json({msg: "Mật khẩu không đúng"})

    const access_token = generateAccessToken({id: user._id})
    const refresh_token = generateRefeshToken({id: user._id})

    res.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        path: 'api/refresh_token',
        maxAge: 30*24*60*60*1000 //30days
    })

    res.json({
        access_token,
        user
    })

}

export default authCtrl
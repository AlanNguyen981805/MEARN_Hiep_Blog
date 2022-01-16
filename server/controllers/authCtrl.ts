import jwt from 'jsonwebtoken';
import { generateActiveToken, generateAccessToken, generateRefeshToken } from './../config/generateToken';
import { Request, Response } from "express";
import Users from "../models/userModel";
import bcrypt from "bcrypt"
import sendEmail from '../config/sendMail';
import { validateEmail, validatePhone } from '../middleware/valid';
import { sendSms } from '../config/sendSMS';
import { IDecodeToken, IGgPayload, IUser, IUserParams } from '../config/interface';
import { OAuth2Client } from 'google-auth-library';
import fetch from "node-fetch"

const CLIENT_URL = `${process.env.BASE_URL}`
const client = new OAuth2Client(`${process.env.MAIL_CLIENT_ID}`)

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

            res.json({access_token: accessToken, user})

            
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

    googleLogin: async(req: Request, res: Response) => {
        try {
            const {id_token} = req.body
            const ticket = await client.verifyIdToken({
                idToken: id_token,
                audience: process.env.MAIL_CLIENT_ID
            })
            const {email, email_verified, name,picture } = <IGgPayload>ticket.getPayload();
            if(!email_verified) return res.status(500).json({msg: "Xac thuc google that bai"})
            const password = email + 'your google secret password'
            const passwordHash = await bcrypt.hash(password, 12)

            const user = await Users.findOne({account: email})
            if(user) {
                loginUser(user, password, res)
            } else {
                const user = {
                    name,
                    account: email,
                    password: passwordHash,
                    avatar: picture,
                    type: 'google'
                }
                registerUser(user, res)
            }
            
        } catch (err: any) {
            console.log(err)
            return res.status(500).json({msg: err.message})
        }
    },

    facebookLogin: async(req: Request, res: Response) => {
        try {
            const {accessToken, userID} = req.body
            const URL = `https://graph.facebook.com/v3.0/${userID}/?fields=id,name,email,picture&access_token=${accessToken}            `
            
            const data = await fetch(URL)
            .then((res: any) => res.json()
            .then((res: any) => {
                return res
            }))
            const {id, name, email, picture} = data;

            const password = email + 'your facebook secrect password'
            const passwordHash = await bcrypt.hash(password, 12)

            const user = await Users.findOne({account: email})
            if(user) {
                loginUser(user, password, res)
            } else {
                const user = {
                    name, 
                    account: email, 
                    password: passwordHash, 
                    avatar: picture.data.url,
                    type: 'facebook'
                  }
                  registerUser(user, res)
            }
            
        } catch (err: any) {
            console.log(err)
            return res.status(500).json({msg: err.message})
        }
    },
}

const loginUser = async (user: IUser, password: string, res: Response) => {
    
    const isMatch = await bcrypt.compare(password, user.password)
    console.log({isMatch});
    
    if(!isMatch) return res.status(400).json({msg: "Mật khẩu không đúng"})

    const access_token = generateAccessToken({id: user._id})
    const refresh_token = generateRefeshToken({id: user._id})

    res.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        path: 'api/refresh_token',
        maxAge: 30*24*60*60*1000 //30days
    })

    res.json({
        msg: 'Login Success!',
        access_token,
        user: { ...user._doc, password: '' }
    })
}

const registerUser = (user: IUserParams, res: Response) => {
    const newUser = new Users(user)
    newUser.save()

    const access_token = generateAccessToken({id: newUser._id})
    const refresh_token = generateRefeshToken({id: newUser._id})

    res.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        path: 'api/refresh_token',
        maxAge: 30*24*60*60*1000 //30days
    })

    res.json({
        access_token,
        user: {...newUser._doc, password: ''}
    })
}

export default authCtrl
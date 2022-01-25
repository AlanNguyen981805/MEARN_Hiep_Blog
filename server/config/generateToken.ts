import { Response } from "express"
import jwt from "jsonwebtoken"

const { 
    ACTIVE_TOKEN_SECRET,
    ACCESS_TOKEN_SECRET,
    REFESH_TOKEN_SECRET
} = process.env

export const generateActiveToken = (payload: object) => {
    return jwt.sign(payload, `${ACTIVE_TOKEN_SECRET}`, {expiresIn: "5m"})
}

export const generateAccessToken = (payload: object) => {
    return jwt.sign(payload, `${ACCESS_TOKEN_SECRET}`, {expiresIn: "15s"})
}

export const generateRefeshToken = (payload: object, res: Response) => {
    const refresh_token = jwt.sign(payload, `${REFESH_TOKEN_SECRET}`, {expiresIn: "30d"})
    res.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        path: 'api/refresh_token',
        maxAge: 30*24*60*60*1000 //30days
    })

    return refresh_token
}
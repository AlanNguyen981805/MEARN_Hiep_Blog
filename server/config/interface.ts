import { Request } from "express";
import { Document } from "mongoose";
 export interface IUser extends Document{
    name: string,
    account: string,
    password: string,
    avatar: string,
    rf_token?: string,
    role: string,
    type: string,
    _doc: object 
}

export interface IGgPayload {
    email: string, 
    email_verified: boolean, 
    name: string,
    picture: string
}
export interface INewUser{
    name: string,
    account: string,
    password: string
}

export interface IDecodeToken{
    id?: string, 
    newUser?: INewUser,
    iat: number,
    exp: number
}

export interface IUserParams {
    name: string,
    account: string,
    password: string,
    avatar?: string,
    type: string
}

export interface IReqAuth extends Request {
    user?: IUser
}

export interface IComment extends Document {
    user: string,
    blog_id: string,
    blog_user_id: string,
    content: string,
    replyCM: string[],
    reply_user: string,
    comment_root: string,
    doc: object
}
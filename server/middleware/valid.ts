import { NextFunction, Request, Response } from "express";

export const validateRegister = async (req: Request, res: Response, next: NextFunction) => {
    const {name, account, password} = req.body

    if(!name) {
        return res.status(400).json({msg: "Bạn chưa nhập tên"})
    } else if (name.length > 20) {
        return res.status(400).json({msg: "Tên không được lớn hơn 20 ký tự"})
    }

    if(!account) {
        return res.status(400).json({msg: "Vui lòng nhập tên hoặc số điện thoại "})
    } else if (!validatePhone(account) && !validateEmail(account)) {
        return res.status(400).json({msg: "Email hoặc số điện thoại không hợp lệ"})
    }

    if(password.length <6) {
        return res.status(400).json({msg: "Mật khẩu không được ít hơn 6 ký tự"})
    }

    next()
}

export function validatePhone(phone: string) {
    return phone
}

export function validateEmail(email: string){
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
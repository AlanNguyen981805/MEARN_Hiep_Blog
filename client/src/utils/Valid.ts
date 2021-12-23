import { IUserRegister } from "./TypeScript";

export const validRegister = (data: IUserRegister) => {
    const {name, password, account, cf_password } = data

    const errors: string[] = [];

    if(!name) {
        errors.push("Bạn chưa nhập tên")
    } else if (name.length > 20) {
        errors.push("Tên không được lớn hơn 20 ký tự")
    }

    if(!account) {
        errors.push("Vui lòng nhập tên hoặc số điện thoại ")
    } else if (!validatePhone(account) && !validateEmail(account)) {
        errors.push("Email hoặc số điện thoại không hợp lệ")
    }

    if(password.length <6) {
        errors.push("Mật khẩu không được ít hơn 6 ký tự")
    } else if (password !== cf_password) {
        errors.push("Mật khẩu did not match")
    }

    return {
        errMSG: errors,
        errLengh: errors.length
    }
}


export function validatePhone(phone: string) {
    return phone
}

export function validateEmail(email: string){
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

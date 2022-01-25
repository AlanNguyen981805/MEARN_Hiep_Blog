import { IBlog, IUserRegister } from "./TypeScript";

export const validRegister = (data: IUserRegister) => {
    const { name, password, account, cf_password } = data

    const errors: string[] = [];

    if (!name) {
        errors.push("Bạn chưa nhập tên")
    } else if (name.length > 20) {
        errors.push("Tên không được lớn hơn 20 ký tự")
    }

    if (!account) {
        errors.push("Vui lòng nhập tên hoặc số điện thoại ")
    } else if (!validatePhone(account) && !validateEmail(account)) {
        errors.push("Email hoặc số điện thoại không hợp lệ")
    }

    if (password.length < 6) {
        errors.push("Mật khẩu không được ít hơn 6 ký tự")
    } else if (password !== cf_password) {
        errors.push("Mật khẩu did not match")
    }

    const msg = checkPassword(password, cf_password)
    if (msg) errors.push(msg)

    return {
        errMSG: errors,
        errLengh: errors.length
    }
}

export const checkPassword = (password: string, cf_password: string) => {
    if (password.length < 6) {
        return ("Password phai lon hon 6 ky tu")
    } else if (password !== cf_password) {
        return ("Confirm password did not match")
    }
}

export function validatePhone(phone: string) {
    return phone
}

export function validateEmail(email: string) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Valid Blog
export const validCreateBlog = ({
    title, content, description, thumbnail, category
}: IBlog) => {
    const err: string[] = []

    if(title.trim().length < 10) {
        err.push("Title phai lon hon 10 ky tu")
    } else if (title.trim().length > 50) {
        err.push('Title qua dai')
    }

    if(content.trim().length < 2000) {
        err.push('Noi dung phai nho hon 2000 ky tu')
    }

    if(description.trim().length < 50) {
        err.push('Description has at least 50 characters')
    } else if (description.trim().length > 200) {
        err.push('Description is up to 200 characters long')
    }

    if(!thumbnail) {
        err.push('Thumnail cannot left blank')
    }

    if(!category) {
        err.push('Category cannot left blank')
    }

    return {
        errMsg: err,
        errLength: err.length
    }
}

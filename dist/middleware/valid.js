"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = exports.validatePhone = exports.validateRegister = void 0;
const validateRegister = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, account, password } = req.body;
    if (!name) {
        return res.status(400).json({ msg: "Bạn chưa nhập tên" });
    }
    else if (name.length > 20) {
        return res.status(400).json({ msg: "Tên không được lớn hơn 20 ký tự" });
    }
    if (!account) {
        return res.status(400).json({ msg: "Vui lòng nhập tên hoặc số điện thoại " });
    }
    else if (!validatePhone(account) && !validateEmail(account)) {
        return res.status(400).json({ msg: "Email hoặc số điện thoại không hợp lệ" });
    }
    if (password.length < 6) {
        return res.status(400).json({ msg: "Mật khẩu không được ít hơn 6 ký tự" });
    }
    next();
});
exports.validateRegister = validateRegister;
function validatePhone(phone) {
    return phone;
}
exports.validatePhone = validatePhone;
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
exports.validateEmail = validateEmail;

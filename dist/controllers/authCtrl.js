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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken_1 = require("./../config/generateToken");
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const sendMail_1 = __importDefault(require("../config/sendMail"));
const valid_1 = require("../middleware/valid");
const sendSMS_1 = require("../config/sendSMS");
const google_auth_library_1 = require("google-auth-library");
const node_fetch_1 = __importDefault(require("node-fetch"));
const CLIENT_URL = `${process.env.BASE_URL}`;
const client = new google_auth_library_1.OAuth2Client(`${process.env.MAIL_CLIENT_ID}`);
const authCtrl = {
    register: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, account, password } = req.body;
            const user = yield userModel_1.default.findOne({ account });
            if (user)
                return res.status(400).json({ msg: 'Email hoặc số điện thoại đã tồn tại' });
            const passwordHash = yield bcrypt_1.default.hash(password, 12);
            const newUser = { name, account, password: passwordHash };
            const active_token = (0, generateToken_1.generateActiveToken)({ newUser });
            const url = `${CLIENT_URL}/active/${active_token}`;
            if ((0, valid_1.validateEmail)(account)) {
                (0, sendMail_1.default)(account, url, 'Verify your email address');
                return res.json({ msg: "Success! Please check your email" });
            }
            else if ((0, valid_1.validatePhone)(account)) {
                (0, sendSMS_1.sendSms)(account, url, "Veryfi phone number");
                return res.json({ msg: "Success! please check your phone " });
            }
            res.json({
                status: "OK",
                msg: "Dang ky thanh cong",
                data: newUser,
                active_token
            });
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ msg: err.message });
        }
    }),
    activeAccount: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { active_token } = req.body;
            const decoded = jsonwebtoken_1.default.verify(active_token, `${process.env.ACTIVE_TOKEN_SECRET}`);
            const { newUser } = decoded;
            if (!newUser)
                return res.status(400).json({ msg: "Invalid authentication" });
            const user = yield userModel_1.default.findOne({ account: newUser.account });
            if (user)
                return res.status(400).json({ msg: "Account already exist" });
            const new_user = new userModel_1.default(newUser);
            yield new_user.save();
            res.json({ msg: "Tài khoản đã được kích hoạt" });
        }
        catch (err) {
            console.log('errrr', err);
            return res.status(500).json({ msg: err.message, status: 500 });
        }
    }),
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { account, password } = req.body;
            const user = yield userModel_1.default.findOne({ account });
            if (!user)
                return res.status(400).json({ msg: 'Account khong ton tai' });
            // if login success
            loginUser(user, password, res);
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ msg: err.message });
        }
    }),
    refreshToken: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const rf_token = req.cookies.refresh_token;
            if (!rf_token)
                return res.status(400).json({ msg: 'Vui log dang nhap' });
            const decoded = jsonwebtoken_1.default.verify(rf_token, `${process.env.REFESH_TOKEN_SECRET}`);
            if (!decoded.id)
                return res.status(400).json({ msg: ' Vui long dang nhap' });
            const user = yield userModel_1.default.findById(decoded.id).select('-password +rf_token');
            if (!user)
                return res.status(400).json({ msg: 'Tai khoan khong ton tai' });
            if (rf_token !== user.rf_token)
                return res.status(400).json({ msg: "Vui long dang nhap" });
            const access_token = (0, generateToken_1.generateAccessToken)({ id: user._id });
            const refresh_token = (0, generateToken_1.generateRefeshToken)({ id: user._id }, res);
            yield userModel_1.default.findOneAndUpdate({ _id: user._id }, {
                rf_token: refresh_token
            });
            res.json({ access_token, user });
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ msg: err.message });
        }
    }),
    logout: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user)
            return res.status(400).json({ msg: "Invalid Authentication" });
        try {
            res.clearCookie('refresh_token', { path: 'api/refresh_token' });
            yield userModel_1.default.findOneAndUpdate({ _id: req.user._id }, {
                rf_token: ''
            });
            return res.json({ msg: `Đã đăng xuất` });
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ msg: err.message });
        }
    }),
    googleLogin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id_token } = req.body;
            const ticket = yield client.verifyIdToken({
                idToken: id_token,
                audience: process.env.MAIL_CLIENT_ID
            });
            const { email, email_verified, name, picture } = ticket.getPayload();
            if (!email_verified)
                return res.status(500).json({ msg: "Xac thuc google that bai" });
            const password = email + 'your google secret password';
            const passwordHash = yield bcrypt_1.default.hash(password, 12);
            const user = yield userModel_1.default.findOne({ account: email });
            if (user) {
                loginUser(user, password, res);
            }
            else {
                const user = {
                    name,
                    account: email,
                    password: passwordHash,
                    avatar: picture,
                    type: 'google'
                };
                registerUser(user, res);
            }
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ msg: err.message });
        }
    }),
    facebookLogin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { accessToken, userID } = req.body;
            const URL = `https://graph.facebook.com/v3.0/${userID}/?fields=id,name,email,picture&access_token=${accessToken}            `;
            const data = yield (0, node_fetch_1.default)(URL)
                .then((res) => res.json()
                .then((res) => {
                return res;
            }));
            const { id, name, email, picture } = data;
            const password = email + 'your facebook secrect password';
            const passwordHash = yield bcrypt_1.default.hash(password, 12);
            const user = yield userModel_1.default.findOne({ account: email });
            if (user) {
                loginUser(user, password, res);
            }
            else {
                const user = {
                    name,
                    account: email,
                    password: passwordHash,
                    avatar: picture.data.url,
                    type: 'facebook'
                };
                registerUser(user, res);
            }
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ msg: err.message });
        }
    }),
};
const loginUser = (user, password, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isMatch)
        return res.status(400).json({ msg: "Mật khẩu không đúng" });
    const access_token = (0, generateToken_1.generateAccessToken)({ id: user._id });
    const refresh_token = (0, generateToken_1.generateRefeshToken)({ id: user._id }, res);
    yield userModel_1.default.findOneAndUpdate({ _id: user._id }, {
        rf_token: refresh_token
    });
    res.json({
        msg: 'Login Success!',
        access_token,
        user: Object.assign(Object.assign({}, user._doc), { password: '' })
    });
});
const registerUser = (user, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = new userModel_1.default(user);
    const access_token = (0, generateToken_1.generateAccessToken)({ id: newUser._id });
    const refresh_token = (0, generateToken_1.generateRefeshToken)({ id: newUser._id }, res);
    newUser.rf_token = refresh_token;
    yield newUser.save();
    res.json({
        access_token,
        user: Object.assign(Object.assign({}, newUser._doc), { password: '' })
    });
});
exports.default = authCtrl;

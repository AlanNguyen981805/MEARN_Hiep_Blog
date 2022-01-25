"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefeshToken = exports.generateAccessToken = exports.generateActiveToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { ACTIVE_TOKEN_SECRET, ACCESS_TOKEN_SECRET, REFESH_TOKEN_SECRET } = process.env;
const generateActiveToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, `${ACTIVE_TOKEN_SECRET}`, { expiresIn: "5m" });
};
exports.generateActiveToken = generateActiveToken;
const generateAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, `${ACCESS_TOKEN_SECRET}`, { expiresIn: "15s" });
};
exports.generateAccessToken = generateAccessToken;
const generateRefeshToken = (payload, res) => {
    const refresh_token = jsonwebtoken_1.default.sign(payload, `${REFESH_TOKEN_SECRET}`, { expiresIn: "30d" });
    res.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        path: 'api/refresh_token',
        maxAge: 30 * 24 * 60 * 60 * 1000 //30days
    });
    return refresh_token;
};
exports.generateRefeshToken = generateRefeshToken;

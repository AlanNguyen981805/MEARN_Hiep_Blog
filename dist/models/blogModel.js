"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const blogSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Types.ObjectId, ref: 'User'
    },
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 50
    },
    content: {
        type: String,
        required: true,
        minlength: 2000,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 50,
        maxlength: 200
    },
    thumbnail: {
        type: String,
        required: true
    },
    category: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'category'
    }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('blog', blogSchema);

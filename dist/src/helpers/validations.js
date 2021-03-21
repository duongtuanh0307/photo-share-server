"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = exports.generateUserToken = exports.isEmpty = exports.validatePassword = exports.isValidUsername = exports.isValidEmail = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = __importDefault(require("../../env"));
const isValidEmail = (email) => {
    const regEx = /\S+@\S+\.\S+/;
    return regEx.test(email);
};
exports.isValidEmail = isValidEmail;
const isValidUsername = (username) => {
    if (username.length > 50)
        return false;
    if (username.replace(/\s/g, "") !== username)
        return false;
    return true;
};
exports.isValidUsername = isValidUsername;
const validatePassword = (password) => {
    if (password.length < 8 || password.length > 20)
        return false;
    if (password.trim() === "")
        return false;
    return true;
};
exports.validatePassword = validatePassword;
const isEmpty = (input) => {
    if (input === undefined || input === "")
        return true;
    if (!input.replace(/\s/g, "").length)
        return true;
    return false;
};
exports.isEmpty = isEmpty;
const generateUserToken = (email, id, username, password) => {
    const token = jsonwebtoken_1.default.sign({
        email,
        id,
        username,
        password,
    }, env_1.default.secret, { expiresIn: "3d" });
    return token;
};
exports.generateUserToken = generateUserToken;
const saltRounds = 10;
const salt = bcryptjs_1.default.genSaltSync(saltRounds);
const hashPassword = (password) => bcryptjs_1.default.hashSync(password, salt);
exports.hashPassword = hashPassword;
const comparePassword = (hashedPassword, password) => {
    return bcryptjs_1.default.compareSync(password, hashedPassword);
};
exports.comparePassword = comparePassword;

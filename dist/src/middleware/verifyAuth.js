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
const status_1 = require("../helpers/status");
const env_1 = __importDefault(require("../../env"));
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.headers;
    if (!token) {
        status_1.errorMessage.error = "Token not provided";
        return res.status(status_1.status.bad).send(status_1.errorMessage);
    }
    try {
        const tokenString = typeof token === "string" ? token : token.join("");
        const decoded = jsonwebtoken_1.default.verify(tokenString, env_1.default.secret);
        req.user = {
            email: decoded.email,
            username: decoded.username,
            id: decoded.id,
        };
        next();
    }
    catch (error) {
        status_1.errorMessage.error = "Authentification Failed";
        return res.status(status_1.status.unauthorized).send(status_1.errorMessage);
    }
});
exports.default = verifyToken;

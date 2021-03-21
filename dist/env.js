"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    database_url: process.env.DATABASE_URL,
    secret: process.env.SECRET || "",
    port: process.env.PORT || 3080,
    environment: process.env.NODE_ENV,
};

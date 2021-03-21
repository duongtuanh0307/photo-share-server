"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const env_1 = __importDefault(require("../../env"));
const dbConfig = { connectionString: env_1.default.database_url };
const pool = new pg_1.Pool(dbConfig);
exports.default = pool;

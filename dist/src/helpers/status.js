"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.status = exports.errorMessage = void 0;
const errorMessage = { status: "error", error: "" };
exports.errorMessage = errorMessage;
const status = {
    success: 200,
    error: 500,
    notfound: 404,
    unauthorized: 401,
    conflict: 409,
    created: 201,
    bad: 400,
    nocontent: 204,
};
exports.status = status;

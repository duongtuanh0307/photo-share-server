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
exports.updateUserInfo = exports.getUserInfo = exports.loginUser = exports.createUser = void 0;
const pool_1 = __importDefault(require("../db/pool"));
const validations_1 = require("../helpers/validations");
const status_1 = require("../helpers/status");
const successMessage = {
    status: "success",
    data: undefined,
};
// POST /signup
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, password } = req.body;
    if (validations_1.isEmpty(email) || validations_1.isEmpty(username) || validations_1.isEmpty(password)) {
        status_1.errorMessage.error = "All fields must be filled";
        return res.status(status_1.status.bad).send(status_1.errorMessage);
    }
    if (!validations_1.isValidEmail(email)) {
        status_1.errorMessage.error = "Please enter a valid email";
        return res.status(status_1.status.bad).send(status_1.errorMessage);
    }
    if (!validations_1.isValidUsername(username)) {
        status_1.errorMessage.error =
            "Username cannot be longer to 50 characters or contain blank spaces";
        return res.status(status_1.status.bad).send(status_1.errorMessage);
    }
    if (!validations_1.validatePassword(password)) {
        status_1.errorMessage.error = "Password must be 8 - 20 characters length";
        return res.status(status_1.status.bad).send(status_1.errorMessage);
    }
    const hashedPassword = validations_1.hashPassword(password);
    const createUserQuery = `INSERT INTO users(email, username, password, profile_image, description)
      VALUES($1, $2, $3, '', '')
      RETURNING *`;
    const values = [email, username, hashedPassword];
    try {
        const result = yield pool_1.default.query(createUserQuery, values);
        const dbResponse = result.rows[0];
        dbResponse.password = "";
        const { id, email, username } = dbResponse;
        const token = validations_1.generateUserToken(email, username, id);
        successMessage.data = dbResponse;
        successMessage.data.token = token;
        return res.status(status_1.status.created).send(successMessage);
    }
    catch (error) {
        if (error.routine === "_bt_check_unique") {
            if (error.constraint === "users_username_key") {
                status_1.errorMessage.error = "Account with that username already exist";
            }
            if (error.constraint === "users_email_key") {
                status_1.errorMessage.error = "Account with that email already exist";
            }
            return res.status(status_1.status.conflict).send(status_1.errorMessage);
        }
        else {
            status_1.errorMessage.error = "Something went wrong";
            return res.status(status_1.status.error).send(status_1.errorMessage);
        }
    }
});
exports.createUser = createUser;
//POST /login
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (validations_1.isEmpty(email) || validations_1.isEmpty(password)) {
        status_1.errorMessage.error = "All fields must be filled";
        return res.status(status_1.status.bad).send(status_1.errorMessage);
    }
    if (!validations_1.isValidEmail(email)) {
        status_1.errorMessage.error = "Please input an valid email";
        return res.status(status_1.status.bad).send(status_1.errorMessage);
    }
    const loginQuery = `SELECT * FROM users WHERE email = $1`;
    try {
        const result = yield pool_1.default.query(loginQuery, [email]);
        const dbResponse = result.rows[0];
        if (!dbResponse) {
            status_1.errorMessage.error = "User not found";
            return res.status(status_1.status.bad).send(status_1.errorMessage);
        }
        if (!validations_1.comparePassword(dbResponse.password, password)) {
            status_1.errorMessage.error = "Please recheck your password";
            return res.status(status_1.status.bad).send(status_1.errorMessage);
        }
        const token = validations_1.generateUserToken(dbResponse.email, dbResponse.id, dbResponse.username);
        dbResponse.password = "";
        successMessage.data = dbResponse;
        successMessage.data.token = token;
        return res.status(status_1.status.success).send(successMessage);
    }
    catch (error) {
        status_1.errorMessage.error = "Something went wrong";
        return res.status(status_1.status.error).send(status_1.errorMessage);
    }
});
exports.loginUser = loginUser;
//GET /user/:username
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    const getUserInfo = `SELECT * FROM users WHERE username=$1`;
    try {
        const result = yield pool_1.default.query(getUserInfo, [username]);
        const { rows } = result;
        if (rows.length === 0) {
            status_1.errorMessage.error = "User not found";
            return res.status(status_1.status.notfound).send(status_1.errorMessage);
        }
        const userInfo = rows[0];
        userInfo.password = "";
        successMessage.data = userInfo;
        return res.status(status_1.status.success).send(successMessage);
    }
    catch (error) {
        status_1.errorMessage.error = "Something went wrong";
        return res.status(status_1.status.error).send(status_1.errorMessage);
    }
});
exports.getUserInfo = getUserInfo;
//PUT /user/:id
const updateUserInfo = (req, res, next) => {
    const { id } = req.params;
    const keys = ["username", "description", "profile_image"];
    const fields = [];
    try {
        keys.forEach((key) => {
            if (req.body[key])
                fields.push(key);
        });
        fields.forEach((field, index) => {
            pool_1.default.query(`UPDATE users SET ${field} = ($1) WHERE id = $2 RETURNING *`, [req.body[field], id], (err, response) => {
                if (err)
                    return next(err);
                if (index === fields.length - 1) {
                    const currentUsername = response.rows[0].username;
                    return res.redirect(`/api/v1/user/${currentUsername}`);
                }
            });
        });
    }
    catch (error) {
        status_1.errorMessage.error = "Something went wrong";
        return res.status(status_1.status.error).send(status_1.errorMessage);
    }
};
exports.updateUserInfo = updateUserInfo;

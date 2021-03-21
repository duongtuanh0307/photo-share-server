import { Request, Response } from "express";
import pool from "../db/pool";
import { QueryResult } from "pg";

import {
  hashPassword,
  comparePassword,
  isValidEmail,
  validatePassword,
  isEmpty,
  generateUserToken,
  isValidUsername,
} from "../helpers/validations";
import { errorMessage, status, SuccessMessage } from "../helpers/status";

type User = {
  id: string;
  email: string;
  username: string;
  profile_image: string;
  description: string;
  password: string;
};

const successMessage: SuccessMessage<User & { token?: string }> = {
  status: "success",
  data: undefined,
};

// POST /signup
const createUser = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  if (isEmpty(email) || isEmpty(username) || isEmpty(password)) {
    errorMessage.error = "All fields must be filled";
    return res.status(status.bad).send(errorMessage);
  }
  if (!isValidEmail(email)) {
    errorMessage.error = "Please enter a valid email";
    return res.status(status.bad).send(errorMessage);
  }
  if (!isValidUsername(username)) {
    errorMessage.error =
      "Username cannot be longer to 50 characters or contain blank spaces";
    return res.status(status.bad).send(errorMessage);
  }

  if (!validatePassword(password)) {
    errorMessage.error = "Password must be 8 - 20 characters length";
    return res.status(status.bad).send(errorMessage);
  }

  const hashedPassword = hashPassword(password);
  const createUserQuery = `INSERT INTO users(email, username, password, profile_image, description)
      VALUES($1, $2, $3, '', '')
      RETURNING *`;
  const values = [email, username, hashedPassword];
  try {
    const result: QueryResult<User> = await pool.query(createUserQuery, values);
    const dbResponse = result.rows[0];
    dbResponse.password = "";
    const { id, email, username } = dbResponse;
    const token = generateUserToken(email, username, id);
    successMessage.data = dbResponse;
    successMessage.data!.token = token;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    if (error.routine === "_bt_check_unique") {
      if (error.constraint === "users_username_key") {
        errorMessage.error = "Account with that username already exist";
      }
      if (error.constraint === "users_email_key") {
        errorMessage.error = "Account with that email already exist";
      }
      return res.status(status.conflict).send(errorMessage);
    } else {
      errorMessage.error = "Something went wrong";
      return res.status(status.error).send(errorMessage);
    }
  }
};

//POST /login
const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (isEmpty(email) || isEmpty(password)) {
    errorMessage.error = "All fields must be filled";
    return res.status(status.bad).send(errorMessage);
  }
  if (!isValidEmail(email)) {
    errorMessage.error = "Please input an valid email";
    return res.status(status.bad).send(errorMessage);
  }
  const loginQuery = `SELECT * FROM users WHERE email = $1`;
  try {
    const result: QueryResult<User> = await pool.query(loginQuery, [email]);
    const dbResponse = result.rows[0];
    if (!dbResponse) {
      errorMessage.error = "User not found";
      return res.status(status.bad).send(errorMessage);
    }
    if (!comparePassword(dbResponse.password, password)) {
      errorMessage.error = "Please recheck your password";
      return res.status(status.bad).send(errorMessage);
    }
    const token = generateUserToken(
      dbResponse.email,
      dbResponse.id,
      dbResponse.username
    );
    dbResponse.password = "";
    successMessage.data = dbResponse;
    successMessage.data!.token = token;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = "Something went wrong";
    return res.status(status.error).send(errorMessage);
  }
};

//GET /user/:username
const getUserInfo = async (req: Request, res: Response) => {
  const { username } = req.params;
  const getUserInfo = `SELECT * FROM users WHERE username=$1`;
  try {
    const result: QueryResult<User> = await pool.query(getUserInfo, [username]);
    const { rows } = result;
    if (rows.length === 0) {
      errorMessage.error = "User not found";
      return res.status(status.notfound).send(errorMessage);
    }
    const userInfo = rows[0];
    userInfo.password = "";
    successMessage.data = userInfo;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = "Something went wrong";
    return res.status(status.error).send(errorMessage);
  }
};

//PUT /user/:id
const updateUserInfo = (req: Request, res: Response, next: Function) => {
  const { id } = req.params;
  const keys = ["username", "description", "profile_image"];
  const fields: string[] = [];

  try {
    keys.forEach((key) => {
      if (req.body[key]) fields.push(key);
    });
    fields.forEach((field, index) => {
      pool.query(
        `UPDATE users SET ${field} = ($1) WHERE id = $2 RETURNING *`,
        [req.body[field], id],
        (err, response) => {
          if (err) return next(err);
          if (index === fields.length - 1) {
            const currentUsername = response.rows[0].username;
            return res.redirect(`/api/v1/user/${currentUsername}`);
          }
        }
      );
    });
  } catch (error) {
    errorMessage.error = "Something went wrong";
    return res.status(status.error).send(errorMessage);
  }
};

//TODO: add enpoint to get Photo

export { createUser, loginUser, getUserInfo, updateUserInfo };

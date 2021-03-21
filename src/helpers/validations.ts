import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import env from "../../env";

const isValidEmail = (email: string) => {
  const regEx = /\S+@\S+\.\S+/;
  return regEx.test(email);
};

const isValidUsername = (username: string) => {
  if (username.length > 50) return false;
  if (username.replace(/\s/g, "") !== username) return false;
  return true;
};

const validatePassword = (password: string) => {
  if (password.length < 8 || password.length > 20) return false;
  if (password.trim() === "") return false;
  return true;
};

const isEmpty = (input: string) => {
  if (input === undefined || input === "") return true;
  if (!input.replace(/\s/g, "").length) return true;
  return false;
};

const generateUserToken = (
  email: string,
  id: string,
  username: string,
  password?: string
) => {
  const token = jwt.sign(
    {
      email,
      id,
      username,
      password,
    },
    env.secret,
    { expiresIn: "3d" }
  );
  return token;
};
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const hashPassword = (password: string) => bcrypt.hashSync(password, salt);

const comparePassword = (hashedPassword: string, password: string) => {
  return bcrypt.compareSync(password, hashedPassword);
};

export {
  isValidEmail,
  isValidUsername,
  validatePassword,
  isEmpty,
  generateUserToken,
  hashPassword,
  comparePassword,
};

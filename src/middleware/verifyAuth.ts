import jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";

import { errorMessage, status } from "../helpers/status";
import env from "../../env";

const verifyToken = async (
  req: TokenRequest,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.headers;
  if (!token) {
    errorMessage.error = "Token not provided";
    return res.status(status.bad).send(errorMessage);
  }
  try {
    const tokenString = typeof token === "string" ? token : token.join("");
    const decoded: any = jwt.verify(tokenString, env.secret);

    req.user = {
      email: decoded.email,
      username: decoded.username,
      id: decoded.id,
    };
    next();
  } catch (error) {
    errorMessage.error = "Authentification Failed";
    return res.status(status.unauthorized).send(errorMessage);
  }
};

export default verifyToken;

type User = {
  email: string;
  id: string;
  username: string;
};

type TokenRequest = Request & { user?: User };

import express from "express";
import {
  createUser,
  loginUser,
  getUserInfo,
  updateUserInfo,
} from "../controllers/usersController";
import verifyAuth from "../middleware/verifyAuth";

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", loginUser);
router.get("/user/:username", verifyAuth, getUserInfo);
router.put("/user/:id", verifyAuth, updateUserInfo);

export default router;

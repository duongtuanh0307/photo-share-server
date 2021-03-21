import express from "express";
import {
  postComment,
  editComment,
  deleteComment,
} from "../controllers/commentsController";
import verifyAuth from "../middleware/verifyAuth";

const router = express.Router();

router.get("/post", verifyAuth, postComment);
router.put("/:id", verifyAuth, editComment);
router.delete("/:id", verifyAuth, deleteComment);

export default router;

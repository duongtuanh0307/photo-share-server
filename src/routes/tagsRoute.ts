import express from "express";
import {
  createNewTag,
  editTagTitle,
  deleteTag,
} from "../controllers/tagsController";
import verifyAuth from "../middleware/verifyAuth";

const router = express.Router();

router.get("/create", verifyAuth, createNewTag);
router.put("/:id", verifyAuth, editTagTitle);
router.delete("/:id", verifyAuth, deleteTag);

export default router;

import express from "express";
import {
  uploadPhoto,
  updatePhotoDescription,
  deletePhoto,
  savePhoto,
  unsavePhoto,
} from "../controllers/photosController";
import verifyAuth from "../middleware/verifyAuth";

const router = express.Router();

router.post("/upload", verifyAuth, uploadPhoto);
router.put("/:id", verifyAuth, updatePhotoDescription);
router.delete("/:id", verifyAuth, deletePhoto);
router.post("/save", verifyAuth, savePhoto);
router.post("/unsave", verifyAuth, unsavePhoto);

export default router;

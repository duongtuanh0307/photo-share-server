"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const photosController_1 = require("../controllers/photosController");
const verifyAuth_1 = __importDefault(require("../middleware/verifyAuth"));
const router = express_1.default.Router();
router.post("/upload", verifyAuth_1.default, photosController_1.uploadPhoto);
router.put("/:id", verifyAuth_1.default, photosController_1.updatePhotoDescription);
router.delete("/:id", verifyAuth_1.default, photosController_1.deletePhoto);
router.post("/save", verifyAuth_1.default, photosController_1.savePhoto);
router.post("/unsave", verifyAuth_1.default, photosController_1.unsavePhoto);
exports.default = router;

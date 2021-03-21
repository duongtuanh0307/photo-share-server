"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentsController_1 = require("../controllers/commentsController");
const verifyAuth_1 = __importDefault(require("../middleware/verifyAuth"));
const router = express_1.default.Router();
router.get("/post", verifyAuth_1.default, commentsController_1.postComment);
router.put("/:id", verifyAuth_1.default, commentsController_1.editComment);
router.delete("/:id", verifyAuth_1.default, commentsController_1.deleteComment);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tagsController_1 = require("../controllers/tagsController");
const verifyAuth_1 = __importDefault(require("../middleware/verifyAuth"));
const router = express_1.default.Router();
router.get("/create", verifyAuth_1.default, tagsController_1.createNewTag);
router.put("/:id", verifyAuth_1.default, tagsController_1.editTagTitle);
router.delete("/:id", verifyAuth_1.default, tagsController_1.deleteTag);
exports.default = router;

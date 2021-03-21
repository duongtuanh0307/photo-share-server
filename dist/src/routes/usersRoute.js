"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersController_1 = require("../controllers/usersController");
const verifyAuth_1 = __importDefault(require("../middleware/verifyAuth"));
const router = express_1.default.Router();
router.post("/signup", usersController_1.createUser);
router.post("/login", usersController_1.loginUser);
router.get("/user/:username", verifyAuth_1.default, usersController_1.getUserInfo);
router.put("/user/:id", verifyAuth_1.default, usersController_1.updateUserInfo);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersRoute_1 = __importDefault(require("./routes/usersRoute"));
const photosRoute_1 = __importDefault(require("./routes/photosRoute"));
const tagsRoute_1 = __importDefault(require("./routes/tagsRoute"));
const tagsRoute_2 = __importDefault(require("./routes/tagsRoute"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = express_1.default();
app.use(body_parser_1.default.json());
app.use("/api/v1", usersRoute_1.default);
app.use("/api/v1/photo", photosRoute_1.default);
app.use("/api/v1/tag", tagsRoute_1.default);
app.use("/api/v1/comment", tagsRoute_2.default);
app.use((err, req, res, next) => {
    res.json(err);
});
module.exports = app;

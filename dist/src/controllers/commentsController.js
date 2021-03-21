"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.editComment = exports.postComment = void 0;
const pool_1 = __importDefault(require("../db/pool"));
const moment_1 = __importDefault(require("moment"));
const status_1 = require("../helpers/status");
const validations_1 = require("../helpers/validations");
const successMessage = {
    status: "success",
    data: undefined,
};
//POST /comment/post
const postComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { comment_by_id, photo_id, comment } = req.body;
    const posted_on = moment_1.default(new Date());
    if (validations_1.isEmpty(comment)) {
        status_1.errorMessage.error = "Comment cannot be empty";
        return res.status(status_1.status.bad).send(status_1.errorMessage);
    }
    if (comment.length > 200) {
        status_1.errorMessage.error = "Comment cannot be longer than 200 characters";
        return res.status(status_1.status.bad).send(status_1.errorMessage);
    }
    const postCommentQuery = `INSERT INTO comments(comment_by_id, photo_id, comment, posted_time, last_update)
    VALUES($1, $2, $3, $4, $4) RETURNING *`;
    const values = [comment_by_id, photo_id, comment, posted_on];
    try {
        const result = yield pool_1.default.query(postCommentQuery, values);
        const createdPhoto = result.rows[0];
        successMessage.data = createdPhoto;
        return res.status(status_1.status.created).send(successMessage);
    }
    catch (error) {
        status_1.errorMessage.error = "Upload Failed";
        return res.status(status_1.status.error).send(status_1.errorMessage);
    }
});
exports.postComment = postComment;
//PUT /comment/:id
const editComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { comment } = req.body;
    const update_on = moment_1.default(new Date());
    if (validations_1.isEmpty(comment)) {
        status_1.errorMessage.error = "Comment cannot be empty";
        return res.status(status_1.status.bad).send(status_1.errorMessage);
    }
    if (comment.length > 200) {
        status_1.errorMessage.error = "Tag title cannot be longer than 120 characters";
        return res.status(status_1.status.bad).send(status_1.errorMessage);
    }
    const editCommentQuery = `UPDATE comments SET comment = ($1), last_update = ($2) WHERE id = $3 RETURNING *`;
    const values = [comment, update_on, id];
    try {
        const result = yield pool_1.default.query(editCommentQuery, values);
        const updatedComment = result.rows[0];
        successMessage.data = updatedComment;
        return res.status(status_1.status.success).send(successMessage);
    }
    catch (error) {
        status_1.errorMessage.error = "Update Failed";
        return res.status(status_1.status.error).send(status_1.errorMessage);
    }
});
exports.editComment = editComment;
//DELETE /comment/:id
const deleteComment = (req, res) => {
    const { id } = req.params;
    const deleteCommentQuery = `DELETE FROM comments WHERE id = ($1)`;
    const values = [id];
    try {
        pool_1.default.query(deleteCommentQuery, values, (err, response) => {
            if (err) {
                status_1.errorMessage.error = "Something went wrong";
                return res.status(status_1.status.error).send(status_1.errorMessage);
            }
            return res.status(status_1.status.success).send(successMessage);
        });
    }
    catch (error) {
        status_1.errorMessage.error = "Something went wrong";
        return res.status(status_1.status.error).send(status_1.errorMessage);
    }
};
exports.deleteComment = deleteComment;

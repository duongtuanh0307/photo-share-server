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
exports.deleteTag = exports.editTagTitle = exports.createNewTag = void 0;
const pool_1 = __importDefault(require("../db/pool"));
const status_1 = require("../helpers/status");
const validations_1 = require("../helpers/validations");
const successMessage = {
    status: "success",
    data: undefined,
};
// POST /tag/create
const createNewTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, owner_id } = req.body;
    if (validations_1.isEmpty(title)) {
        status_1.errorMessage.error = "Tag title cannot be empty";
        return res.status(status_1.status.bad).send(status_1.errorMessage);
    }
    if (title.length > 120) {
        status_1.errorMessage.error = "Tag title cannot be longer than 120 characters";
        return res.status(status_1.status.bad).send(status_1.errorMessage);
    }
    const createTagQuery = `INSERT INTO tags(title, owner_id) VALUES($1, $2) RETURNING *`;
    const values = [title, owner_id];
    try {
        const result = yield pool_1.default.query(createTagQuery, values);
        const createdTag = result.rows[0];
        successMessage.data = createdTag;
        return res.status(status_1.status.created).send(successMessage);
    }
    catch (error) {
        status_1.errorMessage.error = "Upload Failed";
        return res.status(status_1.status.error).send(status_1.errorMessage);
    }
});
exports.createNewTag = createNewTag;
//PUT /tag/:id
const editTagTitle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title } = req.body;
    if (validations_1.isEmpty(title)) {
        status_1.errorMessage.error = "Tag title cannot be empty";
        return res.status(status_1.status.bad).send(status_1.errorMessage);
    }
    if (title.length > 120) {
        status_1.errorMessage.error = "Tag title cannot be longer than 120 characters";
        return res.status(status_1.status.bad).send(status_1.errorMessage);
    }
    const updateTitleQuery = `UPDATE tags SET title = ($1) WHERE id = $2 RETURNING *`;
    const values = [title, id];
    try {
        const result = yield pool_1.default.query(updateTitleQuery, values);
        const updatedTag = result.rows[0];
        successMessage.data = updatedTag;
        return res.status(status_1.status.success).send(successMessage);
    }
    catch (error) {
        status_1.errorMessage.error = "Update Failed";
        return res.status(status_1.status.error).send(status_1.errorMessage);
    }
});
exports.editTagTitle = editTagTitle;
//DELETE /tag/:id
const deleteTag = (req, res) => {
    const { id } = req.params;
    const deleteTagQuery = `DELETE FROM tags WHERE id = ($1)`;
    const values = [id];
    try {
        pool_1.default.query(deleteTagQuery, values, (err, response) => {
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
exports.deleteTag = deleteTag;

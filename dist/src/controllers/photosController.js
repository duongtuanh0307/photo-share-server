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
exports.unsavePhoto = exports.savePhoto = exports.deletePhoto = exports.updatePhotoDescription = exports.uploadPhoto = void 0;
const pool_1 = __importDefault(require("../db/pool"));
const moment_1 = __importDefault(require("moment"));
const status_1 = require("../helpers/status");
const successMessage = {
    status: "success",
    data: undefined,
};
/*----------------- UPLOAD, EDIT, DELETE UPLOADED PHOTO ---------------------------*/
//POST /photo/upload
const uploadPhoto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { owner_id, photo_url, description } = req.body;
    const upload_on = moment_1.default(new Date());
    const uploadPhotoQuery = `INSERT INTO photos(owner_id, photo_url, description, created_on, last_update)
    VALUES($1, $2, $3, $4, $4) RETURNING *`;
    const values = [owner_id, photo_url, description, upload_on];
    try {
        const result = yield pool_1.default.query(uploadPhotoQuery, values);
        const createdPhoto = result.rows[0];
        successMessage.data = createdPhoto;
        return res.status(status_1.status.created).send(successMessage);
    }
    catch (error) {
        status_1.errorMessage.error = "Upload Failed";
        return res.status(status_1.status.error).send(status_1.errorMessage);
    }
});
exports.uploadPhoto = uploadPhoto;
//PUT /photo/:id
const updatePhotoDescription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { description } = req.body;
    const update_on = moment_1.default(new Date());
    if (description.length > 200) {
        status_1.errorMessage.error = "Tag title cannot be longer than 120 characters";
        return res.status(status_1.status.bad).send(status_1.errorMessage);
    }
    const updatePhotoQuery = `UPDATE photos SET description = ($1), last_update = ($2) WHERE id = $3 RETURNING *`;
    const values = [description, update_on, id];
    try {
        const result = yield pool_1.default.query(updatePhotoQuery, values);
        const updatedPhoto = result.rows[0];
        successMessage.data = updatedPhoto;
        return res.status(status_1.status.success).send(successMessage);
    }
    catch (error) {
        status_1.errorMessage.error = "Update Failed";
        return res.status(status_1.status.error).send(status_1.errorMessage);
    }
});
exports.updatePhotoDescription = updatePhotoDescription;
//DELETE /photo/:id
const deletePhoto = (req, res) => {
    const { id } = req.params;
    const deletePhotoQuery = `DELETE FROM photos WHERE id = ($1)`;
    const values = [id];
    try {
        pool_1.default.query(deletePhotoQuery, values, (err, response) => {
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
exports.deletePhoto = deletePhoto;
/*----------------- SAVED & UNSAVED PHOTO ---------------------------*/
//POST /photo/save (save photo)
const savePhoto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { photo_id, tag_id } = req.body;
    const savePhotoQuery = `INSERT INTO saved_photos(photo_id, tag_id)
    VALUES($1, $2) RETURNING *`;
    const values = [photo_id, tag_id];
    try {
        const result = yield pool_1.default.query(savePhotoQuery, values);
        const createdPhoto = result.rows[0];
        successMessage.data = createdPhoto;
        return res.status(status_1.status.created).send(successMessage);
    }
    catch (error) {
        status_1.errorMessage.error = "Upload Failed";
        return res.status(status_1.status.error).send(status_1.errorMessage);
    }
});
exports.savePhoto = savePhoto;
//DELETE /photo/unsave
const unsavePhoto = (req, res) => {
    const { id } = req.body;
    const deletePhotoQuery = `DELETE FROM saved_photos WHERE id = ($1)`;
    const values = [id];
    try {
        pool_1.default.query(deletePhotoQuery, values, (err, response) => {
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
exports.unsavePhoto = unsavePhoto;

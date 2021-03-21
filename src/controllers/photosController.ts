import { Request, Response } from "express";
import pool from "../db/pool";
import moment from "moment";
import { QueryResult } from "pg";

import { errorMessage, status, SuccessMessage } from "../helpers/status";

type Photo = {
  id: string;
  owner_id: string;
  photo_url: string;
  description: string;
  created_on: string;
  last_update: string;
};

type SavedPhoto = {
  id: string;
  photo_id: string;
  tag_id: string;
};

const successMessage: SuccessMessage<Photo | SavedPhoto> = {
  status: "success",
  data: undefined,
};

/*----------------- UPLOAD, EDIT, DELETE UPLOADED PHOTO ---------------------------*/
//POST /photo/upload
const uploadPhoto = async (req: Request, res: Response) => {
  const { owner_id, photo_url, description } = req.body;
  const upload_on = moment(new Date());

  const uploadPhotoQuery = `INSERT INTO photos(owner_id, photo_url, description, created_on, last_update)
    VALUES($1, $2, $3, $4, $4) RETURNING *`;
  const values = [owner_id, photo_url, description, upload_on];
  try {
    const result: QueryResult<Photo> = await pool.query(
      uploadPhotoQuery,
      values
    );
    const createdPhoto = result.rows[0];
    successMessage.data = createdPhoto;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    errorMessage.error = "Upload Failed";
    return res.status(status.error).send(errorMessage);
  }
};

//PUT /photo/:id
const updatePhotoDescription = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { description } = req.body;
  const update_on = moment(new Date());

  if (description.length > 200) {
    errorMessage.error = "Tag title cannot be longer than 120 characters";
    return res.status(status.bad).send(errorMessage);
  }

  const updatePhotoQuery = `UPDATE photos SET description = ($1), last_update = ($2) WHERE id = $3 RETURNING *`;
  const values = [description, update_on, id];

  try {
    const result: QueryResult<Photo> = await pool.query(
      updatePhotoQuery,
      values
    );
    const updatedPhoto = result.rows[0];
    successMessage.data = updatedPhoto;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = "Update Failed";
    return res.status(status.error).send(errorMessage);
  }
};

//DELETE /photo/:id
const deletePhoto = (req: Request, res: Response) => {
  const { id } = req.params;
  const deletePhotoQuery = `DELETE FROM photos WHERE id = ($1)`;
  const values = [id];

  try {
    pool.query(deletePhotoQuery, values, (err, response) => {
      if (err) {
        errorMessage.error = "Something went wrong";
        return res.status(status.error).send(errorMessage);
      }
      return res.status(status.success).send(successMessage);
    });
  } catch (error) {
    errorMessage.error = "Something went wrong";
    return res.status(status.error).send(errorMessage);
  }
};

/*----------------- SAVED & UNSAVED PHOTO ---------------------------*/
//POST /photo/save (save photo)
const savePhoto = async (req: Request, res: Response) => {
  const { photo_id, tag_id } = req.body;
  const savePhotoQuery = `INSERT INTO saved_photos(photo_id, tag_id)
    VALUES($1, $2) RETURNING *`;
  const values = [photo_id, tag_id];
  try {
    const result: QueryResult<SavedPhoto> = await pool.query(
      savePhotoQuery,
      values
    );
    const createdPhoto = result.rows[0];
    successMessage.data = createdPhoto;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    errorMessage.error = "Upload Failed";
    return res.status(status.error).send(errorMessage);
  }
};

//DELETE /photo/unsave
const unsavePhoto = (req: Request, res: Response) => {
  const { id } = req.body;
  const deletePhotoQuery = `DELETE FROM saved_photos WHERE id = ($1)`;
  const values = [id];

  try {
    pool.query(deletePhotoQuery, values, (err, response) => {
      if (err) {
        errorMessage.error = "Something went wrong";
        return res.status(status.error).send(errorMessage);
      }
      return res.status(status.success).send(successMessage);
    });
  } catch (error) {
    errorMessage.error = "Something went wrong";
    return res.status(status.error).send(errorMessage);
  }
};

//TODO: add endpoint to get photo detail

export {
  uploadPhoto,
  updatePhotoDescription,
  deletePhoto,
  savePhoto,
  unsavePhoto,
};

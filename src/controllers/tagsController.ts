import { Request, Response } from "express";
import pool from "../db/pool";
import { QueryResult } from "pg";

import { errorMessage, status, SuccessMessage } from "../helpers/status";
import { isEmpty } from "../helpers/validations";

type Tag = {
  id: string;
  title: string;
  owner_id: string;
};

const successMessage: SuccessMessage<Tag> = {
  status: "success",
  data: undefined,
};

// POST /tag/create
const createNewTag = async (req: Request, res: Response) => {
  const { title, owner_id } = req.body;

  if (isEmpty(title)) {
    errorMessage.error = "Tag title cannot be empty";
    return res.status(status.bad).send(errorMessage);
  }

  if (title.length > 120) {
    errorMessage.error = "Tag title cannot be longer than 120 characters";
    return res.status(status.bad).send(errorMessage);
  }

  const createTagQuery = `INSERT INTO tags(title, owner_id) VALUES($1, $2) RETURNING *`;
  const values = [title, owner_id];
  try {
    const result: QueryResult<Tag> = await pool.query(createTagQuery, values);
    const createdTag = result.rows[0];
    successMessage.data = createdTag;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    errorMessage.error = "Upload Failed";
    return res.status(status.error).send(errorMessage);
  }
};

//PUT /tag/:id
const editTagTitle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title } = req.body;

  if (isEmpty(title)) {
    errorMessage.error = "Tag title cannot be empty";
    return res.status(status.bad).send(errorMessage);
  }

  if (title.length > 120) {
    errorMessage.error = "Tag title cannot be longer than 120 characters";
    return res.status(status.bad).send(errorMessage);
  }

  const updateTitleQuery = `UPDATE tags SET title = ($1) WHERE id = $2 RETURNING *`;
  const values = [title, id];

  try {
    const result: QueryResult<Tag> = await pool.query(updateTitleQuery, values);
    const updatedTag = result.rows[0];
    successMessage.data = updatedTag;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = "Update Failed";
    return res.status(status.error).send(errorMessage);
  }
};

//DELETE /tag/:id
const deleteTag = (req: Request, res: Response) => {
  const { id } = req.params;
  const deleteTagQuery = `DELETE FROM tags WHERE id = ($1)`;
  const values = [id];

  try {
    pool.query(deleteTagQuery, values, (err, response) => {
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

export { createNewTag, editTagTitle, deleteTag };

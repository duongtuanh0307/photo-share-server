import { Request, Response } from "express";
import pool from "../db/pool";
import moment from "moment";
import { QueryResult } from "pg";

import { errorMessage, status, SuccessMessage } from "../helpers/status";
import { isEmpty } from "../helpers/validations";

type Comment = {
  id: string;
  comment_by_id: string;
  photo_id: string;
  comment: string;
  posted_time: string;
  last_update: string;
};

const successMessage: SuccessMessage<Comment> = {
  status: "success",
  data: undefined,
};

//POST /comment/post
const postComment = async (req: Request, res: Response) => {
  const { comment_by_id, photo_id, comment } = req.body;
  const posted_on = moment(new Date());

  if (isEmpty(comment)) {
    errorMessage.error = "Comment cannot be empty";
    return res.status(status.bad).send(errorMessage);
  }

  if (comment.length > 200) {
    errorMessage.error = "Comment cannot be longer than 200 characters";
    return res.status(status.bad).send(errorMessage);
  }
  const postCommentQuery = `INSERT INTO comments(comment_by_id, photo_id, comment, posted_time, last_update)
    VALUES($1, $2, $3, $4, $4) RETURNING *`;
  const values = [comment_by_id, photo_id, comment, posted_on];
  try {
    const result: QueryResult<Comment> = await pool.query(
      postCommentQuery,
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

//PUT /comment/:id
const editComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { comment } = req.body;
  const update_on = moment(new Date());

  if (isEmpty(comment)) {
    errorMessage.error = "Comment cannot be empty";
    return res.status(status.bad).send(errorMessage);
  }

  if (comment.length > 200) {
    errorMessage.error = "Tag title cannot be longer than 120 characters";
    return res.status(status.bad).send(errorMessage);
  }

  const editCommentQuery = `UPDATE comments SET comment = ($1), last_update = ($2) WHERE id = $3 RETURNING *`;
  const values = [comment, update_on, id];

  try {
    const result: QueryResult<Comment> = await pool.query(
      editCommentQuery,
      values
    );
    const updatedComment = result.rows[0];
    successMessage.data = updatedComment;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = "Update Failed";
    return res.status(status.error).send(errorMessage);
  }
};

//DELETE /comment/:id
const deleteComment = (req: Request, res: Response) => {
  const { id } = req.params;
  const deleteCommentQuery = `DELETE FROM comments WHERE id = ($1)`;
  const values = [id];

  try {
    pool.query(deleteCommentQuery, values, (err, response) => {
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

export { postComment, editComment, deleteComment };

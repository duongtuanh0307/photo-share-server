import express, { Application, Request, Response, NextFunction } from "express";
import usersRoute from "./routes/usersRoute";
import photosRoute from "./routes/photosRoute";
import tagsRoute from "./routes/tagsRoute";
import commentsRoute from "./routes/tagsRoute";
import bodyParser from "body-parser";

const app: Application = express();

app.use(bodyParser.json());

app.use("/api/v1", usersRoute);
app.use("/api/v1/photo", photosRoute);
app.use("/api/v1/tag", tagsRoute);
app.use("/api/v1/comment", commentsRoute);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.json(err);
});

module.exports = app;

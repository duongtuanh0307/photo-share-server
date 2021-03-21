const errorMessage: ErrorMessage = { status: "error", error: "" };
const status: Status = {
  success: 200,
  error: 500,
  notfound: 404,
  unauthorized: 401,
  conflict: 409,
  created: 201,
  bad: 400,
  nocontent: 204,
};

export { errorMessage, status };

type Status = {
  success: number;
  error: number;
  notfound: number;
  unauthorized: number;
  conflict: number;
  created: number;
  bad: number;
  nocontent: number;
};

type ErrorMessage = {
  status: "error";
  error: string;
};

export type SuccessMessage<R> = {
  status: "success";
  data?: R;
};

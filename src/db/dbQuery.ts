import pool from "./pool";

export default {
  query(quertText: string, params: object[]) {
    return new Promise((resolve, reject) => {
      pool
        .query(quertText, params)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

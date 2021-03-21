import { Client } from "pg";
import env from "../../env";

const dbConfig = {
  connectionString: env.database_url,
};
const pool = new Client(dbConfig);

export default pool;

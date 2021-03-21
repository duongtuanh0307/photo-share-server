import { Pool } from "pg";
import env from "../../env";

const dbConfig = {
  connectionString: env.database_url,
  ssl: {
    rejectUnauthorized: false,
  },
};
const pool = new Pool(dbConfig);

export default pool;

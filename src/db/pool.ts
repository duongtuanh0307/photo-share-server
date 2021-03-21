import { Pool } from "pg";
import env from "../../env";

const dbConfig = { connectionString: env.database_url };
const pool = new Pool(dbConfig);

export default pool;

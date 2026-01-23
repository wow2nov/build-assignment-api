// Create PostgreSQL Connection Pool here !
import * as pg from "pg";
const { Pool } = pg;

const connectionPool = new Pool({
  connectionString:
    "postgresql://supawow:021138@localhost:5432/lms-assignment",
});

export default connectionPool;


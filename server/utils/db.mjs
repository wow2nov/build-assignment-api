// Create PostgreSQL Connection Pool here !
import * as pg from "pg";
const { Pool } = pg.default;

const connectionPool = new Pool({
  connectionString:
    "postgresql://supawow:0211@localhost:5432/lms-assignment",
});

export default connectionPool;

import { createPool } from "mysql2/promise";

const defaultConnection = createPool({
  host: "sql6.freesqldatabase.com",
  database: "sql6639676",
  user: "sql6639676",
  password: "8eKqtQLAfW",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export default defaultConnection;

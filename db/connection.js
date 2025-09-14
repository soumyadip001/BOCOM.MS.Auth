import sql from "mssql";
import {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_LOGGING,
} from "../config/index.js";

const poolConfig = {
  user: DB_USER,
  password: DB_PASSWORD,
  server: DB_HOST,
  database: DB_NAME,
  port: parseInt(DB_PORT || "1433", 10),
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  logging: DB_LOGGING,
};

export let pool;

export const connect = async () => {
  try {
    pool = await sql.connect(poolConfig);
    console.log("MSSQL connected");
    return pool;
  } catch (err) {
    console.error("MSSQL connection failed", err);
    throw err;
  }
};

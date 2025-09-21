import { config } from "dotenv";
config();

export const CREDENTIALS = process.env.CREDENTIALS === "true";
export const {
  ENV,
  NODE_ENV,
  PORT,
  HOST,
  ORIGIN,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_LOGGING,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
  AWS_REGION,
  MAX_OTPS_PER_DAY,
  MAX_FAILED_ATTEMPTS,
  MAX_VERIFY_ATTEMPTS,
} = process.env;

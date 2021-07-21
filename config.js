// Common settings for sessions-api app

require("dotenv").config();

const DB_URI =
  process.env.NODE_ENV === "test"
    ? "postgresql:///sessions_testdb"
    : "postgresql:///sessionsdb";

const SECRET_KEY = process.env.SECRET_KEY || "secret";
const PORT = +process.env.PORT || 3000;

const BCRYPT_WORK_FACTOR = 12;

module.exports = { DB_URI, PORT, SECRET_KEY, BCRYPT_WORK_FACTOR };

const { Client } = require("pg");
const { DB_URI } = require("./config");

const client = new Client({
  connectionString: process.env.DATBASE_URL || DB_URI,
});

client.connect();

module.exports = client;

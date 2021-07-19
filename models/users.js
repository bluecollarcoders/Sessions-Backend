"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config");

class User {
  constructor(username, password, first_name, last_name, email) {
    this.username = username;
    this.password = password;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
  }

  // authenticate user with username, password.
  // Returns  {username, first_name, last_name, email}
  // Throws UnauthorizedError is user not found or wrong

  static async authenticate(username, password) {
    // try to find user first
    const result = await db.query(
      `SELECT username, password, first_name, last_name, email
     FROM users
     WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  // Register user with data Returns {username, firstname, lastname, email}

  static async register({ username, password, first_name, last_name, email }) {
    const duplicateCheck = await db.query(
      `SELECT username
         FROM users
         WHERE username = $1`,
      [username]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
         (username,
          password,
          first_name,
          last_name,
          email)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING username, first_name, last_name, email`,
      [username, hashedPassword, first_name, last_name, email]
    );

    const user = result.rows[0];

    return user;
  }
  //   Find all users   returns [{id username, password, first_name, last_name, email}]

  static async getAll() {
    const results = await db.query(
      `SELECT username, password, first_name, last_name, email FROM users`
    );
    const users = results.rows.map(
      (r) =>
        new User(r.username, r.password, r.first_name, r.last_name, r.email)
    );
    return users;
  }

  // Find user by username
  static async getByUsername(username) {
    const results = await db.query(
      `SELECT username, password, first_name, last_name, email FROM users WHERE username = $1`,
      [username]
    );
    const u = results.rows[0];
    if (!u) {
      throw new NotFoundError("User not found", 404);
    }
    return new User(u.username, u.password, u.first_name, u.last_name, u.email);
  }

  // update a user
  static async update(
    newUsername,
    newPassword,
    newFirst_name,
    newLast_name,
    newEmail
  ) {
    const results = await db.query(
      `
    UPDATE users SET username = $1, password = $2, first_name = $3, last_name = $4, email = $5
    WHERE username = $1
    RETURNING username, password, first_name, last_name, email`,
      [newUsername, newPassword, newFirst_name, newLast_name, newEmail]
    );
    if (results.rows.length === 0) {
      throw new NotFoundError("User not found", 404);
    }
    return results.rows[0];
  }

  // delete user
  async remove() {
    await db.query(
      `DELETE FROM users
       WHERE username = $1`,
      [this.username]
    );
  }
}

module.exports = User;

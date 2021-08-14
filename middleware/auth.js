"use strict";

// middleware to handle auth cases

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

// Middleware: Authenticate user.

function authenticateJwt(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    return next();
  } catch (e) {
    return next();
  }
}

// Middleware to use when they must be logged in.

function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) throw new UnauthorizedError();
    return next();
  } catch (e) {
    return next(e);
  }
}

function ensureCorrectUser(req, res, next) {
  try {
    const user = res.locals.user;
    if (!user) throw new UnauthorizedError();
    return next();
  } catch (e) {
    return next(e);
  }
}

module.exports = {
  authenticateJwt,
  ensureLoggedIn,
  ensureCorrectUser,
};

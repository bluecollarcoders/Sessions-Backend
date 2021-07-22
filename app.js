"use strict";

// Express app for sessions

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const { authenticateJwt } = require("./middleware/auth");
const uRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJwt);

app.use("/users", uRoutes);
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);

// Handle 404 errors
app.use(function (req, res, next) {
  // pass err to the next middleware
  return next(new NotFoundError());
});

app.use(function (err, req, res, next) {
  // the default status is 500 internal Server Error
  const status = err.status || 500;
  const message = err.message;

  // set the status and alert the user
  return res.status(status).json({
    error: {
      message,
      status,
    },
  });
});

module.exports = app;

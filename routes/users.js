// Routes for users of sessions

const jsonschema = require("jsonschema");

const express = require("express");
const User = require("../models/users");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const { createToken } = require("../helpers/token");
const userNewSchema = require("../schemas/userNew.json");
const { BadRequestError } = require("../expressError");

const router = express.Router();

router.post("/", ensureLoggedIn, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, userNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const user = await User.register(req.body);
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (e) {
    return next(e);
  }
});

// Get all users
router.get("/", ensureLoggedIn, async (req, res, next) => {
  try {
    let users = await User.getAll();
    return res.json({ users });
  } catch (e) {
    return next(e);
  }
});

// Get /[username] => {user}
router.get("/:username", ensureCorrectUser, async (req, res, next) => {
  try {
    const user = await User.getByUsername(req.params.username);

    return res.json({ user });
  } catch (e) {
    return next(e);
  }
});

// Update user
router.patch("/:username", ensureCorrectUser, async (req, res, next) => {
  try {
    const { password, first_name, last_name, email } = req.body;
    const user = await User.update(
      req.params.username,
      password,
      first_name,
      last_name,
      email
    );
    return res.json(user);
  } catch (e) {
    return next(e);
  }
});

// Delete user
router.delete("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    let user = await User.getByUsername(req.params.username);
    await user.remove();
    return res.json({ message: "Deleted" });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;

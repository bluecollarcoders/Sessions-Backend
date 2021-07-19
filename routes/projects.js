// Routes for projects

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth");
const Projects = require("../models/projectModel");
const projectNewSchema = require("../schemas/projects.json");
const propsalSchema = require("../schemas/proposal.json");

const router = express.Router();

// Get all projects

router.get("/", async function (req, res, next) {
  try {
    const projects = await Projects.getAll();
    return res.json({ projects });
  } catch (e) {
    return next(e);
  }
});

// Get project by id

router.get("/:id", async function (req, res, next) {
  try {
    const projects = await Projects.getById(req.params.id);
    return res.json({ projects });
  } catch (e) {
    return next(e);
  }
});

// Delete a project from {id}

router.delete("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    await Projects.remove(req.params.id);
    return res.json("deleted");
  } catch (e) {
    return next(e);
  }
});

// A user creates a project

router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, projectNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const projects = await Projects.create(req.body);

    return res.status(201).json({ projects });
  } catch (e) {
    return next(e);
  }
});

// Create proposal for project

router.post("/:id/proposal", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, propsalSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const proposals = await Projects.createProposal(req.body);

    return res.status(201).json({ proposals });
  } catch (e) {
    return next(e);
  }
});

// Update project
router.put("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const { title, project_name, project_description, music_link } = req.body;
    const projects = await Projects.update(
      req.params.id,
      title,
      project_name,
      project_description,
      music_link
    );
    return res.json(projects);
  } catch (e) {
    return next(e);
  }
});

module.exports = router;

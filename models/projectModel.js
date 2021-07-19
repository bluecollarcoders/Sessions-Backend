"use strict";

const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");

// Related functions for projects.

class Projects {
  // Create a project ()

  static async create(data) {
    const result = await db.query(
      `INSERT INTO projects (title, project_name, project_description, music_link) VALUES ($1, $2, $3, $4) RETURNING id, title, project_name, project_description, music_link`,
      [data.title, data.project_name, data.project_description, data.music_link]
    );
    let projects = result.rows[0];
    return projects;
  }

  // Gets all projects

  static async getAll() {
    const result = await db.query(
      `SELECT id, title, project_name, project_description, music_link FROM projects`
    );
    return result.rows;
  }

  // Get By Id
  static async getById(id) {
    const result = await db.query(
      ` SELECT title, project_name, project_description, music_link FROM projects WHERE id =$1`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError(`No such project: ${id}`);
    }

    return result.rows[0];
  }

  // Deleting a project
  static async remove(id) {
    const result = await db.query(
      `DELETE FROM projects WHERE id =$1 RETURNING id`,
      [id]
    );
    if (result.rows.length === 0) {
      throw new NotFoundError(`No such project: ${id}`);
    }
  }

  // Updating a project
  static async update(
    id,
    newTitle,
    newProject_name,
    newProject_description,
    newMusic_link
  ) {
    const result = await db.query(
      `UPDATE projects SET title =$1, project_name = $2, project_description = $3, music_link = $4 WHERE id = $5 
      RETURNING id, title, project_name, project_description, music_link`,
      [newTitle, newProject_name, newProject_description, newMusic_link, id]
    );
    if (result.rows.length === 0) {
      throw new NotFoundError("Project not found", 404);
    }
    return result.rows[0];
  }

  // Create a proposal using projects_id :id

  static async createProposal(data) {
    const result = await db.query(
      `INSERT INTO proposals (projects_id, producer_name, proposal_details, contact) VALUES ( $1, $2, $3, $4) 
      RETURNING id, projects_id, producer_name, proposal_details, contact `,
      [
        data.projects_id,
        data.producer_name,
        data.proposal_details,
        data.contact,
      ]
    );

    let proposal = result.rows[0];
    return proposal;
  }
}

module.exports = Projects;

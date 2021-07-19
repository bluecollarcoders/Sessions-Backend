DROP DATABASE IF EXISTS sessions_testdb;

CREATE DATABASE sessions_testdb;

\c sessions_testdb;

DROP TABLE IF EXISTS users;


CREATE TABLE users (
    username VARCHAR(25) PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL
);

DROP TABLE IF EXISTS projects;

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    project_name TEXT NOT NULL,
    project_description TEXT NOT NULL,
    music_link TEXT 
);

DROP TABLE IF EXISTS proposals;

CREATE TABLE proposals (
    id SERIAL PRIMARY KEY,
    projects_id INTEGER NOT NULL REFERENCES projects(id),
    producer_name VARCHAR(50) NOT NULL,
    proposal_details TEXT NOT NULL,
    contact TEXT NOT NULL
);

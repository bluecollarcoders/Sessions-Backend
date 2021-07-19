CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    project_name TEXT NOT NULL,
    project_description TEXT NOT NULL,
    music_link TEXT 
);

CREATE TABLE proposals (
    id SERIAL PRIMARY KEY,
    projects_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    producer_name VARCHAR(50) NOT NULL,
    proposal_details TEXT NOT NULL,
    contact TEXT NOT NULL
);


CREATE TABLE users (
    username VARCHAR(25) PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL
);
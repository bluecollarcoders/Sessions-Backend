DROP DATABASE IF EXISTS sessionsdb;

CREATE DATABASE sessionsdb;

\c sessionsdb;

\i sessions-schema.sql
\i sessions-seed.sql

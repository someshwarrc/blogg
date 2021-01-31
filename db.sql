-- initializing the database with a table for posts
CREATE DATABASE IF NOT EXISTS blog_database;

-- \c blog_database


-- user schema
CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(50),
    password VARCHAR(1000)
);

-- post schema
CREATE TABLE IF NOT EXISTS posts (
    post_id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description VARCHAR(255),
    published_date timestamp DEFAULT CURRENT_TIMESTAMP,
    creator VARCHAR(50),
    FOREIGN KEY (creator) REFERENCES users(username) 
);

const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");

// GET /posts => get all posts
router.get("/", async (req, res) => {
  try {
    const allPosts = await pool.query("SELECT * FROM posts");
    res.json(allPosts.rows); // returning all posts in the table
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
});

// GET /posts/new => render form to create post
router.get("/new", (req, res) => {
  res.sendStatus(200);
});

//POST /posts/new => save post in database
router.post("/new", async (req, res) => {
  try {
    // await
    const { title, description } = req.body;
    const newBlogPost = await pool.query(
      "INSERT INTO \
    posts (title, description, creator) VALUES ($1, $2, $3) RETURNING *",
      [title, description, req.user.username]
    );
    res.json(newBlogPost.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
});

// GET /posts/{id} => details of post
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const postDetails = await pool.query(
      "SELECT * FROM posts WHERE post_id = $1",
      [id]
    );
    res.json(postDetails.rows[0]); // get the specific post
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
});

// PUT /posts/{id}=>update a post
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body; // updated values of title and description

    const updateTodo = await pool.query(
      "UPDATE posts SET title=$1, description=$2 WHERE post_id=$3",
      [title, description, id]
    );

    res.json(updateTodo);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
});

//DELETE /posts/{id} => delete a post
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteTodo = pool.query("DELETE FROM posts WHERE post_id=$1", [id]);
    res.json({ message: "post was successfully deleted" });
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
});

module.exports = router;

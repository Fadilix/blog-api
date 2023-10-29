// const app = require("../index")
const pool = require("../db");

const createPost = async (req, res) => {
    const { title, image, description, user_id, category } = req.body;
    const query = "INSERT INTO posts(title, image, description, user_id, category) VALUES ($1, $2, $3, $4, $5) RETURNING *"
    try {
        const result = await pool.query(query, [title, image, description, user_id, category]);
        const newPost = result.rows[0];
        res.status(201).json({ result: "User created successffully", post: newPost })
    } catch (error) {
        console.error("Error creating user : ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const deletePost = async (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM posts WHERE id = $1";
    const checkPostQuery = "SELECT * FROM posts WHERE id = $1"
    try {
        const checkPost = await pool.query(checkPostQuery, [id]);
        if (checkPost.rows.length <= 0) {
            res.status(404).json({ result: "Post Not Found" })
            return;
        }
        const result = await pool.query(query, [id]);
        res.status(200).json({ result: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user", error);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

const getPosts = async (req, res) => {
    const query = "SELECT * FROM posts"
    try {
        const result = await pool.query(query);
        const allPosts = result.rows
        res.status(200).json({ result: allPosts })
    } catch (error) {
        console.error("Error fetching data", error);
        res.status(500).json({ error: "Internal Server Error" })
    }
}


const editPost = async (req, res) => {
    const { id } = req.params;
    const { title, image, description, category } = req.body;
    const query = "UPDATE posts SET title = $1, image = $2, description = $3, category = $4 WHERE id = $5 RETURNING *"
    try {
        const result = await pool.query(query, [title, image, description, category, id])
        const updatedPost = result.rows[0];
        res.status(200).json({ result: "User updated successfully", updatedPost: updatedPost })
    } catch (error) {
        console.error("Error while updating data", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

}


module.exports = {
    createPost,
    deletePost,
    getPosts,
    editPost
}
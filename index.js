const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { env } = process;
const userController = require("./controllers/userController");
const postController = require("./controllers/postController");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routes //

app.get("/", (req, res) => {
    res.json({ greeting: "Hello, world!!!" })
})
// For the user
app.post("/users", userController.createUser);
app.get("/users", userController.getUsers);
app.delete("/user/:id", userController.deleteUser);
app.put("/user/:id", userController.editUser)

// For the post
app.post("/createpost", postController.createPost);
app.get("/posts", postController.getPosts);
app.delete("/post/:id", postController.deletePost);
app.put("/post/:id", postController.editPost);

const PORT = env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
const pool = require("../db")
const bcrypt = require("bcrypt");

const hashPassword = async (plainTextPassword) => {
    const saltRounds = 10;
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(plainTextPassword, salt);
        return hashedPassword;
    } catch (error) {
        console.error("Error hashing password", error);
        throw error;
    }
}

// Create a new user
const createUser = async (req, res) => {
    const { name, password } = req.body
    const hashedPassword = await hashPassword(password)
    console.log(hashedPassword)
    const query = "INSERT INTO users(name, password) VALUES($1, $2) RETURNING *";
    try {
        const result = await pool.query(query, [name, hashedPassword]);
        const newUser = result.rows[0];
        res.status(201).json({ newUser: newUser });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


// get all the users
const getUsers = async (req, res) => {
    const query = "SELECT * FROM users"
    try {
        const result = await pool.query(query)
        res.status(200).json({ users: result.rows })
    } catch (error) {
        console.error("Error fetching data from database", error);
        res.status(500).json({ error: "Internal Server Error" })
    }
}


// delete a user
const deleteUser = async (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM users WHERE id = $1 "
    try {
        const result = await pool.query(query, [id])
        res.status(200).json({ result: "user deleted sucessfully" })
    } catch (error) {
        console.error("Error deleting user", error);
        res.status(500).json({ error: "Internal Server Error" })
    }
}


// edit a user
const editUser = async (req, res) => {
    const { id } = req.params;
    const { name, password } = req.body
    const hashedPassword = await hashPassword(password);
    const query = "UPDATE users SET name = $1, password = $2 WHERE id = $3 RETURNING *"
    try {

        const checkUserQuery = "SELECT * FROM users WHERE id = $1"
        const checkUser = await pool.query(checkUserQuery, [id])
        if (checkUser.rows.length === 0) {
            res.status(404).json({ error: "User not found" })
            return
        }
        const updateResult = await pool.query(query, [name, hashedPassword, id])
        res.status(200).json({ result: "User udpated successfully", user: updateResult.rows[0] })
    } catch (error) {
        console.error("An Error occured", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

module.exports = {
    createUser,
    getUsers,
    deleteUser,
    editUser,
}
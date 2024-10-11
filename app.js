import express from "express";
import "dotenv/config";
import jwt from "jsonwebtoken";

const app = express();

app.get("/users", (req, res) => {
  // get all users
})

app.get("/users/:id", (req, res) => {
  // get a single user
})

app.post("users/register", (req, res) => {
  // register a new user
})

app.post("/users/login", (req, res) => {
  // authenticate user JWT
})

app.listen(process.env.PORT, () =>
  console.log(`listening on port ${process.env.PORT}`)
);

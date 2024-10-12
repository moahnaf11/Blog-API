import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import "dotenv/config";
import {
  addUser,
  deleteUser,
  getUser,
  getUserProfile,
  updateUser,
} from "../prisma/userQueries.js";

const registerUser = async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body;
  const userRole = role || "USER";
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await addUser(
    firstname,
    lastname,
    email,
    hashedPassword,
    userRole
  );
  res.json({ user });
};

const postLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await getUser(email, password);
  if (!user) {
    // error user not found
    res.status(401).json({ error: "user not found" });
  } else {
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      // error incorrect password
      return res.status(401).json({ error: "incorrect password" });
    } else {
      const payload = { user };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({ token });
    }
  }
};

const getUserDetails = async (req, res) => {
  const user = await getUserProfile(req.params.id);
  if (!user) {
    return res.status(404).json({error: "user not found"})
  }
  res.json(user);
};

const updateUserDetails = async (req, res) => {
  const { firstname, lastname } = req.body;
  const user = await updateUser(req.params.id, firstname, lastname);
  if (!user) {
    return res.status(404).json({error: "user not found, could not update user's details"})
  }
  res.json(user);
};

const deleteTheUser = async (req, res) => {
  const user = await deleteUser(req.params.id);
  if (!user) {
    return res.status(404).json({error: "user not found, could not delete this user"});
  }
  res.json(user);
};

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "token not present" });
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: "invalid token" }); // If token is invalid or expired
      req.user = user; // Attach user information to request
      return next();
    });
  }
}

export {
  postLogin,
  authenticateToken,
  registerUser,
  getUserDetails,
  updateUserDetails,
  deleteTheUser,
};

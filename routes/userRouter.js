import { Router } from "express";
import { deleteTheUser, getUserDetails, postLogin, registerUser, updateUserDetails } from "../controllers/userController.js";
const userRouter = Router({ mergeParams: true });

// register user
userRouter.post("/register", registerUser);

// login user
userRouter.post("/login", postLogin);

// get user profile
userRouter.get("/:id", getUserDetails);

// update user details
userRouter.put("/:id", updateUserDetails);

// delete user and all associated data
userRouter.delete("/:id", deleteTheUser );

export { userRouter };

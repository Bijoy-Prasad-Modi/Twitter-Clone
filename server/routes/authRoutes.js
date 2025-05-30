import express from "express";
import { getMe, login, logout, signup } from "../controllers/authController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/me",protectRoute, getMe);
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

export default router;

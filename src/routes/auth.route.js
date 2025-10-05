import express from "express";
import {
  checkAuth,
  signin,
  signup,
  signout,
  updateUser,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.post("/check", protectRoute, checkAuth);
router.post("/updateUser", protectRoute, updateUser);

export default router;

import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  clear,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.post("/getMessages", protectRoute, getMessages);
router.post("/sendMessage", protectRoute, sendMessage);

export default router;

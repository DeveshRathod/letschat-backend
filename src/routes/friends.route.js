import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  acceptFriend,
  getFriend,
  getFriends,
  getRequests,
  search,
  sendRequest,
} from "../controllers/friends.controller.js";

const router = express.Router();

router.post("/search", protectRoute, search);
router.post("/sendRequest", protectRoute, sendRequest);
router.post("/acceptRequest", protectRoute, acceptFriend);
router.get("/getFriends", protectRoute, getFriends);
router.get("/getRequests", protectRoute, getRequests);
router.post("/getFriend", protectRoute, getFriend);

export default router;

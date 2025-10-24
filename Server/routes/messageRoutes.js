import express from 'express';
import { protectRoute } from '../middleware/Auth.js';
import { getMessage, getUsersForSidebar, markMessageSeen, sendMessage } from '../controllers/messageController.js';

const messageRouter=express.Router();

messageRouter.get("/users",protectRoute,getUsersForSidebar)
messageRouter.get("/:id",protectRoute,getMessage)
messageRouter.put("/mark/:id",protectRoute,markMessageSeen)
messageRouter.post("/send/:id",protectRoute,sendMessage)

export default  messageRouter;


import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  getMyChats,
  newGroupChat,
  getMyGroups,
  addMembers,
  removeMembers,
  leaveGroup,
  sendAttachments,
  getChatDetails,
  renameGroup,
  deleteChat,
} from "../controllers/chat.js";
import { attachmentsMulter } from "../middlewares/multer.js";

const app = express.Router();

// protected routes
app.use(isAuthenticated);
app.post("/new", newGroupChat);
app.get("/my", getMyChats);
app.get("/my/groups", getMyGroups);
app.put("/addmembers", addMembers);
app.put("/removemember", removeMembers);
app.delete("/leave/:id",leaveGroup)
app.post("/message", attachmentsMulter, sendAttachments)
app.route("/:id").get(getChatDetails).put(renameGroup).delete(deleteChat)

export default app;

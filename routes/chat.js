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
  getMessages,
} from "../controllers/chat.js";
import { attachmentsMulter } from "../middlewares/multer.js";
import { addMemberValidator, chatIdValidator, newGroupValidator, removeMemberValidator, renameValidator, sendAttachmentsValidator, validateHandler } from "../lib/validator.js";

const app = express.Router();

// protected routes
app.use(isAuthenticated);
app.post("/new",newGroupValidator(),validateHandler, newGroupChat);
app.get("/my",addMemberValidator(), validateHandler, getMyChats);
app.get("/my/groups", getMyGroups);
app.put("/addmembers", addMemberValidator(), validateHandler,addMembers);
app.put("/removemember", removeMemberValidator(), validateHandler, removeMembers);
app.delete("/leave/:id",chatIdValidator(),validateHandler,leaveGroup)
app.post("/message", attachmentsMulter,sendAttachmentsValidator(),validateHandler, sendAttachments)
app.get("/message/:id",chatIdValidator(),validateHandler,getMessages)
app.route("/:id").get(chatIdValidator(),validateHandler,getChatDetails).put( renameValidator, validateHandler,renameGroup).delete(chatIdValidator,validateHandler,deleteChat)

export default app;

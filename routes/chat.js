import express from "express"
import { isAuthenticated } from "../middlewares/auth.js";
import { newGroupChat } from "../controllers/chat.js";

const app = express.Router();




// protected routes
app.use(isAuthenticated)
app.post("/new", newGroupChat)




export default app;
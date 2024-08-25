import express from "express"
import { connectDB } from "./utils/features.js"
import dotenv from "dotenv"
import { errorMiddleware } from "./middlewares/error.js"
import cookieParser from "cookie-parser"

import userRoute from "./routes/user.js"
import chatRoute from "./routes/chat.js"
import adminRoute from "./routes/admin.js"

dotenv.config({
    path: "./.env"
})
const port = process.env.PORT;
const app = express()
app.use(express.json())
app.use(cookieParser())
export const adminSecretKey = process.env.ADMIN_SECRET_KEY || "Gharat@123"
connectDB(process.env.MONGO_URI)
app.use("/user", userRoute)
app.use("/chat", chatRoute)
app.use("/admin", adminRoute)
app.get("/",(req, res)=> {
    res.send("Hello World");
})
app.use(errorMiddleware)
app.listen(port,()=> {
    console.log("Server Started on PORT 3000")
})


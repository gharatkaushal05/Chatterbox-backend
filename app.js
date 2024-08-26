import express from "express"
import { connectDB } from "./utils/features.js"
import dotenv from "dotenv"
import { errorMiddleware } from "./middlewares/error.js"
import cookieParser from "cookie-parser"
import { Server } from "socket.io"
import {createServer} from "http"
import { v4 as uuid } from "uuid"

import userRoute from "./routes/user.js"
import chatRoute from "./routes/chat.js"
import adminRoute from "./routes/admin.js"
import { NEW_MESSAGE } from "./constants/events.js"

dotenv.config({
    path: "./.env"
})
const port = process.env.PORT;
export const envMode = process.env.NODE_ENV.trim() || "PRODUCTION"
const app = express()
const server = createServer(app)
const io = new Server(server, {})
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

io.on("connection", (socket)=> {

    const user = {
        _id: "asdsda",
        name: "Kaushal"

    }
    console.log("a user connected", socket.id)

    socket.on(NEW_MESSAGE, async ({chatId, members, message})=> {

        const messageForRealTime = {
            content: message,
            _id: uuid(),
            sender: {
                _id: user._id,
                name: user.name,
            },
            chat: chatId,
            createdAt: new Date().toISOString(),
        }
        console.log("New Message", messageForRealTime)
    })

    socket.on("disconnect", ()=> {
        console.log("user disconnected")
    })
})

app.use(errorMiddleware)
server.listen(port,()=> {
    console.log(`Server Started on PORT ${port} in ${envMode} Mode`)
})


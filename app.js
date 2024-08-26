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
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/events.js"
import { getSockets } from "./lib/helper.js"
import { Message } from "./models/message.js"

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
export const userSocketIDs= new Map()
connectDB(process.env.MONGO_URI)
app.use("/user", userRoute)
app.use("/chat", chatRoute)
app.use("/admin", adminRoute)
app.get("/",(req, res)=> {
    res.send("Hello World");
})
io.use((socket, next)=> {})
io.on("connection", (socket)=> {

    const user = {
        _id: "asdsda",
        name: "Kaushal"

    }
    userSocketIDs.set(user._id.toString(), socket.id)
    console.log(userSocketIDs)

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

        const messageForDB = {
            content: message,
            sender: user._id,
            chat: chatId
        }

        const membersSocket = getSockets(members)
        io.to(membersSocket).emit(NEW_MESSAGE, {
            chatId,
            message: messageForRealTime
        });
        io.to(membersSocket).emit(NEW_MESSAGE_ALERT, {chatId})
       try {
        await Message.create(messageForDB)
       } catch (error) {
        console.log(error)
       }
    })

    socket.on("disconnect", ()=> {
        console.log("user disconnected")
        userSocketIDs.delete(user._id.toString())
    })
})

app.use(errorMiddleware)
server.listen(port,()=> {
    console.log(`Server Started on PORT ${port} in ${envMode} Mode`)
})


import express from "express"
import userRoute from "./routes/user.js"
import { connectDB } from "./utils/features.js"
import dotenv from "dotenv"
dotenv.config({
    path: "./.env"
})
const port = process.env.PORT;
const app = express()
app.use(express.json())
connectDB(process.env.MONGO_URI)
app.use("/user", userRoute)
app.get("/",(req, res)=> {
    res.send("Hello World");
})
app.listen(port,()=> {
    console.log("Server Started on PORT 3000")
})


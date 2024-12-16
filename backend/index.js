import express from "express";
import dotenv from "dotenv"
import connectToDatabase from "./database/db.js";
import authRoutes from "./routes/auth.route.js"
import cookieParser from "cookie-parser";
// app reference
const app = express()


dotenv.config()
connectToDatabase()
// middlewares
app.use(express.json()) // allows us to parse the incoming request from json payload or req.body
app.use(cookieParser())
// Port
const Port = process.env.PORT || 5000

app.get("/", (req, res) => {
    res.send("<h1>hey  land</h1>")
})
app.use("/api/auth", authRoutes)
app.listen(Port, () => {

    console.log(`server is ruuning on port 5000`)

})
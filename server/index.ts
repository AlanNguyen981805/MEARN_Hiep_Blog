import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import { createServer } from "http"
import {  Server, Socket } from "socket.io"
import path from "path"

const axios = require('axios')
// Middleware 

const app = express()
app.use(express.json()) // chuyển request body thành JSON
app.use(express.urlencoded({extended: true})) //chuyển đổi request body thành JSON và một vài thứ khác như FORM DATA
app.use(cors())
app.use(morgan('dev')) // giúp ghi log
app.use(cookieParser()) // giúp sử dụng cookie trong express
import routes from "./routes"

// SocketIO
const http = createServer(app)
export const io = new Server(http)
import { SocketServer } from "./config/socket"

io.on("connection", (socket: Socket) => SocketServer(socket))

// Routes 
app.use('/api', routes)

// Database
import './config/database'


// Production Deploy
if(process.env.NODE_ENV === "production") {
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client', 'build', 'index.html'))
    })
}

// Server listening
const PORT = process.env.PORT || 5000
http.listen(PORT, () => {
    console.log('Server running on port', PORT);
})
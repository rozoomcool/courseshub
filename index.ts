import express from 'express';
import prisma from './config/database';
import dotenv from 'dotenv';
import http from 'http';
import { setupSocket } from './websocket/websocket';
import { Server } from 'socket.io';
import cors from "cors";
import { UPLOAD_PATH } from './config/config';
import path from 'path';

dotenv.config();

const app = express();
export const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000/",
      methods: ["GET", "POST"],
      allowedHeaders: ["Authorization"],
      credentials: true,
    },
  });

const corsOptions = {
    origin: '*',
    // methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Authorization"],
    credentials: true
}

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

// app.use(express.static(__dirname));
app.use(express.json());
app.use('/uploads', express.static(path.join(UPLOAD_PATH)));


setupSocket(io)

async function main() {
    server.listen(PORT, async () => {
        console.log(`Courses app listening on port ${PORT}`)
    })
}

main().then(async () => {
    await prisma.$disconnect()
}).catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})


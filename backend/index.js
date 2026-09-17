require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./db");
const teamRoutes = require("./Routes/Team");
const memberRoutes = require("./Routes/Member");
const fileRoutes = require("./Routes/File");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use("/team", teamRoutes);
app.use("/member", memberRoutes);
app.use("/file", fileRoutes);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    const uid = socket.handshake.auth.uid;

    console.log("User connected:", socket.id);
    console.log("Firebase UID:", uid);

    socket.on("join-file", (fileId) => {
        socket.join(fileId);

        console.log(`${uid} joined file room: ${fileId}`);
    });

    socket.on("leave-file", (fileId) => {
        socket.leave(fileId);

        console.log(`${uid} left file room: ${fileId}`);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const startServer = async () => {
    try {
        await connectDB();

        server.listen(5000, () => {
            console.log("Server running on port 5000");
        });

    } catch (error) {
        console.log("Failed to connect to database:", error.message);
    }
};

startServer();
// require("dotenv").config();
// const express = require("express");
// const http = require("http");
// const cors = require("cors");
// const { Server } = require("socket.io");
// const teamRoutes = require("./Routes/Team");

// const app = express();
// require("./db");
// // Create HTTP server from Express app
// const server = http.createServer(app);

// app.use(cors());
// app.use(express.json());

// app.use("/team", teamRoutes);

// // Create Socket.IO server
// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"]
//     }
// });


// // Socket connection
// io.on("connection", (socket) => {
//     console.log("User connected:", socket.id);

//     socket.on("disconnect", () => {
//         console.log("User disconnected:", socket.id);
//     });
// });

// // IMPORTANT: use server.listen, not app.listen
// server.listen(5000, () => {
//     console.log("Server running on port 5000");
// });

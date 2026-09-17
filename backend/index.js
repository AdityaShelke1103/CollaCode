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

// Track users inside each file
const fileUsers = new Map();

io.on("connection", (socket) => {

    const uid = socket.handshake.auth.uid;
    // Join file
    socket.on("join-file", (fileId) => {

        socket.join(fileId);

        // Create user map for this file
        if (!fileUsers.has(fileId)) {
            fileUsers.set(fileId, new Map());
        }

        const users = fileUsers.get(fileId);

        // Store socket ID -> UID
        users.set(socket.id, uid);

        // Send current users to the newly joined user
        socket.emit("file-users", {
            users: Array.from(users.values())
        });

        // Tell everyone else that a new user joined
        socket.to(fileId).emit("user-joined", {
            uid
        });

    });

    // Live code changes
    socket.on("code-change", (data) => {

        socket.to(data.fileId).emit("code-update", {
            content: data.content
        });

    });

    // Leave file
    socket.on("leave-file", (fileId) => {

        removeUserFromFile(socket, fileId);

        socket.leave(fileId);

        console.log(`${uid} left file room: ${fileId}`);
    });

    // Browser/tab closed or connection lost
    socket.on("disconnect", () => {

        for (const [fileId, users] of fileUsers.entries()) {

            if (users.has(socket.id)) {

                removeUserFromFile(socket, fileId);

            }
        }
    });
});

// Remove user from file
const removeUserFromFile = (socket, fileId) => {

    const users = fileUsers.get(fileId);

    if (!users) {
        return;
    }

    const uid = users.get(socket.id);

    users.delete(socket.id);

    // Tell remaining users
    socket.to(fileId).emit("user-left", {
        uid
    });

    // Delete empty file room
    if (users.size === 0) {
        fileUsers.delete(fileId);
    }
};

const startServer = async () => {

    try {

        await connectDB();

        server.listen(5000, () => {
            console.log("Server running on port 5000");
        });

    } catch (error) {

        console.log(
            "Failed to connect to database:",
            error.message
        );

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

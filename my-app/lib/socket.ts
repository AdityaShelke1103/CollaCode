import { io } from "socket.io-client";

const uid =
    typeof window !== "undefined"
        ? localStorage.getItem("uid")
        : null;

const socket = io("http://localhost:5000", {
    transports: ["websocket"],
    auth: {
        uid,
    },
});

export default socket;
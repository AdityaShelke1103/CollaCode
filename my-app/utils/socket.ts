import { io } from "socket.io-client";

export const createSocket = (uid: string) => {
    return io("http://localhost:5000", {
        auth: {
            uid,
        },
    });
};
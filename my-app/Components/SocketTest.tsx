"use client";

import { useEffect } from "react";
import socket from "@/lib/socket";

export default function SocketTest() {
    useEffect(() => {
        const fileId = "test-file-123";

        socket.on("connect", () => {
            console.log("Connected:", socket.id);

            socket.emit("join-file", fileId);

            console.log("Requested to join:", fileId);
        });

        return () => {
            socket.emit("leave-file", fileId);

            socket.off("connect");
        };
    }, []);

    return <div>Socket Room Test</div>;
}
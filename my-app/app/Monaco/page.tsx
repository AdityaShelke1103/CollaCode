"use client";

import Editor from "@monaco-editor/react";
import { useContext, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthContext } from "@/utils/AuthContext";
import { createSocket } from "@/utils/socket";
import type { Socket } from "socket.io-client";

export default function CodeEditor() {
    const searchParams = useSearchParams();
    const fileId = searchParams.get("fileId");

    const { uid } = useContext(AuthContext);

    const [code, setCode] = useState("");
    const [fileName, setFileName] = useState("");
    const [users, setUsers] = useState<string[]>([]);

    const socketRef = useRef<Socket | null>(null);
    const isRemoteChange = useRef(false);

    // Detect language from file extension
    const getLanguage = (fileName: string) => {
        const extension = fileName.split(".").pop()?.toLowerCase();

        const languages: Record<string, string> = {
            js: "javascript",
            jsx: "javascript",
            ts: "typescript",
            tsx: "typescript",

            py: "python",

            java: "java",

            c: "c",
            h: "c",
            cpp: "cpp",
            hpp: "cpp",

            cs: "csharp",

            html: "html",
            css: "css",

            json: "json",
            xml: "xml",

            sql: "sql",

            php: "php",

            go: "go",

            rs: "rust",

            rb: "ruby",

            swift: "swift",

            kt: "kotlin",

            sh: "shell",

            md: "markdown",
        };

        return languages[extension || ""] || "plaintext";
    };

    // Get File
    const getFile = async () => {
        if (!fileId) return;

        try {
            const response = await fetch(
                `http://localhost:5000/file/${fileId}`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch file"
                );
            }

            setCode(data.file.code);
            setFileName(data.file.fileName);

        } catch (error) {
            console.error("Error fetching file:", error);
        }
    };

    useEffect(() => {
        getFile();
    }, [fileId]);

    // Socket connection
    useEffect(() => {
        if (!uid || !fileId) return;

        const socket = createSocket(uid);

        socketRef.current = socket;

        // Connected
        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);

            socket.emit("join-file", fileId);
        });

        // Existing users in the file
        socket.on("file-users", (data) => {
            setUsers(data.users);
        });

        // New user joins
        socket.on("user-joined", (data) => {
            setUsers((prev) => {
                if (prev.includes(data.uid)) {
                    return prev;
                }

                return [...prev, data.uid];
            });
        });

        // User leaves
        socket.on("user-left", (data) => {
            setUsers((prev) =>
                prev.filter((user) => user !== data.uid)
            );
        });

        // Receive code from another user
        socket.on("code-update", (data) => {
            isRemoteChange.current = true;

            setCode(data.content);
        });

        // Disconnected
        socket.on("disconnect", () => {
            console.log("Socket disconnected");
        });

        // Cleanup
        return () => {
            socket.emit("leave-file", fileId);
            socket.disconnect();

            socketRef.current = null;
        };
    }, [uid, fileId]);

    // Send code changes
    const handleCodeChange = (value: string | undefined) => {
        const newCode = value || "";

        setCode(newCode);

        // Don't send changes received from another user
        if (isRemoteChange.current) {
            isRemoteChange.current = false;
            return;
        }

        if (socketRef.current && fileId) {
            socketRef.current.emit("code-change", {
                fileId,
                content: newCode,
            });
        }
    };

    // Save File
    const handleSave = async () => {
        if (!fileId || !uid) return;

        try {
            const response = await fetch(
                `http://localhost:5000/file/${fileId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        code,
                        memberId: uid,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to save file"
                );
            }

            console.log("File saved successfully");

        } catch (error) {
            console.error("Error saving file:", error);
        }
    };

    return (
        <div className="min-h-screen p-4">

            {/* File Name */}
            <div className="mb-3 flex items-center justify-between">

                <h1 className="text-xl font-semibold text-white">
                    {fileName || "Code Editor"}
                </h1>

                {/* Online Users */}
                <div className="text-white">
                    🟢 Online: {users.length}
                </div>

            </div>

            {/* Monaco */}
            <Editor
                height="80vh"
                language={getLanguage(fileName)}
                value={code}
                onChange={handleCodeChange}
                theme="vs-dark"
            />

            {/* Save Button */}
            <div className="flex justify-end mt-4">

                <button
                    onClick={handleSave}
                    className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                    Save
                </button>

            </div>

        </div>
    );
}
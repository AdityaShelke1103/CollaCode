"use client";

import Editor from "@monaco-editor/react";
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthContext } from "@/utils/AuthContext";

export default function CodeEditor() {
    const searchParams = useSearchParams();
    const fileId = searchParams.get("fileId");

    const { uid } = useContext(AuthContext);

    const [code, setCode] = useState("");
    const [fileName, setFileName] = useState("");

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
            <div className="mb-3">
                <h1 className="text-xl font-semibold text-white">
                    {fileName || "Code Editor"}
                </h1>
            </div>

            {/* Monaco */}
            <Editor
                height="80vh"
                language={getLanguage(fileName)}
                value={code}
                onChange={(value) => setCode(value || "")}
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

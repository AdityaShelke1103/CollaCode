"use client";

import React, { useContext, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AuthContext } from "@/utils/AuthContext";

const Page = () => {
    const { uid } = useContext(AuthContext);

    const searchParams = useSearchParams();
    const router = useRouter();

    const teamId = searchParams.get("teamId");

    const [files, setFiles] = useState<any[]>([]);
    const [fileName, setFileName] = useState("");
    const [showCreate, setShowCreate] = useState(false);

    const [renameName, setRenameName] = useState("");
    const [renameFileId, setRenameFileId] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);

    // Get Team Files
    const getTeamFiles = async () => {
        if (!teamId) return;

        try {
            const response = await fetch(
                `http://localhost:5000/team/${teamId}`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch files"
                );
            }

            setFiles(data.files || []);

        } catch (error) {
            console.error("Error fetching files:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTeamFiles();
    }, [teamId]);

    // Create File
    const handleCreateFile = async () => {
        if (!fileName.trim() || !teamId || !uid) return;

        try {
            const response = await fetch(
                "http://localhost:5000/file/create",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        teamId,
                        fileName,
                        code: "console.log('Hello World');",
                        lastModifiedBy: uid,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to create file"
                );
            }

            setFileName("");
            setShowCreate(false);

            getTeamFiles();

        } catch (error) {
            console.error("Error creating file:", error);
        }
    };

    // Open Monaco
    const handleOpenFile = (fileId: string) => {
        router.push(`/Monaco?fileId=${fileId}`);
    };

    // Delete File
    const handleDeleteFile = async (fileId: string) => {
        try {
            const response = await fetch(
                `http://localhost:5000/file/${fileId}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete file"
                );
            }

            getTeamFiles();

        } catch (error) {
            console.error("Error deleting file:", error);
        }
    };

    // Open Rename Modal
    const handleRenameClick = (
        fileId: string,
        currentName: string
    ) => {
        setRenameFileId(fileId);
        setRenameName(currentName);
    };

    // Rename File
    const handleRenameFile = async () => {
        if (!renameFileId || !renameName.trim()) return;

        try {
            const response = await fetch(
                `http://localhost:5000/file/${renameFileId}/rename`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        fileName: renameName,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to rename file"
                );
            }

            setRenameFileId(null);
            setRenameName("");

            getTeamFiles();

        } catch (error) {
            console.error("Error renaming file:", error);
        }
    };

    return (
        <div className="min-h-screen p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">

                <h1 className="text-2xl font-semibold text-white">
                    Team Files
                </h1>

                <button
                    onClick={() => setShowCreate(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Create File
                </button>

            </div>

            {/* Files */}
            <div className="bg-blue-600 rounded-xl p-5">

                <h2 className="text-white text-lg font-semibold mb-5">
                    Files
                </h2>

                {loading ? (

                    <p className="text-white">
                        Loading files...
                    </p>

                ) : files.length === 0 ? (

                    <p className="text-white">
                        No files in this team yet.
                    </p>

                ) : (

                    <div className="flex flex-col gap-4">

                        {files.map((file) => (

                            <div
                                key={file._id}
                                className="bg-white rounded-xl p-5 shadow-lg flex items-center justify-between"
                            >

                                {/* File Information */}
                                <div>

                                    <h3 className="text-lg font-semibold text-black">
                                        📄 {file.fileName}
                                    </h3>

                                    <p className="text-sm text-gray-700 mt-2">
                                        Last modified by:{" "}
                                        {file.lastModifiedBy}
                                    </p>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Created:{" "}
                                        {new Date(
                                            file.createdAt
                                        ).toLocaleString()}
                                    </p>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Last updated:{" "}
                                        {new Date(
                                            file.updatedAt
                                        ).toLocaleString()}
                                    </p>

                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">

                                    <button
                                        onClick={() =>
                                            handleOpenFile(file._id)
                                        }
                                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Open
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleRenameClick(
                                                file._id,
                                                file.fileName
                                            )
                                        }
                                        className="px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                                    >
                                        Rename
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDeleteFile(file._id)
                                        }
                                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

            {/* Create File Modal */}
            {showCreate && (

                <div className="fixed inset-0 flex items-center justify-center bg-black/50">

                    <div className="bg-white p-6 rounded-xl w-96">

                        <h2 className="text-xl font-semibold text-black mb-4">
                            Create File
                        </h2>

                        <input
                            type="text"
                            placeholder="Enter file name"
                            value={fileName}
                            onChange={(e) =>
                                setFileName(e.target.value)
                            }
                            className="w-full border rounded-lg p-3 mb-4 text-black placeholder-gray-500"
                        />

                        <div className="flex justify-end gap-3">

                            <button
                                onClick={() => {
                                    setShowCreate(false);
                                    setFileName("");
                                }}
                                className="px-4 py-2 bg-gray-300 text-black rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleCreateFile}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                            >
                                Create
                            </button>

                        </div>

                    </div>

                </div>

            )}

            {/* Rename File Modal */}
            {renameFileId && (

                <div className="fixed inset-0 flex items-center justify-center bg-black/50">

                    <div className="bg-white p-6 rounded-xl w-96">

                        <h2 className="text-xl font-semibold text-black mb-4">
                            Rename File
                        </h2>

                        <input
                            type="text"
                            value={renameName}
                            onChange={(e) =>
                                setRenameName(e.target.value)
                            }
                            className="w-full border rounded-lg p-3 mb-4 text-black"
                        />

                        <div className="flex justify-end gap-3">

                            <button
                                onClick={() => {
                                    setRenameFileId(null);
                                    setRenameName("");
                                }}
                                className="px-4 py-2 bg-gray-300 text-black rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleRenameFile}
                                className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
                            >
                                Rename
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default Page;


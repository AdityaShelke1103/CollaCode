"use client";

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/utils/AuthContext";
import { useRouter } from "next/navigation";
import SocketTest from "@/Components/SocketTest";

const Page = () => {
    const { uid } = useContext(AuthContext);
    const router = useRouter();

    const [teams, setTeams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [teamName, setTeamName] = useState("");
    const [joinCode, setJoinCode] = useState("");

    const [showCreate, setShowCreate] = useState(false);
    const [showJoin, setShowJoin] = useState(false);

    // Member selection
    const [members, setMembers] = useState<any[]>([]);
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
    const [selectedAction, setSelectedAction] = useState<string | null>(null);

    // ---------------- GET TEAMS ----------------

    const getTeams = async () => {
        if (!uid) return;

        try {
            setLoading(true);

            const response = await fetch(
                `http://localhost:5000/member/teams/${uid}`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch teams");
            }

            setTeams(data.teams || []);

        } catch (error) {
            console.error("Error fetching teams:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTeams();
    }, [uid]);

    // ---------------- CREATE TEAM ----------------

    const handleCreateTeam = async () => {
        if (!teamName.trim() || !uid) return;

        try {
            const response = await fetch(
                "http://localhost:5000/team/create",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        teamName,
                        memberId: uid,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to create team");
            }

            setTeamName("");
            setShowCreate(false);
            getTeams();

        } catch (error) {
            console.error("Error creating team:", error);
        }
    };

    // ---------------- JOIN TEAM ----------------

    const handleJoinTeam = async () => {
        if (!joinCode.trim() || !uid) return;

        try {
            const response = await fetch(
                "http://localhost:5000/team/join",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        joinCode,
                        memberId: uid,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to join team");
            }

            setJoinCode("");
            setShowJoin(false);
            getTeams();

        } catch (error) {
            console.error("Error joining team:", error);
        }
    };

    // ---------------- OPEN TEAM ----------------

    const handleOpenTeam = (teamId: string) => {
        router.push(`/Showfiles?teamId=${teamId}`);
    };

    // ---------------- LEAVE TEAM ----------------

    const handleLeaveTeam = async (teamId: string) => {
        if (!uid) return;

        try {
            const response = await fetch(
                "http://localhost:5000/team/leave",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        teamId,
                        memberId: uid,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to leave team");
            }

            getTeams();

        } catch (error) {
            console.error("Error leaving team:", error);
        }
    };

    // ---------------- GET TEAM MEMBERS ----------------

    const getTeamMembers = async (teamId: string, action: string) => {
        try {
            const response = await fetch(
                `http://localhost:5000/team/members/${teamId}`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch team members"
                );
            }

            setMembers(data.members || []);
            setSelectedTeamId(teamId);
            setSelectedAction(action);

        } catch (error) {
            console.error("Error fetching members:", error);
        }
    };

    // ---------------- MEMBER ACTION ----------------

    const handleMemberAction = async (memberId: string) => {
        if (!uid || !selectedTeamId || !selectedAction) return;

        let url = "";
        let method = "POST";

        if (selectedAction === "makeAdmin") {
            url = "http://localhost:5000/member/make-admin";
            method = "PUT";
        }

        if (selectedAction === "removeAdmin") {
            url = "http://localhost:5000/member/remove-admin";
            method = "PUT";
        }

        if (selectedAction === "removeMember") {
            url = "http://localhost:5000/member/remove";
            method = "POST";
        }

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    teamId: selectedTeamId,
                    adminId: uid,
                    memberId,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Operation failed"
                );
            }

            // Close selection box
            setSelectedTeamId(null);
            setSelectedAction(null);
            setMembers([]);

            // Refresh dashboard
            getTeams();

        } catch (error) {
            console.error("Member action failed:", error);
        }
    };

    return (
        <>
            <SocketTest />
            <div className="min-h-screen p-6">

                {/* HEADER */}

                <div className="flex items-center justify-between mb-8">

                    <h1 className="text-2xl font-semibold text-white">
                        My Teams
                    </h1>

                    <div className="flex gap-3">

                        <button
                            onClick={() => setShowCreate(true)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg"
                        >
                            Create Team
                        </button>

                        <button
                            onClick={() => setShowJoin(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                        >
                            Join Team
                        </button>

                    </div>

                </div>


                {/* TEAMS */}

                <div className="bg-blue-600 rounded-xl p-5">

                    <h2 className="text-white text-lg font-semibold mb-5">
                        Teams Joined
                    </h2>

                    {loading ? (

                        <p className="text-white">
                            Loading teams...
                        </p>

                    ) : teams.length === 0 ? (

                        <p className="text-white">
                            You haven't joined any teams yet.
                        </p>

                    ) : (

                        <div className="flex flex-col gap-4">

                            {teams.map((team) => {

                                const teamInfo = team.teamId;

                                return (

                                    <div
                                        key={teamInfo._id}
                                        className="bg-white rounded-xl p-5 shadow-lg"
                                    >

                                        <h3 className="text-lg font-semibold mb-2 text-black">
                                            {teamInfo.teamName}
                                        </h3>

                                        <p className="text-sm mb-4 text-black">
                                            Team ID: {teamInfo._id}
                                        </p>


                                        {/* BASIC ACTIONS */}

                                        <div className="flex gap-3 flex-wrap">

                                            <button
                                                onClick={() =>
                                                    handleOpenTeam(teamInfo._id)
                                                }
                                                className="px-3 py-2 bg-blue-600 text-white rounded-lg"
                                            >
                                                Open Team
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleLeaveTeam(teamInfo._id)
                                                }
                                                className="px-3 py-2 bg-red-600 text-white rounded-lg"
                                            >
                                                Leave Team
                                            </button>


                                            {/* ADMIN ACTIONS */}

                                            {team.isAdmin && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            getTeamMembers(
                                                                teamInfo._id,
                                                                "makeAdmin"
                                                            )
                                                        }
                                                        className="px-3 py-2 bg-green-600 text-white rounded-lg"
                                                    >
                                                        Make Admin
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            getTeamMembers(
                                                                teamInfo._id,
                                                                "removeAdmin"
                                                            )
                                                        }
                                                        className="px-3 py-2 bg-yellow-600 text-white rounded-lg"
                                                    >
                                                        Remove Admin
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            getTeamMembers(
                                                                teamInfo._id,
                                                                "removeMember"
                                                            )
                                                        }
                                                        className="px-3 py-2 bg-red-700 text-white rounded-lg"
                                                    >
                                                        Remove Member
                                                    </button>
                                                </>
                                            )}

                                        </div>


                                        {/* MEMBER SELECTION */}

                                        {selectedTeamId === teamInfo._id && (
                                            <div className="mt-5 border-t pt-4">

                                                <p className="font-semibold text-black mb-3">
                                                    Select Member
                                                </p>

                                                <div className="flex flex-col gap-2">

                                                    {members.map((member) => (

                                                        <button
                                                            key={member.memberId}
                                                            onClick={() =>
                                                                handleMemberAction(
                                                                    member.memberId
                                                                )
                                                            }
                                                            className="text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-black"
                                                        >
                                                            {member.name ||
                                                                member.memberId}
                                                        </button>

                                                    ))}

                                                </div>

                                                <button
                                                    onClick={() => {
                                                        setSelectedTeamId(null);
                                                        setSelectedAction(null);
                                                        setMembers([]);
                                                    }}
                                                    className="mt-3 text-sm text-gray-600"
                                                >
                                                    Cancel
                                                </button>

                                            </div>
                                        )}

                                    </div>

                                );
                            })}

                        </div>
                    )}

                </div>


                {/* CREATE TEAM MODAL */}

                {showCreate && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50">

                        <div className="bg-white p-6 rounded-xl w-96">

                            <h2 className="text-xl font-semibold text-black mb-4">
                                Create Team
                            </h2>

                            <input
                                type="text"
                                placeholder="Team name"
                                value={teamName}
                                onChange={(e) =>
                                    setTeamName(e.target.value)
                                }
                                className="w-full border rounded-lg p-3 mb-4 text-black placeholder-gray-500"
                            />

                            <div className="flex justify-end gap-3">

                                <button
                                    onClick={() => {
                                        setShowCreate(false);
                                        setTeamName("");
                                    }}
                                    className="px-4 py-2 bg-gray-300 text-black rounded-lg"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleCreateTeam}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                                >
                                    Create
                                </button>

                            </div>

                        </div>

                    </div>
                )}


                {/* JOIN TEAM MODAL */}

                {showJoin && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50">

                        <div className="bg-white p-6 rounded-xl w-96">

                            <h2 className="text-xl font-semibold text-black mb-4">
                                Join Team
                            </h2>

                            <input
                                type="text"
                                placeholder="Enter team code"
                                value={joinCode}
                                onChange={(e) =>
                                    setJoinCode(e.target.value)
                                }
                                className="w-full border rounded-lg p-3 mb-4 text-black placeholder-gray-500"
                            />

                            <div className="flex justify-end gap-3">

                                <button
                                    onClick={() => {
                                        setShowJoin(false);
                                        setJoinCode("");
                                    }}
                                    className="px-4 py-2 bg-gray-300 text-black rounded-lg"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleJoinTeam}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                                >
                                    Join
                                </button>

                            </div>

                        </div>

                    </div>
                )}

            </div>
        </>
    );
};

export default Page;
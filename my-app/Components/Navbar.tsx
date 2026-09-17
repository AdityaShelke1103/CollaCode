"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { AuthContext } from "@/utils/AuthContext";

const Navbar = () => {
    const { userInfo, isLogin } = useContext(AuthContext);
    const [memberId, setMemberId] = useState("");

    useEffect(() => {
        const uid = localStorage.getItem("uid");
        setMemberId(uid || "");
    }, []);

    return (
        <div className="flex items-center justify-between bg-green-700 text-white px-6 py-4 shadow-lg">

            {/* Logo */}
            <div className="font-bold text-xl">
                CollaCode
            </div>

            {/* Welcome */}
            <div className="text-sm font-medium">
                Welcome, {userInfo?.name || "User"}
                {memberId && (
                    <div className="text-xs opacity-80">
                        ID: {memberId}
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-3">

                <Link
                    href="/Dashboard"
                    className="px-4 py-2 bg-white text-green-700 font-semibold rounded-lg hover:bg-gray-100 transition"
                >
                    Return To Teams
                </Link>

                {isLogin && (
                    <Link
                        href="/Logout"
                        className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                    >
                        Logout
                    </Link>
                )}

            </div>

        </div>
    );
};

export default Navbar;
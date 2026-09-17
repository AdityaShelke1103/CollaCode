"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/utils/AuthContext";

export default function LogoutButton() {
    const { setLogin, setUserInfo } = useContext(AuthContext);
    const router = useRouter();

    const handleLogout = () => {
        // Reset React context
        setLogin(false);
        setUserInfo(null);

        // Remove stored login information
        localStorage.clear();

        // Go back to login/home
        router.push("/");
    };

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
}
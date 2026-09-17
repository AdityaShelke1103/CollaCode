"use client";

import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext<any>(null);

const AuthContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {

    const [isLogin, setLogin] = useState(false);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [uid, setUid] = useState<any>(null);

    useEffect(() => {
        const loginData = localStorage.getItem("isLogin");
        const userInfoData = localStorage.getItem("userInfo");
        const uid = localStorage.getItem("uid");

        if (loginData === "true") {
            setLogin(true);
        }

        if (userInfoData) {
            setUserInfo(JSON.parse(userInfoData));
        }

        if (uid) {
            setUid(uid);
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isLogin,
                setLogin,
                userInfo,
                setUserInfo,
                uid,
                setUid,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
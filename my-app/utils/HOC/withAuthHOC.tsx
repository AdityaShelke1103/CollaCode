"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../AuthContext";

const withAuthHOC = (Component: any) => {
    return (props: any) => {

        const { setLogin } = useContext(AuthContext);
        const router = useRouter();

        useEffect(() => {
            const isLogin = localStorage.getItem("isLogin");

            if (!isLogin) {
                setLogin(false);
                localStorage.clear();
                router.push("/");
                return;
            }
        }, [router, setLogin]);

        return <Component {...props} />;
    };
};

export default withAuthHOC;

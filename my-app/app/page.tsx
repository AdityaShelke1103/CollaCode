"use client";

import { auth, googleProvider } from "@/utils/firebase";
import { signInWithPopup } from "firebase/auth";
import { useContext } from "react";
import { AuthContext } from "@/utils/AuthContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const {
    isLogin,
    setLogin,
    setUserInfo,
    userInfo,
    uid,
    setUid
  } = useContext(AuthContext);

  const router = useRouter();

  const handlelogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const user = result.user;
      const uid = user.uid;
      const userData = {
        email: user.email,
        name: user.displayName,
        photo: user.photoURL,
      };

      setLogin(true);
      setUserInfo(userData);
      setUid(user.uid);

      localStorage.setItem("isLogin", "true");
      localStorage.setItem(
        "userInfo",
        JSON.stringify(userData)
      );
      localStorage.setItem("uid", user.uid);
      router.push("/Dashboard");

    } catch (error) {
      console.log(error);
    }
  };

  // Already logged in
  if (isLogin) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-xl font-semibold mb-3">
          You're already logged in
        </h1>

        <p className="mb-5">
          Logged in with{" "}
          <span className="font-semibold">
            {userInfo?.email}
          </span>
        </p>

        <button
          onClick={() => router.push("/Dashboard")}
          className="p-3 bg-blue-600 text-white rounded-lg"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  // Not logged in
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-center font-semibold text-lg mb-5">
        Collaborative Code Editor
      </div>

      <button
        onClick={handlelogin}
        className="p-4 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700"
      >
        Login with Google
      </button>
    </div>
  );
}
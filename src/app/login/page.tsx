"use client";
import React, { useEffect, useState } from "react";
import { auth, provider } from "../firebase/firebase";
import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { permanentRedirect, redirect } from "next/navigation";

export interface FormAlert {
  type?: "SUCCESS" | "WARNING" | "FAILURE";
  show: boolean;
  message?: string;
}

export default function Login() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      permanentRedirect("/");
    }
  }, [token]);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken || null;
      const user = result.user;
      setUser(user);
      setToken(accessToken);
    } catch (error) {
      console.error("Error during sign in:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      {user && <span>Logged in as {user.displayName}!</span>}
      <span
        onClick={handleGoogleSignIn}
        className="flex items-center justify-center hover:cursor-pointer w-[20%] h-[6%] bg-blue-500 text-lg"
      >
        Sign in with Google
      </span>
    </div>
  );
}

"use client";
import { pSBC } from "@/util/pSBC";
import { permanentRedirect } from "next/navigation";
import React, { useState } from "react";

export interface FormAlert {
  type?: "SUCCESS" | "WARNING" | "FAILURE";
  show: boolean;
  message?: string;
}

export default function SignIn() {
  const [submitted, setSubmitted] = useState(false);
  const [alert, setAlert] = useState<FormAlert>({
    show: false,
  });

  const handleSubmit = async (formData: FormData) => {
    const res = await fetch(`/users/signin/submit`, {
      method: "POST",
      body: JSON.stringify({
        username: formData.get("username"),
        password: formData.get("password"),
      }),
    });

    const data = await res.json();

    if (res.status === 200) {
      setSubmitted(true);
      setAlert({
        show: true,
        type: "SUCCESS",
        message: `Successfully logged in. Redirecting to home page...`,
      });
      localStorage.setItem("sessionToken", data.sessionToken);

      permanentRedirect("/");
    } else {
      setAlert({
        show: true,
        type: "FAILURE",
        message: `${data.message} Try again.`,
      });
    }
  };

  return (
    <div className="flex justify-center items-center w-[100vw] h-[100vh]">
      <div className="flex flex-col justify-start items-center bg-black/20 w-[80vw] h-[70vh]">
        <span className="flex flex-col justify-center items-center my-[2vh]">
          <span className="mb-[1vh]">
            <h1 className="text-2xl font-base">BRAND PLACEHOLDER</h1>
          </span>
          <span>
            <h1 className="text-xl font-base">Sign in to start listening!</h1>
          </span>
        </span>

        {alert.show && (
          <span
            className="flex justify-center items-center px-[2vh] min-h-[6vh] max-h-[8vh] rounded-[8px] mt-[1vh] mb-[4vh]"
            style={{
              backgroundColor:
                alert.type === "FAILURE"
                  ? `${pSBC(0.85, "#ff0044", "#141414")}`
                  : alert.type === "SUCCESS"
                  ? `${pSBC(0.85, "#00ff73", "#141414")}`
                  : alert.type === "WARNING"
                  ? `${pSBC(0.85, "#ffe100", "#141414")}`
                  : `#141414`,
              color:
                alert.type === "FAILURE"
                  ? `${pSBC(0.2, "#ff0044", "#141414")}`
                  : alert.type === "SUCCESS"
                  ? `${pSBC(0.2, "#00ff73", "#141414")}`
                  : alert.type === "WARNING"
                  ? `${pSBC(0.2, "#ffe100", "#141414")}`
                  : "white",
              border:
                alert.type === "FAILURE"
                  ? `2px solid ${pSBC(0.2, "#ff0044", "#141414")}`
                  : alert.type === "SUCCESS"
                  ? `2px solid ${pSBC(0.2, "#00ff73", "#141414")}`
                  : alert.type === "WARNING"
                  ? `2px solid ${pSBC(0.2, "#ffe100", "#141414")}`
                  : "2px solid white",
            }}
          >
            {alert.message || ""}
          </span>
        )}

        <form
          action={handleSubmit}
          className="flex flex-col items-center justify-center"
        >
          <input
            className="username min-w-[40vw] max-w-[50vw] min-h-[6vh] max-h-[8vh] rounded-[8px] bg-black/60 hover:bg-black/30 hover:cursor-pointer focus:outline-none focus:ring ring-white/60 transition-shadow indent-10 placeholder:white/80 mb-[2vh]"
            type="text"
            placeholder="Username"
            name="username"
            disabled={submitted}
            required
          />

          <input
            className="password min-w-[40vw] max-w-[50vw] min-h-[6vh] max-h-[8vh] rounded-[8px] bg-black/60 hover:bg-black/30 hover:cursor-pointer focus:outline-none focus:ring ring-white/60 transition-shadow indent-10 placeholder:white/80"
            type="password"
            placeholder="Password"
            name="password"
            disabled={submitted}
            required
          />

          <p className="mt-[4vh]">
            {"Don't have an account? "}
            <a className="text-blue-500 hover:underline" href="/users/signup/">
              Register
            </a>
          </p>

          <button
            type="submit"
            className="my-[1vh] text-lg px-[2vw] py-[1vh] border-2 rounded-full"
            disabled={submitted}
            onClick={() => setAlert({ show: false })}
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

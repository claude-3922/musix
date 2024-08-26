"use client";

import { pSBC } from "@/util/pSBC";
import React, { useRef, useState } from "react";
import { FormAlert } from "../signin/page";

export default function SignUp() {
  const password = useRef<HTMLInputElement | null>(null);
  const confirmation = useRef<HTMLInputElement | null>(null);

  const [submitted, setSubmitted] = useState(false);
  const [alert, setAlert] = useState<FormAlert>({
    show: false,
  });

  const handleSubmit = async (formData: FormData) => {
    if (
      password.current &&
      confirmation.current &&
      password.current.value !== confirmation.current.value
    ) {
      return setAlert({
        show: true,
        type: "WARNING",
        message: "Make sure the password and the confirmation match.",
      });
    }

    const res = await fetch(`/users/signup/submit`, {
      method: "POST",
      body: JSON.stringify({
        username: formData.get("username"),
        password: formData.get("password"),
      }),
    });

    const data = await res.json();

    if (res.status === 200) {
      setAlert({
        show: true,
        type: "SUCCESS",
        message: "Account creation successful. You can now login.",
      });
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
            <h1 className="text-xl font-base">Register a new account</h1>
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
            minLength={4}
            maxLength={32}
            required
          />

          <input
            ref={password}
            className="password min-w-[40vw] max-w-[50vw] min-h-[6vh] max-h-[8vh] rounded-[8px] bg-black/60 hover:bg-black/30 hover:cursor-pointer focus:outline-none focus:ring ring-white/60 transition-shadow indent-10 placeholder:white/80 mb-[2vh]"
            type="password"
            placeholder="Password"
            name="password"
            disabled={submitted}
            minLength={8}
            required
          />

          <input
            ref={confirmation}
            className="password min-w-[40vw] max-w-[50vw] min-h-[6vh] max-h-[8vh] rounded-[8px] bg-black/60 hover:bg-black/30 hover:cursor-pointer focus:outline-none focus:ring ring-white/60 transition-shadow indent-10 placeholder:white/80"
            type="password"
            placeholder="Confirm Password"
            disabled={submitted}
            minLength={8}
            required
          />

          <p className="mt-[4vh]">
            {"Already have an account? "}
            <a className="text-blue-500 hover:underline" href="/users/signin/">
              Login
            </a>
          </p>

          <button
            type="submit"
            className="my-[1vh] text-lg px-[2vw] py-[1vh] border-2 rounded-full"
            disabled={submitted}
            onClick={() => setAlert({ show: false })}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

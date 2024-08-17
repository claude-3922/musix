/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";

export default function Extras() {
  return (
    <div className="flex flex-row justify-center items-center">
      <button>
        <img src="/icons/heart.svg" height={48} width={48}></img>
      </button>
      <button className="border-2">LOOP</button>
      <button className="border-2">VOLUME</button>
      <input type="range" />
    </div>
  );
}

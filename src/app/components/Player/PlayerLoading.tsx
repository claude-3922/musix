/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
"use client";

import { COLORS } from "@/util/enums/colors";
import { pSBC } from "@/util/pSBC";
import React from "react";

export default function PlayerLoading() {
  return (
    <div
      style={{
        backgroundColor: `${pSBC(0.4, COLORS.BG, "#000000")}`,
      }}
      className="h-full w-full"
    >
      Nothing playing
    </div>
  );
}

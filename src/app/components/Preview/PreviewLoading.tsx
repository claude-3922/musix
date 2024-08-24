/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React from "react";

export default function PreviewLoading() {
  return (
    <div className="flex items-center bg-custom_black rounded-[4px] justify-center w-[100vw] h-[77.5vh] my-[2vh] overflow-y-scroll">
      <div className="animate-pulse flex bg-black/20 w-[50vw] h-[50vh] rounded-xl"></div>
    </div>
  );
}

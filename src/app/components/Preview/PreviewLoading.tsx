/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React from "react";

export default function PreviewLoading() {
  return (
    <div className="flex items-center justify-center w-[40vw] h-[50vh] bg-black mt-[2vh] rounded-xl">
      <span className="flex items-center justify-center border-4 rounded-xl h-[6rem] w-[6rem]">
        <img
          className="object-fit invert"
          src="/icons/loading.gif"
          width={150}
          height={150}
        ></img>
      </span>
    </div>
  );
}

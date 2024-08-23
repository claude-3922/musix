import React from "react";
import { SongData } from "@/util/types/SongData";

interface TitleProps {
  data: SongData;
}

export default function Title({ data }: TitleProps) {
  const { vid, owner, playerInfo } = data;

  return (
    <div className="flex flex-col items-start justify-center">
      <span className="flex whitespace-nowrap overflow-hidden justify-start w-[20vw] mx-[1vw]">
        {vid.title.length > 35 ? (
          <h1 className="flex justify-start text-base animateTitle">
            {vid.title}
          </h1>
        ) : (
          <h1 className="flex justify-start text-base">{vid.title}</h1>
        )}
      </span>
      <span>
        <h1 className="flex justify-start text-sm mx-[1vw]">{owner.title}</h1>
      </span>
    </div>
  );
}

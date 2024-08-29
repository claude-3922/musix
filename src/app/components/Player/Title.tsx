import React from "react";
import { SongData } from "@/util/types/SongData";

interface TitleProps {
  data: SongData;
}

export default function Title({ data }: TitleProps) {
  const { vid, owner } = data;

  return (
    <div className="flex flex-col items-start justify-center">
      <span className="flex whitespace-nowrap overflow-hidden justify-start w-[20vw] mx-[1vw]">
        <a href={vid.url} className="hover:underline" target="_blank">
          {vid.title.length > 36 ? (
            <h1 className="flex justify-start text-base animateTitle">
              {vid.title}
            </h1>
          ) : (
            <h1 className="flex justify-start text-base">{vid.title}</h1>
          )}
        </a>
      </span>
      <span>
        <a href={owner.url} className="hover:underline" target="_blank">
          <h1 className="flex justify-start text-sm mx-[1vw]">{owner.title}</h1>
        </a>
      </span>
    </div>
  );
}

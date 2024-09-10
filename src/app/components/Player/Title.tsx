import React from "react";
import { SongData } from "@/util/types/SongData";

interface TitleProps {
  data: SongData;
}

export default function Title({ data }: TitleProps) {
  return (
    <div className="flex flex-col items-start justify-center">
      <span className="flex whitespace-nowrap overflow-hidden justify-start w-[24vw] mx-[1vw]">
        <a href={data.url} className="hover:underline" target="_blank">
          {data.title.length > 36 ? (
            <h1 className="flex justify-start text-base animateTitle">
              {data.title}
            </h1>
          ) : (
            <h1 className="flex justify-start text-base">{data.title}</h1>
          )}
        </a>
      </span>
      <span className="flex whitespace-nowrap overflow-hidden justify-start w-[24vw] mx-[1vw]">
        <a href={""} className="hover:underline" target="_blank">
          {data.artist.name.length > 30 ? (
            <h1 className="animateTitle flex justify-start text-sm">
              {data.artist.name}
            </h1>
          ) : (
            <h1 className="flex justify-start text-sm">{data.artist.name}</h1>
          )}
        </a>
      </span>
    </div>
  );
}

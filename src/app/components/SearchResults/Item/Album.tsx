import React from "react";
import Image from "next/image";
import { AlbumData } from "@/util/types/AlbumData";

interface AlbumProps {
  data: AlbumData;
}

export default function Album({ data }: AlbumProps) {
  return (
    <div className="flex flex-col items-center justify-center min-w-[19.84%] max-w-[19.84%] min-h-full max-h-full bg-white/[5%] overflow-hidden gap-1 snap-always snap-start">
      <span className="max-w-[55%] mt-2">
        <Image
          className="object-cover"
          width={200}
          height={200}
          src={data.thumbnail}
          alt={data.name}
        />
      </span>
      <span className="flex flex-col items-center justify-center grow min-h-[40%] w-[90%]">
        <span className="albumCardContainerTitle w-full text-center">
          <style>
            {`.albumCardContainerTitle {
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: normal;
                        display: -webkit-box;
                      }`}
          </style>
          <p>{data.name}</p>
        </span>
        <span className="flex items-center justify-center text-sm opacity-60 gap-1 whitespace-nowrap">
          <p>{data.year}</p>
          <p>•</p>
          <p>{data.artist.name.length === 0 ? "-" : data.artist.name}</p>
        </span>
      </span>
    </div>
  );
}

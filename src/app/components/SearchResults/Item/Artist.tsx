import React from "react";
import Image from "next/image";
import { ArtistData } from "@/util/types/ArtistData";

interface ArtistProps {
  data: ArtistData;
}

export default function Artist({ data }: ArtistProps) {
  return (
    <div className="flex flex-col items-center justify-center min-w-[19.84%] max-w-[19.84%] min-h-full max-h-full bg-white/[5%] overflow-hidden py-2 snap-always snap-start">
      <span className="block w-auto h-auto max-w-[60%]">
        <Image
          className="object-cover rounded-full"
          width={200}
          height={200}
          src={data.thumbnail}
          alt={data.name}
        />
      </span>
      <span className="flex flex-col items-center justify-center grow min-h-[40%] min-w-full py-2">
        <span className="flex flex-col items-center justify-center grow w-full">
          <span className="artistCardContainerTitle w-full text-center">
            <style>
              {`.artistCardContainerTitle {
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
        </span>
        <span className="flex items-center justify-center text-sm opacity-60 gap-1 whitespace-nowrap">
          <p>Artist</p>
        </span>
      </span>
    </div>
  );
}

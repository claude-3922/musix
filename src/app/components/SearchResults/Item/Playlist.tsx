import { PlaylistMetadata } from "@/util/types/PlaylistData";
import React from "react";
import OverlayIcon from "../../Util/OverlayIcon";
import { MoreVertical } from "../../Icons/Icons";

interface PlaylistProps {
  data: PlaylistMetadata;
}

export default function Playlist({ data }: PlaylistProps) {
  return (
    <div
      className="flex items-center justify-start h-[25%] w-full bg-white/[5%]"
      onContextMenu={(e) => {}}
    >
      <OverlayIcon
        optionalYoutubeId={data.id}
        thumbnailURL={data.thumbnail}
        width={"5vw"}
        height={"5vw"}
        iconStyle={{
          overflow: "hidden",
          margin: "1%",
        }}
      ></OverlayIcon>

      <span className="flex flex-col items-start justify-center grow whitespace-nowrap text-ellipsis max-w-[80%] overflow-hidden">
        <span className="flex items-center justify-start w-full h-[50%] gap-1">
          {data.name}
        </span>
        <h1 className="text-sm">{data.owner.name}</h1>
      </span>
      <span className="flex items-center justify-end gap-2 min-w-[16%] max-w-[50%] h-full">
        <h1 className="text-sm opacity-50">Playlist</h1>

        <span
          //type="button"
          className="flex items-center justify-center relative hover:cursor-pointer w-[20%] h-full hover:scale-110"
        >
          <MoreVertical size={"24px"} opacity={0.8} />
        </span>
      </span>
    </div>
  );
}

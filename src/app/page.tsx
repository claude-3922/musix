"use client";
import { useState } from "react";
import { Player, PlayerProps } from "./components/Player";

export default function Home() {
  const [id, setId] = useState("");
  const [songDataLoaded, setSongDataLoaded] = useState(false);
  const [songData, setSongData] = useState<PlayerProps>({
    vid: {
      id: "",
      url: "",
      title: "-",
      thumbnail: {
        main: "",
        alt: "",
      },
    },
    owner: {
      title: "-",
      url: "",
      thumbnail: {
        main: "",
        alt: "",
      },
    },
    playerInfo: {
      volume: -1,
      loop: false,
      vidEnabled: false,
    },
  });

  const handleLoadStart = async (songId: string) => {
    const res = await fetch(`/data?id=${songId}`, {
      method: "POST",
      body: JSON.stringify({
        def_vid_thumbnail: `/def_vid_thumbnail.png`,
        def_ch_thumbnail: `/def_ch_thumbnail.png`,
        volume: 0.5,
        loop: false,
        vidEnabled: true,
      }),
    });

    if (res.status === 200) {
      const data: PlayerProps = await res.json();
      console.log(data);
      setSongData(data);
      setSongDataLoaded(true);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <input
          id=""
          onChange={(e) => (e.target.id = e.target.value)}
          className="border-2 p-2"
          type="text"
          placeholder="enter song id here"
        />
        <button
          type="submit"
          className="border-2 p-2"
          onClick={() => {
            setId(document.getElementsByTagName("input")[0].id);
          }}
        >
          Play
        </button>

        <audio
          autoPlay
          src={`/media?id=${id}&vid=0`}
          onLoadStart={() => handleLoadStart(id)}
        />

        {songDataLoaded && (
          <Player
            vid={songData.vid}
            owner={songData.owner}
            playerInfo={songData.playerInfo}
          />
        )}
      </div>
    </>
  );
}

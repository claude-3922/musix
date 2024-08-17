"use client";

import { Suspense, useRef, useState } from "react";
import { Player } from "./components/Player/Player";
import PlayerLoading from "./components/Player/PlayerLoading";

export default function Home() {
  const [id, setId] = useState("");
  const [vid, setVid] = useState(false);

  const audioPlayer = useRef<HTMLAudioElement | null>(null);

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <input
          id=""
          name="songId"
          onChange={(e) => (e.target.id = e.target.value)}
          className="border-2 p-2 bg-custom_black"
          type="text"
          placeholder="enter song id here"
        />
        <button
          type="submit"
          className="border-2 p-2"
          onClick={() => {
            setId(document.getElementsByName("songId")[0].id);
          }}
        >
          Play
        </button>
        <label>
          Vid?
          <input
            type="checkbox"
            name="vidEnabled"
            onChange={(e) => {
              console.log(e.target.checked);
              setVid(e.target.checked);
            }}
          />
        </label>

        <audio
          autoPlay
          id="audioPlayer"
          ref={audioPlayer}
          src={`/media?id=${id}&vid=0`}
        />

        <Suspense fallback={<PlayerLoading />}>
          <Player
            songId={id}
            vidEnabled={vid}
            audioPlayer={audioPlayer.current || null}
          />
        </Suspense>
      </div>
    </>
  );
}

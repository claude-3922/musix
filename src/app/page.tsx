"use client";

import { ReactElement, Suspense, useRef, useState } from "react";
import { Player } from "./components/Player/Player";
import PlayerLoading from "./components/Player/PlayerLoading";
import Preview from "./components/Preview/Preview";
import PreviewLoading from "./components/Preview/PreviewLoading";
import Main from "./components/Main/Main";

export default function Home() {
  const [id, setId] = useState("");
  const [vid, setVid] = useState(false);

  const [showPreview, setShowPreview] = useState(false);

  const audioPlayer = useRef<HTMLAudioElement | null>(null);

  const togglePreview = (b: boolean) => {
    setShowPreview(b);
  };

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
              setVid(e.target.checked);
            }}
          />
        </label>

        <audio
          id="audioPlayer"
          ref={audioPlayer}
          src={id.length > 0 ? `/media?id=${id}&vid=0` : ``}
        />

        {showPreview ? (
          <Preview
            songId={id}
            vidEnabled={vid}
            audioPlayer={audioPlayer.current || null}
          />
        ) : (
          <Main></Main>
        )}

        <Suspense fallback={<PlayerLoading />}>
          <Player
            songId={id}
            audioPlayer={audioPlayer.current || null}
            vidEnabled={vid}
            callTogglePreview={togglePreview}
          />
        </Suspense>
      </div>
    </>
  );
}

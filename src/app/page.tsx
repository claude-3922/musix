"use client";

import { useEffect, useRef, useState } from "react";
import { Player } from "./components/Player/Player";

import Preview from "./components/Preview/Preview";

import Main from "./components/Main/Main";
import SearchResults from "./components/SearchResults/SearchResults";
import { SongData } from "@/util/types/SongData";

import useStateManager from "./hooks/StateManager";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const [query, setQuery] = useState<string>("");
  const [vid, setVid] = useState<boolean>(false);

  const songState = useStateManager<SongData | null>(null);

  const previewState = useStateManager<boolean>(false);
  const searchResultState = useStateManager<boolean>(false);

  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioPlayer) return;

    let audioContext: AudioContext | null = null;
    let source: MediaElementAudioSourceNode | null = null;
    let convolver: ConvolverNode | null = null;

    async function init(player: HTMLAudioElement) {
      audioContext = new window.AudioContext();
      source = audioContext.createMediaElementSource(player);
      convolver = audioContext.createConvolver();

      const res = await fetch(`/sounds/reverb_ir3.wav`);
      const undecodedAudio = await res.arrayBuffer();
      const decodedAudio = await audioContext.decodeAudioData(undecodedAudio);

      convolver.buffer = decodedAudio;

      source.connect(convolver);
      convolver.connect(audioContext.destination);
    }

    init(audioPlayer);

    return () => {
      if (convolver) convolver.disconnect();
      if (source) source.disconnect();
      if (audioContext) audioContext.close().catch(console.log);
    };
  }, [audioPlayer]);

  return (
    <>
      {songState.get ? (
        <audio
          id="audioPlayer"
          ref={(el) => setAudioPlayer(el)}
          src={`/media?id=${songState.get.vid.id}&vid=0`}
          preload="auto"
        />
      ) : (
        <></>
      )}

      <div className="flex flex-col items-center justify-between">
        <nav className="flex flex-row items-center justify-between">
          <input
            id=""
            name="searchQuery"
            onChange={(e) => (e.target.id = e.target.value)}
            className="border-2 p-2 bg-custom_black"
            type="text"
            placeholder="search a song"
          />
          <button
            type="submit"
            className="border-2 p-2"
            onClick={() => {
              setQuery(document.getElementsByName("searchQuery")[0].id);
              searchResultState.set(true);
              previewState.set(false);
            }}
          >
            Search
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
        </nav>

        <main className="overflow-hidden">
          <AnimatePresence mode="wait">
            {previewState.get ? (
              <motion.div
                key="preview"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ duration: 0.125 }}
              >
                <Preview
                  songData={songState.get}
                  vidEnabled={vid}
                  audioPlayer={audioPlayer || null}
                />
              </motion.div>
            ) : searchResultState.get ? (
              <SearchResults
                query={query}
                searchResultState={searchResultState}
                songState={songState}
              />
            ) : (
              <Main songState={songState} />
            )}
          </AnimatePresence>
        </main>

        <div className="flex items-center justify-center w-[100vw]">
          {
            <Player
              audioPlayer={audioPlayer || null}
              songState={songState}
              previewState={previewState}
            />
          }
        </div>
      </div>
    </>
  );
}

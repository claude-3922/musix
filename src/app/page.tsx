"use client";

import { useEffect, useRef, useState } from "react";
import { Player } from "./components/Player/Player";

import Preview from "./components/Preview/Preview";

import Main from "./components/Main/Main";
import SearchResults from "./components/SearchResults/SearchResults";
import { SongData } from "@/util/types/SongData";

import useStateManager from "./hooks/StateManager";
import { AnimatePresence, motion } from "framer-motion";
import { PAGE_STATES } from "@/util/enums/pageState";
import { COLORS } from "@/util/enums/colors";

export default function Home() {
  const [query, setQuery] = useState<string>("");
  const [vid, setVid] = useState<boolean>(false);

  const songState = useStateManager<SongData | null>(null);

  const pageState = useStateManager<PAGE_STATES>(PAGE_STATES.Main);

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

      convolver = null;

      source.connect(audioContext.destination);
    }

    init(audioPlayer);

    return () => {
      if (convolver) convolver.disconnect();
      if (source) source.disconnect();
      if (audioContext) audioContext.close().catch(console.log);
    };
  }, [audioPlayer]);

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full"
      onContextMenu={(e) => e.preventDefault()}
    >
      {songState.get ? (
        <audio
          id="audioPlayer"
          ref={(el) => setAudioPlayer(el)}
          src={`/media?id=${songState.get.id}&vid=0`}
          preload="auto"
        />
      ) : (
        <></>
      )}

      <nav className="flex flex-row items-center justify-center h-[6%]">
        <input
          id=""
          name="searchQuery"
          onChange={(e) => {
            e.target.id = e.target.value;
          }}
          className="border-2 p-2 bg-white/10"
          type="text"
          placeholder="search a song"
        />
        <button
          type="submit"
          className="border-2 p-2"
          onClick={() => {
            setQuery(document.getElementsByName("searchQuery")[0].id);
            pageState.set(PAGE_STATES.Search);
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

      <main
        className="relative overflow-y-scroll w-full grow min-h-[80%] max-h-[90%]"
        style={{ backgroundColor: `${COLORS.BG}` }}
      >
        <AnimatePresence mode="wait">
          {pageState.get === PAGE_STATES.Main && <Main songState={songState} />}
          {pageState.get === PAGE_STATES.Search && (
            <SearchResults
              query={query}
              songState={songState}
              pageState={pageState}
            />
          )}
          {pageState.get === PAGE_STATES.Preview && (
            <motion.div
              className="w-full h-full flex items-center justify-center"
              key="previewWindow"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ duration: 0.125 }}
            >
              <Preview
                songData={songState.get}
                vidEnabled={vid}
                audioPlayer={audioPlayer || null}
                songState={songState}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <div className=" h-[11%] w-full">
        <Player
          audioPlayer={audioPlayer || null}
          songState={songState}
          pageState={pageState}
        />
      </div>
    </div>
  );
}

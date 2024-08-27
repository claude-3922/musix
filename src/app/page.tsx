"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Player } from "./components/Player/Player";
import PlayerLoading from "./components/Player/PlayerLoading";
import Preview from "./components/Preview/Preview";

import Main from "./components/Main/Main";
import SearchResults from "./components/SearchResults/SearchResults";
import SearchResultsLoading from "./components/SearchResults/SearchResultsLoading";
import { SongData } from "@/util/types/SongData";
import PreviewLoading from "./components/Preview/PreviewLoading";
import { StateManager } from "@/util/types/StateManager";
import useStateManager from "./hooks/StateManager";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const [query, setQuery] = useState<string>("");
  const [vid, setVid] = useState<boolean>(false);

  const songState = useStateManager<SongData | null>(null);
  const playerState = useStateManager<boolean>(false);
  const previewState = useStateManager<boolean>(false);
  const searchResultState = useStateManager<boolean>(false);

  const audioPlayer = useRef<HTMLAudioElement | null>(null);

  return (
    <>
      <audio
        id="audioPlayer"
        ref={audioPlayer}
        src={songState.get ? `/media?id=${songState.get.vid.id}&vid=0` : ``}
      />
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
                  audioPlayer={audioPlayer.current || null}
                />
              </motion.div>
            ) : searchResultState.get ? (
              <SearchResults
                query={query}
                searchResultState={searchResultState}
                songState={songState}
                playerState={playerState}
              />
            ) : (
              <Main playerState={playerState} songState={songState} />
            )}
          </AnimatePresence>
        </main>

        <div className="flex items-center justify-center w-[100vw]">
          {playerState.get && (
            <Player
              audioPlayer={audioPlayer.current || null}
              songState={songState}
              previewState={previewState}
            />
          )}
        </div>
      </div>
    </>
  );
}

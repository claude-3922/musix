"use client";

import { useEffect, useState } from "react";
import { Player } from "./components/Player/Player";
import { isMobile } from "react-device-detect";

import Preview from "./components/Preview/Preview";

import Main from "./components/Main/Main";
import SearchResults from "./components/SearchResults/SearchResults";
import { SongData } from "@/util/types/SongData";

import useStateManager from "./hooks/StateManager";
import { AnimatePresence, motion } from "framer-motion";
import { PAGE_STATES } from "@/util/enums/pageState";
import { COLORS } from "@/util/enums/colors";
import { pSBC } from "@/util/pSBC";
import NavBar from "./components/Navigation/NavBar";
import { BlockSign } from "./components/Icons/Icons";
import useAuth from "./hooks/Auth";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";
import React from "react";

export default function Page() {
  const songState = useStateManager<SongData | null>(null);
  const pageState = useStateManager<PAGE_STATES>(PAGE_STATES.Main);
  const showPreview = useStateManager<boolean>(false);
  const queryState = useStateManager<string>("");

  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioPlayer) return;

    let audioContext: AudioContext | null = null;
    let source: MediaElementAudioSourceNode | null = null;

    async function init(player: HTMLAudioElement) {
      audioContext = new window.AudioContext();
      source = audioContext.createMediaElementSource(player);

      source.connect(audioContext.destination);
    }

    init(audioPlayer);

    return () => {
      if (source) source.disconnect();
      if (audioContext) audioContext.close().catch(console.log);
    };
  }, [audioPlayer]);

  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <BlockSign size={"36px"} />
        <span className="text-lg">
          Sorry, but mobile devices are not supported
        </span>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full overflow-hidden"
      onContextMenu={(e) => e.preventDefault()}
    >
      {songState.get ? (
        <audio
          id="audioPlayer"
          ref={(el) => setAudioPlayer(el)}
          src={`api/media/?id=${songState.get.id}`}
          preload="auto"
          autoPlay
        />
      ) : (
        <></>
      )}

      <nav
        style={{
          backgroundColor: `${pSBC(0.4, COLORS.BG, "#000000")}`,
        }}
        className="flex flex-row items-center justify-center gap-2 min-h-[8%] max-h-[8%] w-full"
      >
        <NavBar
          pageState={pageState}
          queryState={queryState}
          showPreview={showPreview}
        />
      </nav>

      <main
        className="relative overflow-y-scroll w-full grow"
        style={{ backgroundColor: `${COLORS.BG}` }}
      >
        <AnimatePresence mode="wait">
          {(pageState.get === PAGE_STATES.Main && !showPreview.get && (
            <Main songState={songState} />
          )) ||
            (pageState.get === PAGE_STATES.Search && !showPreview.get && (
              <SearchResults
                query={queryState.get}
                songState={songState}
                audioPlayer={audioPlayer || null}
              />
            ))}
          {showPreview.get && (
            <motion.div
              className="w-full h-full flex items-center justify-center scrollbar-hide overflow-y-hidden"
              key="preview"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ duration: 0.125 }}
            >
              <Preview
                audioPlayer={audioPlayer || null}
                songState={songState}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <div className="min-h-[11%] max-h-[11%] w-full">
        <Player
          audioPlayer={audioPlayer || null}
          songState={songState}
          showPreview={showPreview}
        />
      </div>
    </div>
  );
}

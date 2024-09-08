/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { pSBC } from "@/util/pSBC";
import { SongData } from "@/util/types/SongData";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import Lyrics from "./Lyrics/Lyrics";
import { useLiveQuery } from "dexie-react-hooks";
import { queueDB } from "@/db/queueDB";
import Queue from "./Queue/Queue";
import History from "./Queue/History";
import useStateManager from "@/app/hooks/StateManager";
import Video from "./Video/Video";

interface PreviewProps {
  vidEnabled: boolean;
  songData: SongData | null;
  audioPlayer: HTMLAudioElement | null;
}

export default function Preview({
  vidEnabled,
  songData,
  audioPlayer,
}: PreviewProps) {
  const [activeTab, setActiveTab] = useState(1);
  const [previousTab, setPreviousTab] = useState(activeTab);
  const videoPlayerState = useStateManager<HTMLVideoElement | null>(null);

  useEffect(() => setPreviousTab(activeTab), [activeTab]);

  const queue = useLiveQuery(() => queueDB.queue.toArray());
  const history = useLiveQuery(() => queueDB.history.toArray());

  if (!audioPlayer || !songData) return null;

  const tabs = [
    {
      id: 1,
      component: (
        <Video
          songData={songData}
          enabled={vidEnabled}
          audioPlayer={audioPlayer}
          videoPlayer={videoPlayerState}
        />
      ),
    },
    {
      id: 2,
      component: <></>,
    },
    { id: 3, component: <Queue items={queue || []} /> },
    { id: 4, component: <History items={history || []} /> },
  ];

  return (
    <div
      className="scrollbar-hide flex flex-col items-center justify-center w-[100vw] h-[83.25vh] overflow-y-hidden"
      style={{
        background: `linear-gradient(135deg, 
        ${pSBC(0.01, "#000000")} 0%, 
        ${pSBC(0.02, "#000000")} 30%, 
        ${pSBC(0.03, "#000000")} 50%, 
        ${pSBC(0.02, "#000000")} 70%, 
        ${pSBC(0.01, "#000000")} 100%)`,
      }}
    >
      <div className="flex items-center justify-center">
        {tabs.map(({ id }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`my-[2vh] mx-[0.5vw] ${id === 1 ? "p-[0.5vw]" : ""}`}
            style={{
              borderBottom: activeTab === id ? "solid 2px white" : "none",
            }}
          >
            {id === 1 ? (
              <img className="w-[2vw] h-[2vw]" src="icons/playFill.svg" />
            ) : (
              `TAB ${id}`
            )}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {tabs.map(
          ({ id, component }) =>
            activeTab === id && (
              <motion.div
                key={id}
                initial={{
                  x: activeTab > previousTab ? 300 : -300,
                  opacity: 0,
                }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: activeTab > previousTab ? -300 : 300, opacity: 0 }}
                transition={{ duration: 0.125 }}
              >
                {component}
              </motion.div>
            )
        )}
      </AnimatePresence>
    </div>
  );
}

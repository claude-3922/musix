/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { SongData } from "@/util/types/SongData";
import React, { useEffect, useState } from "react";
import useStateManager from "@/app/hooks/StateManager";
import { COLORS } from "@/util/enums/colors";
import { PREVIEW_TAB_STATES } from "@/util/enums/previewTabState";
import Suggestions from "./Suggestions";
import { StateManager } from "@/util/types/StateManager";
import Lyrics from "./Lyrics";
import NowPlaying from "./NowPlaying";
import { LyricsData } from "@/util/types/LyricsData";
import useFetch from "@/app/hooks/Fetch";

interface PreviewProps {
  audioPlayer: HTMLAudioElement | null;
  songState: StateManager<SongData | null>;
}

export default function Preview({ audioPlayer, songState }: PreviewProps) {
  const videoPlayerState = useStateManager<HTMLVideoElement | null>(null);
  const previewPageState = useStateManager<PREVIEW_TAB_STATES>(
    PREVIEW_TAB_STATES.NowPlaying
  );

  const related = useFetch<SongData[]>(
    `api/data/suggestions/related?id=${songState.get?.id}`
  );
  const lyrics = useFetch<LyricsData>(
    `api/data/lyrics?id=${songState.get?.id}`
  );

  if (!audioPlayer || !songState.get) return null;
  const songData = songState.get;

  const clickHandler = () => {
    audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause();
  };

  const timeUpdateHandler = () => {
    if (!videoPlayerState.get) return;
    syncVideoToAudio(audioPlayer, videoPlayerState.get);
  };

  const buttons = [
    { label: "Now Playing", state: PREVIEW_TAB_STATES.NowPlaying },
    { label: "Suggestions", state: PREVIEW_TAB_STATES.Suggestions },
    { label: "Lyrics", state: PREVIEW_TAB_STATES.Lyrics },
    { label: "Queue", state: PREVIEW_TAB_STATES.Queue },
    { label: "History", state: PREVIEW_TAB_STATES.History },
  ];

  return (
    <div className="flex justify-center items-center gap-2 w-[90%] h-[90%]">
      <video
        ref={(r) => videoPlayerState.set(r)}
        id="videoPlayer"
        poster={songData.thumbnail}
        src={`api/media?id=${songData.id}&vid=1`}
        onTimeUpdate={timeUpdateHandler}
        onClick={clickHandler}
        autoPlay
        className="h-full w-[45%] object-cover rounded-l-lg"
      >
        Video not available on yo pc XD
      </video>
      <div className="flex items-center justify-center bg-white/5 h-full w-full overflow-x-hidden rounded-r-lg">
        {previewPageState.get === PREVIEW_TAB_STATES.NowPlaying && (
          <NowPlaying data={songData} />
        )}
        {previewPageState.get === PREVIEW_TAB_STATES.Suggestions && (
          <Suggestions
            related={related}
            songState={songState}
            audioPlayer={audioPlayer}
          />
        )}
        {previewPageState.get === PREVIEW_TAB_STATES.Lyrics && (
          <Lyrics lyrics={lyrics} audioPlayer={audioPlayer} />
        )}
      </div>
    </div>
  );
}

const syncVideoToAudio = (audio: HTMLAudioElement, video: HTMLVideoElement) => {
  if (Math.abs(audio.currentTime - video.currentTime) >= 0.25) {
    video.currentTime = audio.currentTime;
    console.log("Video time changed");
  }
};

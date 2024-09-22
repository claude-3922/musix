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

interface PreviewProps {
  audioPlayer: HTMLAudioElement | null;
  songState: StateManager<SongData | null>;
}

export default function Preview({ audioPlayer, songState }: PreviewProps) {
  const videoPlayerState = useStateManager<HTMLVideoElement | null>(null);
  const previewPageState = useStateManager<PREVIEW_TAB_STATES>(
    PREVIEW_TAB_STATES.NowPlaying
  );

  const [suggestions, setSuggestions] = useState<SongData[] | null>(null);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const [lyrics, setLyrics] = useState<LyricsData | null>(null);
  const [lyricsLoading, setLyricsLoading] = useState(false);

  useEffect(() => {
    if (!audioPlayer) return;
  }, [audioPlayer]);

  useEffect(() => {
    if (!songState.get) return;

    setSuggestions(null);
    setLyrics(null);
    async function loadSuggestions() {
      setSuggestionsLoading(true);
      const res = await fetch(`api/data/suggestions?id=${songState.get?.id}`);
      if (res.status === 200) {
        const data: SongData[] = await res.json();
        setSuggestions(data);
      }
      setSuggestionsLoading(false);
    }

    async function loadLyrics() {
      setLyricsLoading(true);
      const res = await fetch(
        `api/data/lyrics?name=${songState.get?.title}&artist=${songState.get?.artist.name}&album=${songState.get?.album?.name}&duration=${songState.get?.duration}`
      );
      if (res.status === 200) {
        const data: LyricsData = await res.json();
        setLyrics(data);
      }
      setLyricsLoading(false);
    }

    loadLyrics();
    loadSuggestions();
  }, [songState.get]);

  // const queue = useLiveQuery(() => queueDB.queue.toArray());
  // const history = useLiveQuery(() => queueDB.history.toArray());

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
      ></video>

      <div className="flex flex-col justify-center items-center h-full min-w-[55%] max-w-[55%] border-y-1 border-r-1 gap-2 grow rounded-r-lg">
        <span className="flex gap-4 justify-center items-center w-full pt-2">
          {buttons.map(({ label, state }) => (
            <button
              key={label}
              onClick={() => previewPageState.set(state)}
              className="text-base px-[0.75vw] py-[0.33vw]"
              disabled={previewPageState.get === state}
              style={{
                borderTopColor:
                  previewPageState.get === state ? COLORS.ACCENT : "",
                borderTopWidth: previewPageState.get === state ? "2px" : "0px",
                color: previewPageState.get === state ? COLORS.ACCENT : "",
              }}
            >
              {label}
            </button>
          ))}
        </span>
        <div className="flex items-center justify-center h-full w-full overflow-x-hidden rounded-br-lg">
          {previewPageState.get === PREVIEW_TAB_STATES.NowPlaying && (
            <NowPlaying data={songData} />
          )}
          {previewPageState.get === PREVIEW_TAB_STATES.Suggestions && (
            <Suggestions
              suggestions={suggestions}
              suggestionsLoading={suggestionsLoading}
              songState={songState}
              audioPlayer={audioPlayer}
            />
          )}
          {previewPageState.get === PREVIEW_TAB_STATES.Lyrics && (
            <Lyrics
              lyricsData={lyrics}
              lyricsLoading={lyricsLoading}
              audioPlayer={audioPlayer}
            />
          )}
        </div>
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

import { FetchState } from "@/app/hooks/Fetch";
import { LyricsData } from "@/util/types/LyricsData";
import React from "react";

interface LyricsProps {
  lyrics: FetchState<LyricsData>;
  audioPlayer: HTMLAudioElement | null;
}

export default function Lyrics({ lyrics, audioPlayer }: LyricsProps) {
  if (lyrics.pending)
    return (
      <div className="w-full h-full flex items-center justify-center text-3xl opacity-40 tracking-wide">
        Loading...
      </div>
    );
  if (lyrics.error)
    return (
      <div className="w-full h-full flex items-center justify-center text-3xl opacity-40 tracking-wide">
        No lyrics found.
      </div>
    );

  return (
    <div className="w-full h-full items-center justify-start p-4 overflow-y-scroll">
      {lyrics.data?.lyrics.isSynced
        ? lyrics.data.lyrics.syncedLyrics?.split("\n").map((l, i) => {
            const timeInfo = l
              .substring(0, 10)
              .replaceAll("[", "")
              .replaceAll("]", "");

            const time = convertToSeconds(timeInfo);
            const audioTime = document.getElementById("audioTime")?.innerHTML;

            return (
              <>
                <p
                  className="text-xl tracking-tight"
                  key={i}
                  style={{ opacity: time === Number(audioTime) ? 1 : 0.5 }}
                >
                  {l.substring(10)}
                </p>
              </>
            );
          })
        : lyrics.data?.lyrics.plainLyrics}
    </div>
  );
}

function convertToSeconds(time: string): number {
  const [minutePart, secondPart] = time.split(":");
  const [seconds, fraction] = secondPart.split(".");

  const minutesInSeconds = parseInt(minutePart, 10) * 60;
  const secondsFloat = parseInt(seconds, 10);
  const millisecondsFraction = parseInt(fraction, 10) / 100;

  return minutesInSeconds + secondsFloat + millisecondsFraction;
}

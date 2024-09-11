import { durationSeconds } from "@/util/format";
import { LyricsData } from "@/util/types/LyricsData";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { time } from "console";

interface LyricsProps {
  trackName: string;
  albumName: string;
  artistName: string;
  duration: number;

  audioPlayer: HTMLAudioElement | null;
}

export default function Lyrics({
  trackName,
  albumName,
  artistName,
  duration,
  audioPlayer,
}: LyricsProps) {
  const [lyricsData, setLyricsData] = useState<LyricsData | null>(null);
  const [audioTime, setAudioTime] = useState<number>(0);

  useEffect(() => {
    async function init() {
      const res = await fetch(
        `/data/lyrics?name=${trackName}&artist=${artistName}&album=${albumName}&duration=${duration}`
      );
      if (res.status !== 200) return;
      const data: LyricsData = await res.json();

      setLyricsData(data);
    }

    init();
    if (!audioPlayer) return;

    const timeUpdateHandler = () => {
      setAudioTime(audioPlayer.currentTime);
    };
    audioPlayer.addEventListener("timeupdate", timeUpdateHandler);

    return () => {
      audioPlayer.removeEventListener("timeupdate", timeUpdateHandler);
    };
  }, [albumName, artistName, audioPlayer, duration, trackName]);

  if (!lyricsData) return <div>No lyrics found.</div>;

  return (
    <div>
      {lyricsData.lyrics.isSynced
        ? lyricsData.lyrics.syncedLyrics?.split("\n").map((l, i) => {
            const timeInfo = l
              .substring(0, 10)
              .replaceAll("[", "")
              .replaceAll("]", "");

            const time = convertToSeconds(timeInfo);
            const audioTime = document.getElementById("audioTime")?.innerHTML;

            return (
              <>
                <p
                  key={i}
                  style={{ opacity: time === Number(audioTime) ? 1 : 0.5 }}
                >
                  {l.substring(10)}
                </p>
              </>
            );
          })
        : lyricsData.lyrics.plainLyrics}
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

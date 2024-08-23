import { SongData } from "@/util/types/SongData";
import React, { useEffect, useRef, useState } from "react";

interface PreviewProps {
  vidEnabled: boolean;
  songData: SongData | null;
  audioPlayer: HTMLAudioElement | null;
}

export default async function Preview({
  vidEnabled,
  songData,
  audioPlayer,
}: PreviewProps) {
  const videoPlayer = useRef<HTMLVideoElement | null>(null);

  if (audioPlayer && songData) {
    const vidSrc = `/media?id=${songData.vid.id}&vid=1`;

    return (
      <div
        className={`videoContainer flex items-center justify-center w-[48vw] h-[52.5vh] mt-[2vh]`}
      >
        <video
          id="videoPlayer"
          ref={videoPlayer}
          className="flex bg-black object-cover w-[50vw] h-[50vh] hover:ring rounded-xl"
          src={vidEnabled ? vidSrc : ""}
          poster={songData.vid.thumbnail}
          onTimeUpdate={() => {
            if (videoPlayer.current) {
              syncVideoToAudio(audioPlayer, videoPlayer.current);
            }
          }}
          onClick={() => {
            audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause();
          }}
          autoPlay={audioPlayer.paused ? false : true}
        />
      </div>
    );
  }
}

const syncVideoToAudio = (audio: HTMLAudioElement, video: HTMLVideoElement) => {
  if (Math.abs(audio.currentTime - video.currentTime) >= 0.25) {
    video.currentTime = audio.currentTime;
    console.log(`Video time changed`);
  }
};

const getBestThumbnail = (songId: string) => {
  let returnVal = `/def_vid_thumbnail.jpg`;
  fetch(`https://img.youtube.com/vi/${songId}/maxresdefault.jpg`)
    .then((res) => {
      if (res.status !== 404) {
        returnVal = `https://img.youtube.com/vi/${songId}/maxresdefault.jpg`;
      } else {
        returnVal = `https://img.youtube.com/vi/${songId}/0.jpg`;
      }
    })
    .catch((err) => {
      console.log(err);
    });

  return returnVal;
};

import React, { useEffect, useRef, useState } from "react";

interface PreviewProps {
  vidEnabled: boolean;
  songId: string;
  audioPlayer: HTMLAudioElement | null;
}

export default function Preview({
  vidEnabled,
  songId,
  audioPlayer,
}: PreviewProps) {
  const videoPlayer = useRef<HTMLVideoElement | null>(null);

  const vidSrc = `/media?id=${songId}&vid=1`;

  if (audioPlayer) {
    return (
      <div
        className={`videoContainer flex items-center justify-center w-[48vw] h-[52.5vh] mt-[2vh] overflow:hidden`}
      >
        <video
          id="videoPlayer"
          ref={videoPlayer}
          className="flex bg-black object-contain w-[480px] hover:ring rounded-xl"
          src={vidEnabled ? vidSrc : ""}
          poster={`https://img.youtube.com/vi/${songId}/maxresdefault.jpg`}
          onTimeUpdate={() => {
            if (videoPlayer.current) {
              syncVideoToAudio(audioPlayer, videoPlayer.current);
            }
          }}
          onClick={() => {
            audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause();
          }}
        />
      </div>
    );
  } else {
    console.log("Audio element doesn't exist. This really shouldn't happen");
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

import { pSBC } from "@/util/pSBC";
import { SongData } from "@/util/types/SongData";
import React, { useRef } from "react";

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
  const videoPlayer = useRef<HTMLVideoElement | null>(null);

  if (audioPlayer && songData) {
    const { vid, owner, playerInfo } = songData;
    const vidSrc = `/media?id=${songData.vid.id}&vid=1`;

    const darkerAccent = pSBC(0.9, playerInfo.topColor, "#191919");
    const darkerDarkerAccent = pSBC(0.96, playerInfo.topColor, "#191919");
    const darkestDarkerAccent = pSBC(0.99, playerInfo.topColor, "#191919");

    return (
      <div
        className="scrollbar-hide flex items-center justify-center w-[100vw] h-[83.25vh] overflow-y-hidden bg-gradient-to-b from-current to-[#191919]"
        style={{
          background: `linear-gradient(135deg, 
          ${darkestDarkerAccent} 0%, 
          ${darkerDarkerAccent} 20%, 
          ${darkerAccent} 50%, 
          ${darkerDarkerAccent} 80%, 
          ${darkestDarkerAccent} 100%)`,
        }}
      >
        <video
          id="videoPlayer"
          ref={videoPlayer}
          className="h-[36vw] object-cover hover:ring rounded-xl"
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

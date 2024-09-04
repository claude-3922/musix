import React, { useEffect, useState } from "react";
import { loadingSpinner } from "../../Player/Controls";

interface LyricsProps {
  title: string;
  artist?: string;
  accent: string;
}

export default function Lyrics({ title, accent }: LyricsProps) {
  const [lyrics, setLyrics] = useState("");
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    setFetching(true);

    const init = async () => {
      const res = await fetch(`/data/lyrics`, {
        method: "POST",
        body: JSON.stringify({ title: title }),
      });

      if (res.status === 200) {
        const data = await res.json();
        setLyrics(data.lyrics);
      } else {
        setLyrics("No lyrics found.");
      }
      setFetching(false);
    };

    init();
  }, [title]);

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center py-[3vh] h-[36vw] w-[70vw] bg-white/10 rounded-[4px] overflow-y-scroll whitespace-pre-line text-2xl scrollbar-hide">
        {loadingSpinner("5vw", "5vw")}
      </div>
    );
  }

  if (lyrics.length === 0) setLyrics("No lyrics found.");

  return (
    <div
      className="lyrics flex flex-col items-center justify-start w-[70vw] h-[36vw] px-[10vw] bg-white/10 rounded-[4px] overflow-y-scroll whitespace-pre-line text-2xl scrollbar-hide tracking-wide"
      style={{
        border: `none`,
      }}
    >
      {lyrics}
    </div>
  );
}

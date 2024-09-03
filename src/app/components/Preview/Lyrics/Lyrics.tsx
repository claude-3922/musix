import React, { useEffect, useState } from "react";

interface LyricsProps {
  title: string;
}

export default function Lyrics({ title }: LyricsProps) {
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
      <div className="animate-pulse flex flex-col items-center justify-start py-[3vh] h-[36vw] w-[70vw] bg-white/10 rounded-[4px] overflow-y-scroll whitespace-pre-line text-2xl scrollbar-hide"></div>
    );
  }

  if (lyrics.length === 0) setLyrics("No lyrics found.");

  return (
    <div className="lyrics flex flex-col items-center justify-start py-[3vh] h-[36vw] px-[10vw] bg-white/10 rounded-[4px] overflow-y-scroll whitespace-pre-line text-2xl scrollbar-hide tracking-wide">
      {lyrics}
    </div>
  );
}

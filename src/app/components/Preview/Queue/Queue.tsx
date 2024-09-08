import { queueDB } from "@/db/queueDB";
import { formatSongDuration } from "@/util/format";
import { SongData } from "@/util/types/SongData";
import { useLiveQuery } from "dexie-react-hooks";
import React, { useEffect, useState } from "react";

interface QueueProps {
  items: SongData[];
}

export default function Queue({ items }: QueueProps) {
  const [totalDuration, setTotalDuration] = useState("00:00");
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    setTotalDuration(
      formatSongDuration(
        items
          .map((v) => Number(v.duration) || 0)
          .reduce((sum, a) => (sum += a), 0)
      )
    );
    setTotalItems(items.length);
  }, [items]);

  return (
    <div className="w-[50vw] h-[30vh] bg-white/10">
      {items.length > 0 ? (
        <div>
          {items.map((item, i) => (
            <p key={i}>
              {i + 1}. {item.title}
            </p>
          ))}
        </div>
      ) : (
        "No items in queue."
      )}
    </div>
  );
}

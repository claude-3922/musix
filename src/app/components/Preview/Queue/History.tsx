import { SongData } from "@/util/types/SongData";
import React from "react";

interface HistoryProps {
  items: SongData[];
}

export default function History({ items }: HistoryProps) {
  return (
    <div className="w-[50vw] h-[30vh] bg-white/10">
      {items.length > 1 ? (
        <div>
          {items.map((item, i) => {
            return (
              <p key={i}>
                {i + 1}. {item.title}
              </p>
            );
          })}
        </div>
      ) : (
        "No items in queue."
      )}
    </div>
  );
}

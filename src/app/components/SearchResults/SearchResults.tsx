import { SongData } from "@/util/types/SongData";
import React, { useEffect, useState } from "react";
import Item from "./Item";
import SearchResultsLoading from "./SearchResultsLoading";
import { StateManager } from "@/util/types/StateManager";

interface SearchResultsProps {
  query: string;
  searchResultState: StateManager<boolean>;
  songState: StateManager<SongData | null>;
  playerState: StateManager<boolean>;
}

export default function SearchResults({
  query,
  searchResultState,
  songState,
  playerState,
}: SearchResultsProps) {
  const [results, setResults] = useState<SongData[] | null>(null);

  useEffect(() => {
    setResults(null);
    async function search() {
      const res = await fetch(`/search?query=${query}`, { method: "POST" });
      if (res.status === 200) {
        const data = await res.json();
        setResults(data.items);
      }
    }
    search();
  }, [query]);

  if (results) {
    if (results.length > 0) {
      return (
        <div>
          <button
            className="border-2 mx-[2vw] my-[2vh]"
            onClick={() => searchResultState.set(false)}
          >
            HOME
          </button>

          {results.map((r, i) => (
            <Item
              key={i}
              data={r}
              songState={songState}
              playerState={playerState}
            />
          ))}
        </div>
      );
    } else {
      return <p>NO RESULTS</p>;
    }
  } else {
    return (
      <>
        <SearchResultsLoading searchResultState={searchResultState} />
      </>
    );
  }
}

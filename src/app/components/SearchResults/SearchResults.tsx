import { SongData } from "@/util/types/SongData";
import React, { useEffect, useState } from "react";

import SearchResultsLoading from "./SearchResultsLoading";
import { StateManager } from "@/util/types/StateManager";
import SearchItemSong from "./SearchItemSong";
import useStateManager from "@/app/hooks/StateManager";

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
  const dropdownOpen = useStateManager<boolean>(false);

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
        <div className="flex items-start bg-custom_black rounded-[4px] justify-center w-[100vw] h-[77.5vh] my-[2vh] overflow-y-scroll">
          <div className="w-[100vw]">
            <button
              className="border-2 mx-[2vw] my-[2vh]"
              onClick={() => searchResultState.set(false)}
            >
              HOME
            </button>

            {results.map((r, i) => (
              <SearchItemSong
                key={i}
                data={r}
                songState={songState}
                playerState={playerState}
                dropdownState={dropdownOpen}
              />
            ))}
          </div>
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

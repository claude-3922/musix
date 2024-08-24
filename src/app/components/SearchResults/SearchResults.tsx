import { SongData } from "@/util/types/SongData";
import React, { useEffect, useState } from "react";
import Item from "./Item";
import SearchResultsLoading from "./SearchResultsLoading";

interface SearchResultsProps {
  query: string;
  toggleShowResults: (b: boolean) => void;
  toggleSongData: (s: SongData) => void;
  togglePlayer: (b: boolean) => void;
}

export default function SearchResults({
  query,
  toggleShowResults,
  toggleSongData,
  togglePlayer,
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
            onClick={() => toggleShowResults(false)}
          >
            HOME
          </button>

          {results.map((r, i) => (
            <Item
              key={i}
              data={r}
              toggleSongData={toggleSongData}
              togglePlayer={togglePlayer}
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
        <SearchResultsLoading toggleShowResults={toggleShowResults} />
      </>
    );
  }
}

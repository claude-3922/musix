import { SongData } from "@/util/types/SongData";
import React, { useEffect, useState } from "react";

import SearchResultsLoading from "./SearchResultsLoading";
import { StateManager } from "@/util/types/StateManager";
import SearchItemSong from "./SearchItemSong";
import useStateManager from "@/app/hooks/StateManager";
import { PlaylistMetadata } from "@/util/types/PlaylistData";
import ExpandableList from "../Util/ExpandableList";

interface SearchResultsProps {
  query: string;
  searchResultState: StateManager<boolean>;
  songState: StateManager<SongData | null>;
  playerState: StateManager<boolean>;
}

interface SearchResult {
  topResult?: SongData | PlaylistMetadata;
  songs: SongData[];
  playlists: PlaylistMetadata[];
}

export default function SearchResults({
  query,
  searchResultState,
  songState,
  playerState,
}: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult | null>(null);

  const dropdownItemId = useStateManager<string | null>(null);

  useEffect(() => {
    setResults(null);
    async function search() {
      const res = await fetch(`/search/songs`, {
        method: "POST",
        body: JSON.stringify({
          query: query,
          count: 10,
        }),
      });
      if (res.status === 200) {
        const data: SearchResult = await res.json();
        setResults({
          topResult: data.topResult,
          songs: data.songs,
          playlists: data.playlists,
        });
      }
    }
    search();
  }, [query]);

  if (!results) {
    return (
      <>
        <SearchResultsLoading searchResultState={searchResultState} />
      </>
    );
  }

  if (results.songs.length > 0 || results.playlists.length > 0) {
    return (
      <div
        className="flex items-start bg-custom_black rounded-[4px] justify-center w-[100vw] h-[80.5vh] my-[1vh] overflow-y-scroll"
        //onClick={() => dropdownItemId.set(null)}
      >
        <div>
          <button
            className="flex items-center justify-center rounded-full border-2 w-[3vw] h-[3vw] mx-[2vw] my-[2vh]"
            onClick={() => searchResultState.set(false)}
          >
            <img className="h-[1.5vw] w-[1.5vw]" src="/icons/home.svg" />
          </button>
          <div className="my-[1vh]">
            <h1 className="text-3xl mb-[1vh]">TOP RESULT</h1>
            <SearchItemSong
              data={results.topResult as SongData}
              songState={songState}
              playerState={playerState}
              dropdownItemId={dropdownItemId}
            />
          </div>
          <div className="my-[1vh]">
            <h1 className="text-3xl mb-[1vh]">SONGS</h1>
            <ExpandableList
              beforeCount={3}
              beforeHeight={`${3 * 13}vh`}
              afterCount={results.songs.length}
              afterHeight={`${results.songs.length * 13}vh`}
              customExpandButtonProps={{
                className:
                  "w-[8vw] hover:bg-white/20 py-[0.5vh] border-2 rounded-full mx-[2vw]",
              }}
              className="overflow-y-scroll"
            >
              {results.songs.map((r, i) => (
                <SearchItemSong
                  key={i}
                  data={r}
                  songState={songState}
                  playerState={playerState}
                  dropdownItemId={dropdownItemId}
                />
              ))}
            </ExpandableList>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <SearchResultsLoading searchResultState={searchResultState} />
      </>
    );
  }
}

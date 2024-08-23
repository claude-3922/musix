"use client";

import { Suspense, useRef, useState } from "react";
import { Player } from "./components/Player/Player";
import PlayerLoading from "./components/Player/PlayerLoading";
import Preview from "./components/Preview/Preview";

import Main from "./components/Main/Main";
import SearchResults from "./components/SearchResults/SearchResults";
import SearchResultsLoading from "./components/SearchResults/SearchResultsLoading";
import { SongData } from "@/util/types/SongData";
import PreviewLoading from "./components/Preview/PreviewLoading";

export default function Home() {
  const [query, setQuery] = useState("");
  const [songData, setSongData] = useState<SongData | null>(null);
  const toggleSongData = (s: SongData) => {
    setSongData(s);
  };

  const [vid, setVid] = useState(false);

  const [showPlayer, setShowPlayer] = useState(false);
  const togglePlayer = (b: boolean) => {
    setShowPlayer(b);
  };

  const [showPreview, setShowPreview] = useState(false);
  const togglePreview = (b: boolean) => {
    setShowPreview(b);
  };

  const getPreview = () => {
    return showPreview;
  };

  const [showSearchResults, setShowSearchResults] = useState(false);
  const toggleShowResults = (b: boolean) => {
    setShowSearchResults(b);
  };

  const audioPlayer = useRef<HTMLAudioElement | null>(null);

  return (
    <>
      <audio
        id="audioPlayer"
        ref={audioPlayer}
        src={songData ? `/media?id=${songData.vid.id}&vid=0` : ``}
      />
      <div className="flex flex-col items-center justify-between">
        <nav className="flex flex-row items-center justify-between">
          <input
            id=""
            name="searchQuery"
            onChange={(e) => (e.target.id = e.target.value)}
            className="border-2 p-2 bg-custom_black"
            type="text"
            placeholder="search a song"
          />
          <button
            type="submit"
            className="border-2 p-2"
            onClick={() => {
              setQuery(document.getElementsByName("searchQuery")[0].id);
              setShowSearchResults(true);
              setShowPreview(false);
            }}
          >
            Search
          </button>
          <label>
            Vid?
            <input
              type="checkbox"
              name="vidEnabled"
              onChange={(e) => {
                setVid(e.target.checked);
              }}
            />
          </label>
        </nav>

        <main className="flex items-start bg-custom_black rounded-[4px] justify-center w-[100vw] h-[77vh] my-[2vh] overflow-y-scroll">
          {showPreview ? (
            <Suspense fallback={<PreviewLoading />}>
              <Preview
                songData={songData}
                vidEnabled={vid}
                audioPlayer={audioPlayer.current || null}
              />
            </Suspense>
          ) : showSearchResults ? (
            <Suspense fallback={<SearchResultsLoading />}>
              <SearchResults
                query={query}
                toggleShowResults={toggleShowResults}
                toggleSongData={toggleSongData}
                togglePlayer={togglePlayer}
              />
            </Suspense>
          ) : (
            <Main />
          )}
        </main>

        <div className="flex items-center justify-center w-[100vw]">
          {showPlayer && (
            <Player
              audioPlayer={audioPlayer.current || null}
              togglePreview={togglePreview}
              getPreview={getPreview}
              data={songData}
            />
          )}
        </div>
      </div>
    </>
  );
}

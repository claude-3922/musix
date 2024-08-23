"use client";

import { ReactElement, Suspense, useRef, useState } from "react";
import { Player } from "./components/Player/Player";
import PlayerLoading from "./components/Player/PlayerLoading";
import Preview from "./components/Preview/Preview";
import PreviewLoading from "./components/Preview/PreviewLoading";
import Main from "./components/Main/Main";
import SearchResults from "./components/SearchResults/SearchResults";
import SearchResultsLoading from "./components/SearchResults/SearchResultsLoading";

export default function Home() {
  const [query, setQuery] = useState("");
  const [id, setId] = useState("");
  const [vid, setVid] = useState(false);

  const [showPreview, setShowPreview] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const audioPlayer = useRef<HTMLAudioElement | null>(null);

  const togglePreview = (b: boolean) => {
    setShowPreview(b);
  };

  const getPreview = () => {
    return showPreview;
  };

  return (
    <>
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
            }}
          >
            Search
          </button>
          <input
            id=""
            name="songId"
            onChange={(e) => (e.target.id = e.target.value)}
            className="border-2 p-2 bg-custom_black"
            type="text"
            placeholder="enter song id here"
          />
          <button
            type="submit"
            className="border-2 p-2"
            onClick={() => {
              setId(document.getElementsByName("songId")[0].id);
            }}
          >
            Play
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

        <audio
          id="audioPlayer"
          ref={audioPlayer}
          src={id.length > 0 ? `/media?id=${id}&vid=0` : ``}
        />

        <main className="flex items-center bg-black/20 rounded-[4px] justify-center w-[100vw] my-[2vh]">
          {showPreview ? (
            <Preview
              songId={id}
              vidEnabled={vid}
              audioPlayer={audioPlayer.current || null}
            />
          ) : showSearchResults ? (
            <Suspense fallback={<SearchResultsLoading />}>
              <SearchResults query={query} />
            </Suspense>
          ) : (
            <Main />
          )}
        </main>

        <div className="flex items-center justify-center w-[100vw]">
          <Suspense fallback={<PlayerLoading />}>
            <Player
              songId={id}
              audioPlayer={audioPlayer.current || null}
              togglePreview={togglePreview}
              getPreview={getPreview}
            />
          </Suspense>
        </div>
      </div>
    </>
  );
}

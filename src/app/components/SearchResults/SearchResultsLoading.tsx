import { StateManager } from "@/util/types/StateManager";
import React from "react";

interface SearchResultsLoadingProps {
  searchResultState: StateManager<boolean>;
}

export default function SearchResultsLoading({
  searchResultState,
}: SearchResultsLoadingProps) {
  return (
    <div className="">
      <button
        className="border-2 mx-[2vw] my-[2vh]"
        onClick={() => searchResultState.set(false)}
      >
        HOME
      </button>
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          className="animate-pulse flex justify-between items-center w-[70vw] h-[12vh] rounded-xl mb-[1vh] bg-custom_gray/20"
        ></div>
      ))}
    </div>
  );
}

import { StateManager } from "@/util/types/StateManager";
import React from "react";

interface SearchResultsLoadingProps {
  searchResultState: StateManager<boolean>;
}

export default function SearchResultsLoading({
  searchResultState,
}: SearchResultsLoadingProps) {
  return (
    <div className="flex items-start bg-custom_black rounded-[4px] justify-center w-[100vw] h-[80.5vh] my-[1vh] overflow-y-scroll">
      <div className="w-[100vw]">
        <button
          className="border-2 mx-[2vw] my-[2vh]"
          onClick={() => searchResultState.set(false)}
        >
          HOME
        </button>
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="animate-pulse flex justify-between items-center w-[70vw] h-[12vh] rounded-xl mb-[1vh] bg-custom_gray/20 mx-[1vw]"
          ></div>
        ))}
      </div>
    </div>
  );
}

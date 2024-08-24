import React from "react";

interface SearchResultsLoadingProps {
  toggleShowResults: (b: boolean) => void;
}

export default function SearchResultsLoading({
  toggleShowResults,
}: SearchResultsLoadingProps) {
  return (
    <div className="">
      <button
        className="border-2 mx-[2vw] my-[2vh]"
        onClick={() => toggleShowResults(false)}
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

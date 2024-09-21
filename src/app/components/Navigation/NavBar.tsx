import { PAGE_STATES } from "@/util/enums/pageState";
import { StateManager } from "@/util/types/StateManager";
import React, { useRef } from "react";
import { Arrow_180Deg, Home, Search } from "../Icons/Icons";

interface NavBarProps {
  pageState: StateManager<PAGE_STATES>;
  queryState: StateManager<string>;
  showPreview: StateManager<boolean>;
}

export default function NavBar({
  pageState,
  queryState,
  showPreview,
}: NavBarProps) {
  const searchBar = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <p>In development, prone to errors</p>
      <button
        className="w-[3.5%] h-[80%] rounded-full flex items-center justify-center opacity-60 hover:opacity-100"
        onClick={() => {
          if (showPreview.get) return showPreview.set(false);
          pageState.set(
            pageState.get - 1 <= 0 ? PAGE_STATES.Main : pageState.get - 1
          );
        }}
      >
        <Arrow_180Deg size={"30px"} opacity={0.8} />
      </button>
      <button
        className="w-[3.5%] h-[80%] rounded-full flex items-center justify-center opacity-60 hover:opacity-100"
        onClick={() => {
          if (showPreview.get) showPreview.set(false);
          pageState.set(PAGE_STATES.Main);
        }}
      >
        <Home size={"30px"} opacity={0.8} />
      </button>
      <span className="relative h-[70%] w-[20%] mx-4">
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            ref={searchBar}
            data-query=""
            onChange={(e) => {
              e.target.dataset.query = e.target.value;
            }}
            className="absolute left-[0%] top-[0%] px-4 z-[0] rounded-full bg-white/10 w-full h-full focus:ring focus:ring-accentColor/50 transition-[box-shadow] duration-75 ease-linear focus:outline-none placeholder:text-white/50 pr-12 caret-white/50"
            type="text"
            placeholder="Search"
            onFocus={(e) => {
              e.target.placeholder = "";
              e.target.style.opacity = "100%";
            }}
            onBlur={(e) => {
              e.target.placeholder = "Search";
              e.target.style.opacity = "60%";
            }}
          />
          <button
            type="submit"
            className="absolute flex items-center justify-center rounded-full right-[0%] top-[0%] z-[1] h-full w-[18%] opacity-60 hover:opacity-100"
            onClick={() => {
              queryState.set(searchBar.current?.dataset.query || "");
              pageState.set(PAGE_STATES.Search);
              if (showPreview.get) showPreview.set(false);
            }}
            tabIndex={0}
          >
            <Search opacity={0.8} size={"24px"} />
          </button>
        </form>
      </span>
    </>
  );
}

import React from "react";
import {
  Arrow_0Deg,
  Arrow_180Deg,
  Arrow_270Deg,
  Arrow_90Deg,
} from "../Icons/Icons";

interface ContainerScrollerProps {
  direction: "x" | "y";
  container: HTMLElement;
}

export default function ContainerScroller({
  direction,
  container,
}: ContainerScrollerProps) {
  return (
    <span className="w-full h-full flex items-center justify-center">
      {direction === "x" ? (
        <>
          <Arrow_180Deg size={"90%"} opacity={0.8} />
          <Arrow_0Deg size={"90%"} opacity={0.8} />
        </>
      ) : (
        <>
          <Arrow_90Deg size={"90%"} opacity={0.8} />
          <Arrow_270Deg size={"90%"} opacity={0.8} />
        </>
      )}
    </span>
  );
}

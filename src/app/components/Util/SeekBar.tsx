import { formatSongDuration } from "@/util/format";
import React, {
  HTMLAttributes,
  useEffect,
  useState,
  MouseEvent,
  use,
  useRef,
  useMemo,
  CSSProperties,
} from "react";

interface SeekBarProps {
  width: string;
  height: string;
  containerStyles?: CSSProperties;

  progressPercentage: number;
  progressStyles?: CSSProperties;

  thumbRadius_pixels: number;
  thumbStyles?: CSSProperties;

  onSeek?: (newValue: number) => void;

  songDuration?: number;
}

export default function SeekBar({
  width,
  height,
  containerStyles,
  progressPercentage,
  progressStyles,
  thumbRadius_pixels,
  thumbStyles,
  onSeek,
  songDuration,
}: SeekBarProps) {
  const seekbarContainer = useRef<HTMLSpanElement | null>(null);
  const progressBar = useRef<HTMLSpanElement | null>(null);
  const thumb = useRef<HTMLSpanElement | null>(null);

  const [current, setCurrent] = useState(0);
  const [thumbPositionX, setThumbPositionX] = useState(0);
  const [showThumb, setShowThumb] = useState(false);

  useEffect(() => {
    setCurrent(progressPercentage);

    if (progressBar.current && seekbarContainer.current && thumb.current) {
      const progressBarSize =
        progressBar.current.offsetLeft + progressBar.current.offsetWidth;

      const thumbPosX =
        ((progressBarSize - thumbRadius_pixels / 2) /
          seekbarContainer.current.offsetWidth) *
        100;

      setThumbPositionX(thumbPosX);
    }
  }, [progressPercentage, thumbRadius_pixels]);

  const calculatePercentageFromMousePos = (mousePosX: number) => {
    if (seekbarContainer.current) {
      return (
        ((mousePosX - seekbarContainer.current.offsetLeft) /
          seekbarContainer.current.offsetWidth) *
        100
      );
    }

    return null;
  };

  const seekHandler = (event: MouseEvent<HTMLSpanElement>) => {
    const newPerc = calculatePercentageFromMousePos(event.clientX);

    if (newPerc) {
      setCurrent(newPerc);

      if (onSeek) {
        onSeek(newPerc);
      }
    }
  };

  const getDurationAtCurrentPos = (e: MouseEvent<HTMLSpanElement>) => {
    if (songDuration) {
      const mousePerc = calculatePercentageFromMousePos(e.clientX);

      return mousePerc ? (mousePerc * songDuration) / 100 : 0;
    }
  };

  return (
    <>
      <span
        className="flex items-center relative hover:cursor-pointer"
        onMouseUp={seekHandler}
        onMouseOver={(e) => {
          setShowThumb(true);
        }}
        onMouseMove={(e) => {
          if (seekbarContainer.current) {
            seekbarContainer.current.title = `${formatSongDuration(
              getDurationAtCurrentPos(e) as any
            )}`;
          }
        }}
        onMouseOut={() => setShowThumb(false)}
        style={{ paddingTop: height, paddingBottom: height }}
        ref={seekbarContainer}
      >
        <span
          className="flex flex-col items-start justify-center"
          style={{
            ...containerStyles,
            position: "relative",
            width: width,
            height: height,
            overflowX: "hidden",
            overflowY: "hidden",
          }}
        >
          <span
            ref={progressBar}
            style={{
              ...progressStyles,
              position: "absolute",
              zIndex: 1,
              height: height,
              width: `${current}%`,
              transition: "width 0.02s linear",
            }}
          ></span>
        </span>

        <span
          ref={thumb}
          style={{
            width: `${thumbRadius_pixels}px`,
            height: `${thumbRadius_pixels}px`,
            opacity: showThumb ? "100%" : "0%",
            transition: "left 0.125s linear",
            ...thumbStyles,
            position: "absolute",
            zIndex: 2,
            left: `${thumbPositionX}%`,
            borderRadius: "10vw",
          }}
        ></span>
      </span>
    </>
  );
}

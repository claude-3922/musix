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
  onMouseDragStart?: (seekbar: HTMLSpanElement, thumb: HTMLSpanElement) => void;
  onMouseDragEnd?: (seekbar: HTMLSpanElement, thumb: HTMLSpanElement) => void;

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
  onMouseDragStart,
  onMouseDragEnd,
  songDuration,
}: SeekBarProps) {
  const seekbarContainer = useRef<HTMLSpanElement | null>(null);
  const progressBar = useRef<HTMLSpanElement | null>(null);
  const thumb = useRef<HTMLSpanElement | null>(null);

  const [current, setCurrent] = useState(0);
  const [thumbPositionX, setThumbPositionX] = useState(0);
  const [showThumb, setShowThumb] = useState(false);

  const [isSeeking, setIsSeeking] = useState(false);

  useEffect(() => {
    setCurrent(progressPercentage);
  }, [progressPercentage]);

  useEffect(() => {
    if (current > 100) {
      return setCurrent(100);
    } else if (current < 0) {
      return setCurrent(0);
    }
    if (progressBar.current && seekbarContainer.current && thumb.current) {
      const progressBarSize =
        progressBar.current.offsetLeft + progressBar.current.offsetWidth;

      const thumbPosX =
        ((progressBarSize - thumbRadius_pixels / 2) /
          seekbarContainer.current.offsetWidth) *
        100;

      setThumbPositionX(thumbPosX);
    }
  }, [current, thumbRadius_pixels]);

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

  const getDurationAtCurrentPos = (
    e: MouseEvent<HTMLSpanElement>,
    duration: number
  ) => {
    const mousePerc = calculatePercentageFromMousePos(e.clientX);

    return mousePerc ? (mousePerc * duration) / 100 : 0;
  };

  return (
    <>
      <span
        className="no-select flex items-center relative hover:cursor-pointer"
        onClick={(e) => {
          if (!isSeeking) {
            seekHandler(e);
          }
        }}
        onMouseDown={() => {
          setIsSeeking(true);
          if (onMouseDragStart && seekbarContainer.current && thumb.current) {
            onMouseDragStart(seekbarContainer.current, thumb.current);
          }
        }}
        onMouseUp={(e) => {
          setIsSeeking(false);

          if (onMouseDragEnd && seekbarContainer.current && thumb.current) {
            onMouseDragEnd(seekbarContainer.current, thumb.current);
          }
        }}
        onMouseOver={(e) => {
          setShowThumb(true);
          if (seekbarContainer.current && songDuration) {
            seekbarContainer.current.title = `${formatSongDuration(
              getDurationAtCurrentPos(e, songDuration)
            )}`;
          }
        }}
        onMouseMove={(e) => {
          if (isSeeking && e.buttons === 1) {
            return seekHandler(e);
          }
        }}
        onMouseOut={() => {
          setShowThumb(false);
        }}
        style={{
          paddingTop: height,
          paddingBottom: height,
        }}
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
            }}
          ></span>
        </span>

        <span
          ref={thumb}
          style={{
            width: `${thumbRadius_pixels}px`,
            height: `${thumbRadius_pixels}px`,
            opacity: showThumb ? "100%" : "0%",
            transition: "opacity 0.125s linear",
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

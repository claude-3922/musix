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

  const seekHandler = (event: MouseEvent<HTMLSpanElement>) => {
    if (seekbarContainer.current) {
      const newPercentage =
        ((event.clientX - seekbarContainer.current.offsetLeft) /
          seekbarContainer.current.offsetWidth) *
        100;
      setCurrent(newPercentage);

      if (onSeek) {
        onSeek(newPercentage);
      }
    }
  };

  return (
    <>
      <span
        className="flex items-center relative hover:cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          seekHandler(e);
        }}
        onMouseOver={() => setShowThumb(true)}
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

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
  containerStyles: CSSProperties;

  progressPercentage: number;
  progressStyles: CSSProperties;

  onSeek?: (newValue: number) => void;
}

export default function SeekBar({
  width,
  height,
  containerStyles,
  progressPercentage,
  progressStyles,
  onSeek,
}: SeekBarProps) {
  const seekbarContainer = useRef<HTMLSpanElement | null>(null);

  const [current, setCurrent] = useState(0);
  useEffect(() => setCurrent(progressPercentage), [progressPercentage]);

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
        className="hover:cursor-pointer"
        onClick={(e) => seekHandler(e)}
        style={{ paddingTop: height, paddingBottom: height }}
      >
        <span
          className="flex flex-col items-start justify-center"
          ref={seekbarContainer}
          style={{
            position: "relative",
            width: width,
            height: height,
            overflowX: "hidden",
            overflowY: "hidden",
            ...containerStyles,
          }}
        >
          <span
            style={{
              position: "absolute",
              zIndex: 1,
              height: height,
              width: `${current}%`,
              transition: "width 0.02s linear",
              ...progressStyles,
            }}
          ></span>
        </span>
      </span>
    </>
  );
}

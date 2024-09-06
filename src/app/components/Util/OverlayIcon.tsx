/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { HTMLAttributes, useState } from "react";

interface OverlayIconProps extends HTMLAttributes<HTMLSpanElement> {
  thumbnailURL: string;

  width: number | string;
  height: number | string;

  iconStyle: React.CSSProperties;
}

export default function OverlayIcon({
  thumbnailURL,
  width,
  height,
  iconStyle,
  children,
  ...props
}: OverlayIconProps) {
  const [showOverlay, setShowOverlay] = useState(false);

  const cssWidth = typeof width === "string" ? width : `${width}px`;
  const cssHeight = typeof height === "string" ? height : `${height}px`;

  return (
    <span
      {...props}
      onMouseOver={() => setShowOverlay(true)}
      onMouseOut={() => setShowOverlay(false)}
      style={{
        ...iconStyle,
        position: "relative",
        width: cssWidth,
        height: cssHeight,
        cursor: showOverlay ? "pointer" : "default",
      }}
    >
      <img
        src={thumbnailURL}
        style={{
          objectFit: "cover",
          position: "absolute",
          zIndex: 0,
          left: 0,
          top: 0,
          width: cssWidth,
          height: cssHeight,
        }}
      />
      {showOverlay && (
        <span
          style={{
            position: "absolute",
            zIndex: 1,
            left: 0,
            top: 0,
            width: cssWidth,
            height: cssHeight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0, 0, 0, 0.5)",
          }}
        >
          {children}
        </span>
      )}
    </span>
  );
}

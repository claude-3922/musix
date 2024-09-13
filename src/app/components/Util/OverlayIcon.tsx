/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import React, { HTMLAttributes, useState } from "react";

interface OverlayIconProps extends HTMLAttributes<HTMLSpanElement> {
  thumbnailURL: string;

  width: number | string;
  height: number | string;

  iconStyle: React.CSSProperties;

  optionalYoutubeId?: string;
}

export default function OverlayIcon({
  thumbnailURL,
  width,
  height,
  iconStyle,
  children,
  optionalYoutubeId,
  ...props
}: OverlayIconProps) {
  const [hovering, setHovering] = useState(false);

  const cssWidth = typeof width === "string" ? width : `${width}px`;
  const cssHeight = typeof height === "string" ? height : `${height}px`;

  return (
    <span
      {...props}
      onMouseOver={() => setHovering(true)}
      onMouseOut={() => setHovering(false)}
      style={{
        ...iconStyle,
        position: "relative",
        width: cssWidth,
        height: cssHeight,
        cursor: hovering ? "pointer" : "default",
      }}
    >
      <Image
        loading="lazy"
        alt="Thumbnail"
        width={120}
        height={120}
        src={thumbnailURL}
        style={{
          objectFit: "cover",
          position: "absolute",
          zIndex: 0,
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          transform: hovering ? "scale(1.05)" : "scale(1)",
          transition: "transform 0.125s linear",
        }}
      />
      {hovering && (
        <span
          style={{
            position: "absolute",
            zIndex: 1,
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
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

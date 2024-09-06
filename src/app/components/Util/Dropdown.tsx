import { StateManager } from "@/util/types/StateManager";
import React, { useEffect } from "react";

interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  pos: DropdownPos;

  width: number | string;
  height: number | string;
  dropdownStyle: React.CSSProperties;
}

export interface DropdownPos {
  x: number | string;
  y: number | string;
}

export default function Dropdown({
  id,
  pos,

  width,
  height,
  dropdownStyle,
  children,
  ...props
}: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  useEffect(() => {
    id ? setIsOpen(true) : setIsOpen(false);
  }, [id]);

  if (!isOpen) return null;
  return (
    <div
      {...props}
      id={id}
      style={{
        ...dropdownStyle,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "start",
        position: "absolute",
        left: pos.x,
        top: pos.y,
        zIndex: 10,
        width: typeof width === "string" ? width : `${width}px`,
        height: typeof height === "string" ? height : `${height}px`,
      }}
    >
      {children}
    </div>
  );
}

const toggleDropdownId = (
  id: string,
  dropdownIdState: StateManager<string | null>
) => {
  if (dropdownIdState && dropdownIdState.get === id) {
    dropdownIdState.set(null);
  } else {
    dropdownIdState.set(id);
  }
};

export const toggleDropdown = (
  posX: string | number,
  posY: string | number,
  id: string,
  dropdownIdState: StateManager<string | null>,
  dropdownPosState: StateManager<DropdownPos>
) => {
  dropdownPosState.set({
    x: `${typeof posX === "string" ? posX : `${posX}px`}`,
    y: `${typeof posY === "string" ? posY : `${posY}px`}`,
  });
  toggleDropdownId(id, dropdownIdState);
};

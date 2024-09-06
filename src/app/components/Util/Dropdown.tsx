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
        left: typeof pos.x === "string" ? pos.x : `${pos.x}px`,
        top: typeof pos.y === "string" ? pos.y : `${pos.y}px`,
        zIndex: 10,
        width: typeof width === "string" ? width : `${width}px`,
        height: typeof height === "string" ? height : `${height}px`,
      }}
    >
      {children}
    </div>
  );
}

export const toggleDropdown = (
  id: string,
  dropdownIdState: StateManager<string | null>
) => {
  if (dropdownIdState && dropdownIdState.get === id) {
    dropdownIdState.set(null);
  } else {
    dropdownIdState.set(id);
  }
};

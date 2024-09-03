import { MouseEvent } from "react";

export const detectMouseButton = (event: MouseEvent) => {
  switch (event.button) {
    case 0:
      return "LEFT";
    case 1:
      return "MIDDLE";
    case 3:
      return "RIGHT";
    default:
      return "OTHER";
  }
};

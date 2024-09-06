import React from "react";

interface ToggleableButtonProps extends React.HTMLAttributes<HTMLSpanElement> {
  onToggleChange?: (toggled: boolean, button: HTMLSpanElement) => void;
}

export default function ToggleableButton({
  onToggleChange,
  children,
  ...props
}: ToggleableButtonProps) {
  const buttonRef = React.useRef<HTMLSpanElement | null>(null);
  const [toggled, setToggled] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);

  return (
    <span
      {...props}
      ref={buttonRef}
      onClick={() => {
        setToggled((p) => !p);
        if (onToggleChange && buttonRef.current) {
          onToggleChange(toggled, buttonRef.current);
        }
      }}
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      style={{
        cursor: hovered ? "pointer" : "default",
      }}
    >
      {children}
    </span>
  );
}

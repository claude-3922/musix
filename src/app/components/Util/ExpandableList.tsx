import { HTMLAttributes, useState } from "react";

interface ExpandableListProps extends HTMLAttributes<HTMLDivElement> {
  beforeCount?: number;
  afterCount: number;
  customExpandButtonProps?: HTMLAttributes<HTMLButtonElement>;
  beforeHeight: string;
  afterHeight: string;
  customTransition?: string;
}

export default function ExpandableList({
  children,
  beforeCount = 1,
  afterCount,
  customExpandButtonProps,
  beforeHeight,
  afterHeight,
  customTransition = "height 0.125s ease-in-out",
  ...props
}: ExpandableListProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col items-start justify-center">
      <div
        {...props}
        className="overflow-y-hidden"
        style={{
          height: expanded ? afterHeight : beforeHeight,
          transition: "height 0.125s ease-in-out",
        }}
      >
        {children}
      </div>
      {afterCount > beforeCount && (
        <div>
          <button
            type="button"
            className="w-[8vw] py-[0.5vw] text border-2 rounded-full"
            onClick={() => setExpanded((p) => !p)}
            {...customExpandButtonProps}
          >
            {expanded ? "Hide All" : "Show All"}
          </button>
        </div>
      )}
    </div>
  );
}

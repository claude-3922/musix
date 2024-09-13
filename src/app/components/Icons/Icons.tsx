import { CSSProperties, SVGAttributes, SVGProps } from "react";

interface IconProps extends SVGAttributes<SVGElement> {
  size?: CSSProperties["width"];
  fill?: CSSProperties["fill"];
  opacity?: CSSProperties["opacity"];
}

export function PlayButton({
  opacity = 1,
  size = "24px",
  fill = "white",
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 -960 960 960"
      opacity={opacity}
      width={size}
      fill={fill}
    >
      <path d="m380-300 280-180-280-180v360ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
    </svg>
  );
}

export function PlaySymbol({
  size = "24px",
  fill = "white",
  opacity = 1,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 -960 960 960"
      opacity={opacity}
      width={size}
      fill={fill}
    >
      <path d="M320-200v-560l440 280-440 280Z" />
    </svg>
  );
}

export function PauseButton({
  opacity = 1,
  size = "24px",
  fill = "white",
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 -960 960 960"
      opacity={opacity}
      width={size}
      fill={fill}
    >
      <path d="M360-320h80v-320h-80v320Zm160 0h80v-320h-80v320ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
    </svg>
  );
}

export function PauseSymbol({
  size = "24px",
  fill = "white",
  opacity = 1,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 -960 960 960"
      opacity={opacity}
      width={size}
      fill={fill}
    >
      <path d="M560-200v-560h160v560H560Zm-320 0v-560h160v560H240Z" />
    </svg>
  );
}

export function LoadingSpinner({
  opacity = 1,
  size = "24px",
  fill = "white",
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 -960 960 960"
      opacity={opacity}
      width={size}
      fill={fill}
      style={{
        transformOrigin: "center",
        animation: "spin 1s linear infinite",
      }}
    >
      <path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q17 0 28.5 11.5T520-840q0 17-11.5 28.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-17 11.5-28.5T840-520q17 0 28.5 11.5T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Z" />
      <style>{`
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }`}</style>
    </svg>
  );
}

export function NextButton({
  opacity = 1,
  size = "24px",
  fill = "white",
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 -960 960 960"
      opacity={opacity}
      width={size}
      fill={fill}
    >
      <path d="M660-240v-480h80v480h-80Zm-440 0v-480l360 240-360 240Z" />
    </svg>
  );
}

export function PreviousButton({
  opacity = 1,
  size = "24px",
  fill = "white",
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 -960 960 960"
      opacity={opacity}
      width={size}
      fill={fill}
    >
      <path d="M220-240v-480h80v480h-80Zm520 0L380-480l360-240v480Z" />
    </svg>
  );
}

export function HeartEmpty({
  opacity = 1,
  size = "24px",
  fill = "white",
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 -960 960 960"
      opacity={opacity}
      width={size}
      fill={fill}
    >
      <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
    </svg>
  );
}

export function HeartFill({
  opacity = 1,
  size = "24px",
  fill = "white",
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 -960 960 960"
      opacity={opacity}
      width={size}
      fill={fill}
    >
      <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z" />
    </svg>
  );
}

export function LoopOff({
  opacity = 1,
  size = "24px",
  fill = "white",
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 -960 960 960"
      opacity={opacity}
      width={size}
      fill={fill}
    >
      <path d="M280-80 120-240l160-160 56 58-62 62h406v-160h80v240H274l62 62-56 58Zm-80-440v-240h486l-62-62 56-58 160 160-160 160-56-58 62-62H280v160h-80Z" />
    </svg>
  );
}

export function LoopAll({
  opacity = 1,
  size = "24px",
  fill = "white",
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 -960 960 960"
      opacity={opacity}
      width={size}
      fill={fill}
    >
      <path d="M120-40q-33 0-56.5-23.5T40-120v-720q0-33 23.5-56.5T120-920h720q33 0 56.5 23.5T920-840v720q0 33-23.5 56.5T840-40H120Zm160-40 56-58-62-62h486v-240h-80v160H274l62-62-56-58-160 160L280-80Zm-80-440h80v-160h406l-62 62 56 58 160-160-160-160-56 58 62 62H200v240Z" />
    </svg>
  );
}

export function VolumeFull({
  opacity = 1,
  size = "24px",
  fill = "white",
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 -960 960 960"
      opacity={opacity}
      width={size}
      fill={fill}
    >
      <path d="M560-131v-82q90-26 145-100t55-168q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm440 40v-322q47 22 73.5 66t26.5 96q0 51-26.5 94.5T560-320Z" />
    </svg>
  );
}

export function VolumeMute({
  opacity = 1,
  size = "24px",
  fill = "white",
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 -960 960 960"
      opacity={opacity}
      width={size}
      fill={fill}
    >
      <path d="M792-56 671-177q-25 16-53 27.5T560-131v-82q14-5 27.5-10t25.5-12L480-368v208L280-360H120v-240h128L56-792l56-56 736 736-56 56Zm-8-232-58-58q17-31 25.5-65t8.5-70q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 53-14.5 102T784-288ZM650-422l-90-90v-130q47 22 73.5 66t26.5 96q0 15-2.5 29.5T650-422ZM480-592 376-696l104-104v208Z" />
    </svg>
  );
}

export function QueueAdd({
  size = "24px",
  fill = "white",
  opacity = 1,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 -960 960 960"
      width={size}
      fill={fill}
      opacity={opacity}
    >
      <path d="M520-400h80v-120h120v-80H600v-120h-80v120H400v80h120v120ZM240-240v-640h640v640H240Zm80-80h480v-480H320v480ZM80-80v-640h80v560h560v80H80Zm240-720v480-480Z" />
    </svg>
  );
}

export function QueueRemove({
  size = "24px",
  fill = "white",
  opacity = 1,
}: IconProps) {
  return (
    <svg
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      width={size}
      height={size}
      fill={fill}
      opacity={opacity}
    >
      <defs>
        <style>{`.cls-1 { fill: ${fill}; }`}</style>
      </defs>
      <polygon className="cls-1" points="2 4 0 4 0 20 16 20 16 18 2 18 2 4" />
      <path className="cls-1" d="M4,0v16h16V0H4ZM18,14H6V2h12v12Z" />
      <path className="cls-1" d="M6,7h8v2H6V7Z" /> {/* Proper minus sign */}
    </svg>
  );
}

export function Arrow_180Deg({
  size = "24px",
  fill = "white",
  opacity = 1,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 -960 960 960"
      width={size}
      fill={fill}
      opacity={opacity}
    >
      <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
    </svg>
  );
}

export function Home({
  size = "24px",
  fill = "white",
  opacity = 1,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 -960 960 960"
      width={size}
      fill={fill}
      opacity={opacity}
    >
      <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
    </svg>
  );
}

export function Search({
  size = "24px",
  fill = "white",
  opacity = 1,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 -960 960 960"
      width={size}
      fill={fill}
      opacity={opacity}
    >
      <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
    </svg>
  );
}

export function Error({
  size = "24px",
  fill = "white",
  opacity = 1,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 -960 960 960"
      width={size}
      fill={fill}
      opacity={opacity}
    >
      <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
    </svg>
  );
}

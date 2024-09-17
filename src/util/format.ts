export function formatSongDuration(seconds: number) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const formattedHrs = hrs > 0 ? `${hrs}:` : "";
  const formattedMins =
    mins > 0 ? (mins >= 10 ? `${mins}:` : `0${mins}:`) : "00:";
  const formattedSecs = secs > 0 ? `${secs >= 10 ? secs : "0" + secs}` : "00";

  return `${formattedHrs}${formattedMins}${formattedSecs}`.trim();
}

export function durationSeconds(duration: string) {
  const parts = duration.split(":");
  const secs = Number(parts[parts.length - 1]);
  const mins = Number(parts[parts.length - 2] ?? 0);
  const hrs = Number(parts[parts.length - 3] ?? 0);

  return secs + mins * 60 + hrs * 3600;
}

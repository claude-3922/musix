export function formatSongDuration(seconds: number) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const formattedHrs = hrs > 0 ? `${hrs}:` : "";
  const formattedMins = mins > 0 ? `${mins}:` : "00:";
  const formattedSecs = secs > 0 ? `${secs >= 10 ? secs : "0" + secs}` : "00";

  return `${formattedHrs}${formattedMins}${formattedSecs}`.trim();
}

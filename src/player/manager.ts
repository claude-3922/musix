import queue from "@/db/Queue";
import { SongData } from "@/util/types/SongData";
import { StateManager } from "@/util/types/StateManager";

export const play = (
  songState: StateManager<SongData | null>,
  data: SongData,
  logInHistory = true
) => {
  songState.set(data);
  if (!logInHistory) return true;

  const history = queue.getHistory;

  if (history.find((song) => song.id === data.id)) {
    queue.unlog(data);
  }

  try {
    queue.log(data);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const enqueue = (data: SongData) => {
  const currentQueue = queue.getQueue;
  if (currentQueue.find((song) => song.id === data.id)) {
    queue.dequeue(data);
  }
  try {
    queue.enqueue(data);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const dequeue = (data: SongData) => {
  const currentQueue = queue.getQueue;
  if (currentQueue.find((song) => song.id === data.id)) {
    queue.dequeue(data);
  }
  return true;
};

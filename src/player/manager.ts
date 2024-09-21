import { queueDB } from "@/db/Queue";
import { AlbumData } from "@/util/types/AlbumData";
import { PlaylistMetadata } from "@/util/types/PlaylistData";
import { SongData } from "@/util/types/SongData";
import { StateManager } from "@/util/types/StateManager";

export const play = async (
  songState: StateManager<SongData | null>,
  data: SongData,
  logInHistory = true
) => {
  songState.set(data);

  if (!logInHistory) return true;

  const historyArray = await queueDB.history.toArray();

  if (historyArray.find((song) => song.id === data.id)) {
    await queueDB.history.where("vid.id").equals(data.id).delete();
  }

  try {
    await queueDB.history.add(data);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const enqueue = async (data: SongData) => {
  const queueArray = await queueDB.queue.toArray();
  if (queueArray.find((song) => song.id === data.id)) {
    await queueDB.queue.where("vid.id").equals(data.id).delete();
  }
  try {
    await queueDB.queue.add(data);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const dequeue = async (data: SongData) => {
  const queueArray = await queueDB.queue.toArray();
  if (queueArray.find((song) => song.id === data.id)) {
    await queueDB.queue.where("vid.id").equals(data.id).delete();
  }
  return true;
};

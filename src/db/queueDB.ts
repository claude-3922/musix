import { SongData } from "@/util/types/SongData";
import Dexie, { Table } from "dexie";

interface NowPlayingRecord extends SongData {
  id: number;
}

class QueueDatabase extends Dexie {
  history!: Table<SongData>;
  queue!: Table<SongData>;
  nowPlaying!: Table<NowPlayingRecord>;

  constructor() {
    super("QueueDatabase");
    this.version(1).stores({
      history:
        "++id, vid.id, vid.title, vid.thumbnail, vid.duration, owner.title, playerInfo.topColor",
      queue:
        "++id, vid.id, vid.title, vid.thumbnail, vid.duration, owner.title, playerInfo.topColor",
      nowPlaying: "id",
    });
  }

  async getNowPlaying(): Promise<SongData | null> {
    try {
      const nowPlaying = await this.nowPlaying.toArray();
      return nowPlaying[0] || null;
    } catch (error) {
      console.log("Error fetching nowPlaying: ", error);
      return null;
    }
  }

  async setNowPlaying(song: SongData): Promise<void> {
    try {
      await this.nowPlaying.clear();
      await this.nowPlaying.add({ id: 1, ...song });
    } catch (error) {
      console.log("Error setting nowPlaying: ", error);
    }
  }

  async clearNowPlaying(): Promise<void> {
    try {
      await this.nowPlaying.clear();
    } catch (error) {
      console.log("Error clearing nowPlaying: ", error);
    }
  }
}

const queueDB = new QueueDatabase();

export { queueDB };

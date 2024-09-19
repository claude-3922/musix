/**
 * !! Do not use !!
 * Doesn't work for some reason, will add a new implementation soon
 */

import { SongData } from "@/util/types/SongData";
import Dexie, { Table } from "dexie";

import indexedDB from "fake-indexeddb";

// @ts-ignore
import IDBKeyRange from "fake-indexeddb/lib/FDBKeyRange";

interface NowPlayingRecord extends SongData {
  playingId: number;
}

class QueueDatabase extends Dexie {
  history!: Table<SongData>;
  queue!: Table<SongData>;
  nowPlaying!: Table<NowPlayingRecord>;

  constructor() {
    super("QueueDatabase", {
      indexedDB: indexedDB,
      IDBKeyRange: IDBKeyRange,
    });

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
      if (await this.getNowPlaying()) {
        await this.nowPlaying.update(1, song);
      } else {
        await this.nowPlaying.add({ playingId: 1, ...song });
      }
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

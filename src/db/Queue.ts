import { SongData } from "@/util/types/SongData";
import { LocalStorageService } from "./LocalStorageService";

export class Queue {
  private db: LocalStorageService;
  private nowPlaying: SongData | null;
  private queue: SongData[];
  private history: SongData[];

  constructor() {
    this.db = new LocalStorageService();

    if (!this.db.getItem("queue")) {
      this.db.setItem("queue", []);
    }

    if (!this.db.getItem("history")) {
      this.db.setItem("history", []);
    }

    this.nowPlaying = this.db.getItem<SongData>("nowPlaying");
    this.queue = this.db.getItem<SongData[]>("queue") || [];
    this.history = this.db.getItem<SongData[]>("history") || [];
  }

  get getNowPlaying() {
    return this.nowPlaying;
  }

  set setNowPlaying(data: SongData) {
    this.nowPlaying = data;
    this.db.setItem("nowPlaying", data);
  }

  get getQueue() {
    return this.queue;
  }

  enqueue(data: SongData) {
    this.queue.push(data);
    this.db.setItem("queue", data);
  }

  dequeue(data?: SongData) {
    if (data) {
      this.queue = this.queue.filter((song) => song.id !== data.id);
      this.db.setItem("queue", this.queue);
    }

    this.queue.pop();
    this.db.setItem("queue", this.queue);
  }

  get getHistory() {
    return this.history;
  }

  log(data: SongData) {
    this.history.push(data);
    this.db.setItem("history", this.history);
  }

  unlog(data?: SongData) {
    if (data) {
      this.history = this.history.filter((song) => song.id !== data.id);
      this.db.setItem("history", this.history);
    }

    this.history.pop();
    this.db.setItem("history", this.history);
  }
}

const queue = new Queue();
export default queue;

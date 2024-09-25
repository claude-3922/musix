// import { useState, useEffect } from "react";
// import { SongData } from "@/util/types/SongData";

// interface InteractiveQueue<T> {
//   items: T[];
//   add: (data: T, index?: number) => void;
//   remove: (index?: number) => void;
//   clear: () => void;
// }

// interface NowPlayingState<T> {
//   data: T | null;
//   set: (data: T | null) => void;
// }

// interface QueueManager {
//   queue: InteractiveQueue<SongData>;
//   history: InteractiveQueue<SongData>;
//   nowPlaying: NowPlayingState<SongData>;
// }

// export default function useQueueManager(): QueueManager {
//   const [queue, setQueue] = useState<InteractiveQueue<SongData> | null>(null);
//   const [history, setHistory] = useState<InteractiveQueue<SongData> | null>(
//     null
//   );
//   const [nowPlayingData, setNowPlayingData] = useState<SongData | null>(null);

//   useEffect(() => {
//     const initialQueue = useInteractiveQueue<SongData>("queue");
//     const initialHistory = useInteractiveQueue<SongData>("history");
//     const initialNowPlaying = getLocalStorageItem<SongData | null>(
//       "nowPlaying",
//       null
//     );

//     setQueue(initialQueue);
//     setHistory(initialHistory);
//     setNowPlayingData(initialNowPlaying);
//   }, []);

//   const nowPlaying = {
//     data: nowPlayingData,
//     set: (data: SongData | null) => {
//       setNowPlayingData(data);
//       updateLocalStorage("nowPlaying", data);
//     },
//   };

//   return { queue, history, nowPlaying };
// }

// const getLocalStorageItem = <T>(key: string, defaultValue: T): T => {
//   return JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultValue));
// };

// const updateLocalStorage = (key: string, items: any) => {
//   localStorage.setItem(key, JSON.stringify(items));
// };

// function useInteractiveQueue<T>(key: string): InteractiveQueue<T> {
//   const initialItems = getLocalStorageItem<T[]>(key, []);
//   const [items, setItems] = useState<T[]>(initialItems);

//   const add = (data: T, index?: number) => {
//     const updatedItems = [...items];
//     updatedItems.splice(index ?? updatedItems.length, 0, data);
//     setItems(updatedItems);
//     updateLocalStorage(key, updatedItems);
//   };

//   const remove = (index?: number) => {
//     const updatedItems = [...items];
//     updatedItems.splice(index ?? updatedItems.length - 1, 1);
//     setItems(updatedItems);
//     updateLocalStorage(key, updatedItems);
//   };

//   const clear = () => {
//     setItems([]);
//     updateLocalStorage(key, []);
//   };

//   return { items, add, remove, clear };
// }

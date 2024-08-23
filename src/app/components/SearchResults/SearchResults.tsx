import { SongData } from "@/util/types/SongData";
import React, { useEffect, useState } from "react";
import NoResults from "./NoResults";

interface SearchResultsProps {
  query: string;
}

export default function SearchResults({ query }: SearchResultsProps) {
  const [results, setResults] = useState<SongData[] | null>(null);

  useEffect(() => {
    setResults(null);
    async function search() {
      const res = await fetch(`/search?query=${query}`, { method: "POST" });
      if (res.status === 200) {
        const data = await res.json();
        setResults(data.items);
      }
    }
    search();
  }, [query]);

  if (results) {
    return (
      <>
        <ul>
          {results.map((r, i) => (
            <li key={i} id={r.vid.id}>
              {r.vid.title}
            </li>
          ))}
        </ul>
      </>
    );
  } else {
    return (
      <>
        <NoResults />
      </>
    );
  }
}

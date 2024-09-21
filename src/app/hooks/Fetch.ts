import { useState, useEffect } from "react";

export type FetchState<T> = {
  data: T | null;
  error: string | null;
  pending: boolean;
};

export default function useFetch<T = any>(
  url: string,
  opts?: RequestInit
): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    error: null,
    pending: true,
  });

  useEffect(() => {
    let isMounted = true;

    fetch(url, opts)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        if (isMounted) {
          setState({ data, error: null, pending: false });
        }
      })
      .catch((error) => {
        if (isMounted) {
          setState({ data: null, error: error.message, pending: false });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [opts, url]);

  return state;
}

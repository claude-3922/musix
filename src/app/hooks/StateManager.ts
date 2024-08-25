import { StateManager } from "@/util/types/StateManager";
import { useMemo, useState } from "react";

export default function useStateManager<T>(init: T) {
  const [state, setState] = useState<T>(init);

  const managerState: StateManager<T> = useMemo(
    () => ({
      get: state,
      set: (v: T) => setState(v),
    }),
    [state]
  );

  return managerState;
}

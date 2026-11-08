import { useEffect, useState } from "react";
import { Input } from "./Input";

// One Input per component, listening only while the component is mounted.
export function useInput() {
  const [input] = useState(() => new Input());

  useEffect(() => {
    input.connect();
    return () => input.disconnect();
  }, [input]);

  return input;
}

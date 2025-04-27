import { DependencyList, useEffect, useRef, useCallback } from "react";

export const useAnimationEffect = (
  callback: () => void,
  dependencies?: DependencyList,
) => {
  useEffect(() => {
    const handler = requestAnimationFrame(callback);
    return () => {
      cancelAnimationFrame(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};

export const useRequestAnimationFrame = (
  callback: () => Promise<void> | void,
) => {
  const functionRef = useRef(callback);

  useEffect(() => {
    functionRef.current = callback;
  }, [callback]);

  const requestRef = useRef<number>(0);

  const animate = useCallback(async () => {
    await functionRef.current();
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);
};

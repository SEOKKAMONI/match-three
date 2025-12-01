import { useLayoutEffect, useState, RefObject } from "react";

export const useSize = (ref: RefObject<HTMLElement>): [number, number] => {
  const [size, setSize] = useState<[number, number]>([0, 0]);

  useLayoutEffect(() => {
    if (ref.current) {
      const updateSize = () => {
        if (ref.current) {
          setSize([ref.current.offsetWidth, ref.current.offsetHeight]);
        }
      };

      window.addEventListener("resize", updateSize);

      updateSize();

      return () => {
        window.removeEventListener("resize", updateSize);
      };
    }
  }, [ref]);

  return size;
};

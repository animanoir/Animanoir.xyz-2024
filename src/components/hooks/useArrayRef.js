import { useRef } from "react";

const useArrayRef = () => {
  const refs = useRef([]);
  return [
    refs,
    (ref) => {
      if (ref && !refs.current.includes(ref)) {
        refs.current.push(ref);
      }
    },
  ];
};

export default useArrayRef;

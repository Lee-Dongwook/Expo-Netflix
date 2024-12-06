import { useRef } from "react";
import { Platform } from "react-native";

export const useScrollToTop = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollToTop = () => {
    if (Platform.OS === "web") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return {
    scrollRef,
    scrollToTop,
  };
};

import * as Font from "expo-font";
import { useEffect, useState } from "react";

export default function useCachedResources() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadResourcesAndData() {
      try {
        await Font.loadAsync({
          arialic: require("../assets/fonts/arialic.ttf"),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setIsLoading(true);
      }
    }

    loadResourcesAndData();
  }, []);

  return isLoading;
}

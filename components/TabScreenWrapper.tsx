import { View } from "react-native";
import React, { useEffect, useState } from "react";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { usePathname, useNavigation } from "expo-router";

interface Props {
  children: React.ReactNode;
  isActive: boolean;
  slideDirection: "left" | "right";
}

export function TabScreenWrapper({
  children,
  isActive,
  slideDirection,
}: Props) {
  const navigation = useNavigation();
  const [initialized, setInitialized] = useState(false);

  let shouldAnimate = false;
  const state = navigation.getState();
  const currentRoute = state.routes[state.index].name;
  const previousRoute =
    state.index > 0 ? state.routes[state.index - 1].name : null;

  const possibleRoutes = ["new", "index", "(profile)/profile", null];
  if (
    possibleRoutes.includes(currentRoute) &&
    possibleRoutes.includes(previousRoute)
  ) {
    shouldAnimate = true;
  }

  if (!shouldAnimate) {
    return <>{children}</>;
  }

  const translateX = useSharedValue(
    isActive ? 0 : slideDirection === "left" ? -25 : 25
  );

  const opacity = useSharedValue(isActive ? 1 : 0);

  const [isAnimate, setIsAnimate] = useState(false);

  useEffect(() => {
    if (!initialized && isActive) {
      translateX.value = slideDirection === "left" ? -25 : 25;
      opacity.value = 0;
      setInitialized(true);
    }

    setIsAnimate(true);

    if (isActive) {
      translateX.value = withSpring(
        0,
        {
          damping: 25,
          stiffness: 120,
          mass: 0.4,
        },
        () => {
          runOnJS(setIsAnimate)(false);
        }
      );
      opacity.value = withTiming(1, { duration: 100 });
    } else {
      translateX.value = withSpring(slideDirection === "left" ? -25 : 25, {
        damping: 25,
        stiffness: 120,
        mass: 0.4,
      });
      opacity.value = withTiming(0, { duration: 100 }, () => {
        runOnJS(setIsAnimate)(false);
      });
    }
  }, [isActive, slideDirection]);

  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    width: "100%",
    height: "100%",
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <Animated.View
        style={[
          {
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "#000",
          },
          isAnimate ? animatedStyle : null,
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
}
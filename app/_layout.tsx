import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import { RootScaleProvider } from "@/contexts/RootScaleContext";
import { useRootScale } from "@/contexts/RootScaleContext";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { OverlayProvider } from "@/components/Overlay/OverlayProvider";
import { Stack, useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { UserProvider, useUser } from "@/contexts/UserContext";
import { Image } from "expo-image";
import useCachedResources from "@/hooks/useCachedResources";
import { WhoIsWatching } from "@/components/WhoIsWatching";

function AnimatedStack() {
  const { scale } = useRootScale();
  const router = useRouter();
  const [isModalActive, setIsModalActive] = useState(false);
  const [canBlur, setCanBlur] = useState(false);
  const { selectedProfile, selectProfile } = useUser();
  const colorScheme = useColorScheme();
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: scale.value,
        },
        { translateY: (1 - scale.value) * -150 },
      ],
    };
  });

  if (!selectProfile) {
    return <WhoIsWatching onProfileSelect={selectProfile} />;
  }

  return (
    <View style={{ flex: 1 }}>
      {isModalActive && canBlur && (
        <BlurView
          intensity={50}
          style={[StyleSheet.absoluteFill, { zIndex: 1 }]}
          tint={colorScheme === "dark" ? "dark" : "light"}
        />
      )}
      <Animated.View style={[styles.stackContainer, animatedStyle]}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="movie/[id]"
            options={{
              presentation: "transparentModal",
              headerShown: false,
              contentStyle: {
                backgroundColor: "transparent",
              },
            }}
            listeners={{
              focus: () => {
                setIsModalActive(true);
                setCanBlur(true);
              },
              beforeRemove: () => {
                setIsModalActive(false);
                setCanBlur(false);
              },
            }}
          />
          <Stack.Screen
            name="switch-profile"
            options={{
              presentation: "transparentModal",
              headerShown: false,
              contentStyle: {
                backgroundColor: "transparent",
              },
            }}
            listeners={{
              focus: () => {
                setIsModalActive(true);
                setCanBlur(false);
              },
              beforeRemove: () => {
                setIsModalActive(false);
                setCanBlur(false);
              },
            }}
          />
          <Stack.Screen
            name="search"
            options={{
              headerShown: false,
              contentStyle: {
                backgroundColor: "transparent",
              },
            }}
          />

          <Stack.Screen
            name="downloads"
            options={{
              headerShown: false,
              contentStyle: {
                backgroundColor: "transparent",
              },
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </Animated.View>
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isLoaded = useCachedResources();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    Image.prefetch(["", ""]);
  }, []);

  if (!isLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <RootScaleProvider>
          <UserProvider>
            <OverlayProvider>
              <AnimatedStack />
            </OverlayProvider>
          </UserProvider>
        </RootScaleProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  stackContainer: {
    flex: 1,
    overflow: "hidden",
    borderRadius: 5,
  },
});

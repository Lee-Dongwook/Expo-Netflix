import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabScreenWrapper } from "@/components/TabScreenWrapper";
import { usePathname, useRouter } from "expo-router";
import { TAB_SCREENS } from "@/app/(tabs)/_layout";

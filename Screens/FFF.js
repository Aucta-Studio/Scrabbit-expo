import * as React from "react";
import { ScrollView, Text } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default () => {
  return (
    <TailwindProvider>
      <SafeAreaView className="bg-zinc-900 h-full">
        <ScrollView>
          <Text className="text-white">This is the FFF page</Text>
        </ScrollView>
      </SafeAreaView>
    </TailwindProvider>
  );
};
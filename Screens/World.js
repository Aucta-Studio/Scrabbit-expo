import React, { useState } from "react";
import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TailwindProvider } from "tailwindcss-react-native";

export default () => {
  return (
    <TailwindProvider>
      <SafeAreaView className="bg-zinc-900 h-full">
        <ScrollView>
          <Text className="text-white">This is the world page</Text>
        </ScrollView>
      </SafeAreaView>
    </TailwindProvider>
  );
};

import React, { useState } from "react";
import { Button, ScrollView, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TailwindProvider } from "tailwindcss-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default () => {
  const navigation = useNavigation();
  return (
    <TailwindProvider>
      <SafeAreaView className="bg-zinc-900 h-full">
        <ScrollView>
          <Text className="text-white">This is the Profile page</Text>
          <Button
            title="Edit"
            onPress={() => navigation.navigate("Edit Profile")}
          ></Button>
          <Button
            title="FFF"
            onPress={() => navigation.navigate("FFF")}
          ></Button>
        </ScrollView>
      </SafeAreaView>
    </TailwindProvider>
  );
};

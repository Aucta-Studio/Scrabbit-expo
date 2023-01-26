import React, { useState } from "react";
import {  ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default () => {
  return (
      <SafeAreaView className="bg-zinc-900 h-full">
        <ScrollView>
          <Text className="text-white">This is the camera page</Text>
        </ScrollView>
      </SafeAreaView>
    
  );
};
import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { getStorage, ref } from "firebase/storage";
import { myFireBase } from "../fireBaseConfig";
import { useDownloadURL } from "react-firebase-hooks/storage";

export default function Firemage({ path, style }) {
  const storage = getStorage(myFireBase);
  const [value, loading, error] = useDownloadURL(ref(storage, `${path}`));
  return (
    <View>
      {error && <Text>Error: {error}</Text>}
      {loading && <Text>Download URL: Loading...</Text>}
      {!loading && value && <Image style={style} source={{ uri: value }}/>}
    </View>
  );
}
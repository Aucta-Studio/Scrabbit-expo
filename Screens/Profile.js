import React, { useState } from "react";
import { Button, ScrollView, Text, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { myFireBase } from "../fireBaseConfig";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { useSelector } from "react-redux";

export default () => {
  const [img, setimg] = useState(null);
  const account = useSelector((state) => state.account);
  const storage = getStorage();

  const navigation = useNavigation();

  const download = async () => {
    const temp = await getDownloadURL(ref(storage, `${account.pfp}`));
    setimg(temp);
  };

  download();
  console.log(img);
  return (
    <SafeAreaView>
      <ScrollView>
        {img && (
          <Image
            source={{ uri: img }}
            style={styles.pfp}
            resizeMode="contain"
          />
        )}
        <Text>This is the Profile page of {account.username}</Text>
        <Button
          title="Edit"
          onPress={() => navigation.navigate("Edit Profile")}
        ></Button>
        <Button title="FFF" onPress={() => navigation.navigate("FFF")}></Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pfp: {
    width: "20%",
    height: "20%",
  },
});

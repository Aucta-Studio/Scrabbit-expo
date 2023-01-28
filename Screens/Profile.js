import "react-native-gesture-handler";
import React, { useState } from "react";
import {
  Button,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
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
import { useSelector, useDispatch } from "react-redux";
import MyScrapbooks from "./MyScrapbooks";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

function Tab() {
  const Tab = createMaterialTopTabNavigator();
  return (
    <Tab.Navigator initialRouteName="my">
      <Tab.Screen name="my" component={MyScrapbooks} />
    </Tab.Navigator>
  );
}

export default () => {
  const [img, setimg] = useState(null);
  const account = useSelector((state) => state.account);
  const dispatch = useDispatch();
  const storage = getStorage();

  const navigation = useNavigation();

  const download = async () => {
    const temp = await getDownloadURL(ref(storage, `${account.pfp}`));
    setimg(temp);
  };
  download();
  // console.log(account.pfpFile);
  return (
    <SafeAreaView>
      {/* <ScrollView> */}
      <View>
        {img && (
          <Image
            source={{ uri: img }}
            style={styles.pfp}
            resizeMode="contain"
          />
        )}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("FFF");
          }}
        >
          <Text>FFF</Text>
        </TouchableOpacity>
      </View>
      <Text>
        {account.firstname} {account.lastname}
      </Text>
      <Text>{account.bio}</Text>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Edit Profile");
        }}
      >
        <Text>Edit Profile</Text>
      </TouchableOpacity>
      <Tab />
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pfp: {
    width: "20%",
    height: "20%",
  },
});
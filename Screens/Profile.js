import React, { useState } from "react";
import { Button, ScrollView, Text } from "react-native";
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
import { getAuth } from "firebase/auth";

export default () => {
  const auth = getAuth(myFireBase);
  const email = auth.currentUser.email;
  const uid = auth.currentUser.uid;
  const db = getFirestore(myFireBase);
  var myProfile; 

  const getMyProfile = async() => {
    myProfile = await getDoc(doc(db, "Profiles", `${uid}`));
    console.log(myProfile.data());
  } 

  getMyProfile();
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <ScrollView>
        <Text>This is the Profile page of {uid}</Text>
        <Button
          title="Edit"
          onPress={() => navigation.navigate("Edit Profile")}
        ></Button>
        <Button title="FFF" onPress={() => navigation.navigate("FFF")}></Button>
      </ScrollView>
    </SafeAreaView>
  );
};

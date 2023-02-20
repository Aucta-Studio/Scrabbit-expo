import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import { myFireBase } from "../fireBaseConfig";
import { getFirestore, collection, doc } from "firebase/firestore";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { useDownloadURL } from "react-firebase-hooks/storage";
import { useState } from "react";
import Firemage from "./Firemage";
import { useNavigation } from "@react-navigation/native";

export default function User({ id }) {
  const [thisImg, setThisimg] = useState(null);
  const [followed, setFollowed] = useState(null);
  const db = getFirestore(myFireBase);
  const navigation = useNavigation();
  const [value, loading, error] = useDocument(doc(db, "Profiles", `${id}`));

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("ForeignProfileStack", {fuid: `${id}`});
      }}
    >
      <View>
        {error && <Text>Error: {JSON.stringify(error)}</Text>}
        {loading && <Text>Document: Loading...</Text>}
        {value && (
          <>
            <Firemage style={styles.img} path={value.data().Pfp} />
            <Text>{value.data().UserName}</Text>
            <TouchableOpacity>
              <Text>F</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  img: {
    width: 100,
    height: 100,
  },
});

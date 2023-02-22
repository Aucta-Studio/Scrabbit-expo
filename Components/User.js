import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import { myFireBase } from "../fireBaseConfig";
import { getFirestore, collection, doc } from "firebase/firestore";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { useDownloadURL } from "react-firebase-hooks/storage";
import { useState } from "react";
import { getStorage, ref } from "firebase/storage";
import Firemage from "./Firemage";
import { useNavigation } from "@react-navigation/native";

export default function User({ id }) {
  const [thisImg, setThisimg] = useState(null);
  const [followed, setFollowed] = useState(null);
  const db = getFirestore(myFireBase);
  const storage = getStorage(myFireBase);
  const navigation = useNavigation();

  const [value, loading, error] = useDocument(doc(db, "Profiles", `${id}`));

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("ForeignProfileStack", {fuid: `${id}`,usrn:value.data().UserName});
        // navigation.setParams({fuid: `${id}`,usrn:value.data().UserName});
        // navigation.navigate("ForeignProfileStack", {screen:"ForeignProfile", params:{fuid: `${id}`}});
      }}
    >
      <View style={styles.container}>
        {error && <Text>Error: {JSON.stringify(error)}</Text>}
        {loading && <Text>Document: Loading...</Text>}
        {value && (
          <>
          <View style={styles.row}>
            <View style={styles.pfp}>
              <Firemage style={styles.img} path={value.data().Pfp}/>
            </View>
              <Text style={styles.usernameText}>{value.data().UserName}</Text>
              <TouchableOpacity style={styles.flexend}><Text style={styles.fbutton}>Following</Text></TouchableOpacity>              
          </View>
          </>
          
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
  },
  usernameText: {
    fontSize: 16, 
    fontWeight: 'bold',
    color: "#fff",
    marginRight: 12,
  },
  captionText: {
    marginBottom: 0,
    marginTop: 0,
    fontSize: 14,
    color: "#fff",
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 8
  },
  pfp: {
    alignItems: 'center',
    display: 'flex',
    height: 48,
    justifyContent: 'center',
    marginRight: 12,
    width: 48,
  },
  fbutton: {
    // backgroundColor: '#4CAF50',
    backgroundColor: "#EC6319",
    color : "#000",
    // borderColor: "#000",
    // borderWidth: 2,
    borderRadius: 50,
    padding: 9,
    margin: 0,
  },
  flexend: {
    marginRight: 0,
    marginLeft:"auto",
  },
  img: {
    height: 38,
    width: 38,
    borderRadius: 50
  },
});
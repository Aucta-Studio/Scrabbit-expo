import { View, Text } from "react-native";
import React from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "../fireBaseConfig";
import { TouchableOpacity } from "react-native";
import Firemage from "./Firemage";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";

export default function ChatUser({ id, onPress }) {
  const [value, loading, error] = useDocument(doc(db, "Profiles", id));
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        {value && (
          <>
            <View style={styles.row}>
              <View style={styles.pfp}>
                <Firemage path={value.data().Pfp} style={styles.img} />
              </View>
              <View>
                <Text style={styles.usernameText}>{value.data().UserName}</Text>
              </View>
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  usernameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginRight: 12,
  },
  captionText: {
    marginBottom: 0,
    marginTop: 0,
    fontSize: 14,
    color: "#fff",
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    padding: 8,
  },
  pfp: {
    alignItems: "center",
    display: "flex",
    height: 48,
    justifyContent: "center",
    marginRight: 12,
    width: 48,
  },
  fbutton: {
    // backgroundColor: '#4CAF50',
    backgroundColor: "#EC6319",
    color: "#000",
    // borderColor: "#000",
    // borderWidth: 2,
    borderRadius: 50,
    padding: 9,
    margin: 0,
    textAlign: "center",
  },
  unfollow: {
    // backgroundColor: '#4CAF50',
    backgroundColor: "#FFF",
    color: "#000",
    // borderColor: "#000",
    // borderWidth: 2,
    borderRadius: 50,
    padding: 9,
    margin: 0,
    textAlign: "center",
  },
  flexend: {
    marginRight: 0,
    marginLeft: "auto",
  },
  img: {
    height: 38,
    width: 38,
    borderRadius: 50,
  },
});

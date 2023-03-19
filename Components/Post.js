import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { color } from "react-native-reanimated";
import Icon from "react-native-vector-icons/Ionicons";
import Firemage from "./Firemage";
import { myFireBase } from "../fireBaseConfig";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  setDoc,
  addDoc,
} from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";

// Frontend & Styling of the post completed
export default ({ user, uid, caption, photos, collected, likes, comments, location, date }) => {
  const db = getFirestore(myFireBase);
  const [value, loading, error] = useDocument(doc(db, "Profiles", `${uid}`));
  // console.log(value.data())
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <View style={styles.postHeader}>
          <View style={styles.postPfp}>
            <Firemage style={styles.postPfpImage} path={value.data().Pfp}/>
          </View>
          <Text style={styles.usernameText}>{user}</Text>
        </View>
      </TouchableOpacity>

      {/* thumbnail photo/location */}
      <View style={styles.postImageB}>
        <TouchableOpacity>
          <Firemage
            style={styles.postImage}
            path={photos[0]}
            //resizeMode="contain"
            // source={{ uri: image }}
          />
        </TouchableOpacity>
      </View>

      {/* Like comment and save buttons */}
      <View style={styles.lcblist}>
        <TouchableOpacity
          onPress={() => {
            setLiked(!liked);
          }}
        >
          <Icon
            name={liked ? "heart-sharp" : "heart-outline"}
            size={34}
            color={liked ? "#EC6319" : "white"}
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Icon
            name={"chatbubble-outline"}
            size={32}
            color={"#FFFFFF"}
            style={styles.icon}
          />
        </TouchableOpacity>

        {/* <TouchableOpacity
          onPress={() => {
            setBookmarked(!bookmarked);
          }}
        >
          <Icon
            name={bookmarked ? "bookmark" : "bookmark-outline"}
            size={32}
            color={bookmarked ? "#FFFFFF" : "white"}
            style={styles.icon}
          />
        </TouchableOpacity> */}
      </View>
      {/* Caption and comments link */}
      <View style={styles.postCaption}>
        <Text style={styles.usernameText}>{user}</Text>
        <Text style={styles.captionText}>{caption}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  margin: {
    margin: "5%",
  },
  container: {
    backgroundColor: "#000",
  },
  icon: {
    width: 32,
    height: 32,
    marginLeft: 0,
    marginTop: 0,
    margin: 10,
  },
  usernameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 12,
  },
  captionText: {
    marginBottom: 0,
    marginTop: 0,
    fontSize: 14,
    color: "#fff",
  },
  postHeader: {
    alignItems: "center",
    flexDirection: "row",
    padding: 8,
  },
  postCaption: {
    alignItems: "center",
    flexDirection: "row",
    padding: 8,
  },
  postPfp: {
    alignItems: "center",
    display: "flex",
    height: 48,
    justifyContent: "center",
    marginRight: 12,
    width: 48,
  },
  postPfpImage: {
    height: 38,
    width: 38,
    borderRadius: 100
  },
  postImageB: {
    flex: 1,
    minHeight: 320,
  },
  postImage: {
    aspectRatio: 1,
    flex: 1,
  },
  lcblist: {
    paddingTop: 8,
    paddingLeft: 5,
    flexDirection: "row",
  },
});

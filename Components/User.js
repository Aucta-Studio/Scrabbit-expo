import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
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
import { useState } from "react";
import Firemage from "./Firemage";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { getAuth } from "firebase/auth";

export default function User({ id }) {
  const [followed, setFollowed] = useState(null);
  const db = getFirestore(myFireBase);
  const auth = getAuth(myFireBase);
  const navigation = useNavigation();

  const [value, loading, error] = useDocument(doc(db, "Profiles", `${id}`));

  const handleFollow = async () => {
    setFollowed(!followed);
    if (followed) {
      // setFollowed(!followed);
      // If already following, unfollow
      const q = query(
        collection(db, "Relations"),
        where("Followed", "==", id),
        where("Follower", "==", auth.currentUser.uid)
      );
      getDocs(q).then((docSnap) => {
        docSnap.forEach((doc) => {
          deleteDoc(doc.ref)
            .then(() => {
              console.log("Relation successfully deleted!");
            })
            .catch((error) =>
              console.error("Error removing document: ", error)
            );
        });
      });
    } else {
      // If not following, follow
      addDoc(collection(db, "Relations"), {
        Followed: id,
        Follower: auth.currentUser.uid,
      })
        .then(() => {
          console.log("Relation successfully added!");
        })
        .catch((error) => console.error("Error adding document: ", error));
    }
  };

  const checkFollowing = async () => {
    const q = query(
      collection(db, "Relations"),
      where("Followed", "==", `${id}`),
      where("Follower", "==", `${auth.currentUser.uid}`)
    );
    const docSnap = await getDocs(q);
    if (docSnap.size > 0) {
      setFollowed(true);
    } else {
      setFollowed(false);
    }
  };

  // Check if the current user is following this user
  useEffect(() => {
    checkFollowing();
  });
  // checkFollowing();

  return (
    <TouchableOpacity
      onPress={() => {
        if (id == auth.currentUser.uid) {
          navigation.navigate("Profile Screen");
        } else {
          navigation.navigate("ForeignProfileStack", {
            fuid: `${id}`,
            usrn: value.data().UserName,
          });
        }
      }}
    >
      <View style={styles.container}>
        {error && <Text>Error: {JSON.stringify(error)}</Text>}
        {loading && <Text>Document: Loading...</Text>}
        {value && (
          <>
            <View style={styles.row}>
              <View style={styles.pfp}>
                <Firemage style={styles.img} path={value.data().Pfp} />
              </View>
              <Text style={styles.usernameText}>{value.data().UserName}</Text>
              {id == auth.currentUser.uid ? (
                <></>
              ) : (
                <TouchableOpacity style={styles.flexend} onPress={handleFollow}>
                  <Text style={followed ? styles.fbutton : styles.unfollow}>
                    {followed ? "Following" : "Follow"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

// {(id == auth.currentUser.uid)? (<></>):}

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
    color: "#000",
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
    backgroundColor: "grey",
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

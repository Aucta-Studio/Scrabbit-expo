import "react-native-gesture-handler";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import React, { useEffect, useState } from "react";
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
import { getAuth } from "firebase/auth";
import Firemage from "../Components/Firemage";
import ScrapbooksList from "./ScrapbooksList";
import { useNavigation } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

function Tab() {
  const Tab = createMaterialTopTabNavigator();
  return (
    <Tab.Navigator
      initialRouteName="list"
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        tabBarLabelStyle: {
          fontWeight: "bold",
        },
        tabBarIndicatorStyle: {
          backgroundColor: "white",
        },
        tabBarStyle: {
          backgroundColor: "black",
        },
      }}
    >
      <Tab.Screen name="list" component={ScrapbooksList} />
    </Tab.Navigator>
  );
}

export default function ForeignProfile({ route }) {
  const { fuid } = route.params;
  const [followerCount, setfollowerCount] = useState(0);
  const [followingCount, setfollowingCount] = useState(0);
  const db = getFirestore(myFireBase);
  const auth = getAuth(myFireBase);
  const navigation = useNavigation();
  const [followed, setFollowed] = useState(null);
  const [value, loading, error] = useDocument(doc(db, "Profiles", `${fuid}`));
  const relations = collection(db, "Relations");
  const q1 = query(relations, where("Follower", "==", `${fuid}`));
  const q2 = query(relations, where("Followed", "==", `${fuid}`));

  const getCounts = async () => {
    const temp1 = await getDocs(q1);
    const temp2 = await getDocs(q2);
    var count = 0;
    temp1.forEach((doc) => {
      // console.log(doc.id, "=>", doc.data());
      count++;
    });
    // console.log(count);
    setfollowingCount(count);
    count = 0;
    temp2.forEach((doc) => {
      // console.log(doc.id, "=>", doc.data());
      count++;
    });
    // console.log(count);
    setfollowerCount(count);
  };

  const handleFollow = async () => {
    setFollowed(!followed);
    if (followed) {
      // If already following, unfollow
      const q = query(
        collection(db, "Relations"),
        where("Followed", "==", fuid),
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
        Followed: fuid,
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
      where("Followed", "==", `${fuid}`),
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
  getCounts();
  // if (value) {
  //   navigation.getParent().setParams({fuid: `${id}`,usrn:value.data().UserName});
  // }

  return (
    <SafeAreaView>
      <ScrollView>
        {error && <Text>Error: {JSON.stringify(error)}</Text>}
        {loading && <Text>Document: Loading...</Text>}
        {value && (
          <>
            <View style={styles.profileContainer}>
              <View style={styles.avatarContainer}>
                <Firemage path={value.data().Pfp} style={styles.avatar} />
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.nameText}>
                  {value.data().FirstName} {value.data().LastName}
                </Text>
                <Text style={styles.bioText}>{value.data().Bio}</Text>
                <View style={styles.friendsContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("FFM", { screen: "Followers" });
                    }}
                  >
                    <Text style={styles.friendsText}>
                      {followerCount} Followers{" "}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("FFM", { screen: "Following" });
                    }}
                  >
                    <Text style={styles.friendsText}>
                      {followingCount} Following
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleFollow}>
                  <Text style={followed ? styles.fbutton : styles.unfollow}>
                    {followed ? "Following" : "Follow"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {followed && <ScrapbooksList uid={fuid} />}
            {/* <View style={styles.tav}>
            <Tab />
          </View> */}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tav: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    minHeight: "65%",
  },
  fbutton: {
    // backgroundColor: '#4CAF50',
    backgroundColor: "#EC6319",
    color: "#000",
    // borderColor: "#000",
    // borderWidth: 2,
    borderRadius: 50,
    padding: 10,
    marginTop: 10,
    float: "right",
    textAlign: "center",
  },
  unfollow: {
    // backgroundColor: '#4CAF50',
    backgroundColor: "grey",
    color: "#000",
    // borderColor: "#000",
    // borderWidth: 2,
    borderRadius: 50,
    padding: 10,
    marginTop: 10,
    float: "right",
    textAlign: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#fff",
    // height: "100%"
  },
  avatarContainer: {
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
    padding: 16,
    backgroundColor: "#fff",
  },
  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  usernameText: {
    marginBottom: 16,
    fontSize: 16,
    color: "#aaa",
  },
  bioText: {
    fontSize: 16,
    color: "#000",
    marginTop: 8,
  },
  friendsContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 10,
  },
  friendsCount: {
    fontSize: 15,
    color: "#000",
    marginRight: 8,
  },
  friendsText: {
    fontSize: 16,
    color: "#000",
  },
  photosContainer: {
    marginTop: 10,
    padding: 16,
    backgroundColor: "#000",
  },
  photosText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  photosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  photo: {
    width: "42%",
    aspectRatio: 1,
    backgroundColor: "#555",
    margin: "",
  },
};

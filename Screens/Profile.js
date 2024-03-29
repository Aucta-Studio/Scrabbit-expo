import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import {
  Button,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { myFireBase } from "../fireBaseConfig";
import { useSelector, useDispatch } from "react-redux";
import ScrapbooksList from "./ScrapbooksList";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Firemage from "../Components/Firemage";

export default () => {
  const [followerCount, setfollowerCount] = useState(0);
  const [followingCount, setfollowingCount] = useState(0);
  const account = useSelector((state) => state.account);
  const db = getFirestore(myFireBase);
  const auth = getAuth(myFireBase);
  const relations = collection(db, "Relations");
  const q1 = query(relations, where("Follower", "==", auth.currentUser.uid));
  const q2 = query(relations, where("Followed", "==", auth.currentUser.uid));
  const dispatch = useDispatch();
  const navigation = useNavigation();

  function Tab() {
    const Tab = createMaterialTopTabNavigator();
    return (
      <Tab.Navigator
        initialRouteName="my"
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
        <Tab.Screen
          name="my"
          component={ScrapbooksList}
          initialParams={{ uid: auth.currentUser.uid }}
        />
      </Tab.Navigator>
    );
  }

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

  useEffect(() => {}, []);
  getCounts();
  // console.log(auth.currentUser.uid);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            <Firemage style={styles.avatar} path={account.pfp} />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.nameText}>
              {account.firstname} {account.lastname}
            </Text>
            <Text style={styles.bioText}>{account.bio}</Text>
            <View style={styles.friendsContainer}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("FFF");
                }}
              >
                <Text style={styles.friendsText}>
                  {followerCount} Followers
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("FFF", { screen: "Following" });
                }}
              >
                <Text style={styles.friendsText}>
                  {followingCount} Following
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Edit Profile");
              }}
            >
              <Text style={styles.editButton}>Edit Profile </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* <Tab /> */}
        <ScrapbooksList uid={auth.currentUser.uid} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  editButton: {
    fontSize: 15,
    color: "#fff",
    marginTop: 10,
    backgroundColor: "#333",
    borderRadius: 50,
    padding: 5,
    marginTop: 10,
    textAlign: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#fff",
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
    justifyContent: "space-around",
  },
  friendsCount: {
    fontSize: 15,
    color: "#000",
    marginRight: 8,
  },
  friendsText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "12",
  },
  photosContainer: {
    marginTop: 10,
    padding: 16,
    backgroundColor: "#000",
  },
  photosText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
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

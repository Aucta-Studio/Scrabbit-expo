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
  SafeAreaView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useSelector, useDispatch } from "react-redux";
import ScrapbooksList from "./ScrapbooksList";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

function Tab() {
  const Tab = createMaterialTopTabNavigator();
  return (
    <Tab.Navigator
      initialRouteName="my"
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        tabBarLabelStyle: {
          fontWeight: "bold"
        },
        tabBarIndicatorStyle: {
          backgroundColor: "white"
        },
        tabBarStyle: {
          backgroundColor: "black"
        }
      }}
    >
    <Tab.Screen name="my" component={ScrapbooksList} />
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
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: img }} style={styles.avatar} />
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
              <Text style={styles.friendsText}>Followers </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("FFF",{screen: "Following"});
              }}
            >
              <Text style={styles.friendsText}>Following</Text>
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
      <Tab />
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  editButton: {
    fontSize: 15,
    color: "#fff",
    marginTop: 10,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#000",
  },
  avatarContainer: {
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    marginRight: 10,
    backgroundColor: "#000",
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
    backgroundColor: "#000",
  },
  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  usernameText: {
    marginBottom: 16,
    fontSize: 16,
    color: "#aaa",
  },
  bioText: {
    fontSize: 16,
    color: "#fff",
    marginTop: 8,
  },
  friendsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  friendsCount: {
    fontSize: 15,
    color: "#fff",
    marginRight: 8,
  },
  friendsText: {
    fontSize: 16,
    color: "#aaa",
    fontWeight: "12"
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

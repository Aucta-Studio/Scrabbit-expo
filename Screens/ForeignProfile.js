import "react-native-gesture-handler";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { myFireBase } from "../fireBaseConfig";
import { getFirestore, doc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import Firemage from "../Components/Firemage";
import ScrapbooksList from "./ScrapbooksList";
import MutualFriends from "./MutualFriends";
import MakeFriends from "./MakeFriends";
import { useNavigation } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

export default function ForeignProfile({ route }) {
  const { fuid } = route.params;
  const db = getFirestore(myFireBase);
  const navigation = useNavigation();
  const [value, loading, error] = useDocument(doc(db, "Profiles", `${fuid}`));
  // if (value) {
  //   navigation.setOptions({
  //     title: `${value.data().UserName}`,
  //   });
  // }
  return (
    <SafeAreaView>
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
                    navigation.navigate("FFM",{screen:"Followers"});
                  }}
                >
                  <Text style={styles.friendsText}>Followers </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("FFM",{screen:"Following"});
                  }}
                >
                  <Text style={styles.friendsText}>Following</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity>
                <Text style={styles.fbutton}>F</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  fbutton: {
    // backgroundColor: '#4CAF50',
    backgroundColor: "#ea0",
    color : "#000",
    // borderColor: "#000",
    // borderWidth: 2,
    borderRadius: 50,
    padding: 10,
    marginTop: 10,
    float: 'right'
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
    color: "#fff",
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

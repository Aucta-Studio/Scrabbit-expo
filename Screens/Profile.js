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
} from "react-native";
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
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import MyScrapbooks from "./MyScrapbooks";
import Followers from "./Followers";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Component } from 'react';

function Tab() {
  const Tab = createMaterialTopTabNavigator();
  return (
    <Tab.Navigator initialRouteName="my">
      <Tab.Screen name="my" component={MyScrapbooks} />
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
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: img }}
            style={styles.avatar}
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.nameText}>{account.firstname} {account.lastname}</Text>
          <Text style={styles.usernameText}>@{account.username}</Text>
          <Text style={styles.bioText}>{account.bio}Bio here</Text> 
          <View style={styles.friendsContainer}>
              <Text style={styles.friendsCount}>324</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("FFF");
                }}
              >
                <Text style={styles.friendsText}>Friends</Text>
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
      <View style={styles.photosContainer}>
        <Text style={styles.photosText}>Scrapbooks</Text>
      </View>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#100'
  },
  
  editButton: {
    fontSize: 15,
    color: '#fff',
    marginTop: 10
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#100'
  },
  avatarContainer: {
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    marginRight: 10,
    backgroundColor: '#100'
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
    backgroundColor: '#100'
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
  },
  usernameText: {
    marginBottom: 16,
    fontSize: 16,
    color: '#aaa'
  },
  bioText: {
    fontSize: 16,
    color: '#fff',
    marginTop: 8
  },
  friendsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  friendsCount: {
    fontSize: 15,
    color: '#fff',
    marginRight: 8
  },
  friendsText: {
    fontSize: 16,
    color: '#fff'
  },
  photosContainer: {
    marginTop: 10,
    padding: 16,
    backgroundColor: '#100'
  },
  photosText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  photo: {
    width: '42%',
    aspectRatio: 1,
    backgroundColor: '#555',
    margin: ''
  }
};
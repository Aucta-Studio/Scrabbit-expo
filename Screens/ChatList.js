import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { db, auth } from "../fireBaseConfig";
import { collection, query, where, getDocs, getDoc } from "firebase/firestore";
import Profile from "./Profile";
import { useSelector } from "react-redux";
import Chat from "./Chat";
import { useNavigation } from "@react-navigation/native";
import Firemage from "../Components/Firemage";
import ChatUser from "../Components/ChatUser";
import { ScrollView } from "react-native";
import { RefreshControl } from "react-native";

export default function ChatList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const account = useSelector((state) => state.account);
  const navigation = useNavigation();
  const fetchUsers = async () => {
    try {
      const q = query(
        collection(db, "Relations"),
        where("Follower", "==", `${auth.currentUser.uid}`)
      );
      const unsub = await getDocs(q);
      let array = [];
      unsub.forEach((doc) => {
        array.push(doc.data().Followed);
      });
      console.log(array);
      setUsers(array);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUsers();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <ScrollView className="users_container" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
      {users?.map((user, index) => (
        <ChatUser key={index} id={user} />
      ))}
    </ScrollView>
  );
}

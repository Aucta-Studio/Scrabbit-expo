import { View, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState} from "react";
import { db } from "../fireBaseConfig";
import { collection, query, where, getDocs, getDoc  } from "firebase/firestore";
import Profile from "./Profile";
import { useSelector } from "react-redux";
import Chat from "./Chat"
import { useNavigation } from "@react-navigation/native";
import Firemage from '../Components/Firemage';

export default function ChatList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const account = useSelector((state) => state.account);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, "Profiles"), where("UserName", "!=", `${account.username}`));
        const unsub = await getDocs(q);
        let array = [];
        unsub.forEach((doc) => {
          array.push(doc.data())
        });
        setUsers(array);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <SafeAreaView className="users_container">
        {users?.map((user,index) => (
          <TouchableOpacity onPress={() => navigation.navigate("Chat", {user: user})} key={index} >
            {user && <Firemage path={user?.Pfp} style={{width:50,height:50}}/>}
            <Text>{user.FirstName} {user.LastName}</Text>
          </TouchableOpacity> 
        ))} 
    </SafeAreaView>
  )
}
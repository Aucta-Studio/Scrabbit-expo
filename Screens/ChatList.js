import { View, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState} from "react";
import { db, auth } from "../fireBaseConfig";
import { collection, query, where, getDocs, getDoc, doc, setDoc} from "firebase/firestore";
import Profile from "./Profile";
import { useSelector } from "react-redux";
import Chat from "./Chat"
import { useNavigation } from "@react-navigation/native";
import Firemage from '../Components/Firemage';
import ChatUser from "../Components/ChatUser";

export default function ChatList() {
  const [users, setUsers] = useState([]);
  const [chatIds, setchatIds] = useState([]);
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
          //array.push(doc.data())
          array.push({id: doc.id,...doc.data()})
        });
        setUsers(array);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchUsers();

  const getChatIds =async () => {
    try {
      const q = query(collection(db, "Chats"), where("user", "array-contains", auth.currentUser.uid));
      const unsub = await getDocs(q);
      let array = [];
        unsub.forEach((doc) => {
          array.push({id: doc.id, ...doc.data()});
        });
        setchatIds(array);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    console.log("Chatlistr",chatIds);
    getChatIds();
  }, []);

  const getChatId = async (userId) => {
    console.log("Chatlist ",chatIds)
    const existingChat = chatIds.find(chat => chat.user.includes(userId));
    console.log("exsits",existingChat);
    if(existingChat != undefined) {
      navigation.navigate("Chat", {chatId: existingChat.id});
    } else {
      const newChatRef = doc(collection(db, "Chats"));
      const newChat = {
        user: [auth.currentUser.uid, userId],
      };
      await setDoc(newChatRef, newChat);
      const chatId = newChatRef.id;
      setchatIds([...chatIds, {id: chatId, ...newChat}]);
      navigation.navigate("Chat", {chatId: chatId});
    }
  };

  return (
    <SafeAreaView className="users_container">
        {users?.map((user,index) => (
          <ChatUser id = {user.id} key={index} onPress={() => getChatId(user.id)}/>
          // <TouchableOpacity onPress={() => getChatId(user.id)} key={index} >
          //   {user && <Firemage path={user?.Pfp} style={{width:50,height:50}}/>}
          //   <Text>{user.FirstName} {user.LastName}</Text>
          // </TouchableOpacity> 
        ))} 
    </SafeAreaView>
  )
}
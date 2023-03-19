import React, { useState, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { db } from '../fireBaseConfig';
import { getAuth } from "firebase/auth";
import { myFireBase } from "../fireBaseConfig";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc,
  orderBy, 
  addDoc, 
  onSnapshot
} from "firebase/firestore";
import { useSelector } from "react-redux";

const ChatRoom = ({ route }) => {
  const { chatId } = route.params;
  const [messages, setMessages] = useState([]);
  const auth = getAuth(myFireBase);
  const account = useSelector((state) => state.account);
  console.log("in chat now",chatId);
  useEffect(() => {
    const chatRef  = doc(db,'Chats',chatId);
    const q = query(
      collection(chatRef, 'messages'),
      orderBy('createdAt', 'desc'),
    );

    const unsubscribe = onSnapshot(q,(querySnapshot) => {
        const messages = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
          _id: doc.id,
        }));
        setMessages(messages);
      });
    return () => unsubscribe();
  }, []);

  const onSend = async (newMessages = []) => {
    const chatRef = doc(db,'Chats', chatId);
    const docRef = await addDoc(collection(chatRef,'messages'), {
      text: newMessages[0].text,
      createdAt: new Date(),
      user: {
        _id:auth.currentUser.uid,
        name: account.firstname,
      },
    });
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(newMessages) => onSend(newMessages)}
      user={{
        _id: auth.currentUser.uid,
      }}
    />
  );
};

export default ChatRoom;
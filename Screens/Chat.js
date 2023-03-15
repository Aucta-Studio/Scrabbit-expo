import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { db } from '../fireBaseConfig';
import { collection, query, where, orderBy, limit, addDoc, onSnapshot } from 'firebase/firestore';
import { useSelector } from "react-redux";
export default function Chat({ route }) {
  const { user } = route.params;
  const [messages, setMessages] = useState([]);
  const account = useSelector((state) => state.account);


  useEffect(() => {
    const q = query(
      collection(db, 'Chats'),
      orderBy('createdAt', 'desc'),
   //   where('users', 'array-contains', account.username, user.UserName)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messageList = [];
      querySnapshot.forEach((doc) => {
    const message = {
      ...doc.data(),
      createdAt: new Date(doc.data().createdAt.seconds * 1000),
      _id: doc.id,
    };
    messageList.push(message);
  });
  setMessages(previousMessages =>
    GiftedChat.append(previousMessages, messageList)
  );
    });


    return () => unsubscribe();
  }, []);


  const handleSend = async (newMessage) => {
    try {
      const docRef = await addDoc(collection(db, 'Chats'), {
        text: newMessage[0].text,
        createdAt: new Date(),
        users: [account.username, user.UserName],
        user: {
          _id:account.username,
          name: account.firstname,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(newMessage) => handleSend(newMessage)}
      user={{
        _id:account.username,
        name: account.firstname,
      }}
    />
  );
}

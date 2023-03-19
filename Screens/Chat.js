import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { auth, db } from "../fireBaseConfig";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  onSnapshot,
  arrayUnion,
  getDocs,
} from "firebase/firestore";
import { useSelector } from "react-redux";
export default function Chat({ route }) {
  const { user } = route.params;
  const [chatID, setChatID] = useState([]);
  const [messages, setMessages] = useState([]);
  const account = useSelector((state) => state.account);
  const me = {
    _id: auth.currentUser.uid,
    name: account.firstname,
  }
  const qc = query(
    collection(db, "Chats"),
    where("users", "==", [auth.currentUser.uid, user])
  );

  async function getChatID() {
    const temp = await getDocs(qc);
    let array = [];
    temp.forEach((doc) => {
      array.push(doc.id);
    });
    console.log("array of docs", array);
    if (array.length > 0) {
      // Chat already exists, set chat ID to existing chat ID
      setChatID(array[0]);
      return array[0];
    } else {
      // Create new chat
      const newChat = addDoc(collection(db, "Chats"), {
        users: arrayUnion(auth.currentUser.uid, user),
      });
      setChatID(newChat.id);
      return newChat.id;
    }
  }

  async function getMessages() {
    const chat = await getChatID();
    const messageRef = query(collection(db, "Chats", chat, "Messages"),orderBy("createdAt", "desc"));
    const temp = onSnapshot(messageRef, (querySnapshot) => {
      setMessages(
        querySnapshot.docs.map((doc) => ({
          _id: doc.id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }))
      );
    });
  }

  useEffect(() => {
    getMessages();
  }, []);

  // {chatID && !messages && getMessages()}

  const handleSend = useCallback(async (newMessages = []) => {
    try {
      const messagesRef = collection(db, 'Chats', chatID, 'Messages');
      const newMessage = newMessages[0];
      const { text } = newMessage;
  
      const docRef = await addDoc(messagesRef, {
        text,
        createdAt: new Date(),
        user: {
          _id: auth.currentUser.uid,
          name: account.firstname,
        },
      });
  
      console.log('Message added:', docRef.id);
  
    } catch (error) {
      console.error(error);
    }
  }, [account.firstname, chatID]);

  console.log("chatID: ", chatID);
  console.log("messages: ", messages);

  return (
    <GiftedChat
      messages={messages}
      inverted={true}
      onSend={(newMessage) => handleSend(newMessage)}
      user={me}
    />
  );
}

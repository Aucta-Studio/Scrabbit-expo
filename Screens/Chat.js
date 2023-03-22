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
  onSnapshot,
  deleteDoc
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

  async function onDelete(messageId) {
    const ref = doc(db, "Chats", chatId, "messages", messageId);
    await deleteDoc(ref);
  }

  function onLongPress(context, message) {
    console.log(context, message);
    const ownership = message.user._id == auth.currentUser.uid;
    const options1 = ["Copy Text", "Delete", "Cancel"];
    const options2 = ["Copy Text", "Cancel"];
    var options = ownership ? options1 : options2;
    const cancelButtonIndex = options.length - 1;
    context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        if (ownership) {
          switch (buttonIndex) {
            case 0:
              Clipboard.setString(message.text);
              break;
            case 1:
              // this.onDelete(messageIdToDelete) //pass the function here
              onDelete(message._id);
              break;
          }
        } else {
          switch (buttonIndex) {
            case 0:
              Clipboard.setString(message.text);
              break;
          }
        }
      }
    );
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={(newMessages) => onSend(newMessages)}
      user={{
        _id: auth.currentUser.uid,
      }}
      onLongPress={onLongPress}
      showAvatarForEveryMessage={false}
    />
  );
};

export default ChatRoom;
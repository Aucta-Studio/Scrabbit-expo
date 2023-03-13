import React, { useState, useCallback } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Clipboard,
} from "react-native";
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Message,
} from "react-native-gifted-chat";
import { myFireBase } from "../fireBaseConfig";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  setDoc,
  addDoc,
  arrayUnion,
  updateDoc,
  arrayRemove,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import Icon from "react-native-vector-icons/Ionicons";
import { useEffect } from "react";
import { useSelector } from "react-redux";

// const renderMessage = (props) => {
//   const { currentMessage } = props;
// };

function renderTime(props) {
  const { currentMessage } = props;
  const date = currentMessage.createdAt;
  const timestamp = new Date(date);
  const currentTime = new Date();
  const timeDiffMs = currentTime.getTime() - timestamp.getTime();
  const elapsedSeconds = Math.floor(timeDiffMs / 1000);
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  const elapsedDays = Math.floor(elapsedHours / 24);
  // defining the string for display
  var timeDiff = "";
  if (elapsedSeconds < 60) {
    timeDiff = "just now";
  } else if (elapsedMinutes < 60) {
    timeDiff = `${elapsedMinutes}m ago`;
  } else if (elapsedHours < 24) {
    timeDiff = `${elapsedHours}h ago`;
  } else {
    timeDiff = `${elapsedDays} days ago`;
  }
  return (
    <View
    // style={styles.timeContainer}
    >
      <Text>{timeDiff}</Text>
      {/* {currentMessage.user._id === me._id ? (
        <Text
        // style={styles.timeRight}
        >{timeDiff}</Text>
      ) : (
        <Text
        // style={styles.time}
        >{timeDiff}</Text>
      )} */}
    </View>
  );
}

function renderInputToolbar(props) {
  return (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: "white",
        borderTopWidth: 1,
        borderTopColor: "#E8E8E8",
      }}
    />
  );
}

export default function Comments({ route }) {
  const auth = getAuth(myFireBase);
  const db = getFirestore(myFireBase);
  const account = useSelector((state) => state.account);
  const postID = route.params.postID;
  const ownerID = route.params.owner;
  const [comments, setComments] = useState([]);
  const postRef = doc(db, "Posts", postID);
  const postsCommentsRef = collection(postRef, "Comments");
  const q = query(postsCommentsRef, orderBy("createdAt", "asc"));
  const me = {
    _id: auth.currentUser.uid,
    name: account.username,
  };

  const onSend = useCallback((messages = []) => {
    setComments((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    const { _id, createdAt, text, user } = messages[0];
    addDoc(postsCommentsRef, {
      _id,
      createdAt,
      text,
      user,
    });
  }, []);

  const onDelete = async (messageId) => {
    setComments(comments.filter((message) => message._id !== messageId));
    const q = query(postsCommentsRef, where("_id", "==", messageId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  };

  function onLongPress(context, message) {
    console.log(context, message);
    const supporter = message.user._id == me._id;
    const ownership = ownerID == me._id;
    const options1 = ["Copy Text", "Delete", "Cancel"];
    const options2 = ["Copy Text", "Cancel"];
    var options = supporter ? options1 : options2;
    if (ownership) options = options1;
    const cancelButtonIndex = options.length - 1;
    context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        if (ownership || supporter) {
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

  function renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: "#f0f0f0",
            borderRadius: 8,
            marginLeft: 0,
          },
          right: {
            backgroundColor: "#EC6319",
            borderRadius: 8,
            padding: "1%",
            marginLeft: "1%",
            alignSelf: "flex-start",
          },
        }}
        textStyle={{
          left: {
            color: "#000",
          },
          right: {
            color: "#000",
          },
        }}
      />
    );
  }

  const getComments = async () => {
    const temp = onSnapshot(q, (querySnapshot) => {
      setComments(
        querySnapshot.docs.map((doc) => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }))
      );
    });
  };

  useEffect(() => {
    getComments();
  }, []);

  return (
    <GiftedChat
      messages={comments}
      // inverted={true}
      onSend={onSend}
      user={me}
      onLongPress={onLongPress}
      // renderMessage={renderMessage}
      renderBubble={renderBubble}
      renderAvatar={null}
      renderInputToolbar={renderInputToolbar}
      renderTime={renderTime}
      renderUsernameOnMessage={true}
      alignTop={true}
      renderDay={() => null}
    />
  );
}

const styles = StyleSheet.create({});

import React, { useState, useCallback } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Message,
} from "react-native-gifted-chat";
import Clipboard from "@react-native-community/clipboard";
import { Dialog, Menu, Modal } from "react-native-paper";
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
import { MenuTrigger } from "react-native-popup-menu";

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
    <View style={{ justifyContent: "space-between", alignItems: "flex-end", minWidth:"70%"}}>
      <Text>{timeDiff}</Text>
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
      report_flag: "N",
      flagged_enabled: "N"
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
            backgroundColor: "blue",
            borderRadius: 8,
            padding: "1%",
            marginLeft: 0,
            width: "98%",
          },
          right: {
            backgroundColor: "#EC6319",
            borderRadius: 8,
            padding: "1%",
            paddingRight: "auto",
            marginLeft: "2%",
            alignSelf: "flex-start",
            width: "98%",
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
    <View>
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
    {/* <View style={{backgroundColor: '#000'}}>
          <Menu>
            <MenuTrigger>
              <Icon name="dots-three-horizontal" color={"white"} size={27} 
              style={{backgroundColor: '#000', alignSelf: 'flex-end', marginRight: '8%'}}></Icon>
            </MenuTrigger>
            <MenuOptions>
              <MenuOption onSelect={() => {showDialog}} >
                <Icon2 name="report" color={"white"}></Icon2>
                <Text>Report</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
          <Dialog.Container visible={visible} style={styles.container2}>
              <Dialog.Title>Report Scrapbook</Dialog.Title>
              <Dialog.Description>
                Please tell us the reason for the report:
              </Dialog.Description>
              <Dialog.Input
              onChangeText={(reason) => setReason(reason)}
              // onChange={() => setReason(reason)}
              />
              <Dialog.Button label="Cancel" onPress={handleCancel} />
              <Dialog.Button label="OK" onPress={handleConfirm(value.data().Pfp, value.data().Bio, value.data().FirstName, value.data().LastName)} />
          </Dialog.Container>
        </View> */}
    </View>
  );
}

const styles = StyleSheet.create({});

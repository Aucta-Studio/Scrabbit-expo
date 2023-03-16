import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  ScrollView,
  Dimensions,
  Linking,
  Alert,
} from "react-native";
import { color } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import Firemage from "./Firemage";
import { myFireBase } from "../fireBaseConfig";
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
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useDocument } from "react-firebase-hooks/firestore";

// Frontend & Styling of the post completed
export default ({
  user,
  uid,
  title,
  caption,
  photos,
  collected,
  likes,
  location,
  date,
  docID,
}) => {
  const db = getFirestore(myFireBase);
  const navigation = useNavigation();
  const [value, loading, error] = useDocument(doc(db, "Profiles", `${uid}`));
  const auth = getAuth(myFireBase);
  // console.log(value.data())
  const [liked, setLiked] = useState(likes.includes(auth.currentUser.uid));
  const [bookmarked, setBookmarked] = useState(false);
  // console.log(collected);
  // setLiked();
  const acquired = collected.includes(auth.currentUser.uid);
  // console.log(docID);

  // initialising constants and variables for time calculations
  const timestamp = new Date(
    date?.seconds * 1000 + date?.nanoseconds / 1000000
  );
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

  // initialisin variables for the carousel
  const [imgActive, setimgActive] = useState(0);
  const onchange = (nativeEvent) => {
    if (nativeEvent) {
      const slide = Math.ceil(
        nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width
      );
      if (slide != imgActive) {
        setimgActive(slide);
      }
    }
  };

  // initialising url
  const url = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;

  // handle like function
  const handleLike = async () => {
    const postRef = doc(db, "Posts", docID);
    const temp = await getDoc(postRef);
    const currLikes = temp.data().Likes;
    // console.log(currLikes);
    setLiked(!liked);
    if (liked) {
      await updateDoc(postRef, {
        Likes: arrayRemove(auth.currentUser.uid),
      })
        .then(console.log("Post UnLiked"))
        .catch((error) => {
          console.log("error unliking post");
        });
    } else {
      await updateDoc(postRef, {
        Likes: arrayUnion(auth.currentUser.uid),
      })
        .then(console.log("Post Liked"))
        .catch((error) => {
          console.log("error liking post");
        });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <View style={styles.postHeader}>
          <View style={styles.postPfp}>
            {value && (
              <Firemage style={styles.postPfpImage} path={value.data().Pfp} />
            )}
          </View>
          <Text style={styles.usernameText}>
            {user} at {title}
          </Text>
        </View>
        <View style={styles.reportButtonContainer}>
          <TouchableOpacity
            style={styles.reportButton}
            onPress={() => {
              let reason = "";
              if (Platform.OS === "ios") {
                Alert.prompt(
                  "Report Image",
                  "Please tell us the reason for the report:",
                  (text) => {
                    reason = text;
                    Alert.alert(`Image Reported for ${reason}`);
                  }
                );
              } else {
                Alert.alert(
                  "Report Image",
                  "Please tell us the reason for the report:",
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "OK",
                      onPress: () => {
                        Alert.alert(`Image Reported for ${reason}`);
                      },
                    },
                  ],
                  {
                    editable: true,
                    onDismiss: (text) => {
                      reason = text;
                    },
                    style: { backgroundColor: "black" },
                    placeholder: "Enter reason here",
                  }
                );
              }
            }}
          >
            <Icon name="flag-outline" size={19} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* thumbnail photo/location */}
      {acquired && (
        <View style={styles.postImageB}>
          <ScrollView
            onScroll={({ nativeEvent }) => {
              onchange(nativeEvent);
            }}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            horizontal
            style={styles.postImage}
          >
            {photos?.map((photo, index) => {
              return (
                <Firemage
                  key={index}
                  style={styles.postImage}
                  path={photo}
                  resizeMode="contain"
                />
              );
            })}
          </ScrollView>
          <View style={styles.wrapDot}>
            {photos?.map((photo, index) => (
              <Text
                key={index}
                style={imgActive == index ? styles.dotActive : styles.dot}
              >
                ●
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* if the post isnt captured then display a prompt */}
      {!acquired && (
        <View style={styles.postCaption}>
          <Text style={styles.captionText}>
            You haven't collected this Scrapbook yet please go to its location
            and collect this scrapbook. Tap here to open the location on Google
            Maps.{""}
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(url);
              }}
            >
              <Icon name="map-outline" size={24} color="white" />
            </TouchableOpacity>
          </Text>
        </View>
      )}

      {/* Caption and comments link */}
      <View style={styles.postCaption}>
        <Text style={styles.usernameText}>{user}</Text>
        <Text style={styles.captionText}>{caption}</Text>
      </View>
      {/* Time difference */}
      <View style={styles.postCaption}>
        <Text style={styles.captionText}>{timeDiff}</Text>
      </View>
      {/* Like comment and save buttons only when its acquired*/}
      {acquired && (
        <View style={styles.lcblist}>
          <TouchableOpacity onPress={handleLike}>
            <Icon
              name={liked ? "heart-sharp" : "heart-outline"}
              size={34}
              color={liked ? "#EC6319" : "white"}
              style={styles.icon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Comments", { postID: docID, owner: uid });
            }}
          >
            <Icon
              name={"chatbubble-outline"}
              size={32}
              color={"#FFFFFF"}
              style={styles.icon}
            />
          </TouchableOpacity>

          {/* <TouchableOpacity
          onPress={() => {
            setBookmarked(!bookmarked);
          }}
        >
          <Icon
            name={bookmarked ? "bookmark" : "bookmark-outline"}
            size={32}
            color={bookmarked ? "#FFFFFF" : "white"}
            style={styles.icon}
          />
        </TouchableOpacity> */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  margin: {
    margin: "5%",
  },
  container: {
    backgroundColor: "#000",
  },
  icon: {
    width: 32,
    height: 32,
    marginLeft: 0,
    marginTop: 0,
    margin: 10,
  },

  reportButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 20,
    marginTop: 10,
  },
  reportButton: {
    backgroundColor: "red",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  reportButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  usernameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 12,
  },
  captionText: {
    marginBottom: 0,
    marginTop: 0,
    fontSize: 14,
    color: "#fff",
  },
  postHeader: {
    alignItems: "center",
    flexDirection: "row",
    padding: 8,
  },
  postCaption: {
    alignItems: "center",
    flexDirection: "row",
    padding: 8,
  },
  postPfp: {
    alignItems: "center",
    display: "flex",
    height: 48,
    justifyContent: "center",
    marginRight: 12,
    width: 48,
  },
  postPfpImage: {
    height: 38,
    width: 38,
    borderRadius: 100,
  },
  postImageB: {
    flex: 1,
    minHeight: 320,
  },
  postImage: {
    aspectRatio: 1,
    flex: 1,
  },
  lcblist: {
    paddingTop: 8,
    paddingLeft: 5,
    flexDirection: "row",
  },
  wrapDot: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    alignSelf: "center",
  },
  dot: {
    margin: 3,
    color: "#000",
  },
  dotActive: {
    margin: 3,
    color: "#FFF",
  },
});

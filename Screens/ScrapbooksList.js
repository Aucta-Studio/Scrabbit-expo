import React, { useState, useEffect } from "react";
import {
  Button,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc,
  orderBy,
} from "firebase/firestore";
import { myFireBase } from "../fireBaseConfig";
import Icon from "react-native-vector-icons/Ionicons";
import Icon1 from "react-native-vector-icons/FontAwesome5";
import Post from "../Components/Post";

export default ({ uid }) => {
  // const uid = route.params.uid;
  const id = uid;
  // console.log(id);
  const db = getFirestore(myFireBase);
  const [posts, setPosts] = useState(null);
  const PostStore = collection(db, "Posts");

  const getPosts = async () => {
    const qp = query(
      PostStore,
      where("author", "==", id),
      orderBy("createdAt", "asc")
    );
    const array = [];
    const temp = await getDocs(qp);
    temp.forEach((doc) => {
      // console.log(doc.id, "=>", doc.data());
      array.push({ id: doc.id, ...doc.data() });
    });
    console.log(array);
    setPosts(array);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.flexend}>
        <Text style={styles.tex}>
        <Icon1 name="carrot" size={32} color="white" />
        {posts?.length}
        </Text>
        {/* <Image source={require("../images/feed_button.png")} style={styles.icon} resizeMode="contain"/> */}
      </View>
      <View
        style={{
        borderBottomColor: '#fff',
        borderBottomWidth: 2,
        marginTop: -2,
      }}
/>
      {/* <Text style={styles.tex}>This is My scrapbooks page</Text> */}
      <ScrollView>
        {posts?.map((post, index) => {
          return (
            <Post
              key={index}
              user={post.UserName}
              uid={post.author}
              title={post.Title}
              caption={post.Caption}
              photos={post.photos}
              collected={post.Collected}
              likes={post.Likes}
              location={post.location}
              date={post.createdAt}
              docID={post.id}
            />
          );
        })}
        <View style={{ marginBottom: "100%" }}></View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#000",
  },
  tex: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 32,
    fontWeight:"",
  },
  icon: {
    width: "35%",
    height: "35%",
    aspectRatio: 1,
  },
  flexend: {
    marginRight: "auto",
    marginLeft: "auto",
    //borderBottomColor: "#FFF",
    //borderBottomWidth: 2
  },
});

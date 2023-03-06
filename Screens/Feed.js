import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { myFireBase } from "../fireBaseConfig";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import Post from "../Components/Post";

// The post retrieval from database is in progress. 
// For now, posts are hardcoded to show how the feed will look like.
// Like & Comment 
const Feed = () => {
  const auth = getAuth(myFireBase);
  const db = getFirestore(myFireBase);
  const [idList, setList] = useState(null);
  const [posts, setPosts] = useState(null);
  const relations = collection(db, "Relations");
  const PostStore = collection(db, "Posts");
  const q = query(relations, where("Follower", "==", `${auth.currentUser.uid}`));

  const getList = async () => {
    const temp = await getDocs(q);
    const array = [];
    temp.forEach((doc) => {
      // console.log(doc.id, "=>", doc.data());
      array.push(doc.data().Followed);
    });
    array.push(`${auth.currentUser.uid}`);
    console.log(array)
    setList(array);
  };

  const getPosts = async() => {
    const qp = idList ? query(PostStore, where("author", "in", idList)) : query()
    const array = []
    const temp = await getDocs(qp);
    temp.forEach((doc) => {
      // console.log(doc.id, "=>", doc.data());
      array.push(doc.data());
    });
    console.log(array)
    setPosts(array);
  }

  useEffect(() => {
    getList();
    getPosts();
  }, []);

  return (
    <SafeAreaView className="bg-zinc-900 h-full p-4">
        <ScrollView>
          {/* <Text className="text-white">This is the feed page</Text> */}
            <Post
              user="4aas_h"
              pfp="https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png"
              image="https://th.bing.com/th/id/OIP.eKF2blXCrUp4s_xCE6ncgwHaD3?pid=ImgDet&rs=1"
              caption="good day at le louvre"
            />
            <Post
              user="jdm324xd"
              pfp="https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG.png"
              image="https://firebasestorage.googleapis.com/v0/b/scrabbit-app-test-1.appspot.com/o/posts%2F7He64dcM47bc6Pn4PyZmLowIOyk2%2F0.3ufycyx9ne4.jpeg?alt=media&token=5a7a8239-abb5-4c3a-9dec-47973cda4d15"
              caption="Good Night! <3"
            />
        </ScrollView>
    </SafeAreaView>
  )
}

export default Feed
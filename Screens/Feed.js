import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState, useCallback } from "react";
import { SafeAreaView, ScrollView, Text, View, RefreshControl } from "react-native";
import Post from "../Components/Post";
import { myFireBase } from "../fireBaseConfig";

// The post retrieval from database is in progress.
// For now, posts are hardcoded to show how the feed will look like.
// Like & Comment
const Feed = () => {
  const auth = getAuth(myFireBase);
  const db = getFirestore(myFireBase);
  const [idList, setList] = useState(null);
  const [posts, setPosts] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const relations = collection(db, "Relations");
  const PostStore = collection(db, "Posts");
  const q = query(
    relations,
    where("Follower", "==", `${auth.currentUser.uid}`)
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getPosts();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const getList = async () => {
    const temp = await getDocs(q);
    const array = [];
    temp.forEach((doc) => {
      // console.log(doc.id, "=>", doc.data());
      array.push(doc.data().Followed);
    });
    array.push(`${auth.currentUser.uid}`);
    // console.log(array);
    setList(array);
  };

  const getPosts = async () => {
    const qp = idList
      ? query(PostStore, where("author", "in", idList))
      : query();
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
    getList();
    // getPosts();
  }, []);

  {
    idList && !posts && getPosts();
  }

  return (
    <SafeAreaView>
      <ScrollView>
        {/* <Text className="text-white">This is the feed page</Text> */}
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
              comments={post.Comments}
              location={post.location}
              date={post.createdAt}
              docID={post.id}
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Feed;

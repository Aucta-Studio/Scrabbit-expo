import { SafeAreaView, View, Text, ScrollView } from "react-native";
import React, { useEffect } from "react";
import { SearchBar } from "react-native-elements";
import { useState } from "react";
import { myFireBase } from "../fireBaseConfig";
import { getAuth } from "firebase/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import User from "../Components/User";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
const db = getFirestore(myFireBase);

async function getMutualFriends(user1Id, user2Id) {
  const mutualFriends = [];

  // Get user1's friends
  const user1FriendsQuery = query(
    collection(db, "Relations"),
    where("Follower", "==", user1Id)
  );
  const user1FriendsSnapshot = await getDocs(user1FriendsQuery);
  const user1FriendIds = user1FriendsSnapshot.docs.map(
    (doc) => doc.data().Followed
  );

  // Get user2's friends
  const user2FriendsQuery = query(
    collection(db, "Relations"),
    where("Follower", "==", user2Id)
  );
  const user2FriendsSnapshot = await getDocs(user2FriendsQuery);
  const user2FriendIds = user2FriendsSnapshot.docs.map(
    (doc) => doc.data().Followed
  );

  // Find mutual friends
  user1FriendIds.forEach((friendId) => {
    if (user2FriendIds.includes(friendId)) {
      mutualFriends.push(friendId);
    }
  });

  return mutualFriends;
}

export default function MutualFriends({ route }) {
  const { fuid } = route.params;
  const auth = getAuth(myFireBase);
  const [mutuals, setMutuals] = useState([]);
  
  useEffect(() => {
    const getMutuals = async () => {
      const mutuals = await getMutualFriends(auth.currentUser.uid, fuid);
      setMutuals(mutuals);
    };
    getMutuals();
  }, [auth.currentUser.uid, fuid]);

  return (
    <SafeAreaView>
      <ScrollView>
        {mutuals?.map((follower, index) => {
          return <User key={index} id={follower} />;
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

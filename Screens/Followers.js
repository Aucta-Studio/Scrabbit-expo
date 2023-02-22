import { SafeAreaView, ScrollView } from "react-native";
import React, { useEffect } from "react";
import { myFireBase } from "../fireBaseConfig";
import { useSelector } from "react-redux";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import User from "../Components/User";

export default function Followers({ route }) {
  const { uid } = route.params;
  const [followers, setFolowers] = useState(null);
  const db = getFirestore(myFireBase);
  const auth = getAuth(myFireBase);
  const account = useSelector((state) => state.account);
  const relations = collection(db, "Relations");
  const q = query(relations, where("Followed", "==", `${uid}`));
  const getFollowers = async () => {
    const temp = await getDocs(q);
    const array = [];
    temp.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
      array.push(doc.data().Follower);
    });
    setFolowers(array);
  };

  useEffect(() => {
    getFollowers();
  }, []);

  // console.log(followers);
  return (
    <SafeAreaView>
      <ScrollView>
        {followers?.map((follower, index) => {
          return <User key={index} id={follower} />;
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

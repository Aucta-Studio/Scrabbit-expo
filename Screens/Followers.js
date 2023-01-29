import { View, Text, SafeAreaView } from "react-native";
import React, { useEffect } from "react";
import { myFireBase } from "../fireBaseConfig";
import { useSelector, useDispatch } from "react-redux";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import User from "../Components/User";

export default function Followers() {
  const [followers, setFolowers] = useState(null);
  const db = getFirestore(myFireBase);
  const auth = getAuth(myFireBase);
  const account = useSelector((state) => state.account);
  const relations = collection(db, "Relations");
  const q = query(
    relations,
    where("Followed", "==", `${auth.currentUser.uid}`)
  );
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

  console.log(followers);
  return (
    <SafeAreaView>
      {followers?.map((follower)=>{return <User id={follower}/>})}
    </SafeAreaView>
  );
}

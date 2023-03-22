import { SafeAreaView, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
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
import User from "../Components/User";

export default function Following({ route }) {
  const { uid } = route.params;
  const [followed, setFolowed] = useState(null);
  const db = getFirestore(myFireBase);
  const auth = getAuth(myFireBase);
  const account = useSelector((state) => state.account);
  const relations = collection(db, "Relations");
  const q = query(relations, where("Follower", "==", `${uid}`));

  const getFollowed = async () => {
    const temp = await getDocs(q);
    const array = [];
    temp.forEach((doc) => {
      // console.log(doc.id, "=>", doc.data());
      array.push(doc.data().Followed);
    });
    setFolowed(array);
  };

  // useEffect(() => {
  //   getFollowed();
  // }, []);
  getFollowed();

  // console.log(followed);
  return (
    <SafeAreaView style={{backgroundColor: "white"}}>
      <ScrollView style={{backgroundColor: "white"}}>
        {followed?.map((followed, index) => {
          return <User key={index} id={followed} />;
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

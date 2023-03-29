import { SafeAreaView, View, Text, ScrollView } from "react-native";
import React, { useEffect } from "react";
import { SearchBar } from "react-native-elements";
import { useState } from "react";
import { myFireBase } from "../fireBaseConfig";
import { useCollection } from "react-firebase-hooks/firestore";
import { useSelector } from "react-redux";
import User from "../Components/User";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export default function MakeFriends() {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const account = useSelector((state) => state.account);
  const db = getFirestore(myFireBase);

  useEffect(() => {
    const searchProfiles = async () => {
      let q;
      if (searchText === "") {
        q = query(collection(db, "Profiles"), where("UserName", "!=", `${account.username}`));
      } else {
        q = query(collection(db, "Profiles"), where("UserName", "==", searchText));
      }
      // const q = query(
      //   collection(db, "Profiles"),
        
      // );
      // where("UserName", "==", searchText)
      // where("UserName", "array-contains-any", substrings)
      const result = await getDocs(q);
      const array = [];
      result.forEach((doc) => {
        // console.log(doc.id, "=>", doc.data());
        array.push(doc.id);
      });
      setSearchResults(array);
    };

    // if (searchText !== "") {
    //   searchProfiles();
    // } else {
    //   setSearchResults([]);
    // }
    searchProfiles();
  }, [searchText]);

  return (
    <SafeAreaView>
      <SearchBar
        placeholder="Search by username"
        value={searchText}
        onChangeText={(text) => {
          setSearchText(text);
        }}
        // onSubmitEditing={handleSearch}
      />
      <ScrollView>
        {searchResults?.map((user, index) => {
          return <User key={index} id={user} />;
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

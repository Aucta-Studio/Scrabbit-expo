import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";
import { SearchBar } from "react-native-elements";
import Carrot from "../Components/Carrot";
import * as Location from "expo-location";

import { myFireBase } from "../fireBaseConfig";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export default () => {
  const auth = getAuth(myFireBase);
  const db = getFirestore(myFireBase);
  const [idList, setList] = useState(null);
  const [posts, setPosts] = useState(null);
  const relations = collection(db, "Relations");
  const PostStore = collection(db, "Posts");
  const q = query(
    relations,
    where("Follower", "==", `${auth.currentUser.uid}`)
  );

  const getList = async () => {
    const temp = await getDocs(q);
    const array = [];
    temp.forEach((doc) => {
      // console.log(doc.id, "=>", doc.data());
      array.push(doc.data().Followed);
    });
    array.push(`${auth.currentUser.uid}`);
    // console.log(array)
    setList(array);
  };

  const getPosts = async () => {
    const qp = idList
      ? query(PostStore, where("author", "in", idList))
      : query();
    // const qp = query(PostStore, where("author", "in", idList));
    const array = [];
    const temp = await getDocs(qp);
    temp.forEach((doc) => {
      // console.log(doc.id, "=>", doc.data());
      array.push(doc.data());
    });
    console.log(array);
    setPosts(array);
  };

  const [myLocation, setLocation] = useState({
    latitude: 25.101969,
    longitude: 55.162172,
    latitudeDelta: 0.009,
    longitudeDelta: 0.009,
  });
  const [searchText, setSearchText] = useState("");
  const userLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
    }
    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });
    setLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
  };

  useEffect(() => {
    userLocation();
    getList();
    // getPosts();
  }, []);

  {idList && !posts && getPosts();}
  
  return (
    <SafeAreaView>
      <SearchBar
        placeholder="Search for location or title"
        value={searchText}
        onChangeText={(text) => {
          setSearchText(text);
        }}
      />
      <ScrollView>
        <MapView
          style={styles.map}
          region={myLocation}
          customMapStyle={darkStyle}
        >
          <Marker
            coordinate={{
              latitude: myLocation.latitude,
              longitude: myLocation.longitude,
            }}
            title="Me"
          />
          {posts?.map((post, index) => {
            // console.log(post);
            return (
              <Carrot
                key={index}
                coordinate={{
                  latitude: post?.location.latitude,
                  longitude: post?.location.longitude,
                }}
                title={post?.Title}
                username={post?.UserName}
                doc={post?.createdAt}
                saves={post?.Collected.length}
                likes={post?.Likes.length}
                // comments={post?.Comments?.length}
              />
            );
          })}
        </MapView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

const darkStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#212121",
      },
    ],
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#212121",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#bdbdbd",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#181818",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1b1b1b",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#2c2c2c",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#8a8a8a",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      {
        color: "#373737",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#3c3c3c",
      },
    ],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [
      {
        color: "#4e4e4e",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#000000",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#3d3d3d",
      },
    ],
  },
];

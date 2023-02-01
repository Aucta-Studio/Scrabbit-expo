import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";


export default ({ pfp, user, caption, state, image }) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  return (
    <View style={styles.container}>
      {/* username display */}
      <TouchableOpacity>
        <View style={styles.margin}>
          <Image source={{ uri: pfp }} style={styles.avatar} />
          <Text style={styles.user}>{user}</Text>
        </View>
      </TouchableOpacity>
      {/* thumbnail photo/location */}
      <View style={styles.imgContainer}>
          <Image
            style={styles.image}
            // resizeMode="contain"
            source={{ uri: image }}
          />
      </View>
      {/* Like comment and save buttons */}
      <View style={{ flexDirection: "row", margin: "5%" }}>
        <TouchableOpacity
          onPress={() => {
            setLiked(!liked);
          }}
        >
          <Icon
              name={liked ? "heart-sharp" : "heart-outline"}
              size={34}
              color={liked ? "#E98E3E" : "white"}
              style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Icon
                name={"chatbubble-outline"}
                size={32}
                color={"#FFFFFF"}
                style={styles.icon}
            />
        </TouchableOpacity>

        <TouchableOpacity
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
        </TouchableOpacity>
      </View>
      {/* Caption and comments link */}
      <View style={styles.margin}>
        <Text style={styles.usernameText}>{caption}</Text>
      </View>
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
  user: {
    fontWeight: "bold",
    fontSize: 20,
    padding: 0,
    marginLeft: 30,
    color: "#fff"
  },
  icon: {
    width: 32,
    height: 32,
    marginLeft: 0,
    marginTop: 0,
    margin: 10,
  },
  imgContainer: {
    flexDirection: 'row'
  },
  image: {
    resizeMode: 'contain',
    flex: 1,
    aspectRatio: 1,
    marginLeft: 15 // Your aspect ratio
},
  avatarContainer: {
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    marginRight: 10,
    backgroundColor: "#000",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  usernameText: {
    marginBottom: 16,
    fontSize: 12,
    color: "#fff",
  },
});

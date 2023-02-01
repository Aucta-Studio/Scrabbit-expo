import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export default ({ pfp, user, caption, state, image }) => {
  const [liked, setLiked] = useState(false);
  return (
    <View style={styles.container}>
      {/* username display */}
      <TouchableOpacity>
        <View style={styles.margin}>
          <Image source={{ uri: pfp }} />
          <Text style={styles.user}>{user}</Text>
        </View>
      </TouchableOpacity>
      {/* thumbnail photo/location */}
      <View>
        <TouchableOpacity>
          <Image
            style={styles.image}
            // resizeMode="contain"
            source={{ uri: image }}
          />
        </TouchableOpacity>
      </View>
      {/* Like comment and save buttons */}
      <View style={{ flexDirection: "row", margin: "5%" }}>
        <TouchableOpacity
          onPress={() => {
            setLiked(!liked);
          }}
        >
          <Image
            source={
              liked
                ? require("../assets/heart-active.png")
                : require("../assets/heart.png")
            }
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image
            source={require("../assets/comment.png")}
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image
            source={require("../assets/bookmark.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      {/* Caption and comments link */}
      <View style={styles.margin}>
        <Text>{caption}</Text>
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
    padding: 30,
    marginLeft: 30,
  },
  icon: {
    width: 35,
    height: 35,
    marginLeft: 10,
    marginTop: 10,
    margin: 5,
  },
  image: {
    width: 250,
    height: 250,
  },
});

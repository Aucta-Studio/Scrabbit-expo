import { View, Text, StyleSheet, Image, Linking } from "react-native";
import React from "react";
import { Marker, Callout } from "react-native-maps";
import Firemage from "./Firemage";
import carrot from "../images/carrot_node.png";
import { TouchableOpacity } from "react-native";

export default function Carrot({ coordinate, title, username, doc, saves, likes, comments}) {
  const timestamp = new Date(doc?.seconds * 1000 + doc?.nanoseconds / 1000000);
  const date = timestamp.toLocaleDateString('en-GB');
  const url = `https://www.google.com/maps/search/?api=1&query=${coordinate.latitude},${coordinate.longitude}`;
  return (
    <Marker coordinate={coordinate} image={carrot}>
      <Callout style={styles.callout} tooltip={true} onPress={()=>{Linking.openURL(url);}}>
        <View>
          <Text>
            <Firemage style={styles.img} path='Pfps/default.jpg' />
            <Image style={styles.img} source={carrot} />
          </Text>
          <Text>{title}</Text>
          <Text>by {username}</Text>
          <Text>Date Created: {date}</Text>
          <Text>Saves: {saves}</Text>
          <Text>Likes: {likes}</Text>
          {comments && <Text>Comments: {comments}</Text>}
          <TouchableOpacity><Text>GO TO</Text></TouchableOpacity>
        </View>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  img: {
    width: 20,
    height: 20,
  },
  callout:{
    width: 250,
    height: 250,
    padding: '5%',
    borderRadius: 200,
    backgroundColor: "#EC6319"
  }
});

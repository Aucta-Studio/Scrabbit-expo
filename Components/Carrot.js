import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { Marker, Callout } from "react-native-maps";
import Firemage from "./Firemage";
import carrot from "../assets/images/carrot_node.png";
import { TouchableOpacity } from "react-native";

export default function Carrot({ coordinate, name, uid}) {
  return (
    <Marker coordinate={coordinate} title={name} image={carrot}>
      <Callout style={styles.callout} tooltip={true}>
        <View>
          <Text>
            <Firemage style={styles.img} path='Pfps/default.jpg' />
            <Image style={styles.img} source={carrot} />
          </Text>
          <Text>UserName</Text>
          <Text>Date Created: </Text>
          <Text>Saves: </Text>
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
    width:200,
    height: 200,
    backgroundColor: "#EC6319"
  }
});

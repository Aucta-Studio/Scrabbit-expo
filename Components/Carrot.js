import { View, Text, StyleSheet, Image, Linking } from "react-native";
import React from "react";
import { Marker, Callout } from "react-native-maps";
import Firemage from "./Firemage";
import carrot from "../images/carrot_node.png";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { block } from "react-native-reanimated";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "../fireBaseConfig";

export default function Carrot({ coordinate, title, userID, dateOC, saves, likes, comments}) {
  const timestamp = new Date(dateOC?.seconds * 1000 + dateOC?.nanoseconds / 1000000);
  const date = timestamp.toLocaleDateString('en-GB');
  const url = `https://www.google.com/maps/search/?api=1&query=${coordinate.latitude},${coordinate.longitude}`;
  // const d = doc();
  const [value, loading, error] = useDocument(doc(db, "Profiles", `${userID}`));
  return (
    <Marker coordinate={coordinate} image={carrot}>
      <Callout borderRadius={10} tooltip={true} style={styles.callout} overflow={"hidden"} onPress={()=>{Linking.openURL(url);}}>
        <View>
          <Text style={styles.margins}>
            {/* <Firemage style={styles.img} path='Pfps/default.jpg' /> */}
            <Icon name="ios-person-circle" style={styles.img} />
            <Text style={styles.username}>{value?.data()?.UserName} • {date}</Text>
          </Text>

          <Text style={styles.title}>{title}</Text>
            <View flex-direction={"row"} justifyContent={"space-around"}alignItems={"stretch"}>
              
              <Text style={styles.countn}>
              <Icon
                    name={"eye"}
                    size={34}
                    color={"#000"}
                  />{saves}</Text>
              <Text style={styles.countn}>
              <Icon
                name={"heart"}
                size={34}
                color={"#000"}
              />{likes}</Text>
            </View>
          {comments && <Text>Comments: {comments}</Text>}
        
          <TouchableOpacity alignItems={"center"}><Text style={styles.mapgo} >
          <Icon name="ios-navigate-circle" size={34} color="#000" />
          </Text></TouchableOpacity>
        </View>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  img: {
    width: 32,
    height: 32,
  },
  title:{
    fontSize: 25,
    fontWeight: "bold",
    color: "#000",
  },
  username:{
    fontSize: 13,
    color: "#000",

  },
  callout:{
    width: 250,
    height: 250,
    padding: '5%',
    borderColor: "#AAA",
    backgroundColor: "#EC6319",
  },
  margins:{
    marginTop: -5,
    marginBottom: -5,
  },
  countn:{
    fontSize: 34,
  },
  mapgo:{
    fontSize: 34,
    fontWeight: "bold",
    textAlign:"center",
    marginTop:50
  }


});

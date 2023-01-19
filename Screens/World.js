import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView from "react-native-maps";
import * as Location from "expo-location";

export default () => {
  const [myLocation, setLocation] = useState({
    latitude: 25.101969,
    longitude: 55.162172,
    latitudeDelta: 0.009,
    longitudeDelta: 0.009,
  });
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
      latitudeDelta: 0.009,
      longitudeDelta: 0.009,
    });
  };

  useEffect(() => {userLocation()},[]);
  
  return (
    <SafeAreaView>
      <ScrollView>
        <MapView style={styles.map} region={myLocation} />
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

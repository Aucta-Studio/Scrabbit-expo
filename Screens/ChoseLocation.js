import React, { useEffect, useState } from "react";
import { View, TextInput, Image, Text, Button, StyleSheet, Alert, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { SearchBar } from "react-native-elements";
import Carrot from "../Components/Carrot";
import * as Location from "expo-location";
import carrot from "../images/carrot_2.png";
import target from "../images/Target.png";
import Geolocation from 'react-native-geolocation-service';
import { useSelector, useDispatch } from "react-redux";
import { db, auth, myFireBase } from "../fireBaseConfig";
import { SvgUri } from 'react-native-svg';
import {
    firestore,
    collection,
    addDoc,
    orderBy,
    query,
    onSnapshot,
    getDoc,
    doc,
    where,
    GeoPoint,
    Timestamp,
  } from 'firebase/firestore';
  import { getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
  import { useNavigation } from '@react-navigation/native';

export default function ChoseLocation(props, {navigation}) {
  const selectedImages = props.route.params.selectedImages;
  const selectedImage = props.route.params.selectedImage;
  const user = auth.currentUser.uid;
  const navigationn = useNavigation();
  const account = useSelector((state) => state.account);
  const [myLocation, setLocation] = useState({
    latitude: 25.101969,
    longitude: 55.162172,
    latitudeDelta: 0.009,
    longitudeDelta: 0.009,
  })

  const [region, setRegion] = useState({
    latitude: 25.101969,
    longitude: 55.162172,
    latitudeDelta: 0.009,
    longitudeDelta: 0.009,
  })

  const showMessage = (title, message) => {
    Alert.alert(
      title,
      message
    );
  };

  const onRegionChange = (newRegion) => {
    setLocation({
        latitude: newRegion.latitude,
        longitude: newRegion.longitude,
        latitudeDelta: 0.009,
        longitudeDelta: 0.009,
      });
    console.log("New Coordinates: ", myLocation);
  }
  
  console.log(props.route.params)
  // this method is used to upload image to firebase storage.
    const uploadImage = async () => {
        const photos = [];
        const storage = getStorage();
        const metadata = {
            contentType: 'image/jpeg'
          };
  
        if (selectedImage != null) {
          console.log("Image :", selectedImage[0]);
          const response = await fetch(selectedImage[0]);
          const blob = await response.blob();
          const childPath = 'posts/'+user+'/'+Math.random().toString(36)+'.jpeg'
          const storageRef = ref(storage, childPath);
          const task = uploadBytesResumable(storageRef, blob, metadata);
          await task;
          photos.push(childPath);
        }
        else if (selectedImage == null){
          for (let i = 0; i < selectedImages.length; i++){
            console.log("Image :", selectedImages[i]);
            const response = await fetch(selectedImages[i]);
            const blob = await response.blob();
            const childPath = 'posts/'+user+'/'+Math.random().toString(36)+'.jpeg'
            const storageRef = ref(storage, childPath);
            const task = uploadBytesResumable(storageRef, blob, metadata);
            await task;
            photos.push(childPath);
          }
        }
        
        console.log("Add details to Firestore")
        savePostData(photos);
        showMessage("Posted!", "Your picture has been posted.");
        navigationn.navigate("Camera");
    };
    console.log(Timestamp.now());
    const savePostData = async (photos) => {
      addDoc(collection(db, "Posts"), {
          Caption: props.route.params.Caption,
          Collected: [user],
          Comments: [],
          Likes: [],
          Title: props.route.params.Title,
          author: user,
          createdAt: new Timestamp.now(),
          report_flag: "N",
          flagged_enabled: "N",
          location: new GeoPoint(myLocation.latitude, myLocation.longitude),
          photos
      }).then((function () {
          console.log("Picture posted!")
      })).catch((error) => {
          console.error("Error posting picture: ", error);
          showMessage("Error!", "There was an error posting the picture. Please try again!")
      });
    }

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

  useEffect(() => {
    userLocation();
  }, []);
  
  return (
    <View style={{marginTop: '6%', flex:1}}>
        <GooglePlacesAutocomplete
            placeholder="Search"
            fetchDetails={true}
            GooglePlacesSearchQuery={{
                rankby: "distance"
            }}
            onPress={(data, details = null) => {
                console.log(data, details)
                setRegion({
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                    latitudeDelta: 0.009,
                    longitudeDelta: 0.009,
                })
            }}
            onFail={error => console.log(error)}
            onNotFound={() => console.log('No results were found')}
            listEmptyComponent={() => (
                <View style={{flex: 1}}>
                  <Text>No results were found</Text>
                </View>
            )}
            query={{
                key: "AIzaSyC07oPjwqktz8vYdin-JzyV8fQ-tjg5yM4",
                language: "en"
            }}
            styles={{
                container: {flex:0, position: "absolute", width: "100%", zIndex: 1},
                listView: {backgroundColor: "black"}
            }}
        />
        <MapView
          style={styles.map}
          //region={myLocation}
          customMapStyle={darkStyle}
          initialRegion= {myLocation}
          provider="google"
          draggable={true}
          onRegionChangeComplete={onRegionChange}
        >
            <Marker coordinate={{latitude: region.latitude, longitude: region.longitude}}/>
            <Marker
            coordinate={{
                latitude: myLocation.latitude,
                longitude: myLocation.longitude,
              }}
            title="Drag me!"
            image={target}
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}></Marker>
        </MapView>
        <TouchableOpacity style={{marginBottom: 10}} onPress={uploadImage}>
            <Image style={styles.image} source={carrot} resizeMode = 'cover'/>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height*0.75,
    flex:1,
  },
  image: {
    //marginTop: '150%', 
    marginLeft: '42%', 
    width: 55, 
    height: 55,
    //position: 'absolute', top: 100, left: 10
  }
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

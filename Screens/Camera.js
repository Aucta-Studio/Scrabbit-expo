import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import Icon from "react-native-vector-icons/Ionicons";

export default function App({navigation}) {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [image, setImage] = useState(null);
  const [camera, setCamera] =useState(null);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to use the Camera.</Text>
        <TouchableOpacity onPress={requestPermission}>
      <Text style={styles.permissionbutton}>Grant Permission</Text>
    </TouchableOpacity>
  </View>
    );
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }
  

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const takePicture = async () => {
    if (camera){
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);
    }
  }

  return (
    <View style={styles.container}>
      <Camera 
      ref = {ref => setCamera(ref)} style={styles.fixedRatio} type={type} ratio = {'1:1'}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button_save} onPress={() => navigation.navigate('Save', {image})}>
            <Text style={styles.text}>Next</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            {/*<Text style={styles.text}>Flip Camera</Text>*/}
            <Icon
              name={"camera-reverse-outline"}
              size={40}
              color={"white"}
              style={styles.ImageIconStyle}
          />
          </TouchableOpacity>
          <TouchableOpacity style = {styles.button} onPress={takePicture}>
            {/*<Text style={styles.text}>Take Picture</Text>*/}
            <Icon
              name={"aperture"}
              size={40}
              color={"white"}
              style={styles.ImageIconStyle}
          />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            {/*<Text style={styles.text}>Pick Image</Text>*/}
            <Icon
              name={"folder-open-outline"}
              size={40}
              color={"white"}
              style={styles.ImageIconStyle}
          />
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.button_save} onPress={() => navigation.navigate('Save', {image})}>
            <Text style={styles.text}>Save</Text>
          </TouchableOpacity> */}
        </View>
      </Camera>
       {image && <Image source={{ uri: image }} style={{ width: "100%", height: "92%", position: 'absolute', bottom: 0, right: 0 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    //flexDirection: 'row',
  },
  permissionbutton: {
    textAlign: 'center',
    color: "white",
    fontWeight: "bold",
    backgroundColor: "#FFF",
    borderRadius: 50,
    padding: 15,
    marginTop: 15,
  },
  camera: {
    flex: 1,
  },
  fixedRatio: {
    flex: 1,
    aspectRatio:0.75,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'stretch',
    margin: 30,
    marginRight: 170,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
  },
  button_save: {
    flex: 1,
    left: 200,
    marginTop: 10,
    marginLeft: 100,
    marginRight:150,
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  ImageIconStyle: {
    height: 40,
    width: 40,
    margin: 20,
  },
  ImageIconStyle2: {
    height: 50,
    width: 50,
    margin: 20,
  }
});

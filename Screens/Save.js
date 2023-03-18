import React, {
    useState,
    useEffect,
    useLayoutEffect,
    useCallback
  } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { View, TextInput, Image, Text, Button, StyleSheet, Alert, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import 'firebase/storage';
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
 } from "react-native-popup-menu";
import { db, auth, myFireBase } from "../fireBaseConfig";
import {
    firestore,
    collection,
    addDoc,
    orderBy,
    query,
    onSnapshot,
  getDoc,
<<<<<<< HEAD
  doc,
  where
} from 'firebase/firestore';
import Modal from "react-native-modal";
=======
  doc
  } from 'firebase/firestore';
>>>>>>> afb052bcd17bc94c4a4d206eb215248579881863
import { getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import { useNavigation, useRoute } from '@react-navigation/native';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default function Save(props, {navigation}) {
    const navigationn = useNavigation();
    const [Title, setTitle] = useState("")
    const [Caption, setCaption] = useState("")

    const selectedImages = props.route.params.images;
    const selectedImage = props.route.params.pic;

    const [imgActive, setimgActive] = useState(0);
    onchange = (nativeEvent) => {
      if (nativeEvent) {
        const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
        if (slide != imgActive) {
          setimgActive(slide);
        }
      }
    }

<<<<<<< HEAD
    function navigateToChoseLocation() {
      if (selectedImages == null){
        navigationn.navigate('ChoseLocation', {
=======
    const user = auth.currentUser.uid;

    const getUserName = async () => {
      const temp = await getDoc(doc(db, "Profiles", `${user}`));
      return temp.data().UserName.toString();
    };
    
    // created this method to show any message onto the screen like "Posted!"
    const showMessage = (title, message) => {
        Alert.alert(
          title,
          message
        );
    };
    
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
    };

    const savePostData = async (photos) => {
      const userName = await getUserName();
      addDoc(collection(db, "Posts"), {
>>>>>>> afb052bcd17bc94c4a4d206eb215248579881863
          Caption,
          Title,
<<<<<<< HEAD
          selectedImage
        });
      }
      else {
        navigationn.navigate('ChoseLocation', {
          Caption,
          Title,
          selectedImages
        });
      }
=======
          UserName: userName,
          author: auth.currentUser.uid,
          createdAt: Date.now(),
          //location,
          photos
        }).then((function () {
          console.log("Picture posted!")
      })).catch((error) => {
        console.error("Error posting picture: ", error);
      });
>>>>>>> afb052bcd17bc94c4a4d206eb215248579881863
    }

    return (
        <View style={styles.view}>
            <Text style={{marginTop: 50, fontWeight: 'bold', padding: 10, fontSize: 20, marginLeft: 15}}>New Post</Text>
            {selectedImages == null ? <Image style={styles.wrap} source={{uri : selectedImage[0]}}/> : 
            <View style={styles.wrap}>
            <ScrollView 
              onScroll={({nativeEvent}) => onchange(nativeEvent)}
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              horizontal
              style={styles.wrap}
            >
              {
                selectedImages.map((e, index) =>
                  <Image
                    key={e}
                    resizeMode='stretch'
                    style={styles.wrap}
                    source={{uri : e}}
                  />
                )
              }
            </ScrollView>
            <View style={styles.wrapDot}>
              {
                selectedImages.map((e, index) =>
                  <Text
                    key={e}
                    style={imgActive == index ? styles.dotActive : styles.dot}
                  >
                    ●
                  </Text>
                )
              }
            </View>
          </View>}
            <TextInput style={styles.title}
              placeholder="Enter Scrapbook Name"
              onChangeText={(Title) => setTitle(Title)}
            />
            <View style={{ width: '100%', height: 1, backgroundColor: '#ccc', marginHorizontal: 10, flexDirection: 'row' }} />
            <TextInput autoFocus={true} multiline={true} numberOfLines={3} style={styles.input}
                placeholder="Want to share something?"
                onChangeText={(Caption) => setCaption(Caption)}
            />
            {/* <MenuProvider style={styles.button}>
              <Menu>
                <MenuTrigger
                  text="Select Scrapbook"
                />
                <MenuOptions>
                  <MenuOption onSelect={navigateToExistingScrapbook} text="Existing Scrapbook"/>
                  <MenuOption onSelect={navigateToNewScrapbook} text="New Scrapbook" />
                </MenuOptions>
              </Menu>
            </MenuProvider> */}
            <TouchableOpacity style = {styles.button} onPress={navigateToChoseLocation}>
              <Text style={{fontWeight: 'bold'}}>Chose Location</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
      flex: 1,
      backgroundColor: "#000",
    },
    input: {
      marginTop: 10,
      backgroundColor: "#000",
      padding: 20,
      marginBottom: 20,
      marginLeft: 10,
      marginRight: 10,
      color: "#FFF",
    },
    button: {
      //marginTop: '1%', 
      alignSelf: 'center', 
      backgroundColor: '#EC6319', 
      borderRadius: 30, 
      padding: 20
    },
    title: {
      marginTop: 10,
      backgroundColor: "#000",
      padding: 10,
      marginBottom: 10,
      marginLeft: 20,
      marginRight: 10,
      color: "#FFF",
    },
    image: {
      width: 200,
      height: 200,
      margin: 10,
    },
    wrap: {
      width: WIDTH * 0.75,
      height: HEIGHT * 0.5,
      alignSelf: 'center'
    },
    wrapDot: {
      position: 'absolute',
      bottom: 0,
      flexDirection: 'row',
      alignSelf: 'center'
    },
    dotActive: {
      margin: 3,
      color: '#000'
    },
    dot: {
      margin: 3,
      color: '#FFF'
    },
  });
import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback
} from 'react'
import { useSelector, useDispatch } from "react-redux";
import { View, TextInput, FlatList, Image, Text, Button, StyleSheet, Alert } from 'react-native'
import 'firebase/storage';
import { db, auth, myFireBase } from "../fireBaseConfig";
import {
  firestore,
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";

const MAX_IMAGES = 10;

export default function Save(props, {navigation}) {
    const [Title, setTitle] = useState("")
    const [Caption, setCaption] = useState("")
    const [Collected, setCollected] = useState([])
    const [Comments, setComments] = useState([])
    const [Likes, setLikes] = useState([])
    const location = useState("");
    const fileURIs = [];
    const selectedImages = props.route.params.images;
    const selectedImage = props.route.params.pic;

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
        const user = auth.currentUser.uid;
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

    const savePostData = (photos) => {
      addDoc(collection(db, "Posts"), {
          Caption,
          //Collected,
          //Comments,
          //Likes,
          Title,
          UserName: auth.currentUser.displayName,
          author: auth.currentUser.uid,
          createdAt: Date.now(),
          //location,
          photos
      }).then((function () {
          console.log("Picture posted!")
      }))
    }

    // const renderItem = ({ item }) => {
    //   return <Image style={styles.image} source={{ uri: item }} />;
    // };

    return (
        <View style={styles.view}>
            <Text style={{marginTop: 50, fontWeight: 'bold', padding: 10, fontSize: 20, marginLeft: 15}}>New Post</Text>
            {/* <FlatList
        data={selectedImages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      /> */}
            <TextInput style={styles.title}
              placeholder="Enter Title"
              onChangeText={(Title) => setTitle(Title)}
            />
            <View style={{ width: '100%', height: 1, backgroundColor: '#ccc', marginHorizontal: 10, flexDirection: 'row' }} />
            <TextInput autoFocus={true} multiline={true} numberOfLines={4} style={styles.input}
                placeholder="Want to share something?"
                onChangeText={(Caption) => setCaption(Caption)}
            />
            <Button title='Post' style={styles.button} onPress={() => uploadImage()}/>
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
      flex: 1,
      backgroundColor: "#000",
      //flexDirection: 'row',
      //alignItems: 'center',
      //borderBottomWidth: 1,
      //borderBottomColor: '#ccc',
      //paddingBottom: 10,
      //marginBottom: 10,
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
      //marginTop: 100,
      //alignItems: 'center',
      //justifyContent: 'center',
      //paddingVertical: 12,
      //paddingHorizontal: 32,
      borderRadius: 50,
      //elevation: 3,
      //backgroundColor: 'black',
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
    }
  });
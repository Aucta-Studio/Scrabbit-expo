import React, {
    useState,
    useEffect,
    useLayoutEffect,
    useCallback
  } from 'react'
import { View, TextInput, Image, Button, StyleSheet, Alert } from 'react-native'
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

export default function Save(props, {navigation}) {
    const [caption, setCaption] = useState("")

    const showMessage = (title, message) => {
        Alert.alert(
          title,
          message
        );
    };

    const uploadImage = async () => {
        const uri = props.route.params.image;
        const response = await fetch(uri);
        const blob = await response.blob();
        const user= auth.currentUser.uid;
        const childPath = 'posts/'+user+'/'+Math.random().toString(36)+'.jpeg'

        const storage = getStorage();
        const storageRef = ref(storage, childPath);

        const metadata = {
            contentType: 'image/jpeg'
          };
          
        const task = uploadBytesResumable(storageRef, blob, metadata);
        await task;

        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }

        const taskCompleted = () => {
            getDownloadURL(task.snapshot.ref).then((snapshot) => {
                savePostData(snapshot);
                console.log(snapshot)
            })
        }

        const taskError = snapshot => {
            console.log(snapshot)
        }

        task.on("state_changed", taskProgress, taskError, taskCompleted);
    }

    const savePostData = (downloadURL) => {
        addDoc(collection(db, "Posts", auth.currentUser.uid, "userPosts"), {
            downloadURL,
            caption,
            createdAt: Date.now()
        }).then((function () {
            showMessage("Posted!", "Your picture has been posted.");
        }))
    }

    return (
        <View style={styles.view}>
            <Image source={{uri: props.route.params.image}}/>
            <TextInput autoFocus={true} multiline={true} numberOfLines={4} style={styles.input}
                placeholder="Want to share something?"
                onChangeText={(caption) => setCaption(caption)}
            />
            <Button title='Post' onPress={() => uploadImage()}/>
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
      flex: 1,
    },
    input: {
      marginTop: 100,
      backgroundColor: "#000",
      borderRadius: 40,
      padding: 30,
      marginBottom: 20,
      marginLeft: 10,
      marginRight: 10,
      color: "#FFF",
    },
    button: {
      marginTop: 100,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 4,
      elevation: 3,
      backgroundColor: 'black',
    }
  });
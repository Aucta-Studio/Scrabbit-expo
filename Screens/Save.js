import React, {
    useState,
  } from 'react';
import {View, TextInput, Image, Button, StyleSheet} from 'react-native'
import { db, auth, myFireBase } from "../fireBaseConfig";
import {
    collection,
    addDoc,
    orderBy,
    query,
    onSnapshot,
  } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from "firebase/storage";


export default function Save(props) {
    const [caption, setCaption] = useState("")

    const uploadImage= async () => {
        const uri=props.route.params.image;
        const response = await fetch(uri);
        const blob = await response.blob();
        const user= auth.currentUser.uid
    

        const storage = getStorage();
        const storageRef = ref(storage, 'posts/'+user+Date.now()+'.jpeg');
        
        const metadata = {
          contentType: 'image/jpeg'
        };
        
        const uploadTask = uploadBytes(storageRef, blob, metadata);
        const url = await uploadTask.getDownloadURL()
        return new Promise((res, rej) => {
            addDoc(collection(db, 'posts'), {
                caption,
                uid: user,
                timestamp: this.timestamp,
                image: url
              });
        })
    }
    return(
        <View style={styles.view}>
            <Image source={{uri:props.route.params.image}}/>
            <TextInput autoFocus={true} multiline={true} numberOfLines={4} style={styles.input}
            placeholder="Want to share something?"
            onChangeText={(caption)=> setCaption(caption)}></TextInput>
            <Button title="Post" onPress={() => uploadImage()}/>
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
    //color: "#FFF",
    //width: 30,
    //height: 50,
    // color : "#F97316",
    // borderColor: "#000",
    // borderWidth: 2,
    //borderRadius: 50,
    //padding: 15,
    //marginTop: 20,
    //alignItems: "center",
  }
});
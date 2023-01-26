import React, {
    useState,
  } from 'react';
import {View, TextInput, Image, Button} from 'react-native'
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
        const storageRef = ref(storage, 'posts/'+Math.random()+'.jpeg');
        
        const metadata = {
          contentType: 'image/jpeg'
        };
        
        const uploadTask = uploadBytes(storageRef, blob, metadata);
    }
    return(
        <View stylre={{flex: 1}}>
            <Image source={{uri:props.route.params.image}}/>
            <TextInput
            placeholder="caption here"
            onChangeText={(caption)=> setCaption(caption)}/>
            <Button title="Save" onPress={() => uploadImage()}/>
        </View>
    )
}

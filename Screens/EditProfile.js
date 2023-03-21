import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  setEmail,
  setUsername,
  setFirstName,
  setLastName,
  setPfp,
  setBio,
} from "../Slices/account/accountSlice";
import { useSelector, useDispatch } from "react-redux";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject
} from "firebase/storage";
import { myFireBase } from "../fireBaseConfig";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { getAuth } from "firebase/auth";
import Firemage from "../Components/Firemage";

export default () => {
  const account = useSelector((state) => state.account);
  const db = getFirestore(myFireBase);
  const auth = getAuth(myFireBase);
  const dispatch = useDispatch();
  const storage = getStorage(myFireBase);

  const [localusername, setLocalUsername] = useState(`${account.username}`);
  const [localFirstname, setLocalFirstname] = useState(`${account.firstname}`);
  const [localLastname, setLocalLastname] = useState(`${account.lastname}`);
  const [localBio, setLocalBio] = useState(`${account.bio}`);

  const handleSave = async () => {
    const userRef = doc(db, "Profiles", auth.currentUser.uid);
    const data = {};
    const q = query(
      collection(db, "Profiles"),
      where("UserName", "==", localusername)
    );

    if (localusername !== account.username) {
      let temp = await getDocs(q);
      if (temp.size > 0) {
        console.log(temp);
        Alert.alert("Error", "Username already exists");
        setLocalUsername(account.username);
        return;
      }
      data.UserName = localusername;
    }
    if (localFirstname !== account.firstname) {
      data.FirstName = localFirstname;
    }
    if (localLastname !== account.lastname) {
      data.LastName = localLastname;
    }
    if (localBio !== account.bio) {
      data.Bio = localBio;
    }

    if (Object.keys(data).length === 0) {
      console.log("Error", "No changes to save");
      return;
    }

    updateDoc(userRef, data)
      .then(() => {
        if (data.UserName) {
          dispatch(setUsername(data.UserName));
        }
        if (data.FirstName) {
          dispatch(setFirstName(data.FirstName));
        }
        if (data.LastName) {
          dispatch(setLastName(data.LastName));
        }
        if (data.Bio) {
          dispatch(setBio(data.Bio));
        }
        console.log("Success", "User information saved");
      })
      .catch((error) => {
        console.log(error);
        console.log("Error", "Failed to save user information");
      });
  };

  const handleAvatarChange = async () => {
    let asset = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      maxNumberOfFiles: 1,
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (!asset.canceled) {
      const response = await fetch(asset.uri);
      const blob = await response.blob();
      const currPath = ref(storage, account.pfp);
      const photoID = Math.random().toString(36);
      const storageRef = ref(storage, `Pfps/${photoID}.jpg`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      try {
        if(account.pfp != "Pfps/default.jpg") { await deleteObject(currPath);}
        await uploadTask;
        // const downloadURL = await getDownloadURL(storageRef);
        dispatch(setPfp(`Pfps/${photoID}.jpg`));
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to upload avatar");
      }

      const userRef = doc(db, "Profiles", auth.currentUser.uid);
      const data = {};
      data.Pfp = `Pfps/${photoID}.jpg`;
      updateDoc(userRef, data)
        .then(() => {
          console.log("Success, avatar changed");
        })
        .catch((error) => {
          console.log(error);
          console.log("Error", "Failed to save new avatar");
        });
    }
  };

    return (
      <ScrollView style={styles.container}>
        {/* where the avatar gets changed */}
        <View>
        <Firemage style={styles.avatar} path={account.pfp} />
        <TouchableOpacity onPress={handleAvatarChange}>
            <Text style={styles.changeText}>Change Avatar</Text>
          </TouchableOpacity>
        </View>
        {/* where the other fields get changed */}
        <View>
          <Text style={styles.usernameText}>Username</Text>
          <TextInput
            type="text"
            value={localusername}
            style={styles.nameText}
          onChangeText={(text) => {
            setLocalUsername(text);
            }}
          />
          <View>
            <Text style={styles.usernameText}>Firstname</Text>
            <TextInput
              type="text"
              value={localFirstname}
              style={styles.nameText}
            onChangeText={(text) => {
              setLocalFirstname(text);
              }}
            />
            <Text style={styles.usernameText}>Lastname</Text>
            <TextInput
              type="text"
              value={localLastname}
              style={styles.nameText}
            onChangeText={(text) => {
              setLocalLastname(text);
              }}
            />
          </View>
          <Text style={styles.usernameText}>Bio</Text>
          <TextInput
            type="text"
            value={localBio}
            style={styles.nameText}
          onChangeText={(text) => {
            setLocalBio(text);
            }}
          />
        </View>
      <TouchableOpacity onPress={handleSave}>
          <Text style={styles.button}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: "4%",
  },
  saveButton: {
    fontSize: 30,
    color: "#210",
    marginTop: 0,
  },
  button: {
    // backgroundColor: '#4CAF50',
    backgroundColor: "#FFF",
    // color : "#F97316",
    // borderColor: "#000",
    // borderWidth: 2,
    borderRadius: 50,
    padding: 15,
    marginTop: 20,
    textAlign: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#000",
  },
  avatarContainer: {
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    marginRight: 10,
    backgroundColor: "#000",
  },
  avatar: {
    width: 100,
    height: 100,
    marginTop: 20,
    borderRadius: 50,
    alignSelf: "center",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
    padding: 16,
    backgroundColor: "#000",
  },
  nameText: {
    fontSize: 16,
    color: "#ccc",
  },
  usernameText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  changeText: {
    marginTop: 0,
    fontSize: 16,
    fontWeight: "bold",
    color: "#aaa",
    textAlign: "center",
  },
  bioText: {
    fontSize: 16,
    color: "#aaa",
    marginTop: 8,
  },
};

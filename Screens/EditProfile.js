import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  setEmail,
  setUsername,
  setFirstName,
  setLastName,
  setPfp,
  setBio
} from "../Slices/account/accountSlice";
import { useSelector, useDispatch } from "react-redux";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { myFireBase } from "../fireBaseConfig";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";

export default () => {
  const account = useSelector((state) => state.account);
  const dispatch = useDispatch();
  const storage = getStorage();

  const [img, setimg] = useState(null);
  const [localusername, setLocalUsername] = useState(`${account.username}`);
  const [localFirstname, setLocalFirstname] = useState(`${account.firstname}`);
  const [localLastname, setLocalLastname] = useState(`${account.lastname}`);
  const [localBio, setLocalBio] = useState(`${account.bio}`);

  const download = async () => {
    const temp = await getDownloadURL(ref(storage, `${account.pfp}`));
    setimg(temp);
  };
  download();

  return (
    <View style={styles.container}>
      {/* where the avatar gets changed */}
      <View>
        {img && (
          <Image
            source={{ uri: img }}
            style={styles.avatar}
            resizeMode="contain"
          />
        )}
        <TouchableOpacity><Text style={styles.changeText}>Change Avatar</Text></TouchableOpacity>
      </View>
      {/* where the other fields get changed */}
      <View>
      <Text style={styles.usernameText}>Username</Text>
        <TextInput
          type="text"
          value={localusername}
          style={styles.nameText}
          onChange={() => {
            setLocalUsername(localusername);
          }}
        />
        <View>
        <Text style={styles.usernameText}>Firstname</Text>
          <TextInput
            type="text"
            value={localFirstname}
            style={styles.nameText}
            onChange={() => {
              setLocalFirstname(localFirstname);
            }}
          />
          <Text style={styles.usernameText}>Lastname</Text>
          <TextInput
            type="text"
            value={localLastname}
            style={styles.nameText}
            onChange={() => {
              setLocalLastname(localLastname);
            }}
          />
        </View>
        <Text style={styles.usernameText}>Bio</Text>
        <TextInput
          type="text"
          value={localBio}
          style={styles.nameText}
          onChange={() => {
            setLocalBio(localBio);
          }}
        />
      </View>
      <TouchableOpacity>
        <Text style={styles.button}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#100'
  },
    saveButton: {
    fontSize: 30,
    color: '#210',
    marginTop: 0
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
    textAlign: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#100'
  },
  avatarContainer: {
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    marginRight: 10,
    backgroundColor: '#100'
  },
  avatar: {
    width: 100,
    height: 100,
    marginTop: 20,
    borderRadius: 50,
    alignSelf: 'center',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
    padding: 16,
    backgroundColor: '#100'
  },
  nameText: {
    fontSize: 16,
    color: '#ccc'
  },
  usernameText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  },
  changeText: {
    marginTop: 0,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#aaa',
    textAlign: 'center'
  },
  bioText: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 8
  }
};
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
  setPfpFile,
  setBio,
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
    <SafeAreaView>
      {/* where the avatar gets changed */}
      <View>
        {img && (
          <Image
            source={{ uri: img }}
            style={styles.pfp}
            resizeMode="contain"
          />
        )}
        <TouchableOpacity><Text>change avatar</Text></TouchableOpacity>
      </View>
      {/* where the other fields get changed */}
      <View>
        <Text>Username</Text>
        <TextInput
          type="text"
          value={localusername}
          onChange={() => {
            setLocalUsername(localusername);
          }}
        />
        <View>
          <Text>Firstname</Text>
          <TextInput
            type="text"
            value={localFirstname}
            onChange={() => {
              setLocalFirstname(localFirstname);
            }}
          />
          <Text>Lastname</Text>
          <TextInput
            type="text"
            value={localLastname}
            onChange={() => {
              setLocalLastname(localLastname);
            }}
          />
        </View>
        <Text>Bio</Text>
        <TextInput
          type="text"
          value={localBio}
          onChange={() => {
            setLocalBio(localBio);
          }}
        />
      </View>
      <TouchableOpacity>
        <Text>Save</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pfp: {
    width: "20%",
    height: "20%",
  },
});

import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import login from "../images/login.png";
import { useNavigation } from "@react-navigation/native";
import { myFireBase } from "../fireBaseConfig";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import { setUsername, setEmail, setFirstName, setLastName, setBio, setPfp } from "../Slices/account/accountSlice";

export default () => {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const auth = getAuth(myFireBase);
  const db = getFirestore(myFireBase);
  const account = useSelector((state) => state.account);
  const dispatch = useDispatch();

  function handleLogin() {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user.uid;
        console.log("Logged in");
        console.log(user);
        getMyProfile(user);
        navigation.navigate("app");
      })
      .catch((error) => {
        Alert.alert(error);
        console.log(error);
      });
  }

  function navigateToRegister() {
    navigation.navigate("register");
  }

  const getMyProfile = async (uid) => {
    const temp = await getDoc(doc(db, "Profiles", `${uid}`));   
    console.log(temp.data());
    dispatch(setUsername(temp.data().UserName));
    dispatch(setEmail(temp.data().EmailAddress));
    dispatch(setFirstName(temp.data().FirstName));
    dispatch(setLastName(temp.data().LastName));
    dispatch(setBio(temp.data().Bio));
    dispatch(setPfp(temp.data().Pfp));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#EC6319" }}>
      {/* The photo */}
      <View>
        <Image source={login} style={styles.images} resizeMode="contain" />
      </View>
      <ScrollView>
        {/* beginning of the form */}
        <View style={styles.formContainer}>
          {/* a title */}
          <Text style={styles.title}>Login</Text>
          {/* the username part */}
          <Text>Email</Text>
          <TextInput
            value={email}
            style={styles.input}
            onChangeText={(text) => setemail(text)}
            placeholder="Enter your email..."
            placeholderTextColor="#FFF"
          ></TextInput>
          {/* the password part */}
          <Text>Password</Text>
          <TextInput
            value={password}
            style={styles.input}
            onChangeText={(text) => setPassword(text)}
            placeholder="Enter your password..."
            placeholderTextColor="#FFF"
            secureTextEntry={true}
          ></TextInput>
          {/* The login button */}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text>Login</Text>
          </TouchableOpacity>
          {/* in case of a new user with no account */}
          <TouchableOpacity style = {{marginTop: 10, alignSelf: 'center'}} onPress={navigateToRegister}>
            <Text>Dont have an account?</Text>
            <Text style = {{fontWeight: 'bold', marginLeft: 10}}>Create an account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    textAlign: "center",
    marginBottom: 20,
    color: "#FFF",
  },
  formContainer: {
    marginTop: 20,
    marginHorizontal: 25,
    paddingHorizontal: 50,
    backgroundColor: "#EC6319",
    borderRadius: 50,
    // opacity: 0.75,
  },
  input: {
    backgroundColor: "#000",
    borderRadius: 50,
    padding: 10,
    marginBottom: 20,
    color: "#FFF",
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
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  images: {
    width: 100,
    height: 250,
    alignSelf: "center",
  },
});

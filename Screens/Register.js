import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { myFireBase } from "../fireBaseConfig";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, setDoc, doc } from "firebase/firestore";

export default () => {
  const [firstName, setfirstName] = useState("");
  // const [middleName, setmiddleName] = useState("");
  const [lastName, setlastName] = useState("");
  // const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  // const [DOB, setDOB] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  const navigation = useNavigation();
  const auth = getAuth(myFireBase);
  const db = getFirestore(myFireBase);

  function handleRegister() {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const upload = async (uid, data) => {
          await setDoc(doc(db, "Profiles", `${uid}`), data).catch((error) => {console.log(error)});
        };
        console.log("Signed up");
        const user = userCredential.user.uid;
        const data = {
          Bio: "",
          Email: email,
          FirstName: firstName,
          LastName: lastName,
          Pfp: "Pfps/default.jpg",
          UserName: username,
        };
        upload(user, data);
        navigateToLogin();
      })
      .catch((error) => {console.log(error)});
  }

  function navigateToLogin() {
    navigation.navigate("login");
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#EC6319" }}>
      <ScrollView>
        {/* beginning of the form */}
        <View style={styles.formContainer}>
          {/* a title */}
          <Text style={styles.title}>Register</Text>
          {/* first name */}
          <Text>First Name</Text>
          <TextInput
            value={firstName}
            style={styles.input}
            onChangeText={setfirstName}
            placeholder="Enter your first name"
          />
          {/* lastname */}
          <Text>Last Name</Text>
          <TextInput
            value={lastName}
            style={styles.input}
            onChangeText={setlastName}
            placeholder="Enter your last name"
          />
          {/* phone number
          <Text>Phone Number</Text>
          <TextInput
            value={phoneNumber}
            style={styles.input}
            onChangeText={setPhoneNumber}
            placeholder="Enter your phone number"
          /> */}
          {/* email address */}
          <Text>Email Address</Text>
          <TextInput
            value={email}
            style={styles.input}
            onChangeText={setEmail}
            placeholder="Enter your email address "
          />
          {/* DOB
          <Text>Date Of Birth</Text>
          <TextInput
            value={DOB}
            style={styles.input}
            onChangeText={setDOB}
            placeholder="Enter your date of birth"
          /> */}
          {/* username */}
          <Text>Username</Text>
          <TextInput
            value={username}
            style={styles.input}
            onChangeText={(text) => setUsername(text)}
            placeholder="Enter your username..."
          ></TextInput>
          {/* password */}
          <Text>Password</Text>
          <TextInput
            value={password}
            style={styles.input}
            onChangeText={(text) => setPassword(text)}
            placeholder="Enter your password..."
          ></TextInput>
          {/* retype password */}
          <Text>Retype Password</Text>
          <TextInput
            value={repassword}
            style={styles.input}
            onChangeText={(text) => setRePassword(text)}
            placeholder="Retype your password..."
          ></TextInput>
          {/* register button */}
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text>Register</Text>
          </TouchableOpacity>
          {/* in case of a new user with no account */}
          <TouchableOpacity style = {{marginTop: 10, alignSelf: 'center'}} onPress={navigateToLogin}>
            <Text>Have an account?</Text>
            <Text style = {{fontWeight: 'bold', marginLeft: 35}}>Login</Text>
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
    padding: 50,
    // backgroundColor: '#000',
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
});

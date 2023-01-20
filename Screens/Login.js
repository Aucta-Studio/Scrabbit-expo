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
import login from "../assets/images/login.png";
import { useNavigation } from "@react-navigation/native";
import { myFireBase } from "../fireBaseConfig";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const auth = getAuth(myFireBase);

  function handleLogin() {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Logged in");
        const user = userCredential.user.uid;
        console.log(user);
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
            onChangeText={(text) => setEmail(text)}
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
          <TouchableOpacity onPress={navigateToRegister}>
            <Text>Dont have an account? Create an account</Text>
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

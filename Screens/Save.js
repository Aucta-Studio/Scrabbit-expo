import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  TextInput,
  Image,
  Text,
  Button,
  StyleSheet,
  Alert,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import "firebase/storage";
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { db, auth, myFireBase } from "../fireBaseConfig";
import {
  firestore,
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  getDoc,
  doc,
  where,
} from "firebase/firestore";
import Modal from "react-native-modal";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export default function Save(props, { navigation }) {
  const navigationn = useNavigation();
  const [Title, setTitle] = useState("");
  const [Caption, setCaption] = useState("");

  const selectedImages = props.route.params.images;
  const selectedImage = props.route.params.pic;

  const [imgActive, setimgActive] = useState(0);
  const onchange = (nativeEvent) => {
    if (nativeEvent) {
      const slide = Math.ceil(
        nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width
      );
      if (slide != imgActive) {
        setimgActive(slide);
      }
    }
  };

  function navigateToChoseLocation() {
    if (selectedImages == null) {
      navigationn.navigate("ChoseLocation", {
        Caption,
        Title,
        selectedImage,
      });
    } else {
      navigationn.navigate("ChoseLocation", {
        Caption,
        Title,
        selectedImages,
      });
    }
  }

  return (
    <View style={styles.view2}>
      <SafeAreaView style={{ backgroundColor: "#fff" }}>
        <ScrollView>
          <View style={styles.view}>
            <Text
              style={{
                color: "black",
                marginBottom: "3%",
                fontWeight: "bold",
                padding: 10,
                fontSize: 20,
                marginLeft: 15,
              }}
            >
              New Post
            </Text>
            <TextInput
              style={styles.title}
              placeholder="Enter Scrapbook Title"
              placeholderTextColor={"#000"}
              onChangeText={(Title) => setTitle(Title)}
            />
            <View
              style={{
                width: "100%",
                height: 1,
                backgroundColor: "#ccc",
                marginHorizontal: 10,
                flexDirection: "row",
              }}
            />
            <TextInput
              autoFocus={true}
              multiline={true}
              numberOfLines={3}
              style={styles.title}
              placeholder="Enter Scrapbook Caption"
              placeholderTextColor={"#000"}
              onChangeText={(Caption) => setCaption(Caption)}
            />
            <View
              style={{
                width: "100%",
                height: 1,
                backgroundColor: "#ccc",
                marginHorizontal: 10,
                flexDirection: "row",
              }}
            />
            {selectedImages == null ? (
              <Image style={styles.wrap} source={{ uri: selectedImage[0] }} />
            ) : (
              <View style={styles.wrap}>
                <ScrollView
                  onScroll={({ nativeEvent }) => onchange(nativeEvent)}
                  showsHorizontalScrollIndicator={false}
                  pagingEnabled
                  horizontal
                  style={styles.wrap}
                >
                  {selectedImages.map((e, index) => (
                    <Image
                      key={e}
                      resizeMode="contain"
                      style={styles.wrap}
                      source={{ uri: e }}
                    />
                  ))}
                </ScrollView>
                <View style={styles.wrapDot}>
                  {selectedImages.map((e, index) => (
                    <Text
                      key={e}
                      style={imgActive == index ? styles.dotActive : styles.dot}
                    >
                      ●
                    </Text>
                  ))}
                </View>
              </View>
            )}
            <View
              style={{
                width: "100%",
                height: 1,
                backgroundColor: "#ccc",
                marginHorizontal: 10,
                flexDirection: "row",
              }}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={navigateToChoseLocation}
            >
              <Text style={{ fontWeight: "bold" }}>Chose Location</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: "#fff",
  },
  view2: {
    flex: 1,
    backgroundColor: "#fff",
    width: WIDTH,
    height: HEIGHT,
  },
  input: {
    marginTop: 10,
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    color: "#FFF",
  },
  button: {
    margin: "2%",
    alignSelf: "center",
    backgroundColor: "#EC6319",
    borderRadius: 30,
    padding: 20,
  },
  title: {
    marginTop: 10,
    backgroundColor: "#fff",
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
  },
  wrap: {
    width: WIDTH * 0.75,
    height: HEIGHT * 0.5,
    alignSelf: "center",
  },
  wrapDot: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    alignSelf: "center",
  },
  dotActive: {
    margin: 3,
    color: "#FFF",
  },
  dot: {
    margin: 3,
    color: "#000",
  },
});

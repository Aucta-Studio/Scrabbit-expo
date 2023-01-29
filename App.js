import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { store } from "./store";
import { Provider } from "react-redux";
import Login from "./Screens/Login";
import Register from "./Screens/Register";
import Camera from "./Screens/Camera";
import World from "./Screens/World";
import Chat from "./Screens/Chat";
import Feed from "./Screens/Feed";
import Profile from "./Screens/Profile";
import EditProfile from "./Screens/EditProfile";
// import FFF from "./Screens/FFF";
import Icon from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { Image } from "react-native";
import Save from "./Screens/Save";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Followers from "./Screens/Followers";
import Following from "./Screens/Following";
import MakeFriends from "./Screens/MakeFriends";

function FFF(){
  const Tab = createMaterialTopTabNavigator();
  return(
    <Tab.Navigator>
      <Tab.Screen name="Followers" component={Followers}/>
      <Tab.Screen name="Following" component={Following}/>
      <Tab.Screen name="Make Friends" component={MakeFriends}/>
    </Tab.Navigator>
  );
}

function ProfileDrawer() {
  const Drawer = createDrawerNavigator();
  const account = useSelector((state) => state.account);
  return (
    <Drawer.Navigator
      initialRouteName="Profile"
      screenOptions={{
        drawerPosition: "right",
      }}
    >
      <Drawer.Screen
        name="Profile"
        component={ProfileStack}
        options={{headerShown: false, title: `${account.username}`}}
      />
    </Drawer.Navigator>
  );
}

function ProfileStack() {
  const Stack = createNativeStackNavigator();
  const account = useSelector((state) => state.account);
  return (
    <Stack.Navigator
      initialRouteName="Profile Screen"
    >
      <Stack.Screen name="Profile Screen" component={Profile} options={{ title: `${account.username}` }} />
      <Stack.Screen name="Edit Profile" component={EditProfile} />
      <Stack.Screen name="FFF" component={FFF} />
    </Stack.Navigator>
  );
}

function Base() {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#000" },
        tabBarShowLabel: false,
      }}
      initialRouteName="Scrabbit"
    >
      <Tab.Screen
        name="World"
        component={World}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name="earth-outline"
              size={32}
              color={focused ? "#808080" : "white"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name="chatbubbles-outline"
              size={32}
              color={focused ? "#808080" : "white"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Scrabbit"
        component={Camera}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={
                focused
                  ? require("./assets/images/Scrabbit_Logo_Focused.png")
                  : require("./assets/images/Scrabbit_Logo.png")
              }
              style={{
                width: size,
                height: size,
                borderRadius: size,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={
                focused
                  ? require("./assets/images/feed_button_f.png")
                  : require("./assets/images/feed_button.png")
              }
              style={{
                width: size,
                height: size,
                borderRadius: size,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileDrawer"
        component={ProfileDrawer}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name="person-circle-outline"
              size={32}
              color={focused ? "#808080" : "white"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Provider store={store}>
        <Stack.Navigator
          initialRouteName="login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="login" component={Login} />
          <Stack.Screen name="register" component={Register} />
          <Stack.Screen name="app" component={Base} />
          <Stack.Screen name="Save" component={Save}/>
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

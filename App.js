import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Login from "./Screens/Login";
import Register from "./Screens/Register";
import Camera from "./Screens/Camera";
import World from "./Screens/World";
import Chat from "./Screens/Chat";
import Feed from "./Screens/Feed";
import Profile from "./Screens/Profile";
import EditProfile from "./Screens/EditProfile";
import FFF from "./Screens/FFF";

function ProfileStack() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Edit Profile" component={EditProfile}/>
      <Stack.Screen name="FFF" component={FFF}/>
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
      <Tab.Screen name="World" component={World} />
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="Scrabbit" component={Camera} />
      <Tab.Screen name="Feed" component={Feed} />
      <Tab.Screen name="ProfileStack" component={ProfileStack} />
    </Tab.Navigator>
  );
}

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="register" component={Register} />
        <Stack.Screen name="app" component={Base} />
      </Stack.Navigator>
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

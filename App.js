import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import RegisterForm from "./src/Screens/RegisterForm";
import LoginForm from "./src/Screens/LoginForm";
import AdminActions from "./src/Screens/Actions/AdminActions";
import AdminManagePanel from "./src/Screens/Actions/AdminManagePanel";
import ManagerPanel from "./src/Screens/Actions/ManagerPanel";
import DeveloperTasksScreen from "./src/Screens/Actions/DeveloperTasksScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
const Stack = createStackNavigator();

export const baseURL = "http://localhost:3000";

export default function App({ navigation }) {
  const [userId, setUserId] = useState();
  useEffect(() => {
    const getUserIdFromAsyncStorage = async () => {
      try {
        const userIdd = await AsyncStorage.getItem("id");
        setUserId(userIdd);
      } catch (error) {
        console.log(
          "Error while retrieving user ID from AsyncStorage: ",
          error
        );
      }
    };
    getUserIdFromAsyncStorage();
  }, [userId]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AuthScreen">
        <Stack.Screen component={LoginForm} name="LoginFrom" />
        <Stack.Screen component={RegisterForm} name="RegisterForm" />
        <Stack.Screen component={AdminActions} name="AdminActions" />
        <Stack.Screen component={AdminManagePanel} name="AdminManagePanel" />
        <Stack.Screen component={ManagerPanel} name="ManagerPanel" />
        <Stack.Screen
          component={DeveloperTasksScreen}
          name="DeveloperTasksScreen"
        />
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

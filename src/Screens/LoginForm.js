import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  ImageBackground,
  Text,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseURL } from "../../App";
import axios from "axios";

const USER_ROLES = {
  ADMIN: "Admin",
  MANAGER: "Manager",
  DEVELOPER: "Developer",
};

const LoginForm = ({ navigation }) => {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  const [currentUser, setCurrentUser] = useState(null);

  const [role, setRole] = useState(USER_ROLES.DEVELOPER);
  const [adminActionsVisible, setAdminActionsVisible] = useState(false);
  const [userData, setUserData] = useState();

  const handleLogin = async () => {
    if (username === "") {
      setError("Please enter a username");
    } else if (password === "") {
      setError("Please enter a password");
    } else {
      try {
        const user = await axios.get(`${baseURL}/users`);

        setUserData(user.data);

        const response = user.data.find((a) => {
          return a.username === username && a.password === password;
        });

        console.log("response", response);
        if (!response) {
          console.log("invalid user");
        }
        await AsyncStorage.setItem("id", response.id.toString());
        console.log("res", response.id);

        const userRole = response.role;
        if (userRole === USER_ROLES.ADMIN) {
          setAdminActionsVisible(true);
          navigation.navigate("AdminActions");
        } else if (userRole === USER_ROLES.MANAGER) {
          navigation.navigate("ManagerPanel");
        } else if (userRole === USER_ROLES.DEVELOPER) {
          navigation.navigate("DeveloperTasksScreen");
        } else {
        }
      } catch (error) {
        setError("Incorrect Credential");
        console.error(error);
      }
    }
  };

  const handleRegister = () => {
    navigation.navigate("RegisterForm");
  };
  const handleLogout = async () => {
    try {
      await axios.post(`${baseURL}/logout`);
      setCurrentUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateAccount = async () => {
    try {
      await axios.post(`${baseURL}/users`, {
        username,
        password,
        role,
      });
      alert(`${role} account created successfully!`);
    } catch (error) {
      console.error(error);
    }
  };

  const isAdmin = currentUser?.role === USER_ROLES.ADMIN;

  return (
    <ImageBackground style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.childTitle}>Proceed with Your</Text>
        <Text style={styles.title}>Login</Text>
        {error ? (
          <View style={styles.errorr}>
            <Text style={styles.error}>{error}</Text>
          </View>
        ) : null}
        {currentUser ? (
          <>
            <Text style={styles.title}>Welcome, {currentUser.username}!</Text>
            <Button title='Logout' onPress={handleLogout} />
            {isAdmin && adminActionsVisible && <AdminActions />}
          </>
        ) : (
          <>
            <TextInput
              placeholder='Username'
              value={username}
              onChangeText={setUsername}
              style={styles.input}
            />
            <TextInput
              placeholder='Password'
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              style={styles.input}
            />
            {adminActionsVisible && !userData && (
              <View>
                <Button
                  title='Create Manager Account'
                  onPress={() => setRole(USER_ROLES.MANAGER)}
                />
                <Button
                  title='Create Developer Account'
                  onPress={() => setRole(USER_ROLES.DEVELOPER)}
                />
              </View>
            )}

            <>
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
              <Text style={styles.text}>Don't have an account?</Text>
              <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
            </>

            {adminActionsVisible && !userData && (
              <Button title='Create Account' onPress={handleCreateAccount} />
            )}
          </>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "80%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  childTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 50,
    color: "#fff",
  },
  button: {
    width: "80%",
    height: 50,
    backgroundColor: "#4caf50",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#f093fb",
    backgroundImage: "linear-gradient(315deg, #f093fb 0%, #f5576c 74%)",
  },
  text: {
    marginBottom: 10,
  },
  errorr: {
    backgroundColor: "yellow",
    margin: 10,
    width: "50%",
    textAlign: "center",
    justifyContent: "center",
  },
  error: {
    color: "red",
    marginBottom: 10,
    fontWeight: "bold",
  },
});

export default LoginForm;

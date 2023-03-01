import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ImageBackground,
} from "react-native";
import axios from "axios";
import { baseURL } from "../../../App";

const USER_ROLES = {
  ADMIN: "Admin",
  MANAGER: "Manager",
  DEVELOPER: "Developer",
};

const AdminActions = ({ navigation }) => {
  console.log("nev", navigation);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(USER_ROLES.DEVELOPER);

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

  const handleCreateProject = () => {
    navigation.navigate("AdminManagePanel");
  };

  return (
    <ImageBackground style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Create new user account</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder='Username'
            onChangeText={(text) => setUsername(text)}
            style={styles.textInput}
          />
          <TextInput
            placeholder='Password'
            onChangeText={(text) => setPassword(text)}
            style={styles.textInput}
            secureTextEntry
          />
          <Text style={styles.label}>Select user role:</Text>
          <View style={styles.roleButtons}>
            <Button
              title='Manager'
              onPress={() => setRole(USER_ROLES.MANAGER)}
              color={role === USER_ROLES.MANAGER ? "blue" : "gray"}
            />
            <Button
              title='Developer'
              onPress={() => setRole(USER_ROLES.DEVELOPER)}
              color={role === USER_ROLES.DEVELOPER ? "blue" : "gray"}
            />
          </View>
          <View style={styles.createButton}>
            <Button title='Create account' onPress={handleCreateAccount} />
          </View>
          <Button title='Create Project' onPress={handleCreateProject} />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  createButton: {
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputContainer: {
    width: "100%",
    maxWidth: 400,
  },
  textInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    padding: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  roleButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
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
});

export default AdminActions;

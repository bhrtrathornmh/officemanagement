import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { baseURL } from "../../App";

const RegisterForm = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [selectedValue, setSelectedValue] = useState("Select");
  const [error, setError] = useState("");

  const loginHandler = () => {
    navigation.navigate("LoginFrom");
  };

  const handleRegister = async () => {
    if (username === "") {
      setError("Please enter a username");
    } else if (password === "") {
      setError("Please enter a password");
    } else if (role === "") {
      setError("Please enter a role");
    } else {
      try {
        const response = await axios.post(`${baseURL}/users`, {
          username,
        });

        if (response.data) {
          setError("USername Already Exist");
        }

        console.log("RESPONSE", response.data);
      } catch (error) {
        console.error("error", error);
      }
    }
  };

  return (
    <ImageBackground style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign UP</Text>
        {error ? (
          <View style={styles.errorr}>
            <Text style={styles.error}>{error}</Text>
          </View>
        ) : null}
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

        <Picker
          selectedValue={role}
          style={styles.input}
          onValueChange={(itemValue, itemIndex) => setRole(itemValue)}
        >
          <Picker.Item label='Select' value='' />
          <Picker.Item label='Manager' value='Manager' />
          <Picker.Item label='Developer' value='Developer' />
        </Picker>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 50,
    color: "#fff",
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
    fontWeight: "bold",
  },
  errorr: {
    backgroundColor: "yellow",
    marginBottom: 10,
    width: "50%",
    textAlign: "center",
  },
  error: {
    color: "red",
    marginBottom: 10,
    fontWeight: "bold",
  },
});

export default RegisterForm;

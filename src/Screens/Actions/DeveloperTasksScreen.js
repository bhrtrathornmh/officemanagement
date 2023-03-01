import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Icon } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseURL } from "../../../App";

const DeveloperTasksScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [developerId, setDeveloperId] = useState(0);

  console.log(developerId);
  console.log(tasks);

  useEffect(() => {
    const getUserIdFromAsyncStorage = async () => {
      try {
        const userId = await AsyncStorage.getItem("id");
        console.log(
          "User ID successfully retrieved from AsyncStorage.",
          userId
        );
        setDeveloperId(parseInt(userId));
      } catch (error) {
        console.log(
          "Error while retrieving user ID from AsyncStorage: ",
          error
        );
      }
    };
    getUserIdFromAsyncStorage();
  }, [developerId]);

  useEffect(() => {
    fetch(`${baseURL}/tasks`)
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        console.log("dataw", developerId);

        const developerTasks = data.filter(
          (task) => task.developers.indexOf(developerId) !== -1
        );
        setTasks(developerTasks);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [developerId]);

  const handleTaskUpdate = (taskId, status) => {
    const updatedTask = { ...tasks.find((task) => task.id === taskId), status };
    fetch(`${baseURL}/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedTasks = tasks.map((task) => {
          if (task.id === data.id) {
            return data;
          }
          return task;
        });
        setTasks(updatedTasks);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const renderTaskItem = ({ item }) => {
    let statusColor;
    switch (item.status) {
      case "TODO":
        statusColor = "#f8d7da";
        break;
      case "IN PROGRESS":
        statusColor = "#fff3cd";
        break;
      case "DONE":
        statusColor = "#d4edda";
        break;
      default:
        statusColor = "#fff";
        break;
    }

    return (
      <TouchableOpacity
        style={[styles.taskItem, { backgroundColor: statusColor }]}
      >
        <Text style={styles.taskName}>{item.name}</Text>
        <View style={styles.taskStatus}>
          <TouchableOpacity onPress={() => handleTaskUpdate(item.id, "TODO")}>
            <Icon
              name='checkbox-outline'
              type='ionicon'
              color={item.status === "TODO" ? "green" : "gray"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleTaskUpdate(item.id, "IN PROGRESS")}
          >
            <Icon
              name='timer-outline'
              type='ionicon'
              color={item.status === "IN PROGRESS" ? "orange" : "gray"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleTaskUpdate(item.id, "DONE")}>
            <Icon
              name='checkmark-done-outline'
              type='ionicon'
              color={item.status === "DONE" ? "green" : "gray"}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Tasks</Text>
      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.tasksList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tasksList: {
    flex: 1,
    borderWidth: 1,
    borderColor: "black",
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

export default DeveloperTasksScreen;

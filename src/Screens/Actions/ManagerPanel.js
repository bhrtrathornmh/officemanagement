import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  Modal,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import axios from "axios";
import { Icon } from "react-native-elements";
import { MultipleSelectPicker } from "react-native-multi-select-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseURL } from "../../../App";

const USER_ROLES = {
  ADMIN: "Admin",
  MANAGER: "Manager",
  DEVELOPER: "Developer",
};

const ManagerPanel = ({ navigation }) => {
  const id = AsyncStorage.getItem("id");

  const [taskName, setTaskName] = useState("");
  const [developerNames, setDeveloperNames] = useState("");
  const [taskStatus, setTaskStatus] = useState("TODO");
  const [projectsRes, setProjectsRes] = useState([]);
  const [managerId, setManagerId] = useState(0);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
  const [selectedDeveloper, setSelectedDeveloper] = useState("");
  const [users, setUsers] = useState([]);
  const [newTaskDeveloper, setNewTaskDeveloper] = useState([]);
  const [projectId, setProjectId] = useState();
  const [taskDesc, setTaskDesc] = useState("");
  const [numTodoTasks, setNumTodoTasks] = useState(0);
  const [numInProgressTasks, setNumInProgressTasks] = useState(0);
  const [numDoneTasks, setNumDoneTasks] = useState(0);

  useEffect(() => {
    const getUserIdFromAsyncStorage = async () => {
      try {
        const userId = await AsyncStorage.getItem("id");
        console.log(
          "User ID successfully retrieved from AsyncStorage.",
          userId
        );
        setManagerId(parseInt(userId));
      } catch (error) {
        console.log(
          "Error while retrieving user ID from AsyncStorage: ",
          error
        );
      }
    };
    getUserIdFromAsyncStorage();
  }, [managerId]);

  console.log("managerID", managerId);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${baseURL}/projects`);

      console.log("projectsRess", response.data);
      setProjectsRes(response.data);
      console.log("projectData", projectsRes);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [managerId]);

  useEffect(() => {
    const managerProjects = projectsRes.filter(
      (manager) => manager.manager === managerId
    );
    setProjects(managerProjects);
    console.log("projects", projects);
  }, [managerId]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${baseURL}/projects`);
        setProjects("res", response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${baseURL}/users`);
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProjects();
    fetchUsers();
  }, []);

  console.log("responsess", projectsRes);

  const handleCreateTask = async () => {
    try {
      const response = await axios.post(`${baseURL}/tasks`, {
        name: taskName,
        description: taskDesc,
        projectId: projectId,
        developers: newTaskDeveloper.map((x) => x.value),
        status: taskStatus,
      });
      console.log(response.data);
      setTaskName("");
      setDeveloperNames("");
    } catch (error) {
      console.error(error);
    }
    setIsAddTaskModalVisible(false);
    alert(`New Task ${taskName} created successfully!`);
    setNewTaskDeveloper("");
  };
  const handleProjectPress = (project) => {
    setSelectedProject(project);
    setTasks([]);
    if (project.tasks) {
      setTasks(project.tasks);
    }
    setProjectId(project.id);
  };

  const handleTaskSubmit = async () => {
    try {
      await axios.post(`${baseURL}/tasks`, {
        name: newProjectName,
        manager: newProjectManager,
        developers: newProjectDevelopers,
        status: newProjectStatus,
      });
      alert(`Project ${newProjectName} created successfully!`);
      setNewProjectName("");
      setNewProjectManager("");
      setNewProjectDevelopers([]);
      setNewProjectStatus(PROJECT_STATUSES.ACTIVE);
      setProjects([
        ...projects,
        {
          name: newProjectName,
          manager: newProjectManager,
          developers: newProjectDevelopers,
          status: newProjectStatus,
        },
      ]);
    } catch (error) {
      console.error(error);
    }

    const newTask = { name: taskName, developer: selectedDeveloper };
    const updatedTasks = [...tasks, newTask];
    const updatedProjects = projects.map((project) => {
      if (project.name === selectedProject.name) {
        return { ...project, tasks: updatedTasks };
      } else {
        return project;
      }
    });
    setProjects(updatedProjects);
    setTasks(updatedTasks);
    setTaskName("");
    setSelectedDeveloper("");
    setIsAddTaskModalVisible(false);
  };

  useEffect(() => {
    fetch(`${baseURL}/tasks`)
      .then((response) => response.json())
      .then((data) => {
        const todoTasks = data.filter((task) => task.status === "TODO");
        const inProgressTasks = data.filter(
          (task) => task.status === "IN PROGRESS"
        );
        const doneTasks = data.filter((task) => task.status === "DONE");
        setNumTodoTasks(todoTasks.length);
        setNumInProgressTasks(inProgressTasks.length);
        setNumDoneTasks(doneTasks.length);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const renderProjectItem = ({ item }) => (
    <View style={styles.projectItem}>
      <Text style={styles.projectTitle}>{item.name}</Text>
      <Button title="View Tasks" onPress={() => handleProjectPress(item)} />
    </View>
  );

  const renderTaskItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskName}>{item.name}</Text>
      <Text style={styles.taskDeveloper}>{item.developer}</Text>
    </View>
  );
  const handleAddTaskPress = () => {
    setIsAddTaskModalVisible(true);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("id");
      navigation.navigate("LoginForm");
    } catch (error) {
      console.error(error);
    }

    navigation.navigate("LoginForm");
  };

  return (
    <ImageBackground style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Overview of all the tasks</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.todoitems}>TODO: {numTodoTasks}</Text>
          <Text style={styles.todoitems}>
            IN PROGRESS: {numInProgressTasks}
          </Text>
          <Text style={styles.todoitems}>DONE: {numDoneTasks}</Text>
        </View>

        <View style={styles.container}>
          <Text style={styles.title}>Manager Tasks</Text>
          <FlatList
            data={projectsRes.filter(
              (manager) => manager.manager === managerId
            )}
            renderItem={renderProjectItem}
            keyExtractor={(item) => item.id}
            style={styles.projectsList}
          />
        </View>
        {selectedProject && (
          <View style={styles.tasksContainer}>
            <Text style={styles.subtitle}>{selectedProject.name} Tasks</Text>
            <FlatList
              data={tasks}
              renderItem={renderTaskItem}
              keyExtractor={(item, index) => `${index}`}
              style={styles.tasksList}
            />
            <Button title="Add Task" onPress={handleAddTaskPress} />
          </View>
        )}
        <Modal visible={isAddTaskModalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Add Task to {selectedProject?.name}
            </Text>
            <TextInput
              placeholder="Task Name"
              value={taskName}
              onChangeText={setTaskName}
              style={styles.input}
            />
            <TextInput
              placeholder="Task Description"
              value={taskDesc}
              onChangeText={setTaskDesc}
              style={styles.input}
            />

            <Text>Select Developer</Text>

            <MultipleSelectPicker
              items={users
                .filter((user) => user.role === USER_ROLES.DEVELOPER)
                .map((developer) => {
                  console.log("developer", developer);
                  return { label: developer.username, value: developer.id };
                })}
              onSelectionsChange={(e) => {
                setNewTaskDeveloper(e);
              }}
              selectedItems={newTaskDeveloper}
              buttonStyle={{
                height: 100,
                justifyContent: "center",
                alignItems: "center",
              }}
              buttonText="hello"
              checkboxStyle={{ height: 20, width: 20 }}
            />

            <Button title="Submit" onPress={handleCreateTask} />
            <Icon
              name="close"
              type="ionicon"
              onPress={() => setIsAddTaskModalVisible(false)}
            />
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

ManagerPanel.navigationOptions = ({ navigation }) => {
  return {
    title: "Manager Dashboard",
    headerRight: () => (
      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.headerButton}>Logout</Text>
      </TouchableOpacity>
    ),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerButton: {
    marginRight: 10,
    color: "blue",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  projectsList: {
    marginBottom: 20,
  },
  projectItem: {
    marginBottom: 10,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  projectDescription: {
    fontSize: 14,
    marginBottom: 5,
  },
  tasksContainer: {
    flex: 1,
    alignItems: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  todoitems: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 2,
    color: "#FFBF00",
  },
  tasksList: {
    marginBottom: 20,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  taskName: {
    flex: 1,
    fontSize: 16,
  },
  taskDeveloper: {
    fontSize: 14,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
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

export default ManagerPanel;

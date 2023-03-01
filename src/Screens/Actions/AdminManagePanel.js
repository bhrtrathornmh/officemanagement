import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  ImageBackground,
  Text,
} from "react-native";
import { MultipleSelectPicker } from "react-native-multi-select-picker";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { baseURL } from "../../../App";

const USER_ROLES = {
  ADMIN: "Admin",
  MANAGER: "Manager",
  DEVELOPER: "Developer",
};

const PROJECT_STATUSES = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

const AdminManagePanel = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectManager, setNewProjectManager] = useState("");
  const [newProjectDevelopers, setNewProjectDevelopers] = useState([]);
  const [selectectedItems, setSelectectedItems] = useState([]);
  const [newProjectStatus, setNewProjectStatus] = useState(
    PROJECT_STATUSES.ACTIVE
  );

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
        if (response.data) {
          console.log("response.data", response.data);
          setUsers(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProjects();
    fetchUsers();
  }, []);

  console.log("users", users);

  const handleCreateProject = async () => {
    try {
      await axios.post(`${baseURL}/projects`, {
        name: newProjectName,
        manager: newProjectManager,
        developers: newProjectDevelopers.map((x) => x.value),
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
  };

  const handleAssignManager = async (projectId, managerId) => {
    try {
      await axios.patch(`${baseURL}/projects/${projectId}`, {
        manager: managerId,
      });
      alert(`Manager assigned to project successfully!`);
      setProjects(
        projects.map((project) => {
          if (project.id === projectId) {
            return {
              ...project,
              manager: managerId,
            };
          } else {
            return project;
          }
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleAssignDeveloper = async (projectId, developerId) => {
    try {
      await axios.patch(`${baseURL}/projects/${projectId}`, {
        developers: [
          ...projects.find((project) => project.id === projectId).developers,
          developerId,
        ],
      });
      alert(`Developer assigned to project successfully!`);
      setProjects(
        projects.map((project) => {
          if (project.id === projectId) {
            return {
              ...project,
              developers: [...project.developers, developerId],
            };
          } else {
            return project;
          }
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ImageBackground style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.section}>
          <TextInput
            placeholder='Project Name'
            value={newProjectName}
            onChangeText={setNewProjectName}
            style={styles.textInput}
          />
          <Picker
            selectedValue={newProjectManager}
            onValueChange={(itemValue) => setNewProjectManager(itemValue)}
            style={{ marginBottom: 10 }}
          >
            <Picker.Item label='Select Manager' value='' />
            {users
              .filter((user) => user.role === USER_ROLES.MANAGER)
              .map((manager) => (
                <Picker.Item
                  key={manager.id}
                  label={manager.username}
                  value={manager.id}
                />
              ))}
          </Picker>
          <Text style={styles.text}>Select Developers</Text>
          <MultipleSelectPicker
            style={styles.multipleSelect}
            items={users
              .filter((user) => user.role === USER_ROLES.DEVELOPER)
              .map((developer) => {
                console.log("developer", developer);
                return { label: developer.username, value: developer.id };
              })}
            onSelectionsChange={(e) => {
              setNewProjectDevelopers(e);
            }}
            selectedItems={newProjectDevelopers}
            buttonStyle={{
              height: 100,
              justifyContent: "center",
              alignItems: "center",
            }}
            buttonText='hello'
            checkboxStyle={{ height: 20, width: 20 }}
          />

          <Button title='Create Project' onPress={handleCreateProject} />
        </View>
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
  textInput: {
    justifyContent: "center",
    borderWidth: 2,
    height: 50,
    borderColor: "black",
    paddingBottom: 10,
    color: "black",
    backgroundColor: "white",
    marginBottom: 10,
  },
  text: {
    backgroundColor: "white",
    color: "black",
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  multipleSelect: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  project: {
    marginBottom: 10,
  },
  projectName: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  projectManager: {
    marginBottom: 5,
  },
  projectDevelopers: {
    marginBottom: 5,
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

export default AdminManagePanel;

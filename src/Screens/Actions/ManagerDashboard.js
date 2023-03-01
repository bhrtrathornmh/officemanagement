import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Picker,
  ImageBackground,
} from "react-native";

const USER_ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  DEVELOPER: "developer",
};

const TASK_STATUSES = {
  TODO: "TODO",
  IN_PROGRESS: "In Progress",
  COMPLETE: "Complete",
};

const ManagerDashboard = ({ projects, users, currentUser }) => {
  const [selectedProject, setSelectedProject] = useState("");
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDeveloper, setNewTaskDeveloper] = useState("");

  const handleCreateTask = () => {
    if (
      !selectedProject ||
      !newTaskName ||
      !newTaskDescription ||
      !newTaskDeveloper
    ) {
      return;
    }
    const selectedProjectObject = projects.find(
      (project) => project.id === selectedProject
    );
    if (!selectedProjectObject) {
      return;
    }
    const newTask = {
      name: newTaskName,
      description: newTaskDescription,
      developer: newTaskDeveloper,
      status: "TODO",
    };
    const updatedProject = {
      ...selectedProjectObject,
      tasks: [...selectedProjectObject.tasks, newTask],
    };
    const updatedProjects = projects.map((project) => {
      if (project.id === selectedProject) {
        return updatedProject;
      }
      return project;
    });
    setSelectedProject("");
    setNewTaskName("");
    setNewTaskDescription("");
    setNewTaskDeveloper("");
  };

  const handleAssignDeveloper = (taskId, developerId) => {
    const selectedProjectObject = projects.find(
      (project) => project.id === selectedProject
    );
    if (!selectedProjectObject) {
      return;
    }
    const updatedTasks = selectedProjectObject.tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          developer: developerId,
        };
      }
      return task;
    });
    const updatedProject = {
      ...selectedProjectObject,
      tasks: updatedTasks,
    };
    const updatedProjects = projects.map((project) => {
      if (project.id === selectedProject) {
        return updatedProject;
      }
      return project;
    });
  };

  return (
    <ImageBackground style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.section}>
          <Text>Create Task</Text>
          <Picker
            selectedValue={selectedProject}
            onValueChange={(itemValue) => setSelectedProject(itemValue)}
          >
            <Picker.Item label="Select Project" value="" />
            {projects.map((project) => (
              <Picker.Item
                key={project.id}
                label={project.name}
                value={project.id}
              />
            ))}
          </Picker>
          <TextInput
            placeholder="Task Name"
            value={newTaskName}
            onChangeText={setNewTaskName}
          />
          <TextInput
            placeholder="Task Description"
            value={newTaskDescription}
            onChangeText={setNewTaskDescription}
          />
          <Picker
            selectedValue={newTaskDeveloper}
            onValueChange={(itemValue) => setNewTaskDeveloper(itemValue)}
          >
            <Picker.Item label="Select Developer" value="" />
            {users
              .filter((user) => user.role === USER_ROLES.DEVELOPER)
              .map((developer) => (
                <Picker.Item
                  key={developer.id}
                  label={developer.name}
                  value={developer.id}
                />
              ))}
          </Picker>
          <Button title="Create Task" onPress={handleCreateTask} />
        </View>
        <View style={styles.section}>
          {projects
            .filter(
              (project) =>
                project.manager === currentUser.id &&
                project.tasks.length > 0 &&
                project.tasks.some(
                  (task) => task.status !== TASK_STATUSES.COMPLETE
                )
            )
            .map((project) => (
              <View key={project.id} style={styles.projectContainer}>
                <Text style={styles.projectName}>{project.name}</Text>
                {project.tasks
                  .filter((task) => task.status !== TASK_STATUSES.COMPLETE)
                  .map((task) => (
                    <View key={task.id} style={styles.taskContainer}>
                      <Text>{task.name}</Text>
                      <Text>{task.description}</Text>
                      <Picker
                        selectedValue={task.developer}
                        onValueChange={(itemValue) =>
                          handleAssignDeveloper(task.id, itemValue)
                        }
                      >
                        <Picker.Item label="Assign Developer" value="" />
                        {users
                          .filter((user) => user.role === USER_ROLES.DEVELOPER)
                          .map((developer) => (
                            <Picker.Item
                              key={developer.id}
                              label={developer.name}
                              value={developer.id}
                            />
                          ))}
                      </Picker>
                    </View>
                  ))}
              </View>
            ))}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  projectContainer: {
    marginBottom: 8,
  },
  projectName: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  taskContainer: {
    marginLeft: 16,
    marginBottom: 8,
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

export default ManagerDashboard;

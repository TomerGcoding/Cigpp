import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomClickableIcon from "../../../components/CustomClickableIcon";
import { Ionicons } from "react-native-vector-icons";
import { COLOR, FONT } from "../../../constants/theme";

const CigarettesLogsModal = ({ navigation }) => {
  const [logs, setLogs] = useState([
    { id: "1", time: "09:30 AM", date: "2024-03-20" },
    { id: "2", time: "11:45 AM", date: "2024-03-20" },
    { id: "3", time: "02:15 PM", date: "2024-03-20" },
    { id: "4", time: "04:30 PM", date: "2024-03-20" },
    { id: "5", time: "07:00 PM", date: "2024-03-20" },
  ]);

  const handleDelete = (id) => {
    Alert.alert("Delete Entry", "Are you sure you want to delete this entry?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          setLogs(logs.filter((log) => log.id !== id));
        },
        style: "destructive",
      },
    ]);
  };

  const handleAdd = () => {
    const now = new Date();
    const newLog = {
      id: Date.now().toString(),
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: now.toISOString().split("T")[0],
    };
    setLogs([newLog, ...logs]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.logItem}>
      <View style={styles.logInfo}>
        <Text style={styles.timeText}>{item.time}</Text>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
      <TouchableOpacity
        onPress={() => handleDelete(item.id)}
        style={styles.deleteButton}
      >
        <Ionicons name="trash-outline" size={24} color={COLOR.primary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <CustomClickableIcon
          onPress={() => navigation.goBack()}
          color={COLOR.primary}
          size={30}
          name="arrow-back"
        />
        <Text style={styles.title}>Cigarette Logs</Text>
        <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={30} color={COLOR.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={logs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: FONT.bold,
    color: COLOR.primary,
  },
  addButton: {
    padding: 5,
  },
  listContainer: {
    padding: 20,
  },
  logItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLOR.lightBackground,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  logInfo: {
    flex: 1,
  },
  timeText: {
    fontSize: 18,
    fontFamily: FONT.bold,
    color: COLOR.primary,
  },
  dateText: {
    fontSize: 14,
    color: COLOR.subPrimary,
    fontFamily: FONT.regular,
    marginTop: 4,
  },
  deleteButton: {
    padding: 5,
  },
});

export default CigarettesLogsModal;

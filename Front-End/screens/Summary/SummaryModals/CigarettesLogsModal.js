import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomClickableIcon from "../../../components/CustomClickableIcon";
import { Ionicons } from "react-native-vector-icons";
import { COLOR, FONT } from "../../../constants/theme";

const CigarettesLogsModal = ({ navigation }) => {
  const [logs, setLogs] = useState([
    { id: "1", time: "09:30 AM", date: "2024-03-20", source: "device" },
    { id: "2", time: "11:45 AM", date: "2024-03-20", source: "device" },
    { id: "3", time: "02:15 PM", date: "2024-03-20", source: "manual" },
    { id: "4", time: "04:30 PM", date: "2024-03-20", source: "device" },
    { id: "5", time: "07:00 PM", date: "2024-03-20", source: "device" },
  ]);

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [timeInput, setTimeInput] = useState("");
  const [dateInput, setDateInput] = useState("");

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
    setAddModalVisible(true);

    // Default values for today
    const now = new Date();
    setTimeInput(
      now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
    setDateInput(now.toISOString().split("T")[0]);
  };

  const addNewLog = () => {
    // Basic validation
    if (!timeInput || !dateInput) {
      Alert.alert("Invalid Input", "Please enter both time and date");
      return;
    }

    const newLog = {
      id: Date.now().toString(),
      time: timeInput,
      date: dateInput,
      source: "manual",
    };

    setLogs([newLog, ...logs]);
    setAddModalVisible(false);
  };

  const filteredLogs = () => {
    if (selectedFilter === "all") return logs;
    return logs.filter((log) => log.source === selectedFilter);
  };

  const groupedLogs = () => {
    // Group logs by date
    const groups = {};
    filteredLogs().forEach((log) => {
      if (!groups[log.date]) {
        groups[log.date] = [];
      }
      groups[log.date].push(log);
    });

    // Convert to array for FlatList
    return Object.keys(groups).map((date) => ({
      date,
      data: groups[date].sort((a, b) => {
        // Convert time to comparable format (assumes AM/PM format)
        const timeA = new Date(`1970/01/01 ${a.time}`).getTime();
        const timeB = new Date(`1970/01/01 ${b.time}`).getTime();
        return timeB - timeA; // Sort descending
      }),
    }));
  };

  const formatDate = (dateString) => {
    const options = { weekday: "long", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderLogItem = ({ item }) => (
    <View style={styles.logItem}>
      <View style={styles.logInfo}>
        <Text style={styles.timeText}>{item.time}</Text>
        <View style={styles.sourceContainer}>
          <Ionicons
            name={
              item.source === "device"
                ? "hardware-chip-outline"
                : "hand-left-outline"
            }
            size={14}
            color={COLOR.subPrimary}
          />
          <Text style={styles.sourceText}>
            {item.source === "device" ? "Tracked by device" : "Added manually"}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => handleDelete(item.id)}
        style={styles.deleteButton}
      >
        <Ionicons name="trash-outline" size={20} color={COLOR.primary} />
      </TouchableOpacity>
    </View>
  );

  const renderDateSection = ({ item }) => (
    <View style={styles.dateSection}>
      <Text style={styles.dateSectionHeader}>{formatDate(item.date)}</Text>
      <FlatList
        data={item.data}
        renderItem={renderLogItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
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

      <View style={styles.filterContainer}>
        {["all", "device", "manual"].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterOption,
              selectedFilter === filter && styles.selectedFilter,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.selectedFilterText,
              ]}
            >
              {filter === "all"
                ? "All"
                : filter === "device"
                ? "Device"
                : "Manual"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{logs.length}</Text>
          <Text style={styles.statLabel}>Total Logs</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {logs.filter((log) => log.source === "device").length}
          </Text>
          <Text style={styles.statLabel}>Device</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {logs.filter((log) => log.source === "manual").length}
          </Text>
          <Text style={styles.statLabel}>Manual</Text>
        </View>
      </View>

      {groupedLogs().length > 0 ? (
        <FlatList
          data={groupedLogs()}
          renderItem={renderDateSection}
          keyExtractor={(item) => item.date}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={60} color="#d0d0d0" />
          <Text style={styles.emptyText}>No logs found</Text>
          <Text style={styles.emptySubtext}>
            Logs will appear here when you track cigarettes
          </Text>
        </View>
      )}

      {/* Add Log Modal */}
      <Modal
        visible={addModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Cigarette Log</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Time</Text>
              <TextInput
                style={styles.input}
                value={timeInput}
                onChangeText={setTimeInput}
                placeholder="e.g., 10:30 AM"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Date</Text>
              <TextInput
                style={styles.input}
                value={dateInput}
                onChangeText={setDateInput}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setAddModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={addNewLog}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    fontSize: 20,
    fontFamily: FONT.bold,
    color: COLOR.primary,
  },
  addButton: {
    padding: 5,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  filterOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  selectedFilter: {
    backgroundColor: COLOR.primary,
  },
  filterText: {
    fontFamily: FONT.medium,
    fontSize: 14,
    color: COLOR.primary,
  },
  selectedFilterText: {
    color: COLOR.whitening,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statItem: {
    width: "30%",
    alignItems: "center",
    backgroundColor: COLOR.lightBackground,
    borderRadius: 12,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontFamily: FONT.bold,
    color: COLOR.primary,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: FONT.regular,
    color: COLOR.subPrimary,
    marginTop: 4,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  dateSection: {
    marginBottom: 20,
  },
  dateSectionHeader: {
    fontSize: 16,
    fontFamily: FONT.semiBold,
    color: COLOR.primary,
    marginBottom: 10,
  },
  logItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLOR.lightBackground,
    padding: 15,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  logInfo: {
    flex: 1,
  },
  timeText: {
    fontSize: 18,
    fontFamily: FONT.bold,
    color: COLOR.primary,
  },
  sourceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  sourceText: {
    fontSize: 12,
    color: COLOR.subPrimary,
    fontFamily: FONT.regular,
    marginLeft: 5,
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: FONT.bold,
    color: COLOR.primary,
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: FONT.regular,
    color: COLOR.subPrimary,
    textAlign: "center",
    marginTop: 8,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: COLOR.background,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: FONT.bold,
    color: COLOR.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: FONT.medium,
    color: COLOR.primary,
    marginBottom: 5,
  },
  input: {
    backgroundColor: COLOR.lightBackground,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    fontFamily: FONT.regular,
    color: COLOR.primary,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  cancelButtonText: {
    color: COLOR.primary,
    fontFamily: FONT.medium,
    fontSize: 16,
  },
  addButtonText: {
    color: COLOR.whitening,
    fontFamily: FONT.medium,
    fontSize: 16,
  },
});

export default CigarettesLogsModal;

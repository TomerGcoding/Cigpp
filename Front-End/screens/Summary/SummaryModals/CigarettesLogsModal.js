import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomClickableIcon from "../../../components/CustomClickableIcon";
import { Ionicons } from "react-native-vector-icons";
import { COLOR, FONT } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import cigaretteLogService from "../../../services/cigaretteLogService";

const CigarettesLogsModal = ({ navigation }) => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [timeInput, setTimeInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingLog, setIsAddingLog] = useState(false);

  // Load logs when component mounts
  useEffect(() => {
    fetchLogs();
  }, [user?.uid]);

  const fetchLogs = async () => {
    if (!user?.uid) return;

    setIsLoading(true);
    try {
      const fetchedLogs = await cigaretteLogService.getTodayLogs(user.uid);
      const transformedLogs = fetchedLogs.map((log) => ({
        id: log.id.toString(),
        time: new Date(log.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        date: new Date(log.timestamp).toISOString().split("T")[0],
        source: log.description || "manual",
        timestamp: new Date(log.timestamp).getTime(),
      }));
      setLogs(transformedLogs);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

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
          cigaretteLogService
            .deleteCigaretteLog(id)
            .then(() => {
              Alert.alert("Success", "Cigarette log deleted successfully!");
            })
            .catch((error) => {
              console.error("Error deleting log:", error);
              Alert.alert(
                "Error",
                "Failed to delete cigarette log. Please try again."
              );
            });
        },
        style: "destructive",
      },
    ]);
  };

  const handleAdd = () => {
    setAddModalVisible(true);

    const now = new Date();
    setTimeInput(
      now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    );
  };

  const addNewLog = async () => {
    if (!timeInput) {
      Alert.alert("Invalid Input", "Please enter a valid time");
      return;
    }

    if (!user?.uid) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    setIsAddingLog(true);

    try {
      const currentDate = new Date();

      let timeForDate;
      try {
        const timeStr = timeInput.trim();
        const tempDateTime = `${
          currentDate.toISOString().split("T")[0]
        } ${timeStr}`;
        timeForDate = new Date(tempDateTime);

        if (isNaN(timeForDate.getTime())) {
          timeForDate = new Date();
        }
      } catch (timeError) {
        console.warn("Time parsing failed, using current time:", timeError);
        timeForDate = new Date();
      }

      // Combine the current date with the parsed time
      const finalDateTime = new Date(currentDate);
      finalDateTime.setHours(timeForDate.getHours());
      finalDateTime.setMinutes(timeForDate.getMinutes());
      finalDateTime.setSeconds(0);
      finalDateTime.setMilliseconds(0);

      const newLogData = {
        userId: user.uid,
        description: "Manual",
        timestamp: finalDateTime.toISOString(),
      };

      console.log("Sending log data:", newLogData);
      const createdLog = await cigaretteLogService.addCigaretteLog(newLogData);

      const transformedLog = {
        id: createdLog.id.toString(),
        time: new Date(createdLog.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        date: new Date(createdLog.timestamp).toISOString().split("T")[0],
        source: createdLog.description || "manual",
        timestamp: new Date(createdLog.timestamp).getTime(),
      };

      setLogs([transformedLog, ...logs]);
      setAddModalVisible(false);
      setTimeInput("");

      Alert.alert("Success", "Cigarette log added successfully!");
    } catch (error) {
      console.error("Error adding cigarette log:", error);
      Alert.alert("Error", "Failed to add cigarette log. Please try again.");
    } finally {
      setIsAddingLog(false);
    }
  };

  const filteredLogs = () => {
    if (selectedFilter === "all") return logs;
    return logs.filter(
      (log) => log.source.toLowerCase() === selectedFilter.toLowerCase()
    );
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
      data: groups[date].sort((a, b) => b.timestamp - a.timestamp),
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
              item.source.toLowerCase() === "device"
                ? "hardware-chip-outline"
                : "hand-left-outline"
            }
            size={14}
            color={COLOR.subPrimary}
          />
          <Text style={styles.sourceText}>
            {item.source.toLowerCase() === "device"
              ? "Tracked by device"
              : "Added manually"}
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

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <CustomClickableIcon
            onPress={() => navigation.goBack()}
            color={COLOR.primary}
            size={30}
            name="arrow-back"
          />
          <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
            <Ionicons
              name="add-circle-outline"
              size={30}
              color={COLOR.primary}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLOR.primary} />
          <Text style={styles.loadingText}>Loading logs...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <CustomClickableIcon
          onPress={() => navigation.goBack()}
          color={COLOR.primary}
          size={30}
          name="arrow-back"
        />
        <Text style={styles.title}>Cigarette Tracker</Text>
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
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {logs.filter((log) => log.source.toLowerCase() === "device").length}
          </Text>
          <Text style={styles.statLabel}>Device</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {logs.filter((log) => log.source.toLowerCase() === "manual").length}
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
            <Text style={styles.modalTitle}>Add a Cigarette</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Time</Text>
              <TextInput
                style={styles.input}
                value={timeInput}
                onChangeText={setTimeInput}
                placeholder="e.g., 10:30"
                editable={!isAddingLog}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setAddModalVisible(false)}
                disabled={isAddingLog}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.addButton,
                  isAddingLog && styles.disabledButton,
                ]}
                onPress={addNewLog}
                disabled={isAddingLog}
              >
                {isAddingLog ? (
                  <ActivityIndicator size="small" color={COLOR.whitening} />
                ) : (
                  <Text style={styles.addButtonText}>Add</Text>
                )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: FONT.regular,
    color: COLOR.primary,
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
    padding: 5,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default CigarettesLogsModal;

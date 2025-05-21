import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "react-native-vector-icons";
import { COLOR, FONT } from "../../../constants/theme";
import { useBLE } from "../../../contexts/BleContext";
import CustomButton from "../../../components/CustomButton";

const DeviceModal = ({ navigation }) => {
  const {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice,
    data,
    stopScan,
    isScanning,
  } = useBLE();

  // Handle scanning for devices
  const handleScan = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      console.log("Permissions granted");
      scanForPeripherals();
    }
  };

  // Static data for battery level (in the future this could come from the device)
  const batteryLevel = connectedDevice ? 75 : 0; // Mock 75% battery when connected

  // Determine device status
  const deviceStatus = connectedDevice ? "Connected" : "Disconnected";

  // Device name (from connected device or default)
  const deviceName = connectedDevice ? connectedDevice.name : "Cig++ Device";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.deviceInfoContainer}>
        <View style={styles.deviceIconContainer}>
          <Ionicons
            name="hardware-chip-outline"
            size={60}
            color={COLOR.primary}
          />
        </View>

        <Text style={styles.deviceName}>{deviceName}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status:</Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusIndicator,
                {
                  backgroundColor: connectedDevice ? COLOR.green : COLOR.red,
                },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                {
                  color: connectedDevice ? COLOR.green : COLOR.red,
                },
              ]}
            >
              {deviceStatus}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Battery:</Text>
          <View style={styles.batteryContainer}>
            <View
              style={[styles.batteryLevel, { width: `${batteryLevel}%` }]}
            />
          </View>
          <Text style={styles.batteryText}>{batteryLevel}%</Text>
        </View>

        {data !== -1 && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Data Received:</Text>
            <Text style={styles.infoValue}>{data}</Text>
          </View>
        )}

        {connectedDevice ? (
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Disconnect Device"
              style={{ width: "100%" }}
              onPress={disconnectFromDevice}
            />
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Connect Device"
              style={{ width: "100%" }}
              onPress={() => navigation.navigate("Profile")}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.background,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONT.bold,
    color: COLOR.primary,
  },
  deviceInfoContainer: {
    padding: 20,
    alignItems: "center",
  },
  deviceIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLOR.lightBackground,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  deviceName: {
    fontSize: 24,
    fontFamily: FONT.bold,
    color: COLOR.primary,
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  infoLabel: {
    fontSize: 16,
    fontFamily: FONT.bold,
    color: COLOR.primary,
    width: "30%",
  },
  infoValue: {
    fontSize: 16,
    fontFamily: FONT.regular,
    color: COLOR.subPrimary,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontFamily: FONT.regular,
  },
  batteryContainer: {
    width: "50%",
    height: 20,
    borderRadius: 10,
    backgroundColor: COLOR.lightBackground,
    overflow: "hidden",
    marginRight: 10,
  },
  batteryLevel: {
    height: "100%",
    backgroundColor: COLOR.green,
  },
  batteryText: {
    fontSize: 16,
    fontFamily: FONT.regular,
    color: COLOR.subPrimary,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 20,
  },
});

export default DeviceModal;

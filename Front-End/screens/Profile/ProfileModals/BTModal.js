import { View, Text, StyleSheet, Switch, ActivityIndicator } from "react-native";
import { COLOR, FONT } from "../../../constants/theme";
import { usePreferences } from "../../../contexts/PreferencesContext";
import { useBLE } from "../../../contexts/BleContext";
import React, { useState } from "react";
import CustomButton from "../../../components/CustomButton";
import { Ionicons } from "react-native-vector-icons";

const BTModal = () => {
  const { preferences, updatePreference } = usePreferences();
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
    logCigarette,
  } = useBLE();
  const [isModalVisible, setIsModalVisible] = useState(
      preferences.enableBluetooth
  );

  const toggleSwitch = () => {
    setIsModalVisible(!isModalVisible);
    if (preferences.enableBluetooth === true) {
      disconnectFromDevice();
      stopScan();
    }
    updatePreference("enableBluetooth", !preferences.enableBluetooth);
  };

  const handleScan = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      console.log("Permissions granted");
      scanForPeripherals();
    }
  };

  return (
      <View style={styles.container}>
        {/* Bluetooth Toggle Card */}
        <View style={styles.card}>
          <View style={styles.switchContainer}>
            <View style={styles.switchInfo}>
              <Ionicons name="bluetooth-outline" size={24} color={COLOR.primary} />
              <View style={styles.textContainer}>
                <Text style={styles.switchText}>Connect Bluetooth</Text>
                <Text style={styles.description}>
                  Connect with your Cig++ smart case
                </Text>
              </View>
            </View>
            <Switch
                trackColor={{ false: COLOR.background, true: COLOR.primary }}
                thumbColor={preferences.enableBluetooth ? "#fff" : "#ddd"}
                onValueChange={toggleSwitch}
                value={preferences.enableBluetooth}
            />
          </View>
        </View>

        {/* Scan Button */}
        {isModalVisible && (
            <View style={styles.actionSection}>
              <CustomButton
                  title="Scan For Devices"
                  onPress={handleScan}
                  style={styles.scanButton}
              />
            </View>
        )}

        {/* Scanning State */}
        {isScanning && (
            <View style={styles.card}>
              <View style={styles.scanningHeader}>
                <ActivityIndicator size="small" color={COLOR.primary} />
                <Text style={styles.scanText}>Scanning for devices...</Text>
              </View>
              <View style={styles.deviceList}>
                {allDevices.map((device) => (
                    <View key={device.id} style={styles.deviceItem}>
                      <View style={styles.deviceInfo}>
                        <Ionicons name="hardware-chip-outline" size={20} color={COLOR.primary} />
                        <Text style={styles.deviceName}>{device.name}</Text>
                      </View>
                      <CustomButton
                          onPress={() => connectToDevice(device)}
                          title="Connect"
                          style={styles.connectButton}
                      />
                    </View>
                ))}
              </View>
            </View>
        )}

        {/* Connected Device */}
        {connectedDevice && (
            <View style={[styles.card, styles.connectedCard]}>
              <View style={styles.connectedHeader}>
                <View style={styles.connectedInfo}>
                  <View style={styles.statusIndicator} />
                  <View>
                    <Text style={styles.connectedText}>Connected</Text>
                    <Text style={styles.deviceNameConnected}>{connectedDevice.name}</Text>
                  </View>
                </View>
                <Ionicons name="checkmark-circle" size={24} color={COLOR.green} />
              </View>
              <CustomButton
                  onPress={() => disconnectFromDevice()}
                  title="Disconnect"
                  style={styles.disconnectButton}
              />
            </View>
        )}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.background,
    padding: 20,
    paddingTop: 60,
  },
  card: {
    backgroundColor: COLOR.lightBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  switchText: {
    color: COLOR.primary,
    fontFamily: FONT.bold,
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    color: COLOR.subPrimary,
    fontFamily: FONT.regular,
    fontSize: 12,
  },
  actionSection: {
    alignItems: "center",
    marginVertical: 10,
  },
  scanButton: {
    width: "100%",
  },
  scanningHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  scanText: {
    color: COLOR.primary,
    fontFamily: FONT.medium,
    fontSize: 16,
    marginLeft: 10,
  },
  deviceList: {
    gap: 12,
  },
  deviceItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLOR.background,
    padding: 12,
    borderRadius: 12,
  },
  deviceInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  deviceName: {
    color: COLOR.primary,
    fontFamily: FONT.medium,
    fontSize: 14,
    marginLeft: 8,
  },
  connectButton: {
    width: 100,
    paddingVertical: 8,
  },
  connectedCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLOR.green,
  },
  connectedHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  connectedInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLOR.green,
    marginRight: 12,
  },
  connectedText: {
    color: COLOR.green,
    fontFamily: FONT.bold,
    fontSize: 14,
  },
  deviceNameConnected: {
    color: COLOR.primary,
    fontFamily: FONT.medium,
    fontSize: 16,
  },
  disconnectButton: {
    backgroundColor: COLOR.red,
    width: "100%",
  },
});

export default BTModal;
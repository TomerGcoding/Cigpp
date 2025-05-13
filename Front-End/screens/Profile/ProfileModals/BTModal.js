import { View, Text, StyleSheet, Switch } from "react-native";
import { COLOR, FONT } from "../../../constants/theme";
import { usePreferences } from "../../../contexts/PreferencesContext";
import useBle from "../../../hooks/useBle";
import React, { useState } from "react";
import CustomButton from "../../../components/CustomButton";

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
  } = useBle();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleSwitch = async () => {
    setIsModalVisible(!isModalVisible);
    if (!preferences.enableBluetooth) {
      const isPermissionsEnabled = await requestPermissions();
      if (isPermissionsEnabled) {
        scanForPeripherals();
      }
    } else {
      disconnectFromDevice(connectedDevice);
    }
    updatePreference("enableBluetooth", !preferences.enableBluetooth);
  };

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        <Text
          style={styles.switchText}
          onPress={() => console.log(preferences.enableBluetooth)}
        >
          Connect Bluetooth
        </Text>
        <Switch
          trackColor={{ false: COLOR.background, true: COLOR.primary }}
          thumbColor={preferences.enableBluetooth ? "#fff" : "#ddd"}
          onValueChange={toggleSwitch}
          value={preferences.enableBluetooth}
        />
      </View>
      <Text style={styles.description}>
        Turn on Bluetooth to connect with you Cig++ smart case.
      </Text>
      {isModalVisible && (
        <View style={styles.scanContainer}>
          <Text style={styles.scanText}>Scanning for devices...</Text>
          {allDevices.map((device) => (
            <CustomButton
              key={device.id}
              onPress={() => connectToDevice(device)}
              title={device.name}
            />
          ))}
        </View>
      )}
      {connectedDevice && (
        <View style={styles.scanContainer}>
          <Text style={styles.scanText}>
            Connected to: {connectedDevice.name}
          </Text>
          <Text style={styles.scanText}>Data: {data}</Text>
          <CustomButton
            onPress={() => console.log(connectedDevice)}
            title="Debug"
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
    alignItems: "center",
  },
  switchContainer: {
    backgroundColor: COLOR.lightBackground,
    padding: 15,
    width: "100%",
    marginTop: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchText: {
    color: COLOR.primary,
    fontFamily: FONT.bold,
    fontSize: 16,
  },
  description: {
    color: COLOR.subPrimary,
    fontFamily: FONT.regular,
    margin: 10,
    fontSize: 12,
  },
  scanText: {
    color: COLOR.primary,
    fontFamily: FONT.regular,
    fontSize: 16,
    marginBottom: 10,
  },
  scanContainer: {
    backgroundColor: COLOR.lightBackground,
    padding: 15,
    width: "100%",
    marginTop: 10,
    alignItems: "center",
  },
});

export default BTModal;

/* eslint-disable no-bitwise */
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { BleManager } from "react-native-ble-plx";
import * as ExpoDevice from "expo-device";
import base64 from "react-native-base64";

// These are the standard Nordic UART Service UUIDs
const NORDIC_UART_SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
const NORDIC_UART_RX_CHARACTERISTIC = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E"; // Write to this
const NORDIC_UART_TX_CHARACTERISTIC = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"; // Read/notify from this

// 1. Create the context
export const BleContext = createContext();

// 2. Create the provider component
export const BleProvider = ({ children }) => {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [data, setData] = useState(-1);
  const [isScanning, setIsScanning] = useState(false);

  // // Clean up BLE manager on unmount
  useEffect(() => {
    return () => {
      bleManager.destroy();
    };
  }, [bleManager]);

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  const isDuplicteDevice = (devices, nextDevice) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const scanForPeripherals = () => {
    setIsScanning(true);
    setAllDevices([]);
    console.log("Scanning for devices...");
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
        setIsScanning(false);
        return;
      }
      if (device && device.name?.includes("Cig")) {
        setAllDevices((prevState) => {
          if (!isDuplicteDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });
  };

  const stopScan = () => {
    bleManager.stopDeviceScan();
    setIsScanning(false);
  };

  const connectToDevice = async (device) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();
      setIsScanning(false);
      startStreamingData(deviceConnection);
    } catch (e) {
      console.log("FAILED TO CONNECT", e);
    }
  };

  const disconnectFromDevice = async () => {
    if (connectedDevice) {
      await bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      setData(0);
    }
  };

  const onDataUpdate = (error, characteristic) => {
    if (error) {
      console.log(error);
      return -1;
    } else if (!characteristic?.value) {
      console.log("No Data was recieved");
      return -1;
    }
    console.log("Data Recieved", characteristic.value);

    const rawData = base64.decode(characteristic.value);
    console.log("Raw Data", rawData);

    setData(rawData);
  };

  const startStreamingData = async (device) => {
    if (device) {
      console.log("Starting to monitor TX characteristic...");
      try {
        device.monitorCharacteristicForService(
          NORDIC_UART_SERVICE_UUID,
          NORDIC_UART_TX_CHARACTERISTIC,
          onDataUpdate
        );
        console.log("Monitoring started");
      } catch (e) {
        console.log("Error starting monitoring:", e);
      }
    } else {
      console.log("No Device Connected");
    }
  };

  const logCigarette = async () => {
    if (connectedDevice) {
      connectedDevice.writeCharacteristicWithoutResponseForService(
        NORDIC_UART_SERVICE_UUID,
        NORDIC_UART_RX_CHARACTERISTIC,
        base64.encode(new Date().toString())
      );
    }
  };

  // Provide the BLE functionality to all children
  return (
    <BleContext.Provider
      value={{
        scanForPeripherals,
        stopScan,
        requestPermissions,
        connectToDevice,
        allDevices,
        connectedDevice,
        disconnectFromDevice,
        data,
        isScanning,
        logCigarette,
      }}
    >
      {children}
    </BleContext.Provider>
  );
};

// 3. Create a custom hook for easier context consumption
export function useBLE() {
  return useContext(BleContext);
}

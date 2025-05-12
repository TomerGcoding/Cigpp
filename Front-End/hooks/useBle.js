/* eslint-disable no-bitwise */
import { useMemo, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { BleManager } from "react-native-ble-plx";

import * as ExpoDevice from "expo-device";

import base64 from "react-native-base64";

// These are the standard Nordic UART Service UUIDs
const NORDIC_UART_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const NORDIC_UART_RX_CHARACTERISTIC = "6e400002-b5a3-f393-e0a9-e50e24dcca9e"; // Write to this
const NORDIC_UART_TX_CHARACTERISTIC = "6e400003-b5a3-f393-e0a9-e50e24dcca9e"; // Read/notify from this

function useBLE() {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [data, setData] = useState(-1);

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

  const scanForPeripherals = () =>
    bleManager.startDeviceScan(
      [NORDIC_UART_SERVICE_UUID],
      null,
      (error, device) => {
        if (error) {
          console.log(error);
        }
        if (device && device.name?.includes("Nordic")) {
          setAllDevices((prevState) => {
            if (!isDuplicteDevice(prevState, device)) {
              return [...prevState, device];
            }
            return prevState;
          });
        }
      }
    );

  const connectToDevice = async (device) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();
      startStreamingData(deviceConnection);
    } catch (e) {
      console.log("FAILED TO CONNECT", e);
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
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

    const rawData = base64.decode(characteristic.value);
    let innerData = -1;

    const firstBitValue = Number(rawData) & 0x01;

    if (firstBitValue === 0) {
      innerData = rawData[1].charCodeAt(0);
    } else {
      innerData =
        Number(rawData[1].charCodeAt(0) << 8) +
        Number(rawData[2].charCodeAt(2));
    }

    setData(innerData);
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

  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice,
    data,
  };
}

export default useBLE;

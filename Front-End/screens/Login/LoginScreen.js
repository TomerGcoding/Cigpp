import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Pressable,
  Link,
} from "react-native";
import React, { useState } from "react";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ScrollView>
      <View>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
        />
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
        />
        <Text style={styles.regularText}>Forgot your password?</Text>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
        <View style={styles.noAccountFlow}>
          <Text style={styles.regularText}>Don't have an account?</Text>
          <Pressable>
            <Text
              style={styles.registerText}
              onPress={() => navigation.navigate("Register")}
            >
              Register
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
  button: {
    width: "100%",
    elevation: 8,
    backgroundColor: "#009688",
    shadowColor: "#000",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "black",
  },
  regularText: {
    textAlign: "center",
    margin: 5,
  },
  registerText: {
    color: "blue",
    textDecorationLine: "underline",
    margin: 5,
  },
  noAccountFlow: {
    flexDirection: "row",
    justifyContent: "center",
  },
});

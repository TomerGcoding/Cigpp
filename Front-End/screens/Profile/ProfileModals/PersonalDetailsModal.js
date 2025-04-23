import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { COLOR, FONT } from "../../../constants/theme";
import CustomInput from "../../../components/CustomInput";
import CustomButton from "../../../components/CustomButton";
import { useAuth } from "../../../contexts/AuthContext";
import { updateEmail, updateProfile } from "firebase/auth";
import { usePreferences } from "../../../contexts/PreferencesContext";
import { FIREBASE_AUTH } from "../../../config/firebase/firebaseConfig";

const PersonalDetailsModal = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { preferences, updatePreference } = usePreferences();

  // States for field values
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  // States for edit modes
  const [isEditing, setIsEditing] = useState(false);

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setUsername(user.displayName || "");
    }
  }, [user]);

  const handleEditPressed = () => {
    setIsEditing(true);
  };
  const handleSavePressed = () => {
    setIsEditing(false);
  };
  return (
    <View style={styles.container}>
      <View style={styles.detailsForm}>
        <View
          style={[
            styles.fieldContainer,
            { flexDirection: isEditing ? "column" : "row" },
          ]}
        >
          <Text style={styles.label}>Email:</Text>
          {isEditing ? (
            <CustomInput
              value={email}
              onChangeText={setEmail}
              withLabel={false}
              keyboardType="email-address"
              style={{
                color: COLOR.primary,
                borderColor: COLOR.primary,
              }}
            />
          ) : (
            <Text style={styles.detail}>{email}</Text>
          )}
        </View>
        {/* Username Field */}
        <View
          style={[
            styles.fieldContainer,
            {
              flexDirection: isEditing ? "column" : "row",
            },
          ]}
        >
          <Text style={styles.label}>User Name:</Text>
          {isEditing ? (
            <CustomInput
              withLabel={false}
              value={username}
              onChangeText={setUsername}
              style={{
                color: COLOR.primary,
                borderColor: COLOR.primary,
              }}
            />
          ) : (
            <Text style={styles.detail}>{username}</Text>
          )}
        </View>
      </View>

      <CustomButton
        title={isEditing ? "Save" : "Edit"}
        onPress={isEditing ? handleSavePressed : handleEditPressed}
        style={{
          backgroundColor: isEditing ? COLOR.primary : "transparent",
          borderColor: COLOR.primary,
          borderWidth: 2,
        }}
        textStyle={{ color: isEditing ? "#fff" : COLOR.primary }}
      />

      {/* Delete Account Button */}
      <CustomButton
        title="Delete Account"
        style={{
          backgroundColor: "transparent",
          borderColor: "red",
          borderWidth: 2,
          marginTop: 30,
        }}
        textStyle={{ color: "red" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.background,
    padding: 10,
    alignItems: "center",
  },
  detailsForm: {
    backgroundColor: COLOR.lightBackground,
    borderRadius: 20,
    marginVertical: 50,
    marginHorizontal: 10,
    width: "100%",
  },
  fieldContainer: {
    padding: 10,
  },
  label: {
    color: COLOR.primary,
    fontFamily: FONT.bold,
    fontSize: 18,
  },
  detail: {
    color: COLOR.primary,
    fontFamily: FONT.regular,
    fontSize: 16,
    marginLeft: 15,
    marginTop: 4,
  },
});

export default PersonalDetailsModal;

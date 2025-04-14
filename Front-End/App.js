import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import TabsNavigator from "./screens/Tabs/TabsNavigator";
import MainStackNavigator from "./screens/MainStack/MainStackNavigator";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "./config/firebase/firebaseConfig";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      {user ? <TabsNavigator /> : <MainStackNavigator />}
    </NavigationContainer>
  );
}

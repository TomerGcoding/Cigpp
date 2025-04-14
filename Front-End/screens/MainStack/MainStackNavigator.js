import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../Login/LoginScreen";
import RegisterScreen from "../Register/RegisterScreen";

const Stack = createNativeStackNavigator();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Login"
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};
export default MainStackNavigator;

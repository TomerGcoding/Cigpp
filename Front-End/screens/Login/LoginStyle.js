import { StyleSheet } from "react-native";
import { COLOR } from "../../constants/theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  loginFormContainer: {
    margin: 20,
    padding: 10,
  },
  loginHeader: {
    alignItems: "center",
    color: COLOR.primary,
    fontSize: 30,
    marginBottom: 20,
  },
  buttonContainer: {
    alignItems: "center",
  },
  textButtonsContainer: {
    margin: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default styles;

import { StyleSheet } from "react-native";
import { FONT } from "../../constants/theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#b1bd93",
  },
  header: { margin: 20 },
  title: {
    fontSize: 30,
    fontFamily: FONT.bold,
    color: "#5c3721",
  },
  subtitle: {
    fontSize: 16,
    color: "#5c3700",
    marginBottom: 10,
    fontFamily: FONT.bold,
  },
  registerFormContainer: {
    margin: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "auto",
    marginBottom: 15,
  },
  footerText: {
    color: "#5c3700",
    fontSize: 14,
    fontFamily: FONT.regular,
  },
});

export default styles;

import { StyleSheet } from "react-native";
import { COLOR, FONT } from "../../constants/theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.background,
  },
  header: { marginLeft: 20, marginTop: 10 },
  title: {
    fontSize: 20,
    fontFamily: FONT.bold,
    color: COLOR.primary,
  },
  subtitle: {
    fontSize: 16,
    color: COLOR.subPrimary,
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
    color: COLOR.primary,
    fontSize: 14,
    fontFamily: FONT.regular,
  },
});

export default styles;

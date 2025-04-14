import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F6F0",
  },
  header: { margin: 20 },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
    marginBottom: 10,
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
    color: "#777",
    fontSize: 14,
  },
});

export default styles;

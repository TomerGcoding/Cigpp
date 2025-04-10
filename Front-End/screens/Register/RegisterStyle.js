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
  field: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "transparent",
    borderBottomWidth: 0.5,
    fontSize: 16,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  visibilityIcon: {
    padding: 12,
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#50C878",
    paddingVertical: 15,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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
  footerLink: {
    color: "#50C878",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default styles;

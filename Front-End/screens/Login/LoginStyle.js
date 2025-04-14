import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F6F0",
  },
  regularText: {
    fontSize: 16,
    fontWeight: "400",
  },
  logo: {
    height: 200,
    width: 400,
  },
  loginFormContainer: {
    margin: 20,
  },
  loginHeader: {
    fontSize: 30,
    fontWeight: "bold",
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
  footer: {
    alignItems: "center",
  },
  googleIconContainer: {
    backgroundColor: "#fff",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#dddd",
    marginTop: 10,
    alignItems: "center",
  },
  googleIcon: {
    resizeMode: "center",
  },
});

export default styles;

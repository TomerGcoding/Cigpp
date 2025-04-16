import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F6F0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: "#F8F6F0",
    borderBottomWidth: 1,
    borderBottomColor: "#F8F6F0",
  },
  backButton: {
    color: "#50C878",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default styles;

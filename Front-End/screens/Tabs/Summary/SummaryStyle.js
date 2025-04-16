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
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#F8F6F0",
    borderBottomWidth: 1,
    borderBottomColor: "#e0ddd7",
  },
  date: {
    color: "#777",
    fontSize: 14,
    fontWeight: "bold",
  },
  titleText: {
    color: "#50C878",
    fontSize: 28,
    fontWeight: "bold",
  },
  boxContainer: {
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 20,
    alignItems: "center",
  },
  touchableBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default styles;

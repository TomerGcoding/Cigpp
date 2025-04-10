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
  date: {
    color: "#7779",
    fontSize: 14,
    fontWeight: "bold",
  },
  titleText: {
    color: "#50C878",
    fontSize: 30,
    fontWeight: "bold",
  },
  touchableTiles: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default styles;

import { StyleSheet } from "react-native";
import { COLOR, FONT } from "../../constants/theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  date: {
    color: COLOR.subPrimary,
    fontSize: 14,
    fontFamily: FONT.bold,
  },
  titleText: {
    color: COLOR.primary,
    fontSize: 28,
    fontFamily: FONT.bold,
  },
  boxContainer: {
    padding: 5,
    alignItems: "center",
  },
  touchableBoxContainer: {
    flexDirection: "row",
  },
});

export default styles;

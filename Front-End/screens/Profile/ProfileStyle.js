import { StyleSheet } from "react-native";
import { COLOR } from "../../constants/theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.background,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  header: {
    flexDirection: "row",
  },
  headerRight: {
    flexDirection: "row-reverse",
    right: -100,
  },
  headerLeft: {
    left: -100,
  },
  userDetailesContainer: {
    alignItems: "center",
  },
});

export default styles;

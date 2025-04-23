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
    left: -170,
  },
  userDetailsContainer: {
    alignItems: "center",
  },
});

export default styles;

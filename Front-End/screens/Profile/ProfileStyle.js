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
    flexDirection: "row-reverse",
    margin: 10,
    right: -140,
  },
  userDetailesContainer: {
    alignItems: "center",
  },
});

export default styles;

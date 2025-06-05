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
    paddingTop: 15,
    paddingHorizontal: 20,
  },
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  bellIcon: {
    marginRight: 15,
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
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  greetingContainer: {
    marginBottom: 15,
  },
  greeting: {
    fontSize: 18,
    fontFamily: FONT.semiBold,
    color: COLOR.primary,
    marginBottom: 10,
  },
  tipContainer: {
    backgroundColor: COLOR.primary,
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  tipText: {
    color: COLOR.white || "#FFFFFF",
    fontFamily: FONT.medium,
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  boxContainer: {
    marginBottom: 20,
  },
});

export default styles;

import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { ArrowLeft } from "./icons";

const Header = ({ navigation, headerTitle = "Title", ...props }) => {
  return (
    <View style={styles.container} {...props}>
      <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.back()}>
        <ArrowLeft width={20} height={20} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{headerTitle}</Text>
      <View></View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    height: 100,
    backgroundColor: "red",
  },
});

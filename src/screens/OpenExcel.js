import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";

const excel_data = [
  {
    id: 1,
    name: "Excel 1",
  },
  {
    id: 2,
    name: "Excel 2",
  },
  {
    id: 3,
    name: "Excel 3",
  },
];

const OpenExcel = ({ navigation }) => {
  return (
    <View>
      <Text>OpenExcel</Text>
      {excel_data.map((item, index) => (
        <Pressable
          key={index}
          style={styles.excelContainer}
          onPress={() => navigation.navigate("ExcelControl")}
        >
          <Text>{item.id}</Text>
          <Text>{item.name}</Text>
        </Pressable>
      ))}
    </View>
  );
};

export default OpenExcel;

const styles = StyleSheet.create({
  excelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
  },
});

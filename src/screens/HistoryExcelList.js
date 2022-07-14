import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";

const excel_data = [
  {
    id: 1,
    name: "03.05.2022.xls",
  },
  {
    id: 2,
    name: "22.04.2022.xls",
  },
  {
    id: 3,
    name: "02.11.2021.xls",
  },
];

const HistoryExcelList = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.textsContainer}>
        <Text style={styles.title}>Download excel file!</Text>
        <Text style={styles.subTitle}>
          You can download excel files that you created earlier.
        </Text>
      </View>

      {excel_data.map((item, index) => (
        <Pressable
          key={index}
          style={styles.excelContainer}
          onPress={() =>
            navigation.navigate("ExcelViewerScreen", {
              id: item.id,
              name: item.name,
            })
          }
        >
          <Text>{item.name}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
};

export default HistoryExcelList;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  textsContainer: {
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  title: {
    fontWeight: "600",
    fontSize: 18,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 16,
    color: "#6f76a7",
    marginTop: 9,
    textAlign: "center",
  },
  excelContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#c8ceed",
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 3,
  },
});

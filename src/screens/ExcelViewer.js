import { StyleSheet, Text, View } from "react-native";
import React from "react";

const ExcelViewer = ({ navigation, route }) => {
  return (
    <View>
      <Text>
        {route.params.id} {route.params.name}
      </Text>
    </View>
  );
};

export default ExcelViewer;

const styles = StyleSheet.create({});

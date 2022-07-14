import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HistoryExcelListScreen from "../screens/HistoryExcelList";
import ExcelViewerScreen from "../screens/ExcelViewer";
import Header from "../components/Header";
import { ArrowLeft } from "../components/icons";

const Stack = createNativeStackNavigator();

const ViewStack = ({ navigation }) => {
  return (
    <Stack.Navigator screenOptions={{}}>
      <Stack.Screen
        name="HistoryExcelList"
        component={HistoryExcelListScreen}
        options={{
          headerShown: false,
        }}
        //options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ExcelViewerScreen"
        component={ExcelViewerScreen}
        options={{
          title: "",
          headerBackTitle: "Back",
        }}
        //options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default ViewStack;

const styles = StyleSheet.create({});

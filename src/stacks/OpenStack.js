import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OpenExcelScreen from "../screens/OpenExcel";
import ExcelControlScreen from "../screens/ExcelControl";

const Stack = createNativeStackNavigator();

const OpenStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="OpenExcel"
        component={OpenExcelScreen}
        //options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ExcelControl"
        component={ExcelControlScreen}
        //options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default OpenStack;

const styles = StyleSheet.create({});

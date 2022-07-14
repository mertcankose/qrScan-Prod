import React, { useEffect, useContext } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CommonCreateStack from "./CommonCreateStack";
import OptionsScreen from "../screens/Options";
import { EditContext } from "../context/Edit";
import ExcelList from "../screens/ExcelList";
import { ArrowLeft } from "../components/icons";

const Stack = createNativeStackNavigator();

const CreateStack = () => {
  const { currentRoute } = useContext(EditContext);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OptionsScreen"
        component={OptionsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CommonCreateStack"
        component={CommonCreateStack}
        options={{ headerBackTitle: "Back", headerTitle: "", headerShown:true }}
      />
      <Stack.Screen
        name="ExcelList"
        component={ExcelList}
        options={{
          //headerShown: currentRoute == "SelectImages" ? false : true,
          headerTitle: "",
        }}
      />
    </Stack.Navigator>
  );
};

export default CreateStack;

const styles = StyleSheet.create({});

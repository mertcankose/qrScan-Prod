import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SelectImagesScreen from '../screens/SelectImages';
import ControlImagesScreen from '../screens/ControlImages';
import CommonFieldsScreen from '../screens/CommonFields';

const Stack = createNativeStackNavigator();

const CommonCreateStack = ({navigation, route}) => {
  return (
    <Stack.Navigator initialRouteName="SelectImages" screenOptions={{headerShown:false}}>
      <Stack.Screen
        name="CommonFields"
        component={CommonFieldsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SelectImages"
        component={SelectImagesScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ControlImagesScreen"
        component={ControlImagesScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default CommonCreateStack;

const styles = StyleSheet.create({});

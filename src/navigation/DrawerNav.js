import React, {useContext} from 'react';
import {StyleSheet, TouchableOpacity, StatusBar} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import CreateStack from '../stacks/CreateStack';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import ViewStack from '../stacks/ViewStack';
import {Menu, FileText, PlusSquare, LogOut} from '../components/icons/index';
import {AuthContext} from '../context/Auth';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

const CustomDrawerContent = props => {
  const {removeCognitoToken} = useContext(AuthContext);
  const insets = useSafeAreaInsets();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{flex: 1}}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout"
        onPress={() => removeCognitoToken()}
        pressColor="#fff"
        pressOpacity={0.8}
        style={{
          marginTop: 'auto',
          marginBottom: 16,
          borderWidth: 1,
          borderColor: 'red',
        }}
        labelStyle={{color: 'red'}}
        icon={() => <LogOut width={20} height={20} color="red" />}
      />
    </DrawerContentScrollView>
  );
};

const Drawer = createDrawerNavigator();

const DrawerNav = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{flex: 1}} edges={['bottom', 'left', 'bottom']}>
      <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={{
          drawerStyle: {
            width: 220,
          },
          headerLeft: () => (
            <TouchableOpacity
              style={styles.drawerHeader}
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
              <Menu width={22} height={22} color="black" />
            </TouchableOpacity>
          ),
        }}
        useLegacyImplementation
        drawerContent={props => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
          name="CreateStack"
          component={CreateStack}
          options={{
            title: 'Create',
            drawerLabel: 'Create',
            drawerActiveTintColor: 'green',

            drawerIcon: ({color}) => (
              <PlusSquare width={20} height={20} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="ViewStack"
          component={ViewStack}
          options={{
            title: 'View Excels',
            drawerLabel: 'View',
            drawerActiveTintColor: 'green',
            drawerIcon: ({color}) => (
              <FileText width={20} height={20} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>
    </SafeAreaView>
  );
};

export default DrawerNav;

const styles = StyleSheet.create({
  drawerHeader: {
    marginLeft: 16,
  },
});

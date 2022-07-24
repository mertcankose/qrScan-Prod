import React, {useContext, useRef} from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ThemeContext} from '../context/Theme';
import {AuthContext} from '../context/Auth';
import DefaultTheme from '../constants/DefaultTheme';
import DarkTheme from '../constants/DarkTheme';
import DrawerNav from './DrawerNav';
import {EditContext} from '../context/Edit';
import WebViewScreen from '../screens/WebViewScreen';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const {theme} = useContext(ThemeContext);
  const {cognitoToken} = useContext(AuthContext);
  const {changeCurrentRoute} = useContext(EditContext);

  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef();

  return (
    <NavigationContainer
      theme={theme === 'light' ? DefaultTheme : DarkTheme}
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.getCurrentRoute().name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.getCurrentRoute().name;

        if (previousRouteName !== currentRouteName) {
          changeCurrentRoute(currentRouteName);
        }
        routeNameRef.current = currentRouteName;
      }}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {cognitoToken ? (
          <Stack.Screen
            name="Drawer"
            component={DrawerNav}
            options={{
              headerTitle: 'QR APP',
              headerTintColor: 'red',
            }}
          />
        ) : (
          <Stack.Screen
            name="WebViewScreen"
            component={WebViewScreen}
            options={{headerShown: false}}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

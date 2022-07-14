import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider} from './src/context/Theme';
import {AuthProvider} from './src/context/Auth';
import {EditProvider} from './src/context/Edit';
import Navigation from './src/navigation/Navigation';

/*
import SQLite from 'react-native-sqlite-storage';

SQLite.openDatabase(
  {name: 'papers.db', createFromLocation: 1},
  okCallback,
  errorCallback,
);

const okCallback = () => {
  console.log('Database opened');
}
const errorCallback = err => {
  console.log('Error opening database', err);
}
*/

const App = () => {
  useEffect(() => {}, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        <EditProvider>
          <SafeAreaProvider>
            <StatusBar translucent />
            <Navigation />
          </SafeAreaProvider>
        </EditProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;

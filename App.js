import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/context/Theme';
import { AuthProvider } from './src/context/Auth';
import { EditProvider } from './src/context/Edit';
import Navigation from './src/navigation/Navigation';

import SQLite from 'react-native-sqlite-storage';

let db;
db = SQLite.openDatabase({ name: "papers.db", createFromLocation: 1 });


const App = () => {

  /*
  useEffect(() => {
    let date = Date.now();
    let myDate = date.toString();
    db.transaction(tx => {
      tx.executeSql(`create table if not EXISTS ${Date.now()} (id decimal(10),bin varchar(255),pieces varchar(255), product varchar(255), bf varchar(255), date varchar(255), length varchar(255), width varchar(255), quality varchar(255), species varchar(255), thickness varchar(255));`, [], (tx, results) => {
        // console.log("results: ", results)
      })
    })
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM papers", [], (tx, results) => {
        let temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        console.log("results: ", temp)
      })
    })

  }, [])
*/



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

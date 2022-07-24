import {StyleSheet, Text, View, Pressable} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import SQLite from 'react-native-sqlite-storage';
import moment from 'moment';
import {AuthContext} from '../context/Auth';

let db = SQLite.openDatabase({name: 'papers.db', createFromLocation: 1});

const ExcelList = ({navigation}) => {
  const [fileName, setFileName] = useState('');
  const [fileDate, setFileDate] = useState('');
  const [fileDescription, setFileDescription] = useState('');

  const {addElementToFormInfos} = useContext(AuthContext);

  const [tables, setTables] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT name FROM sqlite_schema WHERE type='table' AND name NOT LIKE 'sqlite%'",
        [],
        (tx, results) => {
          let temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          setTables(temp);
        },
      );
    });
  }, []);

  const nextPage = name => {
    addElementToFormInfos(fileName, fileDate, fileDescription);
    navigation.navigate('CommonCreateStack', {
      screen: 'SelectImages',
      params: {type: 'excel', fileName: name},
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.textsContainer}>
        <Text style={styles.title}>Select the excel file</Text>
        <Text style={styles.subTitle}>
          You can select an excel file and then you can overwrite.
        </Text>
      </View>

      {tables.map((item, index) => (
        <Pressable
          key={index}
          style={styles.excelContainer}
          onPress={() => nextPage(item.name)}>
          <Text>
            {moment(parseInt(item.name.split('_')[1])).format(
              'DD/MM/YYYY - HH:mm:ss',
            )}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
};

export default ExcelList;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  textsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 16,
    color: '#6f76a7',
    marginTop: 9,
    textAlign: 'center',
  },
  excelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#c8ceed',
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 3,
  },
});

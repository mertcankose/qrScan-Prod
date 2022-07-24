import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import SQLite from 'react-native-sqlite-storage';
import moment from 'moment';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';

let db = SQLite.openDatabase({name: 'papers.db', createFromLocation: 1});

const HistoryExcelList = ({navigation}) => {
  const [tables, setTables] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    getFilesFromPhone();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getFilesFromPhone();
  }, []);

  const getFilesFromPhone = () => {
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
          setRefreshing(false);
        },
      );
    });
  };

  const openFile = fileName => {
    let file = RNFS.DocumentDirectoryPath + `/${fileName}.xlsx`;

    const path = FileViewer.open(file)
      .then(() => {
        console.log('File opened successfully');
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#1AC934"
        />
      }>
      <View style={styles.textsContainer}>
        <Text style={styles.title}>Display excel files!</Text>
        <Text style={styles.subTitle}>
          You can display excel files that you created earlier.
        </Text>
      </View>

      {tables.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.excelContainer}
          onPress={() => openFile(item.name)}
          activeOpacity={0.6}>
          <Text>
            {moment(parseInt(item.name.split('_')[1])).format(
              'DD/MM/YYYY - HH:mm:ss',
            )}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default HistoryExcelList;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  textsContainer: {
    paddingHorizontal: 16,
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

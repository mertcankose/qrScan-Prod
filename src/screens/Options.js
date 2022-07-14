import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Plus, FileMinus, FileText} from '../components/icons';
import {ScrollView} from 'react-native-gesture-handler';

const Options = ({navigation}) => {
  const [pressInFirst, setPressInFirst] = useState(false);
  const [pressInSecond, setPressInSecond] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titleText}>Create a document</Text>
      <Text style={styles.titleSubText}>
        Create an amazing excel file to do job easily.
      </Text>
      <TouchableOpacity
        style={[
          styles.createFromScratchButton,
          pressInFirst && styles.createFromScratchButtonPressed,
        ]}
        activeOpacity={0.8}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        onPressIn={() => setPressInFirst(true)}
        onPressOut={() => setPressInFirst(false)}
        onPress={() =>
          navigation.navigate('CommonCreateStack', {
            screen: 'CommonFields',
            params: {type: 'scratch'},
          })
        }>
        <View style={styles.createFromScratchIconContainer}>
          <Plus width="60" height="60" color="#6E76A6" />
        </View>
        <View style={styles.startScratchTextContainer}>
          <Text style={[styles.buttonText, styles.startScratchText]}>
            Start From Scratch
          </Text>
          <Text style={[styles.buttonText, styles.startScratchSubText]}>
            A blank slate is all you need.
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.useExcelButton,
          pressInSecond && styles.useExcelButtonPressed,
        ]}
        activeOpacity={0.8}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        onPressIn={() => setPressInSecond(true)}
        onPressOut={() => setPressInSecond(false)}
        onPress={() => navigation.navigate('ExcelList')}>
        <View style={styles.useExcelIconContainer}>
          <FileText width="60" height="60" color="#6E76A6" />
        </View>
        <View style={styles.useExcelTextContainer}>
          <Text style={[styles.buttonText, styles.useExcelText]}>
            Use existing excel.
          </Text>
          <Text style={[styles.buttonText, styles.useExcelSubText]}>
            Use the same excel that you used before.
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Options;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  titleText: {
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center',
  },
  titleSubText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 8,
    marginBottom: 30,
  },
  createFromScratchButton: {
    width: '55%',
    marginBottom: 30,
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
  createFromScratchButtonPressed: {
    borderWidth: 1,
    borderColor: '#c8ceed',
    borderRadius: 6,
  },
  createFromScratchIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c8ceed',
    //backgroundColor: "rgba(0, 128, 0, 0.6)",
    borderRadius: 6,
    aspectRatio: 1,
  },
  startScratchTextContainer: {
    marginTop: 14,
  },
  buttonText: {
    textAlign: 'center',
  },
  startScratchText: {
    fontWeight: '600',
    fontSize: 18,
  },
  startScratchSubText: {
    fontSize: 16,
    color: '#6f76a7',
    marginTop: 9,
  },
  useExcelButton: {
    width: '55%',
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
  useExcelButtonPressed: {
    borderWidth: 1,
    borderColor: '#c8ceed',
    borderRadius: 6,
  },
  useExcelIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c8ceed',
    //backgroundColor: "rgba(0, 128, 0, 0.6)",
    borderRadius: 6,
    aspectRatio: 1,
  },
  useExcelTextContainer: {
    marginTop: 14,
  },
  useExcelText: {
    fontWeight: '600',
    fontSize: 18,
  },
  useExcelSubText: {
    fontSize: 16,
    color: '#6f76a7',
    marginTop: 9,
  },
});

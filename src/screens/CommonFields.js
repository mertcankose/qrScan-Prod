import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import {AuthContext} from '../context/Auth';

const CommonFields = ({navigation, route}) => {
  const [fileName, setFileName] = useState('');
  const [fileDate, setFileDate] = useState('');
  const [fileDescription, setFileDescription] = useState('');

  const {formInfos, addElementToFormInfos} = useContext(AuthContext);

  const saveAndNext = () => {
    addElementToFormInfos(fileName, fileDate, fileDescription);
    navigation.navigate('SelectImages', {type: route.params.type});
  };

  return (
    <Pressable style={styles.container} onPress={() => Keyboard.dismiss()}>
      <View style={styles.textsContainer}>
        <Text style={styles.title}>Write common fields</Text>
        <Text style={styles.subTitle}>
          You can enter the common fields of the file.
        </Text>
      </View>

      <Text style={styles.inputTitle}>File Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter the name of the excel file"
        placeholderTextColor="#999"
        autoCapitalize="none"
        value={fileName}
        onChangeText={name => setFileName(name)}
      />

      <Text style={styles.inputTitle}>File Date</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter the date of the excel file"
        placeholderTextColor="#999"
        autoCapitalize="none"
        value={fileDate}
        onChangeText={date => setFileDate(date)}
      />

      <Text style={styles.inputTitle}>File Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter the description of the excel file"
        placeholderTextColor="#999"
        autoCapitalize="none"
        value={fileDescription}
        onChangeText={description => setFileDescription(description)}
      />

      <TouchableOpacity
        onPress={() => saveAndNext()}
        style={styles.nextButton}
        activeOpacity={0.8}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </Pressable>
  );
};

export default CommonFields;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 30,
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
  inputTitle: {
    color: '#000',
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#C8CEEC',
    paddingHorizontal: 6,
    paddingVertical: 8,
    marginBottom: 20,
    marginTop: 4,
    borderRadius: 6,
  },
  nextButton: {
    marginLeft: 'auto',
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 4,
    marginTop: 10,
  },
  buttonText: {
    fontWeight: '600',
  },
});

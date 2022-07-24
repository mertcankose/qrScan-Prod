/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {responsiveWidth as rw} from '../utils/Responsive';
import {getPicture} from '../api/RestApi';
import {AuthContext} from '../context/Auth';
import Loading from '../components/Loading';
import {writeFile} from 'react-native-fs';
import XLSX from 'xlsx';
import {
  createTableQuery,
  executeSQL,
  groupByQuery,
  insertQuery,
  partialSelectQuery,
  selectQuery,
} from '../api/Sql';
import RNFS from 'react-native-fs';

let screenWidth = Dimensions.get('window').width;

const Form = ({
  navigation,
  image,
  count,
  deleteImage,
  total,
  unique,
  paging,
  style,
  tableName,
  ...props
}) => {
  // related product
  const [dateOfProduction, setDateOfProduction] = useState('');
  const [productId, setProductId] = useState('');
  const [product, setProduct] = useState('');
  const [species, setSpecies] = useState('');
  const [quality, setQuality] = useState('');
  const [thickness, setThickness] = useState('');
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  const [bf, setBf] = useState('');
  const [pieces, setPieces] = useState('');
  const [bin, setBin] = useState('');
  const [position, setPosition] = useState('');
  const [x, setX] = useState('');
  const [y, setY] = useState('');
  // related screen
  const [isLoading, setIsLoading] = useState(false);
  // logic
  const [isSetImage, setIsSetImage] = useState(false);

  const {
    cognitoToken,
    formInfos,
    setFormInfos,
    addImageToFormInfos,
    changeFormInfos,
    removeCognitoToken,
  } = useContext(AuthContext);

  useEffect(() => {
    getPhoto();
  }, [paging]);

  useEffect(() => {
    if (isSetImage) {
      placementStates();
    }
  }, [isSetImage]);

  const getPhoto = () => {
    setIsLoading(true);
    if (unique === paging) {
      getPhotoFromServer(image.name);
    }
    setIsLoading(false);
  };

  const getPhotoFromServer = async name => {
    let response = await getPicture(name, cognitoToken);
    if (response.message === 'The incoming token has expired') {
      removeCognitoToken();
    }
    if (response.response !== null) {
      await addImageToFormInfos(response);

      setIsSetImage(true);
    }
  };

  const placementStates = () => {
    if (formInfos.images.length > 0) {
      formInfos.images.forEach(el => {
        if (el !== undefined) {
          if (el.filename === image.name) {
            setDateOfProduction(el?.response.date_of_production);
            setProductId(el?.response.product_id);
            setProduct(el?.response.product);
            setSpecies(el?.response.species);
            setQuality(el?.response.quality);
            setThickness(el?.response.thickness);
            setWidth(el?.response.width);
            setLength(el?.response.length);
            setBf(el?.response.bf);
            setPieces(el?.response.pieces);
            setBin(el?.response.bin);
          }
        }
      });
    }
  };

  useEffect(() => {
    if (unique === paging && isSetImage) {
      changeValues();
    }
  }, [
    dateOfProduction,
    productId,
    product,
    species,
    quality,
    thickness,
    width,
    length,
    bf,
    pieces,
    bin,
    position,
    x,
    y,
  ]);

  const changeValues = () => {
    let newObject = {
      filename: image.name,
      date_of_production: dateOfProduction,
      product_id: productId,
      product: product,
      species: species,
      quality: quality,
      thickness: thickness,
      width: width,
      length: length,
      bf: bf,
      pieces: pieces,
      bin: bin,
      position: position,
      x: x,
      y: y,
    };
    changeFormInfos(newObject);
  };

  const submitForms = async () => {
    // changeValues(); // update formInfos
    writeToDb(writeToExcel); // write to sqlite
  };

  const writeToDb = async () => {
    formInfos.images.forEach(el => {
      delete el.statusCode;
      delete el.filename;
    });

    for (var i = 0, len = formInfos.images.length; i < len; i++) {
      let obj = formInfos.images[i];
      for (var key in obj) {
        if (key !== 'response' && obj.response) {
          obj.data[key] = obj[key];
        }
      }
      formInfos.images[i] = obj.response || obj;
    }

    executeSQL(createTableQuery(tableName));

    formInfos.images.forEach(el => {
      let rowObject = {
        id: el.product_id,
        bin: el.bin,
        pieces: el.pieces,
        product: el.product.replaceAll("'", ' feet ').replaceAll('"', ' inch '),
        bf: el.bf.replaceAll("'", ' feet ').replaceAll('"', ' inch '),
        date: el.date_of_production
          .replaceAll("'", ' feet ')
          .replaceAll('"', ' inch '),
        length: el.length.replaceAll("'", ' feet ').replaceAll('"', ' inch '),
        width: el.width.replaceAll("'", ' feet ').replaceAll('"', ' inch '),
        quality: el.quality.replaceAll("'", ' feet ').replaceAll('"', ' inch '),
        species: el.species.replaceAll("'", ' feet ').replaceAll('"', ' inch '),
        thickness: el.thickness
          .replaceAll("'", ' feet ')
          .replaceAll('"', ' inch '),
      };
      executeSQL(insertQuery(tableName, rowObject));
    });
    let tab1 = executeSQL(selectQuery(tableName));
    let tab2 = executeSQL(groupByQuery(tableName));
    let tab3 = executeSQL(partialSelectQuery(tableName));
    setTimeout(() => {
      writeToExcel(tab1, tab2, tab3);
    }, 1000);
  };

  const writeToExcel = (tab1, tab2, tab3) => {
    let ws1 = XLSX.utils.json_to_sheet(tab1);
    let ws2 = XLSX.utils.json_to_sheet(tab2);
    let ws3 = XLSX.utils.json_to_sheet(tab3);

    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, 'Summary');
    XLSX.utils.book_append_sheet(wb, ws2, 'FaceAndGradeCount');
    XLSX.utils.book_append_sheet(wb, ws3, 'PackPosition');

    const wbout = XLSX.write(wb, {type: 'binary', bookType: 'xlsx'});

    let file = RNFS.DocumentDirectoryPath + `/${tableName}.xlsx`;

    writeFile(file, wbout, 'ascii')
      .then(r => {
        console.log('SUCCESS EXCEL: ', r);
        setFormInfos(null);
        navigation.push('OptionsScreen');
      })
      .catch(e => {
        console.log('ERROR EXCEL: ', e);
      });
  };

  return (
    <View style={[styles.outerContainer, style]} {...props}>
      <View style={styles.formHeadContainer}>
        <Text style={styles.imageTitle}>Image: {count + 1}</Text>
        <TouchableOpacity onPress={() => getPhoto()} activeOpacity={0.6}>
          <Text>Refresh</Text>
        </TouchableOpacity>
        {/*
        <TouchableOpacity
          style={styles.removeImageButton}
          activeOpacity={0.8}
          onPress={() => removeImage()}>
          <XSquare width="24" height="24" color="#000" />
        </TouchableOpacity>
        */}
      </View>
      {isLoading && <Loading />}
      <ScrollView contentContainerStyle={[styles.container]}>
        <View style={styles.inputContainer}>
          <KeyboardAvoidingView
            style={styles.inputContainer}
            keyboardVerticalOffset={100}
            behavior={Platform.OS === 'ios' ? 'padding' : null}>
            <View style={styles.subInputContainer}>
              <Text>Date</Text>
              <TextInput
                style={styles.input}
                onChangeText={setDateOfProduction}
                value={dateOfProduction}
                placeholder="Date Of Production"
              />
            </View>

            <View style={styles.subInputContainer}>
              <Text>Product Id</Text>
              <TextInput
                style={styles.input}
                onChangeText={setProductId}
                value={productId}
                placeholder="Product Id"
              />
            </View>

            <View style={styles.subInputContainer}>
              <Text>Product</Text>
              <TextInput
                style={styles.input}
                onChangeText={setProduct}
                value={product}
                placeholder="Product"
              />
            </View>

            <View style={styles.subInputContainer}>
              <Text>Species</Text>
              <TextInput
                style={styles.input}
                onChangeText={setSpecies}
                value={species}
                placeholder="Species"
              />
            </View>

            <View style={styles.subInputContainer}>
              <Text>Quality</Text>
              <TextInput
                style={styles.input}
                onChangeText={setQuality}
                value={quality}
                placeholder="Quality"
              />
            </View>

            <View style={styles.subInputContainer}>
              <Text>Thickness</Text>
              <TextInput
                style={styles.input}
                onChangeText={setThickness}
                value={thickness}
                placeholder="Thickness"
              />
            </View>

            <View style={styles.subInputContainer}>
              <Text>Width</Text>
              <TextInput
                style={styles.input}
                onChangeText={setWidth}
                value={width}
                placeholder="Width"
              />
            </View>

            <View style={styles.subInputContainer}>
              <Text>Length</Text>
              <TextInput
                style={styles.input}
                onChangeText={setLength}
                value={length}
                placeholder="Lenght"
              />
            </View>

            <View style={styles.subInputContainer}>
              <Text>BF</Text>
              <TextInput
                style={styles.input}
                onChangeText={setBf}
                value={bf}
                placeholder="Bf"
              />
            </View>

            <View style={styles.subInputContainer}>
              <Text>Pieces</Text>
              <TextInput
                style={styles.input}
                onChangeText={setPieces}
                value={pieces}
                placeholder="Pieces"
              />
            </View>

            <View style={styles.subInputContainer}>
              <Text>Bin</Text>
              <TextInput
                style={styles.input}
                onChangeText={setBin}
                value={bin}
                placeholder="Bin"
              />
            </View>

            <View style={styles.subInputContainer}>
              <Text>Position</Text>
              <TextInput
                style={styles.input}
                onChangeText={setPosition}
                value={position}
                placeholder="Position"
              />
            </View>

            <View style={styles.subInputContainer}>
              <Text>X</Text>
              <TextInput
                style={styles.input}
                onChangeText={setX}
                value={x}
                placeholder="X"
              />
            </View>

            <View style={styles.subInputContainer}>
              <Text>Y</Text>
              <TextInput
                style={styles.input}
                onChangeText={setY}
                value={y}
                placeholder="Y"
              />
            </View>
          </KeyboardAvoidingView>
        </View>
        <Image
          style={styles.image}
          source={{uri: image.uri}}
          resizeMode="contain"
        />
      </ScrollView>
      {count + 1 === total && (
        <TouchableOpacity
          style={styles.submitButton}
          activeOpacity={0.8}
          onPress={() => submitForms()}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Form;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    width: screenWidth,
  },
  formHeadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#C8CEEC',
  },
  imageTitle: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
  },
  removeImageButton: {
    padding: 3,
  },
  image: {
    width: '100%',
    height: 280,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    paddingHorizontal: 8,
    marginTop: 8,
    marginBottom: 10,
  },
  subInputContainer: {
    width: '48%',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#C8CEEC',
    paddingHorizontal: 6,
    paddingVertical: 8,
    width: '100%',
    borderRadius: 6,
  },
  submitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: rw(120),
    paddingVertical: 10,
    marginLeft: 'auto',
    marginRight: 10,
    borderRadius: 6,
    backgroundColor: 'green',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

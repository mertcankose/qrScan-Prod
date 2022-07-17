import React, { useState, useEffect, useContext } from 'react';
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
import {
  responsiveWidth as rw,
  responsiveHeight as rh,
} from '../utils/Responsive';
import { getPicture } from '../api/RestApi';
import { AuthContext } from '../context/Auth';
import Loading from '../components/Loading';
import SQLite from 'react-native-sqlite-storage';
import { writeFile } from 'react-native-fs';
import XLSX from 'xlsx';
const RNFS = require('react-native-fs');

let db = SQLite.openDatabase({ name: "papers.db", createFromLocation: 1 });

let screenWidth = Dimensions.get('window').width;

const Form = ({
  image,
  count,
  deleteImage,
  total,
  unique,
  paging,
  // formOkay,
  style,
  ...props
}) => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [firstExcelTab, setFirstExcelTab] = useState([]);
  const [secondExcelTab, setSecondExcelTab] = useState([]);
  const [thirdExcelTab, setThirdExcelTab] = useState([]);
  const [tableName] = useState("paper" + Date.now());

  const {
    cognitoToken,
    formInfos,
    addImageToFormInfos,
    isFirstOkay,
    setIsFirstOkay,
    changeFormInfos,
    removeCognitoToken,
    isChangeFormFromServer,
    setIsChangeFormFromServer,
  } = useContext(AuthContext);

  useEffect(() => {
    setIsChangeFormFromServer(false);
    setIsLoading(true);
    if (unique + 1 == paging) {
      changeValues();
    }
    if (unique == paging) {
      getPhotoFromServer(image.name);
      /*
      if (paging == 1 && isFirstOkay == false) {
        setTimeout(() => {
          getPhotoFromServer(image.name);
          setIsFirstOkay(true);
        }, 4000);
      } else {
        getPhotoFromServer(image.name);
      }
      */
    }
  }, [paging]);

  useEffect(() => {
    if (isChangeFormFromServer == true) {
      placementStates();
    }
  }, [isChangeFormFromServer]);

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
    };
    changeFormInfos(newObject);
  };

  const placementStates = () => {
    formInfos.images.forEach(el => {
      if (el.filename == image.name) {
        if (el) {
          setDateOfProduction(el.response.date_of_production);
          setProductId(el.response.product_id);
          setProduct(el.response.product);
          setSpecies(el.response.species);
          setQuality(el.response.quality);
          setThickness(el.response.thickness);
          setWidth(el.response.width);
          setLength(el.response.length);
          setBf(el.response.bf);
          setPieces(el.response.pieces);
          setBin(el.response.bin);
        }
      }
    });
  };

  const getPhotoFromServer = async name => {
    let response = await getPicture(name, cognitoToken);
    //console.log('response: ', response);
    if (response.message == 'The incoming token has expired') {
      removeCognitoToken();
    }
    if (response.response !== null) {
      addImageToFormInfos(response);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    writeToFile();
  }, [firstExcelTab, secondExcelTab])

  const writeToExcel = async () => {
    changeValues()
    writeToDb();
    //writeToFile();
  };

  const writeToDb = () => {
    formInfos.images.forEach(el => {
      delete el['statusCode'];
      delete el['filename'];
    });

    for (var i = 0, len = formInfos.images.length; i < len; i++) {
      obj = formInfos.images[i];
      for (var key in obj) {
        if (key !== 'response' && obj.response) {
          obj.data[key] = obj[key];
        }
      }
      formInfos.images[i] = obj.response || obj;
    }


    //SQLITE PROCESSES
    //let tableName = 'paper' + Date.now().toString();
    // CREATE TABLE
    db.transaction(tx => {
      tx.executeSql(`CREATE TABLE IF NOT EXISTS ${tableName} (id nvarchar(100),bin nvarchar(100),pieces nvarchar(100), product nvarchar(100), bf nvarchar(100), productDate nvarchar(100), length nvarchar(100), productWidth nvarchar(100), quality nvarchar(100), species nvarchar(100), thickness nvarchar(100));`, [], (tx, results) => {
        console.log("create table results: ", results)
      })
    })


    // INSERT INTO ILE JSON I INSERT ET
    formInfos.images.forEach(el => {
      let id = el.product_id;
      let bin = el.bin;
      let pieces = el.pieces;
      let product = el.product.replaceAll("\'", " feet ").replaceAll("\"", " inch ");
      let bf = el.bf.replaceAll("\'", " feet ").replaceAll("\"", " inch ");
      let date = el.date_of_production.replaceAll("\'", " feet ").replaceAll("\"", " inch ");
      let length = el.length.replaceAll("\'", " feet ").replaceAll("\"", " inch ");
      let width = el.width.replaceAll("\'", " feet ").replaceAll("\"", " inch ");
      let quality = el.quality.replaceAll("\'", " feet ").replaceAll("\"", " inch ");
      let species = el.species.replaceAll("\'", " feet ").replaceAll("\"", " inch ");
      let thickness = el.thickness.replaceAll("\'", " feet ").replaceAll("\"", " inch ");

      let query = "INSERT INTO " + tableName + " (id, bin, pieces, product, bf, productDate, length, productWidth, quality, species, thickness) VALUES";
      query = query + "('"
        + id
        + "','"
        + bin
        + "','"
        + pieces
        + "','"
        + product
        + "','"
        + bf
        + "','"
        + date
        + "','"
        + length
        + "','"
        + width
        + "','"
        + quality
        + "','"
        + species
        + "','"
        + thickness
        + "')";

      console.log("query: ", query);
      db.transaction(tx => {
        tx.executeSql(query, [], (tx, results) => {
          console.log("insert into results: ", results)
        })
      })
    })

    let firstExcelTabArr = [];
    let secondExcelTabArr = [];
    db.transaction(tx => {
      tx.executeSql(`SELECT * FROM ${tableName}`, [], (tx, results) => {
        for (let i = 0; i < results.rows.length; ++i) {
          firstExcelTabArr.push(results.rows.item(i));
          //console.log("firstExcelTab: ", firstExcelTabArr);
          setFirstExcelTab(firstExcelTabArr);
        }
      })

      tx.executeSql(`SELECT product, thickness, count(product) FROM ${tableName} GROUP by product, thickness ORDER by product asc; `, [], (tx, results) => {
        for (let i = 0; i < results.rows.length; ++i) {
          secondExcelTabArr.push(results.rows.item(i));
          setSecondExcelTab(secondExcelTabArr);
          //console.log("second: ", secondExcelTabArr);
        }
      })
    })
  }


  const writeToFile = () => {
    // console.log('last: ', JSON.stringify(formInfos));
    console.log("ff: ", firstExcelTab)
    var ws1 = XLSX.utils.json_to_sheet(firstExcelTab);
    var ws2 = XLSX.utils.json_to_sheet(secondExcelTab);
    var ws3 = XLSX.utils.json_to_sheet(secondExcelTab);

    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, 'Summary');
    XLSX.utils.book_append_sheet(wb, ws2, 'FaceAndGradeCount');
    XLSX.utils.book_append_sheet(wb, ws3, 'PackPosition');

    const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });
    var RNFS = require('react-native-fs');
    var file = RNFS.DocumentDirectoryPath + `/${tableName}.xlsx`;
    writeFile(file, wbout, 'ascii')
      .then(r => {
        console.log('SUCCESS: ', r);
        console.log('file: ', file);
      })
      .catch(e => {
        console.log('ERROR: ', e);
      });
  }


  return (
    <View style={[styles.outerContainer, style]} {...props}>
      <View style={styles.formHeadContainer}>
        <Text style={styles.imageTitle}>Image: {count + 1}</Text>
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
                require
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
          </KeyboardAvoidingView>
        </View>
        <Image
          style={styles.image}
          source={{ uri: image.uri }}
          resizeMode="contain"
        />
      </ScrollView>
      {count + 1 == total && (
        <TouchableOpacity
          style={styles.submitButton}
          activeOpacity={0.8}
          onPress={() => writeToExcel()}>
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

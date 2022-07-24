/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Form from '../components/Form';
import ImagePicker from 'react-native-image-crop-picker';
import {uploadPicture} from '../api/RestApi';
import {AuthContext} from '../context/Auth';
import ImageResizer from 'react-native-image-resizer';
import Loading from '../components/Loading';

let screenWidth = Dimensions.get('window').width;

const SelectImages = ({navigation, route}) => {
  const [paging, setPaging] = useState(1);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDoneUpload, setIsDoneUpload] = useState(false);
  const [tableName, setTableName] = useState('');

  const {cognitoToken} = useContext(AuthContext);

  useEffect(() => {
    // set table name
    if (route.params.fileName && route.params.fileName.length > 0) {
      setTableName(route.params.fileName);
    } else {
      setTableName('file_' + Date.now());
    }
  }, []);

  useEffect(() => {
    // control upload done
    if (isDoneUpload) {
      setIsLoading(false);
    }
  }, [isDoneUpload]);

  const openCamera = () => {
    ImagePicker.openCamera({
      cropping: true,
      maxFiles: 40,
      multiple: true,
      compressImageQuality: 0.6,
      compressImageMaxWidth: 190,
      compressImageMaxHeight: 280,
    }).then(image => {
      setImages(...images, image);
    });
  };

  const openGallery = () => {
    ImagePicker.openPicker({
      cropping: true,
      maxFiles: 40,
      multiple: true,
      compressImageQuality: 0.6,
      compressImageMaxWidth: 190,
      compressImageMaxHeight: 280,
    }).then(images => {
      //setImages(images);
      uploadPhotosToServer(images);
    });
  };

  const uploadPhotosToServer = async comingImages => {
    setIsLoading(true);

    let myArr = [];
    let myImages = [];
    comingImages.forEach(async img => {
      let responseImage = await resizeImage(img);
      myImages.push(responseImage);

      let response = await uploadPicture(
        responseImage.uri,
        responseImage.name,
        cognitoToken,
      );
      myArr.push(response);

      if (myArr.length === comingImages.length) {
        setIsDoneUpload(true);
        setImages(myImages);
      }
    });
  };

  const resizeImage = async img => {
    let imageType = Platform.OS === 'ios' ? img.sourceURL : img.path;
    try {
      let resizedImage = await ImageResizer.createResizedImage(
        imageType,
        900,
        1200,
        'JPEG',
        80,
      );
      return resizedImage;
    } catch (error) {
      console.log('resizedImage Error: ', error);
    }
  };

  const changePaging = event => {
    setPaging(Math.round(event.nativeEvent.contentOffset.x / screenWidth) + 1);
  };

  const clearAll = () => {
    setImages([]);
  };

  const deleteImageFromArray = uniqueUrl => {
    let filteredArr = images.filter(el => {
      return el.sourceURL !== uniqueUrl;
    });
    setImages(filteredArr);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {isLoading && <Loading />}
      <View style={styles.titleContainer}>
        {route.params.type === 'scratch' ? (
          <Text style={styles.title}>Create from Scratch</Text>
        ) : (
          <Text style={styles.title}>Overwrite on Excel file!</Text>
        )}
      </View>

      <View style={styles.buttonsContainer}>
        {/*
        <TouchableOpacity
          style={[styles.button, styles.cameraButton]}
          activeOpacity={0.8}
          onPress={() => openCamera()}>
          <Text style={[styles.buttonText, styles.cameraText]}>CAMERA</Text>
        </TouchableOpacity>
        */}
        <TouchableOpacity
          style={[styles.button, styles.galleryButton]}
          activeOpacity={0.8}
          onPress={() => openGallery()}>
          <Text style={[styles.buttonText, styles.galleryText]}>GALLERY</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.clearAllButton]}
          activeOpacity={0.8}
          onPress={() => clearAll()}>
          <Text style={[styles.buttonText, styles.clearAllText]}>
            Clear All
          </Text>
        </TouchableOpacity>
      </View>

      {images.length > 0 ? (
        <>
          <ScrollView
            contentContainerStyle={styles.scrollView}
            horizontal={true}
            pagingEnabled={true}
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            scrollIndicatorInsets={{top: 5, left: 5, bottom: 5, right: 5}}
            //scrollEventThrottle={10}
            //disableIntervalMomentum={true} // disable the iOS momentum effect
            //snapToInterval={screenWidth} // snap to a multiple of the width
            onMomentumScrollEnd={event => {
              changePaging(event);
            }}>
            {images.map((image, index) => (
              <Form
                image={image}
                key={index}
                unique={index + 1}
                paging={paging}
                count={index}
                total={images.length}
                tableName={tableName}
                deleteImage={unique => deleteImageFromArray(unique)}
                navigation={navigation}
                // formOkay={value => formOkay(value)}
                style={{marginVertical: 10}}
              />
            ))}
          </ScrollView>

          <Text style={styles.pagingIndicator}>
            {paging} / {images.length}
          </Text>
        </>
      ) : (
        <View style={styles.noImageTextContainer}>
          <Text style={styles.noImageText}>
            You haven't selected a photo yet.
          </Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default SelectImages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
  },
  titleContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingHorizontal: 10,
  },
  title: {
    fontWeight: '600',
    fontSize: 18,
  },
  buttonsContainer: {
    flexDirection: 'row',
    //justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  button: {
    borderWidth: 1,
    borderColor: '#C8CEEC',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    flex: 3,
    marginRight: 4,
    backgroundColor: '#5463FF',
  },
  galleryButton: {
    flex: 3,
    marginRight: 4,
    backgroundColor: '#5463FF',
  },
  clearAllButton: {
    flex: 1,
    backgroundColor: '#FF1818',
  },
  buttonText: {
    fontWeight: '600',
  },
  cameraText: {
    color: '#fff',
    textAlign: 'center',
  },
  galleryText: {
    color: '#fff',
    textAlign: 'center',
  },
  clearAllText: {
    color: '#fff',
    textAlign: 'center',
  },
  scrollView: {
    justifyContent: 'center',
  },
  pagingIndicator: {
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 10,
  },
  noImageTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noImageText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
  },
});

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
//import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {uploadPicture, getPicture} from '../api/RestApi';
import {AuthContext} from '../context/Auth';
import ImageResizer from 'react-native-image-resizer';
import Loading from '../components/Loading';
//import Carousel from 'react-native-snap-carousel';



let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

const imageOptions = {};

const SelectImages = ({navigation, route}) => {
  const [paging, setPaging] = useState(1);
  const [images, setImages] = useState([]);
  const [responseImages, setResponseImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [isFormOkay, setIsFormOkay] = useState(false);
  const [imageNames, setImageNames] = useState([]);
  const [isDoneUpload, setIsDoneUpload] = useState(false);

  const {cognitoToken, formInfos, addElementToFormInfos} =
    useContext(AuthContext);

  useEffect(() => {
    if (isDoneUpload) {
      setIsLoading(false);
    }
  }, [isDoneUpload]);

  const changePaging = event => {
    setPaging(Math.round(event.nativeEvent.contentOffset.x / screenWidth) + 1);
  };

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

  const clearAll = () => {
    setImages([]);
  };

  const deleteImageFromArray = uniqueUrl => {
    let filteredArr = images.filter(el => {
      return el.sourceURL != uniqueUrl;
    });
    setImages(filteredArr);
  };

  const uploadPhotosToServer = async comingImages => {
    setIsLoading(true);

    let myArr = [];
    let myImages = [];
    comingImages.forEach(async img => {
      let responseImage = await resizeImage(img);
      myImages.push(responseImage);

      /* control duplicate */
      // let myArray = [];
      // myArray.push(responseImage)

      let response = await uploadPicture(
        responseImage.uri,
        responseImage.name,
        cognitoToken,
      );
      console.log('upload photo response: ', response);
      myArr.push(response);

      if (myArr.length == comingImages.length) {
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
      /*return img;*/
    } catch (error) {
      console.log('resizedImage Error: ', error);
    }
  };

  /*
  const formOkay = value => {
    setIsFormOkay(value);
  };
  */

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {isLoading && <Loading />}
      <View style={styles.titleContainer}>
        {route.params.type == 'scratch' ? (
          <Text style={styles.title}>Create from Scratch</Text>
        ) : (
          <Text style={styles.title}>Overwrite on Excel file!</Text>
        )}
      </View>
      {/*
      <TouchableOpacity
          style={[styles.button, styles.galleryButton]}
          activeOpacity={0.8}
          onPress={() => getTest()}>
          <Text style={[styles.buttonText, styles.galleryText]}>GET</Text>
        </TouchableOpacity>
      */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cameraButton]}
          activeOpacity={0.8}
          onPress={() => openCamera()}>
          <Text style={[styles.buttonText, styles.cameraText]}>CAMERA</Text>
        </TouchableOpacity>
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
                deleteImage={unique => deleteImageFromArray(unique)}
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
    paddingVertical: 2,
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

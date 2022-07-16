import React, { useState, createContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [cognitoToken, setCognitoToken] = useState(null);
  const [formInfos, setFormInfos] = useState(null);
  const [isFirstOkay, setIsFirstOkay] = useState(false);
  const [isChangeFormFromServer, setIsChangeFormFromServer] = useState(false);

  useEffect(() => {
    const tokenControl = async () => {
      try {
        const token = await AsyncStorage.getItem('cognitoToken');
        if (token) {
          setCognitoToken(token);
        }
      } catch (error) {
        console.warn(error);
      }
    };
    tokenControl();
  }, []);

  const addCognitoToken = async value => {
    setCognitoToken(value);
    try {
      await AsyncStorage.setItem('cognitoToken', value);
    } catch (error) {
      console.warn(error);
    }
  };

  const removeCognitoToken = async () => {
    setCognitoToken(null);
    try {
      await AsyncStorage.removeItem('cognitoToken');
    } catch (error) {
      console.warn(error);
    }
  };

  const addElementToFormInfos = (fileName = "empty", fileDate = "empty", fileDescription = "empty") => {
    let infos = {
      filename: fileName,
      filedate: fileDate,
      filedescription: fileDescription,
      images: [],
    };
    setFormInfos(infos);
  };

  const addImageToFormInfos = image => {
    setFormInfos({ ...formInfos, images: [...formInfos.images, image] });
    setIsChangeFormFromServer(true);
  };

  const changeFormInfos = obj => {
    let currentFormInfos = JSON.parse(JSON.stringify(formInfos));
    //console.log('prev: ', currentFormInfos.images);
    currentFormInfos.images.forEach((el, index) => {
      if (el.filename == obj.filename) {
        currentFormInfos.images[index] = obj;
      }
    });
    setFormInfos({ ...formInfos, images: currentFormInfos.images });
  };

  return (
    <AuthContext.Provider
      value={{
        cognitoToken,
        addCognitoToken,
        removeCognitoToken,
        formInfos,
        setFormInfos,
        addElementToFormInfos,
        addImageToFormInfos,
        isFirstOkay,
        setIsFirstOkay,
        changeFormInfos,
        isChangeFormFromServer,
        setIsChangeFormFromServer,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

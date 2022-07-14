const baseURL = 'https://lolt879976.execute-api.us-east-1.amazonaws.com/test';

var fs = require('react-native-fs');
var Buffer = require('buffer/').Buffer;

export const getPicture = async (filename, token) => {
  //console.log('getPicture file name: , ', filename);

  try {
    const response = await fetch(
      `${baseURL}/transactions?filename=${filename}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          CognitoKey: token,
        },
      },
    );

    const json = await response.json();

    return json;
  } catch (error) {
    console.error('Get Profile Error: ', error);
    return {error: true};
  }
};

export const uploadPicture = async (uri, filename, token) => {
  const base64 = await fs.readFile(uri, 'base64');
  const buffer = Buffer.from(base64, 'base64');

  try {
    const response = await fetch(
      `${baseURL}/raw-picture-storage-us-east-1/${filename}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'image/*',
          CognitoKey: token,
        },
        body: buffer,
      },
    );

    if (response.status == 200) {
      return {error: false};
    } else {
      return {error: true};
    }
  } catch (error) {
    console.log('error: ', error);
    return {error: true};
  }
};
